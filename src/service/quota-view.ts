import {
  QUOTA_PROVIDER_ERROR_MESSAGE_MAX,
  QUOTA_PROVIDER_LABEL_MAX,
  QUOTA_PROVIDER_MODELS_MAX,
  QUOTA_PROVIDER_NAME_MAX,
  QUOTA_PROVIDER_WINDOWS_MAX,
  type QuotaProviderUsageData,
  type QuotaProviderWindow,
} from '@openchamber/sdk';
import {
  clampPercent,
  formatAgWindowCompactValueLabel,
  formatAgWindowValueLabel,
  formatAisModelCompactValueLabel,
  formatAisModelValueLabel,
  formatPercent,
  round1,
  truncate,
} from '../shared/format.ts';
import type {
  AntigravityWindow,
  BoardSnapshot,
  PoolQuotaConfig,
} from '../shared/types.ts';

const WINDOW_ORDER = ['gemini_5h', 'gemini_weekly', 'claude_5h', 'claude_weekly', 'argon_weekly'];

const safeKey = (raw: string): string => {
  const trimmed = raw.trim() || 'window';
  if (trimmed === '__proto__' || trimmed === 'constructor' || trimmed === 'prototype') {
    return `w_${trimmed}`;
  }
  return truncate(trimmed, QUOTA_PROVIDER_NAME_MAX);
};

const safeLabel = (raw: string): string => truncate(raw.trim(), QUOTA_PROVIDER_LABEL_MAX);

const sortAgWindows = (windows: AntigravityWindow[]): AntigravityWindow[] => (
  [...windows].sort((a, b) => {
    const ia = WINDOW_ORDER.indexOf(a.key);
    const ib = WINDOW_ORDER.indexOf(b.key);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.label.localeCompare(b.label);
  })
);

const toAgQuotaWindow = (win: AntigravityWindow, compact: boolean): QuotaProviderWindow => {
  const remaining = clampPercent(win.remaining_percent);
  const used = round1(clampPercent(100 - remaining));
  const rawLabel = compact
    ? formatAgWindowCompactValueLabel(win)
    : formatAgWindowValueLabel(win);
  const out: QuotaProviderWindow = {
    usedPercent: used,
    ...(rawLabel ? { valueLabel: safeLabel(rawLabel) } : {}),
  };
  if (Number.isFinite(win.duration_seconds) && win.duration_seconds > 0) {
    out.windowSeconds = Math.round(win.duration_seconds);
  }
  if (Number.isFinite(win.reset_at_ms) && win.reset_at_ms > 0) {
    out.resetAt = Math.round(win.reset_at_ms);
  }
  return out;
};

export const buildQuotaErrorData = (message: string): QuotaProviderUsageData => ({
  ok: false,
  configured: true,
  error: truncate(message || '无法读取双号池快照', QUOTA_PROVIDER_ERROR_MESSAGE_MAX),
  usage: null,
});

