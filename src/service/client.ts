import crypto from 'node:crypto';
import type {
  AntigravityHistoryResponse,
  BoardSnapshot,
  PoolQuotaConfig,
} from '../shared/types.ts';

export type BoardFetchErrorCode = 'unauthorized' | 'unreachable' | 'http' | 'invalid';

export type BoardFetchResult<T> =
  | { ok: true; data: T; fetchedAtMs: number }
  | { ok: false; code: BoardFetchErrorCode; status?: number; message: string; fetchedAtMs: number };

const SNAPSHOT_TTL_MS = 8_000;
const HISTORY_TTL_MS = 20_000;
const REQUEST_TIMEOUT_MS = 10_000;
const FRESH_REQUEST_TIMEOUT_MS = 12_000;

interface CachedEntry<T> {
  key: string;
  fetchedAtMs: number;
  data: T;
  etag?: string;
}

let snapshotCache: CachedEntry<BoardSnapshot> | null = null;
const historyCache = new Map<string, { fetchedAtMs: number; data: AntigravityHistoryResponse; etag?: string }>();

export const clearBoardCache = (): void => {
  snapshotCache = null;
  historyCache.clear();
};

const passcodeFingerprint = (passcode: string): string => (
  passcode.length > 0
    ? crypto.createHash('sha256').update(passcode).digest('hex').slice(0, 8)
    : 'open'
);

const cacheKeyOf = (cfg: PoolQuotaConfig): string => `${cfg.url}|${passcodeFingerprint(cfg.passcode)}`;

const buildHeaders = (cfg: PoolQuotaConfig, etag?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (cfg.passcode) {
    headers['X-View-Passcode'] = cfg.passcode;
  }
  if (etag) {
    headers['If-None-Match'] = etag;
  }
  return headers;
};

const parsePositiveHeaderInt = (res: Response, headerName: string): number | null => {
  const raw = res.headers.get(headerName);
  if (raw === null) return null;
  const parsed = Number(raw.trim());
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null;
};

