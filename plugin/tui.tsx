/** @jsxImportSource @opentui/solid */
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Plugin } from "@opencode/plugin/tui";
import { For, Show, createMemo, createSignal, onCleanup } from "solid-js";

const DEFAULT_URL = "http://127.0.0.1:18380";
const POLL_INTERVAL_MS = 30_000;
const ALERT_COOLDOWN_MS = 15 * 60_000;
const WINDOW_ORDER = ["gemini_5h", "gemini_weekly", "claude_5h", "claude_weekly"];

type PoolConfig = {
  url: string;
  passcode: string;
  showAis: boolean;
  compactQuota: boolean;
};

type AgWindow = {
  key: string;
  label: string;
  remaining_percent: number;
  used_percent: number;
  reset_at_ms: number;
  observed_at_ms?: number;
  stale?: boolean;
  has_current_usage: boolean;
  current_cost: number;
  has_forecast: boolean;
  forecast_basis?: string;
  forecast_cost: number;
  post_sample_cost_usd?: number;
  post_sample_tokens?: number;
  post_sample_requests?: number;
  estimated_remaining_percent?: number | null;
};

type AisModel = {
  id: string;
  label: string;
  category?: string;
  eligible_accounts: number;
  available_accounts: number;
  limit_requests: number;
  used_requests?: number;
  effective_remaining_requests: number;
  limit_tokens: number;
  used_tokens?: number;
  effective_remaining_tokens: number;
  effective_percent: number;
};

type Snapshot = {
  generated_at_ms?: number;
  antigravity?: {
    online: boolean;
    status?: string;
    status_message?: string;
    summary?: { active_accounts?: number };
    accounts?: Array<{
      id: string;
      code_name: string;
      windows: AgWindow[];
    }>;
  };
  aistudio?: {
    online: boolean;
    status?: string;
    status_message?: string;
    next_reset_ms?: number;
    account_counts?: { enabled: number; ready: number };
    models?: AisModel[];
  };
};

function parseBool(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lower = value.trim().toLowerCase();
    if (["1", "true", "yes", "on"].includes(lower)) return true;
    if (["0", "false", "no", "off"].includes(lower)) return false;
  }
  return undefined;
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return DEFAULT_URL;
  const parsed = new URL(trimmed);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("URL 必须以 http:// 或 https:// 开头");
  }
  return parsed.origin + parsed.pathname.replace(/\/+$/, "");
}

function sharedConfigPath(): string {
  return path.join(os.homedir(), ".config", "opencode", "pool-quota.json");
}

function openChamberConfigPath(): string {
  return path.join(os.homedir(), ".config", "openchamber", "guest-data", "pool-quota", "config.json");
}

function readJsonWithMtime(filePath: string): { data: Record<string, unknown>; mtimeMs: number } | null {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return null;
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    return { data: data as Record<string, unknown>, mtimeMs: stat.mtimeMs };
  } catch {
    return null;
  }
}

