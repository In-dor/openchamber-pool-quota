import type {
  AntigravityHistoryResponse,
  BoardSnapshot,
  PoolQuotaConfig,
} from '../shared/types.ts';

export type BoardFetchErrorCode = 'unauthorized' | 'unreachable' | 'http' | 'invalid';

export type BoardFetchResult<T> =
  | { ok: true; data: T; fetchedAtMs: number }
  | { ok: false; code: BoardFetchErrorCode; status?: number; message: string; fetchedAtMs: number };

const SNAPSHOT_TTL_MS = 12_000;
const HISTORY_TTL_MS = 30_000;
const REQUEST_TIMEOUT_MS = 10_000;

let snapshotCache: { key: string; fetchedAtMs: number; data: BoardSnapshot } | null = null;
const historyCache = new Map<string, { fetchedAtMs: number; data: AntigravityHistoryResponse }>();

export const clearBoardCache = (): void => {
  snapshotCache = null;
  historyCache.clear();
};

const cacheKeyOf = (cfg: PoolQuotaConfig): string => `${cfg.url}|${cfg.passcode.length > 0 ? 'auth' : 'open'}`;

const buildHeaders = (cfg: PoolQuotaConfig): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (cfg.passcode) {
    headers['X-View-Passcode'] = cfg.passcode;
  }
  return headers;
};

export const fetchBoardSnapshot = async (
  cfg: PoolQuotaConfig,
  options: { force?: boolean; timeoutMs?: number } = {},
): Promise<BoardFetchResult<BoardSnapshot>> => {
  const now = Date.now();
  const key = cacheKeyOf(cfg);
  if (!options.force && snapshotCache && snapshotCache.key === key && now - snapshotCache.fetchedAtMs < SNAPSHOT_TTL_MS) {
    return { ok: true, data: snapshotCache.data, fetchedAtMs: snapshotCache.fetchedAtMs };
  }

  let response: Response;
  try {
    response = await fetch(`${cfg.url}/api/snapshot`, {
      method: 'GET',
      headers: buildHeaders(cfg),
      signal: AbortSignal.timeout(options.timeoutMs ?? REQUEST_TIMEOUT_MS),
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
  snapshotCache = { key, fetchedAtMs, data };
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
      headers: buildHeaders(cfg),
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
    return {
      ok: false,
      code: 'unauthorized',
      status: response.status,
      message: '历史曲线接口需要有效访问口令。',
      fetchedAtMs: Date.now(),
    };
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
    historyCache.set(key, { fetchedAtMs, data });
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