export const fetchBoardSnapshot = async (
  cfg: PoolQuotaConfig,
  options: { force?: boolean; fresh?: boolean; timeoutMs?: number } = {},
): Promise<BoardFetchResult<BoardSnapshot>> => {
  const now = Date.now();
  const key = cacheKeyOf(cfg);
  const bypassCache = Boolean(options.force || options.fresh);
  const useFresh = options.fresh ?? Boolean(options.force);
  const cached = snapshotCache && snapshotCache.key === key ? snapshotCache : null;

  if (!bypassCache && cached && now - cached.fetchedAtMs < SNAPSHOT_TTL_MS) {
    return { ok: true, data: cached.data, fetchedAtMs: cached.fetchedAtMs };
  }

  const snapshotUrl = useFresh
    ? `${cfg.url}/api/snapshot?view=compact&fresh=1`
    : `${cfg.url}/api/snapshot?view=compact`;

  let response: Response;
  try {
    response = await fetch(snapshotUrl, {
      method: 'GET',
      headers: buildHeaders(cfg, cached?.etag),
      signal: AbortSignal.timeout(options.timeoutMs ?? (useFresh ? FRESH_REQUEST_TIMEOUT_MS : REQUEST_TIMEOUT_MS)),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      code: 'unreachable',
      message: `无法连接看板 ${cfg.url}（${detail}）。请确认看板服务在线，或在左侧 Pool Quota 面板检查地址。`,
      fetchedAtMs: Date.now(),
    };
  }

  if (response.status === 401 || response.status === 403) {
    if (snapshotCache?.key === key) {
      snapshotCache = null;
    }
    return {
      ok: false,
      code: 'unauthorized',
      status: response.status,
      message: cfg.passcode
        ? '访问口令不正确，请在左侧 Pool Quota 面板重新填写访问口令。'
        : '看板已开启口令保护，请打开左侧 Pool Quota 面板填写访问口令。',
      fetchedAtMs: Date.now(),
    };
  }

  if (response.status === 304 && cached) {
    const cloned = structuredClone(cached.data);
    const headerGenMs = parsePositiveHeaderInt(response, 'X-Generated-At-Ms');
    if (headerGenMs !== null) {
      cloned.generated_at_ms = headerGenMs;
    }
    const nextEtag = response.headers.get('ETag')?.trim() || cached.etag;
    const fetchedAtMs = Date.now();
    snapshotCache = { key, fetchedAtMs, data: cloned, etag: nextEtag };
    return { ok: true, data: cloned, fetchedAtMs };
  }

  if (!response.ok) {
    return {
      ok: false,
      code: 'http',
      status: response.status,
      message: `看板返回 HTTP ${response.status}，请稍后重试。`,
      fetchedAtMs: Date.now(),
    };
  }

  let parsed: unknown;
  try {
    parsed = await response.json();
  } catch {
    return {
      ok: false,
      code: 'invalid',
      message: '看板返回的不是合法 JSON，请确认看板地址填写正确。',
      fetchedAtMs: Date.now(),
    };
  }

  if (
    !parsed
    || typeof parsed !== 'object'
    || !('antigravity' in parsed)
    || !('aistudio' in parsed)
  ) {
    return {
      ok: false,
      code: 'invalid',
      message: '看板 JSON 结构不符合 Pool Status Board 格式。',
      fetchedAtMs: Date.now(),
    };
  }

  const data = parsed as BoardSnapshot;
  const fetchedAtMs = Date.now();
  const etag = response.headers.get('ETag')?.trim() || undefined;
  snapshotCache = { key, fetchedAtMs, data, etag };
  return { ok: true, data, fetchedAtMs };
};

export const fetchAntigravityHistory = async (
  cfg: PoolQuotaConfig,
  params: { accountId: string; window?: '5h' | '7d'; range?: string; force?: boolean },
): Promise<BoardFetchResult<AntigravityHistoryResponse>> => {
  const windowKind = params.window ?? '5h';
  const range = params.range ?? (windowKind === '7d' ? '7d' : '24h');
  const key = `${cacheKeyOf(cfg)}|${params.accountId}|${windowKind}|${range}`;
  const now = Date.now();
  const cached = historyCache.get(key);
  if (!params.force && cached && now - cached.fetchedAtMs < HISTORY_TTL_MS) {
    return { ok: true, data: cached.data, fetchedAtMs: cached.fetchedAtMs };
  }

  const query = new URLSearchParams({
    account: params.accountId,
    window: windowKind,
    range,
  });

  let response: Response;
  try {
    response = await fetch(`${cfg.url}/api/antigravity/history?${query.toString()}`, {
      method: 'GET',
      headers: buildHeaders(cfg, cached?.etag),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      code: 'unreachable',
      message: `无法拉取历史曲线：${detail}`,
      fetchedAtMs: Date.now(),
    };
  }

  if (response.status === 401 || response.status === 403) {
    historyCache.delete(key);
    return {
      ok: false,
      code: 'unauthorized',
      status: response.status,
      message: '历史曲线接口需要有效访问口令。',
      fetchedAtMs: Date.now(),
    };
  }

  if (response.status === 304 && cached) {
    const cloned = structuredClone(cached.data);
    const headerToSec = parsePositiveHeaderInt(response, 'X-History-To-Sec');
    if (headerToSec !== null) {
      cloned.to_sec = headerToSec;
    }
    const nextEtag = response.headers.get('ETag')?.trim() || cached.etag;
    const fetchedAtMs = Date.now();
    historyCache.set(key, { fetchedAtMs, data: cloned, etag: nextEtag });
    return { ok: true, data: cloned, fetchedAtMs };
  }

  if (!response.ok) {
    return {
      ok: false,
      code: 'http',
      status: response.status,
      message: `历史曲线接口返回 HTTP ${response.status}。`,
      fetchedAtMs: Date.now(),
    };
  }

  try {
    const data = (await response.json()) as AntigravityHistoryResponse;
    const fetchedAtMs = Date.now();
    const etag = response.headers.get('ETag')?.trim() || undefined;
    historyCache.set(key, { fetchedAtMs, data, etag });
    return { ok: true, data, fetchedAtMs };
  } catch {
    return {
      ok: false,
      code: 'invalid',
      message: '历史曲线返回的不是合法 JSON。',
      fetchedAtMs: Date.now(),
    };
  }
};