function loadConfig(storedPrefs?: { url?: string; showAis?: boolean }, pluginOptions?: Record<string, unknown>): PoolConfig {
  const files = [sharedConfigPath(), openChamberConfigPath()]
    .map((p) => readJsonWithMtime(p))
    .filter((v): v is { data: Record<string, unknown>; mtimeMs: number } => v !== null)
    .sort((a, b) => a.mtimeMs - b.mtimeMs);

  let url = storedPrefs?.url?.trim() || DEFAULT_URL;
  let passcode = "";
  let showAis = typeof storedPrefs?.showAis === "boolean" ? storedPrefs.showAis : true;
  let compactQuota = true;

  for (const item of files) {
    if (typeof item.data.url === "string" && item.data.url.trim()) {
      try {
        url = normalizeUrl(item.data.url);
      } catch {
        // ignore invalid url
      }
    }
    if (typeof item.data.passcode === "string") {
      passcode = item.data.passcode;
    }
    const b = parseBool(item.data.showAis);
    if (b !== undefined) showAis = b;
    const cb = parseBool(item.data.compactQuota);
    if (cb !== undefined) compactQuota = cb;
  }

  if (pluginOptions) {
    if (typeof pluginOptions.url === "string" && pluginOptions.url.trim()) {
      try {
        url = normalizeUrl(pluginOptions.url);
      } catch {
        // ignore
      }
    }
    if (typeof pluginOptions.passcode === "string" && pluginOptions.passcode.length > 0) {
      passcode = pluginOptions.passcode;
    }
    const ob = parseBool(pluginOptions.showAis);
    if (ob !== undefined) showAis = ob;
    const ocb = parseBool(pluginOptions.compactQuota);
    if (ocb !== undefined) compactQuota = ocb;
  }

  if (typeof process.env.POOL_QUOTA_URL === "string" && process.env.POOL_QUOTA_URL.trim()) {
    try {
      url = normalizeUrl(process.env.POOL_QUOTA_URL);
    } catch {
      // ignore
    }
  }
  if (typeof process.env.POOL_QUOTA_PASSCODE === "string" && process.env.POOL_QUOTA_PASSCODE.length > 0) {
    passcode = process.env.POOL_QUOTA_PASSCODE;
  }
  const eb = parseBool(process.env.POOL_QUOTA_SHOW_AIS);
  if (eb !== undefined) showAis = eb;
  const ecb = parseBool(process.env.POOL_QUOTA_COMPACT);
  if (ecb !== undefined) compactQuota = ecb;

  return { url, passcode, showAis, compactQuota };
}

function writeSecureFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmp = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, content, { encoding: "utf8", mode: 0o600 });
  fs.chmodSync(tmp, 0o600);
  fs.renameSync(tmp, filePath);
}

function saveConfig(next: PoolConfig): void {
  const content = `${JSON.stringify(next, null, 2)}\n`;
  writeSecureFile(sharedConfigPath(), content);
  const ocPath = openChamberConfigPath();
  if (fs.existsSync(path.dirname(ocPath))) {
    try {
      writeSecureFile(ocPath, content);
    } catch {
      // ignore optional sync error
    }
  }
}

