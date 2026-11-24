import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DEFAULT_URL = "http://127.0.0.1:18380";
const CACHE_TTL_MS = 15_000;
const CORE_AIS_MODELS = ["gemini-4-carbon", "gemini-4-neon", "gemini-4-argon", "gemini-4-hydrogen"];
const WINDOW_ORDER = ["gemini_5h", "gemini_weekly", "claude_5h", "claude_weekly"];

let snapshotCache = null;

function parseBool(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lower = value.trim().toLowerCase();
    if (["1", "true", "yes", "on"].includes(lower)) return true;
    if (["0", "false", "no", "off"].includes(lower)) return false;
  }
  return undefined;
}

function normalizeUrl(raw) {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return DEFAULT_URL;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return DEFAULT_URL;
    return parsed.origin + parsed.pathname.replace(/\/+$/, "");
  } catch {
    return DEFAULT_URL;
  }
}

function readJsonWithMtime(filePath) {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return null;
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    return { data, mtimeMs: stat.mtimeMs };
  } catch {
    return null;
  }
}

function loadConfig(pluginOptions) {
  const home = os.homedir();
  const candidates = [
    path.join(home, ".config", "opencode", "pool-quota.json"),
    path.join(home, ".config", "openchamber", "guest-data", "pool-quota", "config.json"),
  ];

  const loaded = candidates
    .map((filePath) => readJsonWithMtime(filePath))
    .filter(Boolean)
    .sort((a, b) => a.mtimeMs - b.mtimeMs);

  let url = DEFAULT_URL;
  let passcode = "";
  let showAis = true;

  for (const item of loaded) {
    if (typeof item.data.url === "string" && item.data.url.trim()) {
      url = normalizeUrl(item.data.url);
    }
    if (typeof item.data.passcode === "string") {
      passcode = item.data.passcode;
    }
    const boolVal = parseBool(item.data.showAis);
    if (boolVal !== undefined) showAis = boolVal;
  }

  if (pluginOptions && typeof pluginOptions === "object") {
    if (typeof pluginOptions.url === "string" && pluginOptions.url.trim()) {
      url = normalizeUrl(pluginOptions.url);
    }
    if (typeof pluginOptions.passcode === "string" && pluginOptions.passcode.length > 0) {
      passcode = pluginOptions.passcode;
    }
    const optShowAis = parseBool(pluginOptions.showAis);
    if (optShowAis !== undefined) showAis = optShowAis;
  }

  if (typeof process.env.POOL_QUOTA_URL === "string" && process.env.POOL_QUOTA_URL.trim()) {
    url = normalizeUrl(process.env.POOL_QUOTA_URL);
  }
  if (typeof process.env.POOL_QUOTA_PASSCODE === "string" && process.env.POOL_QUOTA_PASSCODE.length > 0) {
    passcode = process.env.POOL_QUOTA_PASSCODE;
  }
  const envShowAis = parseBool(process.env.POOL_QUOTA_SHOW_AIS);
  if (envShowAis !== undefined) showAis = envShowAis;

  return { url, passcode, showAis };
}

function clampPct(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function fmtPct(value) {
  const c = clampPct(value);
  return Math.abs(c - Math.round(c)) < 0.05 ? `${Math.round(c)}%` : `${c.toFixed(1)}%`;
}

function fmtUsd(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return "$0";
  if (n >= 100) return `$${Math.round(n)}`;
  if (n >= 10) return `$${n.toFixed(1)}`;
  return `$${n.toFixed(2)}`;
}

function fmtTokens(tokens) {
  const n = Number(tokens);
  if (!Number.isFinite(n) || n <= 0) return "0";
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) {
    const m = n / 1e6;
    return m >= 100 ? `${Math.round(m)}M` : `${m.toFixed(1)}M`;
  }
  if (n >= 1e3) return `${Math.round(n / 1e3)}K`;
  return String(Math.round(n));
}

