import http from 'node:http';
import {
  QUOTA_PROVIDER_PATH,
  readQuotaProviderRequest,
  type QuotaProviderResult,
} from '@openchamber/sdk';
import {
  loadConfig,
  normalizeBoardUrl,
  saveConfig,
  toPublicConfig,
} from '../shared/config.ts';
import type { PanelStateResponse, PoolQuotaConfig } from '../shared/types.ts';
import {
  clearBoardCache,
  fetchAntigravityHistory,
  fetchBoardSnapshot,
} from './client.ts';
import { buildQuotaErrorData, buildQuotaUsageData } from './quota-view.ts';
import { buildStatusErrorView, buildStatusView } from './status-view.ts';

const port = Number(process.env.OPENCHAMBER_SERVICE_PORT);
const serviceToken = process.env.OPENCHAMBER_SERVICE_TOKEN ?? '';

if (!Number.isFinite(port) || port <= 0 || !serviceToken) {
  console.error('OPENCHAMBER_SERVICE_PORT and OPENCHAMBER_SERVICE_TOKEN are required');
  process.exit(1);
}

const MAX_BODY_BYTES = 64 * 1024;

const sendJson = (res: http.ServerResponse, status: number, body: unknown): void => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(body));
};

const readBody = (req: http.IncomingMessage): Promise<string> => new Promise((resolve, reject) => {
  let body = '';
  let bytes = 0;
  req.on('data', (chunk: Buffer | string) => {
    bytes += Buffer.byteLength(chunk);
    if (bytes > MAX_BODY_BYTES) {
      reject(new Error('Request body too large'));
      req.destroy();
      return;
    }
    body += chunk.toString();
  });
  req.on('end', () => resolve(body));
  req.on('error', reject);
});

const parseJsonObject = (raw: string): Record<string, unknown> => {
  if (!raw.trim()) return {};
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('JSON body must be an object');
  }
  return parsed as Record<string, unknown>;
};

const buildPanelState = async (
  cfg: PoolQuotaConfig,
  options: { force?: boolean; historyWindow?: '5h' | '7d'; historyRange?: string } = {},
): Promise<PanelStateResponse> => {
  const snapRes = await fetchBoardSnapshot(cfg, { force: options.force });
  if (!snapRes.ok) {
    return {
      config: toPublicConfig(cfg),
      snapshot: null,
      history: null,
      error: snapRes.message,
      errorCode: snapRes.code,
      fetchedAtMs: snapRes.fetchedAtMs,
    };
  }

  let history = null;
  const firstAccountId = snapRes.data.antigravity?.accounts?.[0]?.id;
  if (firstAccountId) {
    const histRes = await fetchAntigravityHistory(cfg, {
      accountId: firstAccountId,
      window: options.historyWindow ?? '5h',
      range: options.historyRange ?? (options.historyWindow === '7d' ? '7d' : '24h'),
      force: options.force,
    });
    if (histRes.ok) {
      history = histRes.data;
    }
  }

  return {
    config: toPublicConfig(cfg),
    snapshot: snapRes.data,
    history,
    error: null,
    errorCode: null,
    fetchedAtMs: snapRes.fetchedAtMs,
  };
};

