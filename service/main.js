// src/service/main.ts
import http from "node:http";
// node_modules/@openchamber/sdk/dist/scrollbar-style.js
var GUEST_SCROLLING_ATTRIBUTE = "data-oc-scrolling";
var GUEST_SCROLLBAR_CSS = `
:root {
  /* Quiet at rest like the app's own thumbs; hover gives a clear grab target. */
  --oc-scrollbar-thumb: color-mix(in srgb, var(--oc-muted, currentColor) 18%, transparent);
  --oc-scrollbar-thumb-hover: color-mix(in srgb, var(--oc-muted, currentColor) 36%, transparent);
  scrollbar-gutter: stable;
}
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
:hover, [${GUEST_SCROLLING_ATTRIBUTE}] {
  scrollbar-color: var(--oc-scrollbar-thumb) transparent;
}
/* Chromium's standard scrollbar properties otherwise override its pseudo-elements. */
@supports selector(::-webkit-scrollbar) {
  *, :hover, [${GUEST_SCROLLING_ATTRIBUTE}] { scrollbar-width: auto; scrollbar-color: auto; }
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    min-width: 24px;
    min-height: 24px;
  }
  :hover::-webkit-scrollbar-thumb, [${GUEST_SCROLLING_ATTRIBUTE}]::-webkit-scrollbar-thumb { background: var(--oc-scrollbar-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--oc-scrollbar-thumb-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
}
@media (forced-colors: active) {
  *, :hover, [${GUEST_SCROLLING_ATTRIBUTE}] { scrollbar-color: auto; }
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover { background: CanvasText; }
}
`;
function installGuestScrollbarActivity(doc) {
  const root = doc.documentElement;
  if (root.hasAttribute("data-oc-scrollbar-activity"))
    return;
  root.setAttribute("data-oc-scrollbar-activity", "");
  const timers = new WeakMap;
  doc.addEventListener("scroll", (event) => {
    const target = event.target === doc ? root : event.target;
    if (!(target instanceof Element))
      return;
    if (!target.hasAttribute("data-oc-scrolling"))
      target.setAttribute("data-oc-scrolling", "");
    const pending = timers.get(target);
    if (pending !== undefined)
      clearTimeout(pending);
    timers.set(target, setTimeout(() => {
      timers.delete(target);
      target.removeAttribute("data-oc-scrolling");
    }, 1000));
  }, { capture: true, passive: true });
}
var GUEST_SCROLLBAR_SCRIPT = `(${installGuestScrollbarActivity.toString()})(document);`;
// node_modules/@openchamber/sdk/dist/status-view.js
var GUEST_STATUS_VIEW_ROWS_MAX = 16;
var GUEST_STATUS_VIEW_CHART_POINTS_MAX = 120;
var GUEST_STATUS_VIEW_NOTE_MAX = 300;
// node_modules/@openchamber/sdk/dist/manifest.js
var GUEST_PROVIDER_LOGO_BYTES_MAX = 1024 * 1024;
var TRACKER_URL_TOKENS = ["{id}", "{segment}", "{segments+}"];
var TRACKER_URL_TOKEN_SET = new Set(TRACKER_URL_TOKENS);
// node_modules/@openchamber/sdk/dist/session-events.js
var GUEST_SESSION_EVENT_TYPES = [
  "turn-finished",
  "turn-failed",
  "permission-asked",
  "question-asked",
  "turn-started",
  "session-created",
  "session-archived",
  "session-deleted"
];
var SESSION_EVENTS_IDLE_MS = 10 * 60000;
var EVENT_TYPES = new Set(GUEST_SESSION_EVENT_TYPES);
// node_modules/@openchamber/sdk/dist/service-host.js
var SERVICE_SCHEDULE_IDLE_MS = 10 * 60000;
var MENTIONS_IDLE_MS = 10 * 60000;
// node_modules/@openchamber/sdk/dist/file-editor.js
var patternExpressions = new Map;
// node_modules/@openchamber/sdk/dist/contract.js
var GUEST_FILE_STAT_KINDS = ["file", "directory", "other", "missing"];
var GUEST_GENERATE_LATE_KEEP_MS = 60 * 60000;
var HOST_REQUEST_ERROR_CODES = [
  "HOST_UNAVAILABLE",
  "HOST_TIMEOUT",
  "HOST_REJECTED",
  "DISCONNECTED",
  "DISABLED",
  "BAD_PATH",
  "NO_INTEGRATION",
  "NO_SERVICE",
  "SERVICE_FAILED",
  "REQUEST_FAILED",
  "RESPONSE_TOO_LARGE",
  "NO_SESSION",
  "SESSION_BUSY",
  "NOT_GRANTED",
  "NO_DIRECTORY",
  "NOT_FOUND",
  "FILE_TOO_LARGE",
  "DENIED",
  "NO_MODEL",
  "MODEL_FAILED",
  "UNSUPPORTED"
];
var SERVICE_STATUS_VALUES = ["stopped", "starting", "ready", "failed"];
var hostRequestErrorCodeSet = new Set(HOST_REQUEST_ERROR_CODES);
var serviceStatusSet = new Set(SERVICE_STATUS_VALUES);
var fileStatKindSet = new Set(GUEST_FILE_STAT_KINDS);
var HOST_PUSH_TYPES = new Set([
  "workspace",
  "shells",
  "ready",
  "directory",
  "session",
  "connection",
  "settings",
  "session-lifecycle",
  "item",
  "resolve",
  "action",
  "service-event",
  "status-control-event",
  "popover-closed",
  "file-open",
  "file-snapshot",
  "file-saved",
  "generate-late",
  "microphone-audio",
  "microphone-ended"
]);
// node_modules/@openchamber/sdk/dist/service-providers.js
var BROWSER_CONTROL_ACTIONS = [
  "browser.open",
  "browser.snapshot",
  "browser.click",
  "browser.type",
  "browser.select",
  "browser.scroll",
  "browser.back",
  "browser.forward",
  "browser.inspect",
  "browser.capture",
  "browser.resize",
  "browser.close"
];
var BROWSER_PROVIDER_IDLE_MS = 10 * 60000;
var CONTROL_ACTIONS = new Set(BROWSER_CONTROL_ACTIONS);
var SOURCE_CONTROL_PROVIDER_IDLE_MS = 10 * 60000;
var NOTIFICATIONS_PROVIDER_IDLE_MS = 10 * 60000;
var TRACKER_PROVIDER_IDLE_MS = 10 * 60000;
var QUOTA_PROVIDER_PATH = "/quota";
var QUOTA_PROVIDER_WIRE_VERSION = 1;
var QUOTA_PROVIDER_METHODS = ["usage.read"];
var QUOTA_PROVIDER_ERROR_MESSAGE_MAX = 2000;
var QUOTA_PROVIDER_IDLE_MS = 10 * 60000;
var QUOTA_PROVIDER_WINDOWS_MAX = 32;
var QUOTA_PROVIDER_MODELS_MAX = 64;
var QUOTA_PROVIDER_NAME_MAX = 128;
var QUOTA_PROVIDER_LABEL_MAX = 128;
var isQuotaProviderMethod = (value) => QUOTA_PROVIDER_METHODS.some((method) => method === value);
var readQuotaProviderRequest = (body) => {
  let wire;
  try {
    const parsed = JSON.parse(body);
    if (Object(parsed) !== parsed || parsed === null)
      return null;
    wire = parsed;
  } catch {
    return null;
  }
  const { v, requestId, method, provider, input } = wire;
  if (v !== QUOTA_PROVIDER_WIRE_VERSION)
    return null;
  if (String(requestId) !== requestId || requestId.length === 0)
    return null;
  if (String(provider) !== provider || provider.length === 0)
    return null;
  if (String(method) !== method || !isQuotaProviderMethod(method))
    return null;
  if (Object(input) !== input || input === null || input === undefined || Array.isArray(input))
    return null;
  const { credentials } = input;
  if (Object(credentials) !== credentials || credentials === null || Array.isArray(credentials))
    return null;
  if (Object.values(Object(credentials)).some((credential) => Object(credential) !== credential || credential === null || Array.isArray(credential)))
    return null;
  return { v: QUOTA_PROVIDER_WIRE_VERSION, requestId, method, provider, input: { credentials } };
};
// node_modules/@openchamber/sdk/dist/service-surface.js
var SURFACE_CONTROLLERS = ["none", "agent", "user"];
var CONTROLLERS = new Set(SURFACE_CONTROLLERS);
// src/shared/config.ts
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
var DEFAULT_BOARD_URL = "http://127.0.0.1:18380";
var DEFAULT_CONFIG = {
  url: DEFAULT_BOARD_URL,
  passcode: "",
  showAis: true,
  compactQuota: true
};
var normalizeBoardUrl = (raw) => {
  const trimmed = raw.trim();
  if (!trimmed)
    return DEFAULT_BOARD_URL;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Board URL must start with http:// or https://");
    }
    return parsed.origin + parsed.pathname.replace(/\/+$/, "");
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Invalid board URL");
  }
};
var sharedConfigPath = () => path.join(os.homedir(), ".config", "opencode", "pool-quota.json");
var serviceDataConfigPath = (env = process.env) => {
  const dir = env.OPENCHAMBER_SERVICE_DATA_DIR?.trim();
  return dir ? path.join(dir, "config.json") : null;
};
var readJsonFileSafe = (filePath) => {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile())
      return null;
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return null;
    return { data: parsed, mtimeMs: stat.mtimeMs };
  } catch {
    return null;
  }
};
var parseBool = (value) => {
  if (typeof value === "boolean")
    return value;
  if (typeof value === "string") {
    const lower = value.trim().toLowerCase();
    if (lower === "1" || lower === "true" || lower === "yes" || lower === "on")
      return true;
    if (lower === "0" || lower === "false" || lower === "no" || lower === "off")
      return false;
  }
  return;
};
var loadConfig = (env = process.env) => {
  const sharedPath = sharedConfigPath();
  const dataPath = serviceDataConfigPath(env);
  const shared = readJsonFileSafe(sharedPath);
  const service = dataPath && dataPath !== sharedPath ? readJsonFileSafe(dataPath) : null;
  const ordered = [];
  if (shared && service) {
    if (shared.mtimeMs >= service.mtimeMs) {
      ordered.push(service.data, shared.data);
    } else {
      ordered.push(shared.data, service.data);
    }
  } else if (shared) {
    ordered.push(shared.data);
  } else if (service) {
    ordered.push(service.data);
  }
  let url = DEFAULT_CONFIG.url;
  let passcode = DEFAULT_CONFIG.passcode;
  let showAis = DEFAULT_CONFIG.showAis;
  let compactQuota = DEFAULT_CONFIG.compactQuota;
  for (const item of ordered) {
    if (typeof item.url === "string" && item.url.trim()) {
      try {
        url = normalizeBoardUrl(item.url);
      } catch {}
    }
    if (typeof item.passcode === "string") {
      passcode = item.passcode;
    }
    const boolVal = parseBool(item.showAis);
    if (boolVal !== undefined) {
      showAis = boolVal;
    }
    const compactVal = parseBool(item.compactQuota);
    if (compactVal !== undefined) {
      compactQuota = compactVal;
    }
  }
  if (typeof env.POOL_QUOTA_URL === "string" && env.POOL_QUOTA_URL.trim()) {
    try {
      url = normalizeBoardUrl(env.POOL_QUOTA_URL);
    } catch {}
  }
  if (typeof env.POOL_QUOTA_PASSCODE === "string" && env.POOL_QUOTA_PASSCODE.length > 0) {
    passcode = env.POOL_QUOTA_PASSCODE;
  }
  const envShowAis = parseBool(env.POOL_QUOTA_SHOW_AIS);
  if (envShowAis !== undefined) {
    showAis = envShowAis;
  }
  const envCompact = parseBool(env.POOL_QUOTA_COMPACT);
  if (envCompact !== undefined) {
    compactQuota = envCompact;
  }
  return { url, passcode, showAis, compactQuota };
};
var writeFileSecure = (filePath, content) => {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpPath, content, { encoding: "utf8", mode: 384 });
  fs.chmodSync(tmpPath, 384);
  fs.renameSync(tmpPath, filePath);
};
var saveConfig = (patch, env = process.env) => {
  const current = loadConfig(env);
  const nextUrl = patch.url !== undefined ? normalizeBoardUrl(patch.url) : current.url;
  let nextPasscode = current.passcode;
  if (patch.clearPasscode === true) {
    nextPasscode = "";
  } else if (typeof patch.passcode === "string" && patch.passcode.length > 0) {
    nextPasscode = patch.passcode;
  }
  const nextShowAis = typeof patch.showAis === "boolean" ? patch.showAis : current.showAis;
  const nextCompactQuota = typeof patch.compactQuota === "boolean" ? patch.compactQuota : current.compactQuota;
  const next = {
    url: nextUrl,
    passcode: nextPasscode,
    showAis: nextShowAis,
    compactQuota: nextCompactQuota
  };
  const payload = `${JSON.stringify(next, null, 2)}
`;
  const targets = new Set([sharedConfigPath()]);
  const dataPath = serviceDataConfigPath(env);
  if (dataPath)
    targets.add(dataPath);
  let wroteAny = false;
  let lastError = null;
  for (const target of targets) {
    try {
      writeFileSecure(target, payload);
      wroteAny = true;
    } catch (err) {
      lastError = err;
    }
  }
  if (!wroteAny && lastError) {
    throw lastError;
  }
  return next;
};
var toPublicConfig = (cfg) => ({
  url: cfg.url,
  hasPasscode: cfg.passcode.length > 0,
  showAis: cfg.showAis,
  compactQuota: cfg.compactQuota
});