function fmtCountdown(resetAtMs) {
  if (!resetAtMs || !Number.isFinite(resetAtMs) || resetAtMs <= Date.now()) return "即将重置";
  const sec = Math.max(0, Math.floor((resetAtMs - Date.now()) / 1000));
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${Math.max(1, mins)}m`;
}

async function fetchSnapshot(cfg, options = {}) {
  const now = Date.now();
  const key = `${cfg.url}|${cfg.passcode.length > 0 ? "auth" : "open"}`;
  const bypassCache = Boolean(options.force || options.fresh);
  const useFresh = options.fresh ?? Boolean(options.force);
  if (!bypassCache && snapshotCache && snapshotCache.key === key && now - snapshotCache.fetchedAtMs < CACHE_TTL_MS) {
    return { ok: true, data: snapshotCache.data, fetchedAtMs: snapshotCache.fetchedAtMs };
  }

  const headers = { Accept: "application/json" };
  if (cfg.passcode) headers["X-View-Passcode"] = cfg.passcode;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? (useFresh ? 10_000 : 6_000));
  if (options.signal) {
    if (options.signal.aborted) {
      clearTimeout(timer);
      return { ok: false, code: "aborted", error: "Request aborted" };
    }
    options.signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  const url = useFresh ? `${cfg.url}/api/snapshot?fresh=1` : `${cfg.url}/api/snapshot`;
  let res;
  try {
    res = await fetch(url, { method: "GET", headers, signal: controller.signal });
  } catch (err) {
    return {
      ok: false,
      code: "unreachable",
      error: `无法连接看板 ${cfg.url}（${err instanceof Error ? err.message : String(err)}）`,
    };
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 401 || res.status === 403) {
    return {
      ok: false,
      code: "unauthorized",
      error: "看板口令未配置或不正确，请在 OpenChamber 左侧 Pool Quota 面板或 OpenCode TUI /quota（按 s）中配置。",
    };
  }
  if (!res.ok) {
    return { ok: false, code: "http", error: `看板返回 HTTP ${res.status}` };
  }

  let data;
  try {
    data = await res.json();
  } catch {
    return { ok: false, code: "invalid", error: "看板响应不是合法 JSON" };
  }

  snapshotCache = { key, fetchedAtMs: Date.now(), data };
  return { ok: true, data, fetchedAtMs: snapshotCache.fetchedAtMs };
}

function summarizeSnapshot(snap, cfg, options = {}) {
  const scope = options.scope || (cfg.showAis ? "all" : "antigravity");
  const includeAg = scope === "all" || scope === "antigravity";
  const includeAis = scope === "all" || scope === "aistudio";
  const includeModels = options.includeModels !== false;

  const ag = snap.antigravity || {};
  const ais = snap.aistudio || {};
  const primary = Array.isArray(ag.accounts) ? ag.accounts[0] : null;
  const agWindows = primary && Array.isArray(primary.windows)
    ? [...primary.windows].sort((a, b) => {
      const ia = WINDOW_ORDER.indexOf(a.key);
      const ib = WINDOW_ORDER.indexOf(b.key);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    })
    : [];

  const findWin = (key) => agWindows.find((w) => w.key === key);
  const g5 = findWin("gemini_5h");
  const c5 = findWin("claude_5h");
  const gw = findWin("gemini_weekly");
  const cw = findWin("claude_weekly");

  const fmtWinInline = (name, w) => {
    if (!w) return "";
    const rem = clampPct(w.remaining_percent);
    const estRem = typeof w.estimated_remaining_percent === "number" && Number.isFinite(w.estimated_remaining_percent)
      ? clampPct(w.estimated_remaining_percent)
      : null;
    const est = estRem !== null && (rem - estRem) >= 0.3
      ? ` 实时估 ~${estRem.toFixed(1)}%`
      : "";
    const forecastTag = w.forecast_basis === "previous" ? "参考" : "预测";
    const forecastFull = w.forecast_basis === "previous" ? "上期参考" : "满额预测";
    const cost = w.has_current_usage && w.current_cost > 0
      ? (w.has_forecast && w.forecast_cost > 0
        ? ` (${fmtUsd(w.current_cost)}/${forecastTag}${fmtUsd(w.forecast_cost)})`
        : ` (${fmtUsd(w.current_cost)})`)
      : (w.has_forecast && w.forecast_cost > 0
        ? ` (${forecastFull}${fmtUsd(w.forecast_cost)})`
        : "");
    return `${name} ${fmtPct(rem)}${est}${cost}`;
  };

  const ag5hText = includeAg
    ? [fmtWinInline("Gemini", g5), fmtWinInline("Claude", c5)].filter(Boolean).join(" · ") || (ag.online ? "无数据" : "离线")
    : "";
  const agWeeklyText = includeAg
    ? [fmtWinInline("Gemini", gw), fmtWinInline("Claude", cw)].filter(Boolean).join(" · ") || ""
    : "";

  const aisModels = Array.isArray(ais.models) ? ais.models : [];
  const aisReady = ais.account_counts?.ready ?? 0;
  const aisEnabled = ais.account_counts?.enabled ?? 0;

  let aisSummaryText = "";
  if (includeAis) {
    if (ais.online) {
      const coreBits = CORE_AIS_MODELS
        .map((id) => aisModels.find((m) => m.id === id))
        .filter(Boolean)
        .map((m) => `${m.id.replace("gemini-4-", "")} ${fmtPct(m.effective_percent)}(${m.available_accounts}/${m.eligible_accounts})`);
      aisSummaryText = `${aisReady}/${aisEnabled}号就绪` + (coreBits.length > 0 ? ` · ${coreBits.join(" · ")}` : "");
    } else {
      aisSummaryText = ais.status_message || "离线";
    }
  }

  const resetBits = [];
  if (includeAg && g5?.reset_at_ms > 0) resetBits.push(`AG G5h ${fmtCountdown(g5.reset_at_ms)}`);
  if (includeAg && c5?.reset_at_ms > 0 && c5.used_percent > 0) resetBits.push(`AG C5h ${fmtCountdown(c5.reset_at_ms)}`);
  if (includeAis && ais.next_reset_ms > 0) resetBits.push(`AIS 16:00 ${fmtCountdown(ais.next_reset_ms)}`);

  // Determine overall status badge
  let statusBadge = "Healthy";
  const allMinAg = includeAg && agWindows.length > 0
    ? Math.min(...agWindows.map((w) => clampPct(w.remaining_percent)))
    : 100;
  const exhaustedAis = includeAis
    ? aisModels.filter((m) => m.eligible_accounts > 0 && m.available_accounts === 0)
    : [];
  const lowAis = includeAis
    ? aisModels.filter((m) => CORE_AIS_MODELS.includes(m.id) && clampPct(m.effective_percent) < 20)
    : [];

  if ((includeAg && !ag.online) && (!includeAis || !ais.online)) {
    statusBadge = "Offline";
  } else if (allMinAg < 15 || exhaustedAis.length > 0) {
    statusBadge = "Critical";
  } else if ((includeAg && !ag.online) || (includeAis && !ais.online)) {
    statusBadge = "Degraded";
  } else if (allMinAg < 40 || lowAis.length > 0) {
    statusBadge = "Warning";
  }

  const summaryParts = [];
  if (includeAg && ag.online) {
    summaryParts.push(`AG G5h ${g5 ? fmtPct(g5.remaining_percent) : "-"} / C5h ${c5 ? fmtPct(c5.remaining_percent) : "-"}`);
  }
  if (includeAis && ais.online) {
    summaryParts.push(`AIS ${aisReady}/${aisEnabled}号`);
  }

  const payload = {
    pool_label: includeAg && includeAis ? "Antigravity + AIStudio 双号池" : (includeAg ? "Antigravity 号池" : "AIStudio2API 号池"),
    summary: summaryParts.join(" · ") || "号池暂不可用",
    status_badge: statusBadge,
    ag_5h: ag5hText,
    ag_weekly: agWeeklyText,
    ais_summary: aisSummaryText,
    next_reset: resetBits.join(" · "),
    generated_at: snap.generated_at_ms ? new Date(snap.generated_at_ms).toISOString() : null,
    show_ais_setting: cfg.showAis,
  };

  if (includeAg) {
    payload.antigravity = {
      online: Boolean(ag.online),
      status: ag.status || "unknown",
      active_accounts: ag.summary?.active_accounts ?? ag.accounts?.length ?? 0,
      windows: agWindows.map((w) => {
        const rem = clampPct(w.remaining_percent);
        const estRem = typeof w.estimated_remaining_percent === "number" && Number.isFinite(w.estimated_remaining_percent)
          ? clampPct(w.estimated_remaining_percent)
          : null;
        const hasSignificantEst = estRem !== null && (rem - estRem) >= 0.3;
        return {
          key: w.key,
          label: w.label,
          remaining_percent: rem,
          used_percent: clampPct(w.used_percent),
          ...(estRem !== null ? { estimated_remaining_percent: estRem } : {}),
          ...(hasSignificantEst ? { live_estimate_note: `实时估 ~${estRem.toFixed(1)}%` } : {}),
          ...(typeof w.post_sample_cost_usd === "number" ? { post_sample_cost_usd: w.post_sample_cost_usd } : {}),
          ...(typeof w.post_sample_tokens === "number" ? { post_sample_tokens: w.post_sample_tokens } : {}),
          ...(typeof w.post_sample_requests === "number" ? { post_sample_requests: w.post_sample_requests } : {}),
          ...(w.observed_at_ms > 0 ? { observed_at_ms: w.observed_at_ms } : {}),
          current_cost_usd: w.current_cost ?? 0,
          forecast_cost_usd: w.has_forecast ? (w.forecast_cost ?? 0) : null,
          ...(w.has_forecast
            ? {
              forecast_basis: w.forecast_basis || "quota",
              forecast_label: w.forecast_basis === "previous" ? "上期参考" : "满额预测",
            }
            : {}),
          reset_in: w.reset_at_ms > 0 ? fmtCountdown(w.reset_at_ms) : null,
          reset_at_ms: w.reset_at_ms || null,
        };
      }),
    };
  }

  if (includeAis) {
    payload.aistudio = {
      online: Boolean(ais.online),
      status: ais.status || "unknown",
      ready_accounts: aisReady,
      enabled_accounts: aisEnabled,
      reset_in: ais.next_reset_ms > 0 ? fmtCountdown(ais.next_reset_ms) : null,
      next_reset_ms: ais.next_reset_ms || null,
      playground_requests: ais.playground?.requests ?? 0,
      ...(includeModels
        ? {
          models: aisModels.map((m) => ({
            id: m.id,
            label: m.label,
            available_accounts: m.available_accounts,
            eligible_accounts: m.eligible_accounts,
            effective_percent: clampPct(m.effective_percent),
            remaining_requests: m.effective_remaining_requests,
            remaining_tokens: fmtTokens(m.effective_remaining_tokens),
          })),
        }
        : {}),
    };
  }

  return payload;
}

function buildCriticalAlert(snap, cfg) {
  const warnings = [];
  const agAccounts = snap.antigravity?.accounts ?? [];
  const primary = agAccounts[0];
  if (primary && Array.isArray(primary.windows)) {
    for (const w of primary.windows) {
      if (clampPct(w.remaining_percent) < 15) {
        warnings.push(`Antigravity ${w.label} 剩余 ${fmtPct(w.remaining_percent)}（${fmtCountdown(w.reset_at_ms)} 后重置）`);
      }
    }
  }
  if (cfg.showAis && snap.aistudio?.online && Array.isArray(snap.aistudio.models)) {
    for (const m of snap.aistudio.models) {
      if (!CORE_AIS_MODELS.includes(m.id)) continue;
      if (m.eligible_accounts > 0 && m.available_accounts === 0) {
        warnings.push(`AIStudio ${m.id} 可用号已归零`);
      } else if (clampPct(m.effective_percent) < 15) {
        warnings.push(`AIStudio ${m.id} 剩余 ${fmtPct(m.effective_percent)}（${m.available_accounts}/${m.eligible_accounts}号）`);
      }
    }
  }
  if (warnings.length === 0) return null;
  return `[Pool Quota Alert] ${warnings.join("；")}。如任务较长可主动提醒用户注意窗口余量或切换模型。`;
}

export default {
  id: "pool-quota",
  async setup(ctx) {
    const pluginOptions = ctx?.options ?? {};

    await ctx.tool.transform((editor) => {
      editor.add({
        name: "pool_quota",
        description:
          "Query real-time Antigravity (4 windows: remaining %, optional live burn estimate, current/forecast or previous-cycle reference USD cost, reset countdown) and AIStudio2API (10 models: available accounts, remaining requests/tokens, bottleneck %) quotas from Pool Status Board.",
        input: {
          type: "object",
          properties: {
            scope: {
              type: "string",
              enum: ["all", "antigravity", "aistudio"],
              description: "Pool scope to query. Defaults to all when showAis is enabled, or antigravity when hidden.",
            },
            include_models: {
              type: "boolean",
              description: "Include all 10 AIStudio models in the JSON payload (default: true).",
            },
            refresh: {
              type: "boolean",
              description: "Bypass the 15s in-memory cache and request a fresh snapshot (?fresh=1) from the board.",
            },
          },
          additionalProperties: false,
        },
        execute: async (input, toolCtx) => {
          const args = input && typeof input === "object" ? input : {};
          const cfg = loadConfig(pluginOptions);
          const result = await fetchSnapshot(cfg, {
            force: args.refresh === true,
            fresh: args.refresh === true,
            signal: toolCtx?.signal,
            timeoutMs: args.refresh === true ? 10_000 : 8_000,
          });
          if (!result.ok) {
            return {
              content: JSON.stringify(
                {
                  pool_label: "Pool Status Board",
                  summary: result.error,
                  status_badge: "Offline",
                  ag_5h: "",
                  ag_weekly: "",
                  ais_summary: "",
                  next_reset: "",
                  error: result.error,
                  error_code: result.code,
                },
                null,
                2,
              ),
            };
          }
          const summary = summarizeSnapshot(result.data, cfg, {
            scope: typeof args.scope === "string" ? args.scope : undefined,
            includeModels: args.include_models !== false,
          });
          return { content: JSON.stringify(summary, null, 2) };
        },
      });
    });

    // Zero-overhead context hook: injects a single alert line ONLY when critical (<15% or 0 accounts).
    if (ctx.session && typeof ctx.session.hook === "function") {
      await ctx.session.hook("context", async (event) => {
        const cfg = loadConfig(pluginOptions);
        const result = await fetchSnapshot(cfg, { force: false, timeoutMs: 1500 });
        if (!result.ok) return;
        const alertText = buildCriticalAlert(result.data, cfg);
        if (!alertText) return;
        if (Array.isArray(event.system)) {
          event.system.push({ type: "text", text: alertText });
        }
      });
    }
  },
};