export const buildQuotaUsageData = (
  snapshot: BoardSnapshot,
  cfg: PoolQuotaConfig,
): QuotaProviderUsageData => {
  const windows: Record<string, QuotaProviderWindow> = {};
  const ag = snapshot.antigravity;
  const ais = snapshot.aistudio;

  const pushWindow = (name: string, win: QuotaProviderWindow): void => {
    if (Object.keys(windows).length >= QUOTA_PROVIDER_WINDOWS_MAX) return;
    windows[safeKey(name)] = win;
  };

  const compact = cfg.compactQuota;

  if (ag?.online && Array.isArray(ag.accounts) && ag.accounts.length > 0) {
    if (ag.accounts.length === 1) {
      const only = ag.accounts[0]!;
      for (const win of sortAgWindows(only.windows ?? [])) {
        pushWindow(win.label || win.key, toAgQuotaWindow(win, compact));
      }
    } else {
      // Multi-account pool: show pool averages first, then per-account windows if room permits.
      for (const avg of ag.summary?.window_averages ?? []) {
        const remaining = clampPercent(avg.avg_remaining_percent);
        const used = round1(clampPercent(100 - remaining));
        // Find earliest active reset across accounts for this window key
        let earliestReset: number | null = null;
        let durationSeconds: number | null = null;
        for (const acct of ag.accounts) {
          const match = acct.windows?.find((w) => w.key === avg.key);
          if (!match) continue;
          if (durationSeconds === null && match.duration_seconds > 0) {
            durationSeconds = Math.round(match.duration_seconds);
          }
          if (match.reset_at_ms > 0 && (earliestReset === null || match.reset_at_ms < earliestReset)) {
            earliestReset = Math.round(match.reset_at_ms);
          }
        }
        const entry: QuotaProviderWindow = {
          usedPercent: used,
          valueLabel: safeLabel(
            compact
              ? `${formatPercent(remaining)} · ${avg.account_count}号`
              : `均剩 ${formatPercent(remaining)} (${avg.account_count}号)`,
          ),
        };
        if (durationSeconds !== null) entry.windowSeconds = durationSeconds;
        if (earliestReset !== null) entry.resetAt = earliestReset;
        pushWindow(avg.label || avg.key, entry);
      }

      for (const acct of ag.accounts) {
        for (const win of sortAgWindows(acct.windows ?? [])) {
          if (Object.keys(windows).length >= QUOTA_PROVIDER_WINDOWS_MAX - (cfg.showAis ? 1 : 0)) break;
          pushWindow(`${acct.code_name} · ${win.label || win.key}`, toAgQuotaWindow(win, compact));
        }
      }
    }
  } else if (ag && !ag.online) {
    pushWindow('Antigravity', {
      usedPercent: null,
      valueLabel: safeLabel(ag.status_message || '离线'),
    });
  }

  let models: Record<string, { windows: Record<string, QuotaProviderWindow> }> | undefined;

  if (cfg.showAis) {
    if (ais?.online) {
      const aisModels = Array.isArray(ais.models) ? ais.models : [];
      const activeModels = aisModels.filter((m) => m.eligible_accounts > 0);
      const minPct = activeModels.length > 0
        ? Math.min(...activeModels.map((m) => clampPercent(m.effective_percent)))
        : 100;
      const zeroCount = activeModels.filter((m) => m.available_accounts === 0).length;
      const ready = ais.account_counts?.ready ?? 0;
      const enabled = ais.account_counts?.enabled ?? 0;
      const summaryLabel = compact
        ? (zeroCount > 0
          ? `${ready}/${enabled}号 · ${zeroCount}耗尽`
          : `${ready}/${enabled}号 · ${formatPercent(minPct)}`)
        : (zeroCount > 0
          ? `${ready}/${enabled}号 · ${zeroCount}模型耗尽 · 最低${formatPercent(minPct)}`
          : `${ready}/${enabled}号就绪 · 最低 ${formatPercent(minPct)}`);

      const aisSummaryWin: QuotaProviderWindow = {
        usedPercent: round1(clampPercent(100 - minPct)),
        windowSeconds: 86_400,
        valueLabel: safeLabel(summaryLabel),
      };
      if (Number.isFinite(ais.next_reset_ms) && ais.next_reset_ms > 0) {
        aisSummaryWin.resetAt = Math.round(ais.next_reset_ms);
      }
      pushWindow(compact ? 'AIS 号池' : 'AIStudio 号池 (Playground)', aisSummaryWin);

      if (aisModels.length > 0) {
        models = {};
        for (const model of aisModels.slice(0, QUOTA_PROVIDER_MODELS_MAX)) {
          const rem = clampPercent(model.effective_percent);
          const rawModelLabel = compact
            ? formatAisModelCompactValueLabel(model)
            : formatAisModelValueLabel(model);
          const modelWin: QuotaProviderWindow = {
            usedPercent: round1(clampPercent(100 - rem)),
            windowSeconds: 86_400,
            ...(rawModelLabel ? { valueLabel: safeLabel(rawModelLabel) } : {}),
          };
          if (Number.isFinite(ais.next_reset_ms) && ais.next_reset_ms > 0) {
            modelWin.resetAt = Math.round(ais.next_reset_ms);
          }
          // Preserve original model.id keys so OpenChamber's saved usageSelectedModels keep matching.
          models[safeKey(model.id || model.label)] = {
            windows: {
              daily: modelWin,
            },
          };
        }
      }
    } else if (ais) {
      pushWindow(compact ? 'AIS 号池' : 'AIStudio 号池', {
        usedPercent: null,
        valueLabel: safeLabel(ais.status_message || '离线'),
      });
    }
  }

  const agCount = ag?.summary?.active_accounts ?? ag?.accounts?.length ?? 0;
  const aisReady = ais?.account_counts?.ready ?? 0;
  const aisEnabled = ais?.account_counts?.enabled ?? 0;
  const planLabel = cfg.showAis
    ? safeLabel(`AG ${agCount}号 · AIS ${aisReady}/${aisEnabled}号`)
    : safeLabel(`Antigravity ${agCount}号 · AIS已隐藏`);

  return {
    ok: true,
    configured: true,
    planLabel,
    usage: {
      windows,
      ...(models && Object.keys(models).length > 0 ? { models } : {}),
    },
  };
};