function clampPct(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function fmtPct(value: number): string {
  const c = clampPct(value);
  return Math.abs(c - Math.round(c)) < 0.05 ? `${Math.round(c)}%` : `${c.toFixed(1)}%`;
}

function fmtUsd(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "$0";
  if (value >= 100) return `$${Math.round(value)}`;
  if (value >= 10) return `$${value.toFixed(1)}`;
  return `$${value.toFixed(2)}`;
}

function fmtTokens(tokens: number): string {
  if (!Number.isFinite(tokens) || tokens <= 0) return "0";
  if (tokens >= 1e9) return `${(tokens / 1e9).toFixed(2)}B`;
  if (tokens >= 1e6) {
    const m = tokens / 1e6;
    return m >= 100 ? `${Math.round(m)}M` : `${m.toFixed(1)}M`;
  }
  if (tokens >= 1e3) return `${Math.round(tokens / 1e3)}K`;
  return String(Math.round(tokens));
}

function fmtCountdown(resetAtMs?: number): string {
  if (!resetAtMs || !Number.isFinite(resetAtMs) || resetAtMs <= Date.now()) return "即将重置";
  const sec = Math.max(0, Math.floor((resetAtMs - Date.now()) / 1000));
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (d > 0) return `${d}d${h}h`;
  if (h > 0) return `${h}h${m}m`;
  return `${Math.max(1, m)}m`;
}

function renderBar(remainingPercent: number, width = 12): string {
  const clamped = clampPct(remainingPercent);
  const filled = Math.round((clamped / 100) * width);
  return "█".repeat(filled) + "░".repeat(Math.max(0, width - filled));
}

function isRequestsOnlyModel(model: Pick<AisModel, "limit_tokens">): boolean {
  return !Number.isFinite(model.limit_tokens) || (model.limit_tokens ?? 0) <= 0;
}

function shortFooterModelName(id: string): string {
  const map: Record<string, string> = {
    "gemini-nano-banana-2.1": "banana-2.1",
    "gemini-3-pro-image": "banana-pro",
    "gemini-3.1-flash-image": "banana-2",
    "gemini-3.1-flash-lite-image": "banana-lite",
  };
  if (map[id]) return map[id];
  if (id.startsWith("gemini-nano-banana-")) {
    return id.replace(/^gemini-nano-/, "");
  }
  if (id.endsWith("-image")) {
    return id.replace(/^gemini-/, "img-").replace(/-image$/, "");
  }
  return id.replace(/^gemini-4-/, "").replace(/^gemini-/, "g");
}

let lastCacheKey = "";
let lastEtag: string | null = null;
let lastSnapshot: Snapshot | null = null;

function passcodeFingerprint(passcode: string): string {
  return passcode && passcode.length > 0
    ? crypto.createHash("sha256").update(passcode).digest("hex").slice(0, 8)
    : "open";
}

function parsePositiveHeaderInt(res: Response, headerName: string): number | null {
  const raw = res.headers.get(headerName);
  if (raw === null) return null;
  const parsed = Number(raw.trim());
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null;
}

export function clearSnapshotCache(): void {
  lastCacheKey = "";
  lastEtag = null;
  lastSnapshot = null;
}

export async function fetchBoardSnapshot(
  cfg: PoolConfig,
  options: { fresh?: boolean; timeoutMs?: number } = {},
): Promise<{ ok: true; data: Snapshot } | { ok: false; code: string; error: string }> {
  const cacheKey = `${cfg.url}|${passcodeFingerprint(cfg.passcode)}`;
  const canReuseCached = cacheKey === lastCacheKey && lastSnapshot !== null;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (cfg.passcode) headers["X-View-Passcode"] = cfg.passcode;
  if (canReuseCached && lastEtag) headers["If-None-Match"] = lastEtag;

  const timeoutMs = options.timeoutMs ?? (options.fresh ? 10_000 : 7_000);
  const url = options.fresh
    ? `${cfg.url}/api/snapshot?view=tui&fresh=1`
    : `${cfg.url}/api/snapshot?view=tui`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    return {
      ok: false,
      code: "unreachable",
      error: `无法连接 ${cfg.url}（${err instanceof Error ? err.message : String(err)}）`,
    };
  }

  if (res.status === 401 || res.status === 403) {
    if (cacheKey === lastCacheKey) {
      lastEtag = null;
      lastSnapshot = null;
    }
    return { ok: false, code: "unauthorized", error: "需要访问口令（在 /quota 弹窗按 s 配置）" };
  }

  if (res.status === 304 && canReuseCached && lastSnapshot) {
    const cloned = structuredClone(lastSnapshot);
    const headerGenMs = parsePositiveHeaderInt(res, "X-Generated-At-Ms");
    if (headerGenMs !== null) {
      cloned.generated_at_ms = headerGenMs;
    }
    lastEtag = res.headers.get("ETag")?.trim() || lastEtag;
    lastSnapshot = cloned;
    return { ok: true, data: cloned };
  }

  if (!res.ok) {
    return { ok: false, code: "http", error: `HTTP ${res.status}` };
  }

  try {
    const data = (await res.json()) as Snapshot;
    lastCacheKey = cacheKey;
    lastEtag = res.headers.get("ETag")?.trim() || null;
    lastSnapshot = data;
    return { ok: true, data };
  } catch {
    return { ok: false, code: "invalid", error: "看板返回非法 JSON" };
  }
}