// src/service/client.ts
var SNAPSHOT_TTL_MS = 8000;
var HISTORY_TTL_MS = 20000;
var REQUEST_TIMEOUT_MS = 1e4;
var FRESH_REQUEST_TIMEOUT_MS = 12000;
var snapshotCache = null;
var historyCache = new Map;
var clearBoardCache = () => {
  snapshotCache = null;
  historyCache.clear();
};
var cacheKeyOf = (cfg) => `${cfg.url}|${cfg.passcode.length > 0 ? "auth" : "open"}`;
var buildHeaders = (cfg) => {
  const headers = {
    Accept: "application/json"
  };
  if (cfg.passcode) {
    headers["X-View-Passcode"] = cfg.passcode;
  }
  return headers;
};
var fetchBoardSnapshot = async (cfg, options = {}) => {
  const now = Date.now();
  const key = cacheKeyOf(cfg);
  const bypassCache = Boolean(options.force || options.fresh);
  const useFresh = options.fresh ?? Boolean(options.force);
  if (!bypassCache && snapshotCache && snapshotCache.key === key && now - snapshotCache.fetchedAtMs < SNAPSHOT_TTL_MS) {
    return { ok: true, data: snapshotCache.data, fetchedAtMs: snapshotCache.fetchedAtMs };
  }
  const snapshotUrl = useFresh ? `${cfg.url}/api/snapshot?fresh=1` : `${cfg.url}/api/snapshot`;
  let response;
  try {
    response = await fetch(snapshotUrl, {
      method: "GET",
      headers: buildHeaders(cfg),
      signal: AbortSignal.timeout(options.timeoutMs ?? (useFresh ? FRESH_REQUEST_TIMEOUT_MS : REQUEST_TIMEOUT_MS))
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      code: "unreachable",
      message: `无法连接看板 ${cfg.url}（${detail}）。请确认看板服务在线，或在左侧 Pool Quota 面板检查地址。`,
      fetchedAtMs: Date.now()
    };
  }
  if (response.status === 401 || response.status === 403) {
    return {
      ok: false,
      code: "unauthorized",
      status: response.status,
      message: cfg.passcode ? "访问口令不正确，请在左侧 Pool Quota 面板重新填写访问口令。" : "看板已开启口令保护，请打开左侧 Pool Quota 面板填写访问口令。",
      fetchedAtMs: Date.now()
    };
  }
  if (!response.ok) {
    return {
      ok: false,
      code: "http",
      status: response.status,
      message: `看板返回 HTTP ${response.status}，请稍后重试。`,
      fetchedAtMs: Date.now()
    };
  }
  let parsed;
  try {
    parsed = await response.json();
  } catch {
    return {
      ok: false,
      code: "invalid",
      message: "看板返回的不是合法 JSON，请确认看板地址填写正确。",
      fetchedAtMs: Date.now()
    };
  }
  if (!parsed || typeof parsed !== "object" || !("antigravity" in parsed) || !("aistudio" in parsed)) {
    return {
      ok: false,
      code: "invalid",
      message: "看板 JSON 结构不符合 Pool Status Board 格式。",
      fetchedAtMs: Date.now()
    };
  }
  const data = parsed;
  const fetchedAtMs = Date.now();
  snapshotCache = { key, fetchedAtMs, data };
  return { ok: true, data, fetchedAtMs };
};
var fetchAntigravityHistory = async (cfg, params) => {
  const windowKind = params.window ?? "5h";
  const range = params.range ?? (windowKind === "7d" ? "7d" : "24h");
  const key = `${cacheKeyOf(cfg)}|${params.accountId}|${windowKind}|${range}`;
  const now = Date.now();
  const cached = historyCache.get(key);
  if (!params.force && cached && now - cached.fetchedAtMs < HISTORY_TTL_MS) {
    return { ok: true, data: cached.data, fetchedAtMs: cached.fetchedAtMs };
  }
  const query = new URLSearchParams({
    account: params.accountId,
    window: windowKind,
    range
  });
  let response;
  try {
    response = await fetch(`${cfg.url}/api/antigravity/history?${query.toString()}`, {
      method: "GET",
      headers: buildHeaders(cfg),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      code: "unreachable",
      message: `无法拉取历史曲线：${detail}`,
      fetchedAtMs: Date.now()
    };
  }
  if (response.status === 401 || response.status === 403) {
    return {
      ok: false,
      code: "unauthorized",
      status: response.status,
      message: "历史曲线接口需要有效访问口令。",
      fetchedAtMs: Date.now()
    };
  }
  if (!response.ok) {
    return {
      ok: false,
      code: "http",
      status: response.status,
      message: `历史曲线接口返回 HTTP ${response.status}。`,
      fetchedAtMs: Date.now()
    };
  }
  try {
    const data = await response.json();
    const fetchedAtMs = Date.now();
    historyCache.set(key, { fetchedAtMs, data });
    return { ok: true, data, fetchedAtMs };
  } catch {
    return {
      ok: false,
      code: "invalid",
      message: "历史曲线返回的不是合法 JSON。",
      fetchedAtMs: Date.now()
    };
  }
};

// src/shared/format.ts
var clampPercent = (value) => {
  if (!Number.isFinite(value))
    return 0;
  return Math.max(0, Math.min(100, value));
};
var round1 = (value) => Math.round(value * 10) / 10;
var formatPercent = (value) => {
  const clamped = clampPercent(value);
  if (Math.abs(clamped - Math.round(clamped)) < 0.05) {
    return `${Math.round(clamped)}%`;
  }
  return `${clamped.toFixed(1)}%`;
};
var formatUsd = (value) => {
  if (!Number.isFinite(value) || value < 0)
    return "$0";
  if (value >= 100)
    return `$${Math.round(value)}`;
  if (value >= 10)
    return `$${value.toFixed(1)}`;
  return `$${value.toFixed(2)}`;
};
var formatTokens = (tokens) => {
  if (!Number.isFinite(tokens) || tokens <= 0)
    return "0";
  if (tokens >= 1e9)
    return `${(tokens / 1e9).toFixed(2)}B`;
  if (tokens >= 1e6) {
    const m = tokens / 1e6;
    return m >= 100 ? `${Math.round(m)}M` : `${m.toFixed(1)}M`;
  }
  if (tokens >= 1000)
    return `${Math.round(tokens / 1000)}K`;
  return String(Math.round(tokens));
};
var formatCountdown = (resetAtMs, nowMs = Date.now()) => {
  if (!resetAtMs || !Number.isFinite(resetAtMs) || resetAtMs <= nowMs)
    return "即将重置";
  const sec = Math.max(0, Math.floor((resetAtMs - nowMs) / 1000));
  const days = Math.floor(sec / 86400);
  const hours = Math.floor(sec % 86400 / 3600);
  const mins = Math.floor(sec % 3600 / 60);
  if (days > 0)
    return `${days}d ${hours}h`;
  if (hours > 0)
    return `${hours}h ${mins}m`;
  return `${Math.max(1, mins)}m`;
};
var formatSampleFreshness = (observedAtMs, nowMs = Date.now()) => {
  if (!observedAtMs || !Number.isFinite(observedAtMs) || observedAtMs <= 0)
    return null;
  const obsMs = observedAtMs > 1000000000000 ? observedAtMs : observedAtMs * 1000;
  const diffSec = Math.max(0, Math.floor((nowMs - obsMs) / 1000));
  if (diffSec < 60)
    return "刚刚采样";
  const mins = Math.floor(diffSec / 60);
  if (mins < 60)
    return `采样 ${mins}m 前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24)
    return `采样 ${hours}h 前`;
  const days = Math.floor(hours / 24);
  return `采样 ${days}d 前`;
};
var forecastLabelFor = (basis, compact = false) => {
  if (basis === "previous")
    return compact ? "参考" : "上期参考";
  return compact ? "预测" : "满额预测";
};
var toneForRemaining = (remainingPercent) => {
  const rem = clampPercent(remainingPercent);
  if (rem <= 20)
    return "error";
  if (rem <= 50)
    return "warning";
  return "success";
};
var formatAgWindowValueLabel = (win) => {
  const rem = formatPercent(win.remaining_percent);
  if (win.has_current_usage && win.current_cost > 0) {
    if (win.has_forecast && win.forecast_cost > 0) {
      const tag = forecastLabelFor(win.forecast_basis, false);
      return `剩 ${rem} · ${formatUsd(win.current_cost)} / ${tag}${formatUsd(win.forecast_cost)}`;
    }
    return `剩 ${rem} · 已用${formatUsd(win.current_cost)}`;
  }
  return `剩 ${rem}`;
};
var formatAgWindowCompactValueLabel = (win) => {
  if (win.has_current_usage && win.current_cost > 0) {
    const rem = formatPercent(win.remaining_percent);
    if (win.has_forecast && win.forecast_cost > 0) {
      return `${rem} · ${formatUsd(win.current_cost)}/${formatUsd(win.forecast_cost)}`;
    }
    return `${rem} · ${formatUsd(win.current_cost)}`;
  }
  return null;
};
var formatAisModelValueLabel = (model) => {
  const acct = `${model.available_accounts}/${model.eligible_accounts}号`;
  const remReq = `${model.effective_remaining_requests}次`;
  const remTok = formatTokens(model.effective_remaining_tokens);
  const pct = formatPercent(model.effective_percent);
  return `${acct} · ${pct} · 剩${remReq}/${remTok}`;
};
var formatAisModelCompactValueLabel = (model) => {
  if (model.eligible_accounts <= 0) {
    return "0/0号";
  }
  if (model.available_accounts <= 0) {
    return `0/${model.eligible_accounts}号 · 耗尽`;
  }
  if (model.available_accounts < model.eligible_accounts) {
    return `${model.available_accounts}/${model.eligible_accounts}号 · ${formatPercent(model.effective_percent)}`;
  }
  return null;
};
var truncate = (value, max) => value.length <= max ? value : `${value.slice(0, Math.max(1, max - 1))}…`;

// src/service/quota-view.ts
var WINDOW_ORDER = ["gemini_5h", "gemini_weekly", "claude_5h", "claude_weekly", "argon_weekly"];
var safeKey = (raw) => {
  const trimmed = raw.trim() || "window";
  if (trimmed === "__proto__" || trimmed === "constructor" || trimmed === "prototype") {
    return `w_${trimmed}`;
  }
  return truncate(trimmed, QUOTA_PROVIDER_NAME_MAX);
};
var safeLabel = (raw) => truncate(raw.trim(), QUOTA_PROVIDER_LABEL_MAX);
var sortAgWindows = (windows) => [...windows].sort((a, b) => {
  const ia = WINDOW_ORDER.indexOf(a.key);
  const ib = WINDOW_ORDER.indexOf(b.key);
  if (ia !== -1 && ib !== -1)
    return ia - ib;
  if (ia !== -1)
    return -1;
  if (ib !== -1)
    return 1;
  return a.label.localeCompare(b.label);
});
var toAgQuotaWindow = (win, compact) => {
  const remaining = clampPercent(win.remaining_percent);
  const used = round1(clampPercent(100 - remaining));
  const rawLabel = compact ? formatAgWindowCompactValueLabel(win) : formatAgWindowValueLabel(win);
  const out = {
    usedPercent: used,
    ...rawLabel ? { valueLabel: safeLabel(rawLabel) } : {}
  };
  if (Number.isFinite(win.duration_seconds) && win.duration_seconds > 0) {
    out.windowSeconds = Math.round(win.duration_seconds);
  }
  if (Number.isFinite(win.reset_at_ms) && win.reset_at_ms > 0) {
    out.resetAt = Math.round(win.reset_at_ms);
  }
  return out;
};
var buildQuotaErrorData = (message) => ({
  ok: false,
  configured: true,
  error: truncate(message || "无法读取双号池快照", QUOTA_PROVIDER_ERROR_MESSAGE_MAX),
  usage: null
});
var buildQuotaUsageData = (snapshot, cfg) => {
  const windows = {};
  const ag = snapshot.antigravity;
  const ais = snapshot.aistudio;
  const pushWindow = (name, win) => {
    if (Object.keys(windows).length >= QUOTA_PROVIDER_WINDOWS_MAX)
      return;
    windows[safeKey(name)] = win;
  };
  const compact = cfg.compactQuota;
  if (ag?.online && Array.isArray(ag.accounts) && ag.accounts.length > 0) {
    if (ag.accounts.length === 1) {
      const only = ag.accounts[0];
      for (const win of sortAgWindows(only.windows ?? [])) {
        pushWindow(win.label || win.key, toAgQuotaWindow(win, compact));
      }
    } else {
      for (const avg of ag.summary?.window_averages ?? []) {
        const remaining = clampPercent(avg.avg_remaining_percent);
        const used = round1(clampPercent(100 - remaining));
        let earliestReset = null;
        let durationSeconds = null;
        for (const acct of ag.accounts) {
          const match = acct.windows?.find((w) => w.key === avg.key);
          if (!match)
            continue;
          if (durationSeconds === null && match.duration_seconds > 0) {
            durationSeconds = Math.round(match.duration_seconds);
          }
          if (match.reset_at_ms > 0 && (earliestReset === null || match.reset_at_ms < earliestReset)) {
            earliestReset = Math.round(match.reset_at_ms);
          }
        }
        const entry = {
          usedPercent: used,
          valueLabel: safeLabel(compact ? `${formatPercent(remaining)} · ${avg.account_count}号` : `均剩 ${formatPercent(remaining)} (${avg.account_count}号)`)
        };
        if (durationSeconds !== null)
          entry.windowSeconds = durationSeconds;
        if (earliestReset !== null)
          entry.resetAt = earliestReset;
        pushWindow(avg.label || avg.key, entry);
      }
      for (const acct of ag.accounts) {
        for (const win of sortAgWindows(acct.windows ?? [])) {
          if (Object.keys(windows).length >= QUOTA_PROVIDER_WINDOWS_MAX - (cfg.showAis ? 1 : 0))
            break;
          pushWindow(`${acct.code_name} · ${win.label || win.key}`, toAgQuotaWindow(win, compact));
        }
      }
    }
  } else if (ag && !ag.online) {
    pushWindow("Antigravity", {
      usedPercent: null,
      valueLabel: safeLabel(ag.status_message || "离线")
    });
  }
  let models;
  if (cfg.showAis) {
    if (ais?.online) {
      const aisModels = Array.isArray(ais.models) ? ais.models : [];
      const activeModels = aisModels.filter((m) => m.eligible_accounts > 0);
      const minPct = activeModels.length > 0 ? Math.min(...activeModels.map((m) => clampPercent(m.effective_percent))) : 100;
      const zeroCount = activeModels.filter((m) => m.available_accounts === 0).length;
      const ready = ais.account_counts?.ready ?? 0;
      const enabled = ais.account_counts?.enabled ?? 0;
      const summaryLabel = compact ? zeroCount > 0 ? `${ready}/${enabled}号 · ${zeroCount}耗尽` : `${ready}/${enabled}号 · ${formatPercent(minPct)}` : zeroCount > 0 ? `${ready}/${enabled}号 · ${zeroCount}模型耗尽 · 最低${formatPercent(minPct)}` : `${ready}/${enabled}号就绪 · 最低 ${formatPercent(minPct)}`;
      const aisSummaryWin = {
        usedPercent: round1(clampPercent(100 - minPct)),
        windowSeconds: 86400,
        valueLabel: safeLabel(summaryLabel)
      };
      if (Number.isFinite(ais.next_reset_ms) && ais.next_reset_ms > 0) {
        aisSummaryWin.resetAt = Math.round(ais.next_reset_ms);
      }
      pushWindow(compact ? "AIS 号池" : "AIStudio 号池 (Playground)", aisSummaryWin);
      if (aisModels.length > 0) {
        models = {};
        for (const model of aisModels.slice(0, QUOTA_PROVIDER_MODELS_MAX)) {
          const rem = clampPercent(model.effective_percent);
          const rawModelLabel = compact ? formatAisModelCompactValueLabel(model) : formatAisModelValueLabel(model);
          const modelWin = {
            usedPercent: round1(clampPercent(100 - rem)),
            windowSeconds: 86400,
            ...rawModelLabel ? { valueLabel: safeLabel(rawModelLabel) } : {}
          };
          if (Number.isFinite(ais.next_reset_ms) && ais.next_reset_ms > 0) {
            modelWin.resetAt = Math.round(ais.next_reset_ms);
          }
          models[safeKey(model.id || model.label)] = {
            windows: {
              daily: modelWin
            }
          };
        }
      }
    } else if (ais) {
      pushWindow(compact ? "AIS 号池" : "AIStudio 号池", {
        usedPercent: null,
        valueLabel: safeLabel(ais.status_message || "离线")
      });
    }
  }
  const agCount = ag?.summary?.active_accounts ?? ag?.accounts?.length ?? 0;
  const aisReady = ais?.account_counts?.ready ?? 0;
  const aisEnabled = ais?.account_counts?.enabled ?? 0;
  const planLabel = cfg.showAis ? safeLabel(`AG ${agCount}号 · AIS ${aisReady}/${aisEnabled}号`) : safeLabel(`Antigravity ${agCount}号 · AIS已隐藏`);
  return {
    ok: true,
    configured: true,
    planLabel,
    usage: {
      windows,
      ...models && Object.keys(models).length > 0 ? { models } : {}
    }
  };
};

// src/service/status-view.ts
var WINDOW_ORDER2 = ["gemini_5h", "gemini_weekly", "claude_5h", "claude_weekly"];
var CORE_AIS_MODELS = ["gemini-4-carbon", "gemini-4-neon", "gemini-4-argon", "gemini-4-hydrogen"];
var toKebabId = (raw, fallback) => {
  const cleaned = raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 36);
  return cleaned || fallback;
};
var shortAgLabel = (win) => {
  switch (win.key) {
    case "gemini_5h":
      return "AG Gemini 5h";
    case "gemini_weekly":
      return "AG Gemini 7d";
    case "claude_5h":
      return "AG Claude 5h";
    case "claude_weekly":
      return "AG Claude 7d";
    default:
      return truncate(win.label || win.key, 40);
  }
};
var shortModelLabel = (model) => {
  const map = {
    "gemini-4-carbon": "AIS Carbon",
    "gemini-4-neon": "AIS Neon",
    "gemini-4-argon": "AIS Argon",
    "gemini-4-hydrogen": "AIS Hydrogen",
    "gemini-3.1-pro-preview": "AIS 3.1 Pro",
    "gemini-3.8-flash": "AIS 3.8 Flash"
  };
  return map[model.id] ?? truncate(`AIS ${model.label || model.id}`, 40);
};
var buildStatusErrorView = (cfg, errorMessage, errorCode) => ({
  rows: [
    {
      kind: "line",
      id: "pool-ais-toggle",
      label: "显示 AIS 号池",
      dot: "warning",
      value: cfg.showAis ? "开启" : "关闭",
      actions: [
        {
          kind: "switch",
          id: "toggle-ais",
          label: "显示 AIS 号池",
          checked: cfg.showAis
        }
      ]
    },
    {
      kind: "note",
      id: "pool-error",
      text: truncate(errorMessage, GUEST_STATUS_VIEW_NOTE_MAX),
      tone: errorCode === "unauthorized" ? "warning" : "error"
    }
  ],
  controls: [
    { kind: "button", id: "refresh", label: "刷新" }
  ]
});
var buildStatusView = (snapshot, history, cfg) => {
  const rows = [];
  const alerts = [];
  const pushRow = (row) => {
    if (rows.length < GUEST_STATUS_VIEW_ROWS_MAX) {
      rows.push(row);
    }
  };
  const agOnline = snapshot.antigravity?.online === true;
  const aisOnline = snapshot.aistudio?.online === true;
  const aisReady = snapshot.aistudio?.account_counts?.ready ?? 0;
  const aisEnabled = snapshot.aistudio?.account_counts?.enabled ?? 0;
  pushRow({
    kind: "line",
    id: "pool-controls",
    label: "AIS 号池",
    dot: agOnline && (!cfg.showAis || aisOnline) ? "success" : "warning",
    value: cfg.showAis ? `${aisReady}/${aisEnabled}号就绪` : "已隐藏",
    valueTone: cfg.showAis ? "default" : "muted",
    actions: [
      {
        kind: "switch",
        id: "toggle-ais",
        label: "显示 AIS 号池",
        checked: cfg.showAis
      }
    ]
  });
  const agAccounts = snapshot.antigravity?.accounts ?? [];
  const primaryAccount = agAccounts[0];
  if (primaryAccount && primaryAccount.windows.length > 0) {
    const sorted = [...primaryAccount.windows].sort((a, b) => {
      const ia = WINDOW_ORDER2.indexOf(a.key);
      const ib = WINDOW_ORDER2.indexOf(b.key);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    for (const win of sorted.slice(0, 4)) {
      const rem = clampPercent(win.remaining_percent);
      const tone = toneForRemaining(rem);
      const costPart = win.has_current_usage && win.current_cost > 0 ? win.has_forecast && win.forecast_cost > 0 ? ` · ${formatUsd(win.current_cost)}/${forecastLabelFor(win.forecast_basis, true)}${formatUsd(win.forecast_cost)}` : ` · ${formatUsd(win.current_cost)}` : "";
      const resetPart = win.reset_at_ms > 0 ? ` · ${formatCountdown(win.reset_at_ms)}` : "";
      const estRem = typeof win.estimated_remaining_percent === "number" && Number.isFinite(win.estimated_remaining_percent) ? clampPercent(win.estimated_remaining_percent) : null;
      const showEst = estRem !== null && rem - estRem >= 0.25;
      const freshness = formatSampleFreshness(win.observed_at_ms);
      const tooltipParts = [
        `${win.label}: 剩余 ${formatPercent(rem)}`,
        showEst ? `实时估算 ~${estRem.toFixed(1)}%` : "",
        freshness ?? "",
        win.has_current_usage ? `本轮已用 ${formatUsd(win.current_cost)} (${win.current_requests}次)` : "本轮暂无消耗",
        win.has_forecast && win.forecast_cost > 0 ? `${forecastLabelFor(win.forecast_basis, false)} ${formatUsd(win.forecast_cost)}` : "",
        win.reset_at_ms > 0 ? `重置倒计时 ${formatCountdown(win.reset_at_ms)}` : ""
      ].filter(Boolean);
      pushRow({
        kind: "line",
        id: `ag-${toKebabId(win.key, "win")}`,
        label: shortAgLabel(win),
        content: { kind: "bar", value: rem, tone },
        value: truncate(`${formatPercent(rem)}${costPart}${resetPart}`, 80),
        valueTone: tone === "success" ? "default" : tone,
        tooltip: truncate(tooltipParts.join(" · "), 200)
      });
      if (rem < 20) {
        alerts.push(`${win.label} 仅剩 ${formatPercent(rem)}`);
      }
    }
  } else if (!agOnline) {
    alerts.push("Antigravity 号池当前离线");
  }
  const geminiSeries = history?.series?.find((s) => s.key === "gemini_5h" && s.points.length >= 2) ?? history?.series?.find((s) => s.points.length >= 2);
  if (geminiSeries) {
    const rawVals = geminiSeries.points.map((pt) => clampPercent(pt[1]));
    const vals = rawVals.slice(-GUEST_STATUS_VIEW_CHART_POINTS_MAX);
    const step = history?.sample_step_sec && history.sample_step_sec > 0 && history.sample_step_sec <= 3600 ? history.sample_step_sec : 900;
    const latest = vals[vals.length - 1] ?? 0;
    pushRow({
      kind: "line",
      id: "ag-trend-24h",
      label: "24h 剩余趋势",
      content: {
        kind: "chart",
        values: vals,
        max: 100,
        tone: toneForRemaining(latest) === "success" ? "accent" : toneForRemaining(latest),
        unit: "percent",
        step
      },
      value: `${geminiSeries.label} ${formatPercent(latest)}`,
      tooltip: truncate(`${geminiSeries.label} 近 24 小时剩余额度曲线（共 ${vals.length} 个采样点）`, 200)
    });
  }
  if (cfg.showAis) {
    if (aisOnline) {
      const allModels = snapshot.aistudio?.models ?? [];
      const picked = [];
      const seen = new Set;
      for (const id of CORE_AIS_MODELS) {
        const m = allModels.find((item) => item.id === id);
        if (m) {
          picked.push(m);
          seen.add(m.id);
        }
      }
      for (const m of allModels) {
        if (seen.has(m.id))
          continue;
        if (m.available_accounts === 0 || m.effective_percent < 50) {
          picked.push(m);
          seen.add(m.id);
        }
      }
      const maxAisRows = Math.max(0, GUEST_STATUS_VIEW_ROWS_MAX - rows.length - 2);
      for (const model of picked.slice(0, maxAisRows)) {
        const rem = clampPercent(model.effective_percent);
        const tone = model.available_accounts === 0 ? "error" : toneForRemaining(rem);
        pushRow({
          kind: "line",
          id: `ais-${toKebabId(model.id, "model")}`,
          label: shortModelLabel(model),
          content: { kind: "bar", value: rem, tone },
          value: truncate(`${model.available_accounts}/${model.eligible_accounts}号 · ${formatPercent(rem)}`, 80),
          valueTone: tone === "success" ? "default" : tone,
          tooltip: truncate(`${model.label}: 可用 ${model.available_accounts}/${model.eligible_accounts} 号 · 剩 ${model.effective_remaining_requests}次 / ${formatTokens(model.effective_remaining_tokens)} tok · 重置 ${formatCountdown(snapshot.aistudio.next_reset_ms)}`, 200)
        });
      }
      for (const m of allModels) {
        if (m.eligible_accounts > 0 && m.available_accounts === 0) {
          alerts.push(`${m.label} 可用号归零`);
        } else if (CORE_AIS_MODELS.includes(m.id) && m.effective_percent < 20) {
          alerts.push(`${m.label} 仅剩 ${formatPercent(m.effective_percent)}`);
        }
      }
      if (snapshot.aistudio.next_reset_ms > 0 && rows.length < GUEST_STATUS_VIEW_ROWS_MAX - (alerts.length > 0 ? 1 : 0)) {
        pushRow({
          kind: "line",
          id: "ais-reset",
          label: "AIS 每日重置",
          content: {
            kind: "chips",
            chips: [
              { id: "ais-reset-chip", label: `16:00 · ${formatCountdown(snapshot.aistudio.next_reset_ms)}`, tone: "info" },
              { id: "board-link", label: "打开看板", tone: "accent", url: cfg.url }
            ]
          }
        });
      }
    } else {
      alerts.push("AIStudio2API 号池当前离线");
    }
  } else if (rows.length < GUEST_STATUS_VIEW_ROWS_MAX - (alerts.length > 0 ? 1 : 0)) {
    pushRow({
      kind: "line",
      id: "board-shortcut",
      label: "完整看板",
      content: {
        kind: "chips",
        chips: [{ id: "board-link", label: "打开 Pool Status Board", tone: "accent", url: cfg.url }]
      }
    });
  }
  if (alerts.length > 0) {
    pushRow({
      kind: "note",
      id: "quota-alert",
      text: truncate(`预警：${alerts.join("；")}`, GUEST_STATUS_VIEW_NOTE_MAX),
      tone: alerts.some((a) => a.includes("归零") || a.includes("离线")) ? "error" : "warning"
    });
  }
  return {
    rows,
    controls: [
      { kind: "button", id: "refresh", label: "刷新" }
    ]
  };
};

// src/service/main.ts
var port = Number(process.env.OPENCHAMBER_SERVICE_PORT);
var serviceToken = process.env.OPENCHAMBER_SERVICE_TOKEN ?? "";
if (!Number.isFinite(port) || port <= 0 || !serviceToken) {
  console.error("OPENCHAMBER_SERVICE_PORT and OPENCHAMBER_SERVICE_TOKEN are required");
  process.exit(1);
}
var MAX_BODY_BYTES = 64 * 1024;
var sendJson = (res, status, body) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(body));
};
var readBody = (req) => new Promise((resolve, reject) => {
  let body = "";
  let bytes = 0;
  req.on("data", (chunk) => {
    bytes += Buffer.byteLength(chunk);
    if (bytes > MAX_BODY_BYTES) {
      reject(new Error("Request body too large"));
      req.destroy();
      return;
    }
    body += chunk.toString();
  });
  req.on("end", () => resolve(body));
  req.on("error", reject);
});
var parseJsonObject = (raw) => {
  if (!raw.trim())
    return {};
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("JSON body must be an object");
  }
  return parsed;
};
var buildPanelState = async (cfg, options = {}) => {
  const snapRes = await fetchBoardSnapshot(cfg, { force: options.force, fresh: options.fresh });
  if (!snapRes.ok) {
    return {
      config: toPublicConfig(cfg),
      snapshot: null,
      history: null,
      error: snapRes.message,
      errorCode: snapRes.code,
      fetchedAtMs: snapRes.fetchedAtMs
    };
  }
  let history = null;
  const firstAccountId = snapRes.data.antigravity?.accounts?.[0]?.id;
  if (firstAccountId) {
    const histRes = await fetchAntigravityHistory(cfg, {
      accountId: firstAccountId,
      window: options.historyWindow ?? "5h",
      range: options.historyRange ?? (options.historyWindow === "7d" ? "7d" : "24h"),
      force: options.force
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
    fetchedAtMs: snapRes.fetchedAtMs
  };
};
var handleRequest = async (req, res) => {
  if (req.headers.authorization !== `Bearer ${serviceToken}`) {
    sendJson(res, 401, { error: "unauthorized" });
    return;
  }
  const parsedUrl = new URL(req.url ?? "/", "http://127.0.0.1");
  const pathname = parsedUrl.pathname;
  const method = (req.method ?? "GET").toUpperCase();
  if (pathname === "/health" && method === "GET") {
    sendJson(res, 200, { ok: true });
    return;
  }
  if (pathname === QUOTA_PROVIDER_PATH && method === "POST") {
    const raw = await readBody(req);
    const request = readQuotaProviderRequest(raw);
    if (!request) {
      sendJson(res, 400, { error: "invalid quota provider request" });
      return;
    }
    const cfg = loadConfig();
    const snapRes = await fetchBoardSnapshot(cfg);
    const result = snapRes.ok ? { ok: true, data: buildQuotaUsageData(snapRes.data, cfg) } : { ok: true, data: buildQuotaErrorData(snapRes.message) };
    sendJson(res, 200, result);
    return;
  }
  if (pathname === "/status" && method === "GET") {
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
        window: "5h",
        range: "24h"
      });
      if (histRes.ok)
        history = histRes.data;
    }
    sendJson(res, 200, buildStatusView(snapRes.data, history, cfg));
    return;
  }
  if (pathname === "/status" && method === "POST") {
    const body = parseJsonObject(await readBody(req));
    const actionId = typeof body.id === "string" ? body.id : "";
    const value = typeof body.value === "string" ? body.value : undefined;
    if (actionId === "toggle-ais") {
      const current = loadConfig();
      const nextShowAis = value !== undefined ? value === "on" || value === "true" : !current.showAis;
      saveConfig({ showAis: nextShowAis });
      clearBoardCache();
      sendJson(res, 200, { ok: true, showAis: nextShowAis });
      return;
    }
    if (actionId === "refresh") {
      clearBoardCache();
      const cfg = loadConfig();
      await fetchBoardSnapshot(cfg, { force: true, fresh: true });
      sendJson(res, 200, { ok: true });
      return;
    }
    sendJson(res, 400, { message: `未知操作：${actionId || "(empty)"}` });
    return;
  }
  if (pathname === "/panel/state" && method === "GET") {
    const refresh = parsedUrl.searchParams.get("refresh") === "1" || parsedUrl.searchParams.get("force") === "1";
    const histWinParam = parsedUrl.searchParams.get("window");
    const historyWindow = histWinParam === "7d" ? "7d" : "5h";
    const historyRange = parsedUrl.searchParams.get("range") || (historyWindow === "7d" ? "7d" : "24h");
    const cfg = loadConfig();
    const state = await buildPanelState(cfg, { force: refresh, fresh: refresh, historyWindow, historyRange });
    sendJson(res, 200, state);
    return;
  }
  if (pathname === "/panel/config" && method === "POST") {
    const body = parseJsonObject(await readBody(req));
    const patch = {};
    if (typeof body.url === "string") {
      patch.url = normalizeBoardUrl(body.url);
    }
    if (typeof body.passcode === "string" && body.passcode.length > 0) {
      patch.passcode = body.passcode;
    }
    if (body.clearPasscode === true) {
      patch.clearPasscode = true;
    }
    if (typeof body.showAis === "boolean") {
      patch.showAis = body.showAis;
    }
    if (typeof body.compactQuota === "boolean") {
      patch.compactQuota = body.compactQuota;
    }
    const nextCfg = saveConfig(patch);
    clearBoardCache();
    const state = await buildPanelState(nextCfg, { force: true, fresh: false });
    sendJson(res, 200, state);
    return;
  }
  if (pathname === "/panel/test" && method === "POST") {
    const body = parseJsonObject(await readBody(req));
    const current = loadConfig();
    const testUrl = typeof body.url === "string" && body.url.trim() ? normalizeBoardUrl(body.url) : current.url;
    const clearPasscode = body.clearPasscode === true;
    const testPasscode = clearPasscode ? "" : typeof body.passcode === "string" && body.passcode.length > 0 ? body.passcode : current.passcode;
    const testShowAis = typeof body.showAis === "boolean" ? body.showAis : current.showAis;
    const testCompactQuota = typeof body.compactQuota === "boolean" ? body.compactQuota : current.compactQuota;
    const candidate = {
      url: testUrl,
      passcode: testPasscode,
      showAis: testShowAis,
      compactQuota: testCompactQuota
    };
    const snapRes = await fetchBoardSnapshot(candidate, { force: true, fresh: false, timeoutMs: 8000 });
    if (!snapRes.ok) {
      sendJson(res, 200, {
        ok: false,
        code: snapRes.code,
        message: snapRes.message
      });
      return;
    }
    if (body.save === true) {
      saveConfig({
        url: candidate.url,
        passcode: candidate.passcode,
        clearPasscode,
        showAis: candidate.showAis,
        compactQuota: candidate.compactQuota
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
      config: toPublicConfig(candidate)
    });
    return;
  }
  if (pathname === "/panel/history" && method === "GET") {
    const cfg = loadConfig();
    const accountId = parsedUrl.searchParams.get("account") ?? "";
    if (!accountId) {
      sendJson(res, 400, { error: "missing account parameter" });
      return;
    }
    const windowKind = parsedUrl.searchParams.get("window") === "7d" ? "7d" : "5h";
    const range = parsedUrl.searchParams.get("range") || (windowKind === "7d" ? "7d" : "24h");
    const histRes = await fetchAntigravityHistory(cfg, {
      accountId,
      window: windowKind,
      range,
      force: parsedUrl.searchParams.get("refresh") === "1" || parsedUrl.searchParams.get("force") === "1"
    });
    if (!histRes.ok) {
      sendJson(res, 502, { error: histRes.message });
      return;
    }
    sendJson(res, 200, histRes.data);
    return;
  }
  sendJson(res, 404, { error: "not-found" });
};
var server = http.createServer((req, res) => {
  handleRequest(req, res).catch((err) => {
    const message = err instanceof Error ? err.message : "internal error";
    if (!res.headersSent) {
      sendJson(res, 500, { error: message });
    }
  });
});
server.listen(port, "127.0.0.1");