const handleRequest = async (req: http.IncomingMessage, res: http.ServerResponse): Promise<void> => {
  if (req.headers.authorization !== `Bearer ${serviceToken}`) {
    sendJson(res, 401, { error: 'unauthorized' });
    return;
  }

  const parsedUrl = new URL(req.url ?? '/', 'http://127.0.0.1');
  const pathname = parsedUrl.pathname;
  const method = (req.method ?? 'GET').toUpperCase();

  if (pathname === '/health' && method === 'GET') {
    sendJson(res, 200, { ok: true });
    return;
  }

  // Native OpenChamber Usage / Quota Provider wire endpoint
  if (pathname === QUOTA_PROVIDER_PATH && method === 'POST') {
    const raw = await readBody(req);
    const request = readQuotaProviderRequest(raw);
    if (!request) {
      sendJson(res, 400, { error: 'invalid quota provider request' });
      return;
    }
    const cfg = loadConfig();
    const snapRes = await fetchBoardSnapshot(cfg, { force: true });
    const result: QuotaProviderResult = snapRes.ok
      ? { ok: true, data: buildQuotaUsageData(snapRes.data, cfg) }
      : { ok: true, data: buildQuotaErrorData(snapRes.message) };
    sendJson(res, 200, result);
    return;
  }

  // Native Work Status section source endpoint
  if (pathname === '/status' && method === 'GET') {
    const cfg = loadConfig();
    const snapRes = await fetchBoardSnapshot(cfg);
    if (!snapRes.ok) {
      sendJson(res, 200, buildStatusErrorView(cfg, snapRes.message, snapRes.code));
      return;
    }
    let history = null;
    const firstAccountId = snapRes.data.antigravity?.accounts?.[0]?.id;
    if (firstAccountId) {
      const histRes = await fetchAntigravityHistory(cfg, {
        accountId: firstAccountId,
        window: '5h',
        range: '24h',
      });
      if (histRes.ok) history = histRes.data;
    }
    sendJson(res, 200, buildStatusView(snapRes.data, history, cfg));
    return;
  }

  if (pathname === '/status' && method === 'POST') {
    const body = parseJsonObject(await readBody(req));
    const actionId = typeof body.id === 'string' ? body.id : '';
    const value = typeof body.value === 'string' ? body.value : undefined;
    if (actionId === 'toggle-ais') {
      const current = loadConfig();
      const nextShowAis = value !== undefined
        ? (value === 'on' || value === 'true')
        : !current.showAis;
      saveConfig({ showAis: nextShowAis });
      clearBoardCache();
      sendJson(res, 200, { ok: true, showAis: nextShowAis });
      return;
    }
    if (actionId === 'refresh') {
      clearBoardCache();
      const cfg = loadConfig();
      await fetchBoardSnapshot(cfg, { force: true });
      sendJson(res, 200, { ok: true });
      return;
    }
    sendJson(res, 400, { message: `未知操作：${actionId || '(empty)'}` });
    return;
  }

  // Rail Panel endpoints
  if (pathname === '/panel/state' && method === 'GET') {
    const force = parsedUrl.searchParams.get('force') === '1';
    const histWinParam = parsedUrl.searchParams.get('window');
    const historyWindow: '5h' | '7d' = histWinParam === '7d' ? '7d' : '5h';
    const historyRange = parsedUrl.searchParams.get('range') || (historyWindow === '7d' ? '7d' : '24h');
    const cfg = loadConfig();
    const state = await buildPanelState(cfg, { force, historyWindow, historyRange });
    sendJson(res, 200, state);
    return;
  }

  if (pathname === '/panel/config' && method === 'POST') {
    const body = parseJsonObject(await readBody(req));
    const patch: Partial<{ url: string; passcode: string; showAis: boolean; compactQuota: boolean; clearPasscode: boolean }> = {};
    if (typeof body.url === 'string') {
      patch.url = normalizeBoardUrl(body.url);
    }
    if (typeof body.passcode === 'string' && body.passcode.length > 0) {
      patch.passcode = body.passcode;
    }
    if (body.clearPasscode === true) {
      patch.clearPasscode = true;
    }
    if (typeof body.showAis === 'boolean') {
      patch.showAis = body.showAis;
    }
    if (typeof body.compactQuota === 'boolean') {
      patch.compactQuota = body.compactQuota;
    }
    const nextCfg = saveConfig(patch);
    clearBoardCache();
    const state = await buildPanelState(nextCfg, { force: true });
    sendJson(res, 200, state);
    return;
  }

  if (pathname === '/panel/test' && method === 'POST') {
    const body = parseJsonObject(await readBody(req));
    const current = loadConfig();
    const testUrl = typeof body.url === 'string' && body.url.trim()
      ? normalizeBoardUrl(body.url)
      : current.url;
    const clearPasscode = body.clearPasscode === true;
    const testPasscode = clearPasscode
      ? ''
      : (typeof body.passcode === 'string' && body.passcode.length > 0 ? body.passcode : current.passcode);
    const testShowAis = typeof body.showAis === 'boolean' ? body.showAis : current.showAis;
    const testCompactQuota = typeof body.compactQuota === 'boolean' ? body.compactQuota : current.compactQuota;

    const candidate: PoolQuotaConfig = {
      url: testUrl,
      passcode: testPasscode,
      showAis: testShowAis,
      compactQuota: testCompactQuota,
    };

    const snapRes = await fetchBoardSnapshot(candidate, { force: true, timeoutMs: 8_000 });
    if (!snapRes.ok) {
      sendJson(res, 200, {
        ok: false,
        code: snapRes.code,
        message: snapRes.message,
      });
      return;
    }

    if (body.save === true) {
      saveConfig({
        url: candidate.url,
        passcode: candidate.passcode,
        clearPasscode,
        showAis: candidate.showAis,
        compactQuota: candidate.compactQuota,
      });
      clearBoardCache();
    }

    const agAccounts = snapRes.data.antigravity?.summary?.active_accounts ?? snapRes.data.antigravity?.accounts?.length ?? 0;
    const aisReady = snapRes.data.aistudio?.account_counts?.ready ?? 0;
    const aisEnabled = snapRes.data.aistudio?.account_counts?.enabled ?? 0;
    sendJson(res, 200, {
      ok: true,
      saved: body.save === true,
      summary: `连接成功：AG ${agAccounts} 号 · AIS ${aisReady}/${aisEnabled} 号就绪`,
      config: toPublicConfig(candidate),
    });
    return;
  }

  if (pathname === '/panel/history' && method === 'GET') {
    const cfg = loadConfig();
    const accountId = parsedUrl.searchParams.get('account') ?? '';
    if (!accountId) {
      sendJson(res, 400, { error: 'missing account parameter' });
      return;
    }
    const windowKind: '5h' | '7d' = parsedUrl.searchParams.get('window') === '7d' ? '7d' : '5h';
    const range = parsedUrl.searchParams.get('range') || (windowKind === '7d' ? '7d' : '24h');
    const histRes = await fetchAntigravityHistory(cfg, {
      accountId,
      window: windowKind,
      range,
      force: parsedUrl.searchParams.get('force') === '1',
    });
    if (!histRes.ok) {
      sendJson(res, 502, { error: histRes.message });
      return;
    }
    sendJson(res, 200, histRes.data);
    return;
  }

  sendJson(res, 404, { error: 'not-found' });
};

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((err) => {
    const message = err instanceof Error ? err.message : 'internal error';
    if (!res.headersSent) {
      sendJson(res, 500, { error: message });
    }
  });
});

server.listen(port, '127.0.0.1');