export default Plugin.define({
  id: "pool-quota.tui",
  setup(context) {
    const [prefs, updatePrefs] = context.storage.store("prefs", {
      initial: { url: DEFAULT_URL, showAis: true },
    });

    const [config, setConfig] = createSignal<PoolConfig>(loadConfig(prefs, context.options));
    const [snapshot, setSnapshot] = createSignal<Snapshot | null>(null);
    const [errorText, setErrorText] = createSignal<string | null>(null);
    const [loading, setLoading] = createSignal(false);
    const [lastUpdated, setLastUpdated] = createSignal<number | null>(null);

    const lastAlertAt = new Map<string, number>();

    const toneColor = (remaining: number) => {
      const rem = clampPct(remaining);
      if (rem <= 20) return context.theme?.text?.feedback?.error?.base ?? "#ef4444";
      if (rem <= 50) return context.theme?.text?.feedback?.warning?.base ?? "#f59e0b";
      return context.theme?.text?.feedback?.success?.base ?? "#22c55e";
    };

    const currentModelId = (): string => {
      const cur = context.ui.model.current() as { modelID?: string; id?: string } | undefined;
      return cur?.modelID ?? cur?.id ?? "";
    };

    const checkAndAlert = (snap: Snapshot, cfg: PoolConfig): void => {
      const now = Date.now();
      const emitOnce = (key: string, message: string) => {
        const prev = lastAlertAt.get(key) ?? 0;
        if (now - prev < ALERT_COOLDOWN_MS) return;
        lastAlertAt.set(key, now);
        context.ui.toast.show({
          title: "Pool Quota 预警",
          message,
          variant: "warning",
          duration: 6000,
        });
      };

      const primary = snap.antigravity?.accounts?.[0];
      if (primary) {
        for (const w of primary.windows ?? []) {
          if ((w.key === "gemini_5h" || w.key === "claude_5h") && clampPct(w.remaining_percent) < 20) {
            emitOnce(`ag:${w.key}`, `${w.label} 仅剩 ${fmtPct(w.remaining_percent)}（${fmtCountdown(w.reset_at_ms)} 重置）`);
          }
        }
      }

      if (cfg.showAis && snap.aistudio?.online) {
        const activeId = currentModelId();
        const aisModels = snap.aistudio.models ?? [];
        const matched = activeId ? aisModels.find((m) => m.id === activeId) : undefined;
        if (matched) {
          if (matched.eligible_accounts > 0 && matched.available_accounts === 0) {
            emitOnce(`ais:${matched.id}:zero`, `当前模型 ${matched.id} 可用号已归零！`);
          } else if (clampPct(matched.effective_percent) < 20) {
            emitOnce(
              `ais:${matched.id}:low`,
              `当前模型 ${matched.id} 仅剩 ${fmtPct(matched.effective_percent)}（${matched.available_accounts}/${matched.eligible_accounts}号）`,
            );
          }
        }
      }
    };

    const refresh = async (options: { notifyError?: boolean; alertOnLow?: boolean; fresh?: boolean } = {}): Promise<boolean> => {
      const cfg = loadConfig(prefs, context.options);
      setConfig(cfg);
      setLoading(true);
      try {
        const res = await fetchBoardSnapshot(cfg, { fresh: options.fresh });
        if (!res.ok) {
          setErrorText(res.error);
          if (options.notifyError) {
            context.ui.toast.show({ title: "Pool Quota", message: res.error, variant: "error", duration: 4000 });
          }
          return false;
        }
        setSnapshot(res.data);
        setErrorText(null);
        setLastUpdated(Date.now());
        if (options.alertOnLow) {
          checkAndAlert(res.data, cfg);
        }
        return true;
      } finally {
        setLoading(false);
      }
    };

    const toggleAis = async (): Promise<void> => {
      const cur = loadConfig(prefs, context.options);
      const next: PoolConfig = { ...cur, showAis: !cur.showAis };
      try {
        saveConfig(next);
        await updatePrefs((draft) => {
          draft.url = next.url;
          draft.showAis = next.showAis;
        });
        setConfig(next);
        context.ui.toast.show({
          title: "Pool Quota",
          message: next.showAis ? "已开启 AIStudio 号池显示" : "已隐藏 AIStudio 号池",
          variant: "info",
          duration: 2500,
        });
      } catch (err) {
        context.ui.toast.show({
          title: "保存失败",
          message: err instanceof Error ? err.message : String(err),
          variant: "error",
        });
      }
    };

    const runSetupWizard = async (): Promise<void> => {
      context.ui.dialog.clear();
      const cur = loadConfig(prefs, context.options);
      const urlAnswer = await context.ui.dialog.prompt({
        title: "Pool Quota — 看板地址 URL",
        placeholder: cur.url || DEFAULT_URL,
      });
      if (urlAnswer === undefined) {
        openQuotaDialog();
        return;
      }

      let nextUrl = cur.url;
      const trimmedUrl = urlAnswer.trim();
      if (trimmedUrl) {
        try {
          nextUrl = normalizeUrl(trimmedUrl);
        } catch (err) {
          context.ui.toast.show({
            title: "地址格式无效",
            message: err instanceof Error ? err.message : "请输入 http:// 或 https:// 开头的地址",
            variant: "error",
          });
          openQuotaDialog();
          return;
        }
      }

      const passAnswer = await context.ui.dialog.prompt({
        title: "Pool Quota — 访问口令 (留空保持不变，输入 - 清空)",
        placeholder: cur.passcode ? "已保存口令（直接回车保持不变）" : "未设置口令（直接回车跳过）",
      });
      if (passAnswer === undefined) {
        openQuotaDialog();
        return;
      }

      const trimmedPass = passAnswer.trim();
      const nextPasscode = trimmedPass === "-" ? "" : (trimmedPass ? trimmedPass : cur.passcode);
      const candidate: PoolConfig = {
        url: nextUrl,
        passcode: nextPasscode,
        showAis: cur.showAis,
        compactQuota: cur.compactQuota,
      };

      const check = await fetchBoardSnapshot(candidate, { timeoutMs: 8000 });
      if (!check.ok) {
        context.ui.toast.show({
          title: "连接测试失败",
          message: check.error,
          variant: "error",
          duration: 5000,
        });
        openQuotaDialog();
        return;
      }

      try {
        saveConfig(candidate);
        await updatePrefs((draft) => {
          draft.url = candidate.url;
          draft.showAis = candidate.showAis;
        });
        setConfig(candidate);
        setSnapshot(check.data);
        setErrorText(null);
        setLastUpdated(Date.now());
        context.ui.toast.show({
          title: "Pool Quota",
          message: "看板连接验证通过，配置已写入 0600 文件",
          variant: "success",
          duration: 3500,
        });
      } catch (err) {
        context.ui.toast.show({
          title: "保存配置失败",
          message: err instanceof Error ? err.message : String(err),
          variant: "error",
        });
      }
      openQuotaDialog();
    };

    const QuotaDialog = () => {
      const agWindows = createMemo(() => {
        const primary = snapshot()?.antigravity?.accounts?.[0];
        if (!primary) return [];
        return [...(primary.windows ?? [])].sort((a, b) => {
          const ia = WINDOW_ORDER.indexOf(a.key);
          const ib = WINDOW_ORDER.indexOf(b.key);
          return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        });
      });

      const aisModels = createMemo(() => snapshot()?.aistudio?.models ?? []);
      const aisIdColWidth = createMemo(() => (
        Math.max(23, ...aisModels().map((item) => item.id.length + 1))
      ));

      context.keymap.layer(() => ({
        mode: "global",
        priority: 100,
        commands: [
          {
            id: "pool-quota.dialog.toggle-ais",
            title: "Toggle AIStudio Pool",
            bind: "a",
            run: () => void toggleAis(),
          },
          {
            id: "pool-quota.dialog.refresh",
            title: "Refresh Quota",
            bind: "r",
            run: async () => {
              const ok = await refresh({ notifyError: true, fresh: true });
              if (ok) {
                context.ui.toast.show({ title: "Pool Quota", message: "已刷新最新额度", variant: "success", duration: 2000 });
              }
            },
          },
          {
            id: "pool-quota.dialog.setup",
            title: "Configure Board URL & Passcode",
            bind: "s",
            run: () => void runSetupWizard(),
          },
          {
            id: "pool-quota.dialog.close",
            title: "Close",
            bind: "escape",
            run: () => context.ui.dialog.clear(),
          },
        ],
        bindings: [
          "pool-quota.dialog.toggle-ais",
          "pool-quota.dialog.refresh",
          "pool-quota.dialog.setup",
          "pool-quota.dialog.close",
        ],
      }));

      return (
        <box flexDirection="column" gap={1} padding={1}>
          <box flexDirection="row" justifyContent="space-between" gap={2}>
            <text fg={context.theme.text.base}>
              Pool Quota — 双号池实时额度 {loading() ? "(刷新中...)" : ""}
            </text>
            <text fg={context.theme.text.muted}>
              AIS: {config().showAis ? "开启" : "隐藏"}
            </text>
          </box>

          <Show when={errorText()}>
            {(err) => (
              <text fg={context.theme.text.feedback.error.base}>
                ⚠ {err()}
              </text>
            )}
          </Show>

          <Show when={snapshot()}>
            {(snap) => (
              <box flexDirection="column" gap={1}>
                <text fg={context.theme.text.muted}>
                  Antigravity ({snap().antigravity?.online ? `${snap().antigravity?.summary?.active_accounts ?? 0}号在线` : "离线"})
                </text>
                <For each={agWindows()}>
                  {(w) => {
                    const rem = clampPct(w.remaining_percent);
                    const estRem = typeof w.estimated_remaining_percent === "number" && Number.isFinite(w.estimated_remaining_percent)
                      ? clampPct(w.estimated_remaining_percent)
                      : null;
                    const estStr = estRem !== null && (rem - estRem) >= 0.3
                      ? ` 实时估 ~${estRem.toFixed(1)}%`
                      : "";
                    const forecastTag = w.forecast_basis === "previous" ? "参考" : "预测";
                    const forecastFull = w.forecast_basis === "previous" ? "上期参考" : "满额预测";
                    const costStr = w.has_current_usage && w.current_cost > 0
                      ? (w.has_forecast && w.forecast_cost > 0
                        ? ` ${fmtUsd(w.current_cost)}/${forecastTag}${fmtUsd(w.forecast_cost)}`
                        : ` ${fmtUsd(w.current_cost)}`)
                      : (w.has_forecast && w.forecast_cost > 0
                        ? ` ${forecastFull}${fmtUsd(w.forecast_cost)}`
                        : "");
                    const resetStr = w.reset_at_ms > 0 ? ` ↻${fmtCountdown(w.reset_at_ms)}` : "";
                    return (
                      <text fg={context.theme.text.base}>
                        {w.label.padEnd(13, " ")}{" "}
                        <span style={{ fg: toneColor(rem) }}>
                          {renderBar(rem, 12)} {fmtPct(rem).padStart(5, " ")}
                        </span>
                        <span style={{ fg: context.theme.text.muted }}>
                          {estStr}{costStr}{resetStr}
                        </span>
                      </text>
                    );
                  }}
                </For>

                <Show when={config().showAis}>
                  <box flexDirection="column" gap={0}>
                    <text fg={context.theme.text.muted}>
                      {"\n"}AIStudio2API ({snap().aistudio?.account_counts?.ready ?? 0}/{snap().aistudio?.account_counts?.enabled ?? 0}号就绪 · 16:00重置 ↻{fmtCountdown(snap().aistudio?.next_reset_ms)})
                    </text>
                    <For each={aisModels()}>
                      {(m) => {
                        const rem = clampPct(m.effective_percent);
                        const color = m.available_accounts === 0
                          ? context.theme.text.feedback.error.base
                          : toneColor(rem);
                        const activeMark = currentModelId() === m.id ? "▸ " : "  ";
                        const remText = isRequestsOnlyModel(m)
                          ? `剩${m.effective_remaining_requests}次`
                          : `剩${m.effective_remaining_requests}次/${fmtTokens(m.effective_remaining_tokens)}`;
                        return (
                          <text fg={context.theme.text.base}>
                            {activeMark}{m.id.padEnd(aisIdColWidth(), " ")}{" "}
                            <span style={{ fg: color }}>
                              {renderBar(rem, 10)} {fmtPct(rem).padStart(5, " ")}
                            </span>
                            <span style={{ fg: context.theme.text.muted }}>
                              {" "}{m.available_accounts}/{m.eligible_accounts}号 {remText}
                            </span>
                          </text>
                        );
                      }}
                    </For>
                  </box>
                </Show>
              </box>
            )}
          </Show>

          <text fg={context.theme.text.muted}>
            [a] 切换AIS号池  [r] 刷新  [s] 配置地址/口令  [Esc] 关闭
            {lastUpdated() ? `  · ${new Date(lastUpdated()!).toLocaleTimeString()}` : ""}
          </text>
        </box>
      );
    };

    const openQuotaDialog = (): void => {
      void refresh({ notifyError: false });
      context.ui.dialog.set({ size: "large", centered: true });
      context.ui.dialog.show(() => <QuotaDialog />);
    };

    // Compact always-on footer widget
    const FooterBadge = () => {
      const summary = createMemo(() => {
        const err = errorText();
        const snap = snapshot();
        const cfg = config();

        if (!snap) {
          if (err) {
            return { text: "Pool: ⚠ /quota", color: context.theme.text.feedback.warning.base };
          }
          return { text: "Pool: ...", color: context.theme.text.muted };
        }

        const primary = snap.antigravity?.accounts?.[0];
        const g5 = primary?.windows?.find((w) => w.key === "gemini_5h");
        const c5 = primary?.windows?.find((w) => w.key === "claude_5h");

        const parts: string[] = [];
        let worstPct = 100;

        if (g5 || c5) {
          const gStr = g5 ? `G:${Math.round(clampPct(g5.remaining_percent))}%` : "";
          const cStr = c5 ? `C:${Math.round(clampPct(c5.remaining_percent))}%` : "";
          if (g5) worstPct = Math.min(worstPct, clampPct(g5.remaining_percent));
          if (c5) worstPct = Math.min(worstPct, clampPct(c5.remaining_percent));
          parts.push(`AG ${[gStr, cStr].filter(Boolean).join(" ")}`);
        } else if (snap.antigravity && !snap.antigravity.online) {
          parts.push("AG 离线");
          worstPct = 0;
        }

        if (cfg.showAis && snap.aistudio) {
          if (snap.aistudio.online) {
            const activeId = currentModelId();
            const matched = activeId ? snap.aistudio.models?.find((m) => m.id === activeId) : undefined;
            if (matched) {
              const shortName = shortFooterModelName(matched.id);
              const pct = Math.round(clampPct(matched.effective_percent));
              worstPct = Math.min(worstPct, matched.available_accounts === 0 ? 0 : pct);
              parts.push(`${shortName}:${pct}%(${matched.available_accounts}/${matched.eligible_accounts})`);
            } else {
              const ready = snap.aistudio.account_counts?.ready ?? 0;
              const enabled = snap.aistudio.account_counts?.enabled ?? 0;
              parts.push(`AIS:${ready}/${enabled}`);
            }
          } else {
            parts.push("AIS 离线");
            worstPct = Math.min(worstPct, 20);
          }
        }

        const color = worstPct <= 20
          ? context.theme.text.feedback.error.base
          : worstPct <= 50
            ? context.theme.text.feedback.warning.base
            : context.theme.text.muted;

        return { text: parts.join(" · ") || "Pool", color };
      });

      return (
        <box flexDirection="row" flexShrink={0} onMouseUp={() => openQuotaDialog()}>
          <text fg={summary().color}>{summary().text}</text>
        </box>
      );
    };

    // Global /quota (alias /pool) command + palette entry
    context.keymap.layer(() => ({
      mode: "global",
      priority: 10,
      commands: [
        {
          id: "pool-quota.open",
          title: "Pool Quota (查看双号池额度)",
          group: "Quota",
          palette: true,
          slash: { name: "quota", aliases: ["pool"] },
          run: () => openQuotaDialog(),
        },
        {
          id: "pool-quota.toggle-ais",
          title: "Pool Quota: 切换显示 AIS 号池",
          group: "Quota",
          palette: true,
          run: () => void toggleAis(),
        },
      ],
    }));

    const unsubPromptSlot = context.ui.slot({
      append: "prompt.footer.status",
      render: () => <FooterBadge />,
    });
    const unsubHomeSlot = context.ui.slot({
      append: "home.footer.status",
      render: () => <FooterBadge />,
    });

    // Initial silent fetch + 30s poll + post-turn alert check
    void refresh({ notifyError: false, alertOnLow: false });
    const timer = setInterval(() => {
      void refresh({ notifyError: false, alertOnLow: false });
    }, POLL_INTERVAL_MS);

    const unsubTurn = context.data.on("session.execution.succeeded", () => {
      void refresh({ notifyError: false, alertOnLow: true });
    });

    return () => {
      clearInterval(timer);
      unsubTurn();
      unsubPromptSlot();
      unsubHomeSlot();
    };
  },
});
