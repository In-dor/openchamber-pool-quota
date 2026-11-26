import type { AIStudioModelSummary, AntigravityWindow } from './types.ts';

export const clampPercent = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
};

export const round1 = (value: number): number => Math.round(value * 10) / 10;

export const formatPercent = (value: number): string => {
  const clamped = clampPercent(value);
  if (Math.abs(clamped - Math.round(clamped)) < 0.05) {
    return `${Math.round(clamped)}%`;
  }
  return `${clamped.toFixed(1)}%`;
};

export const formatUsd = (value: number): string => {
  if (!Number.isFinite(value) || value < 0) return '$0';
  if (value >= 100) return `$${Math.round(value)}`;
  if (value >= 10) return `$${value.toFixed(1)}`;
  return `$${value.toFixed(2)}`;
};

export const formatTokens = (tokens: number): string => {
  if (!Number.isFinite(tokens) || tokens <= 0) return '0';
  if (tokens >= 1_000_000_000) return `${(tokens / 1_000_000_000).toFixed(2)}B`;
  if (tokens >= 1_000_000) {
    const m = tokens / 1_000_000;
    return m >= 100 ? `${Math.round(m)}M` : `${m.toFixed(1)}M`;
  }
  if (tokens >= 1_000) return `${Math.round(tokens / 1_000)}K`;
  return String(Math.round(tokens));
};

export const formatCountdown = (resetAtMs: number | null | undefined, nowMs = Date.now()): string => {
  if (!resetAtMs || !Number.isFinite(resetAtMs) || resetAtMs <= nowMs) return '即将重置';
  const sec = Math.max(0, Math.floor((resetAtMs - nowMs) / 1000));
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${Math.max(1, mins)}m`;
};

export const formatSampleFreshness = (
  observedAtMs: number | null | undefined,
  nowMs = Date.now(),
): string | null => {
  if (!observedAtMs || !Number.isFinite(observedAtMs) || observedAtMs <= 0) return null;
  const obsMs = observedAtMs > 1e12 ? observedAtMs : observedAtMs * 1000;
  const diffSec = Math.max(0, Math.floor((nowMs - obsMs) / 1000));
  if (diffSec < 60) return '刚刚采样';
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return `采样 ${mins}m 前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `采样 ${hours}h 前`;
  const days = Math.floor(hours / 24);
  return `采样 ${days}d 前`;
};

export const forecastLabelFor = (basis?: string, compact = false): string => {
  if (basis === 'previous') return compact ? '参考' : '上期参考';
  return compact ? '预测' : '满额预测';
};

export const toneForRemaining = (remainingPercent: number): 'success' | 'warning' | 'error' => {
  const rem = clampPercent(remainingPercent);
  if (rem <= 20) return 'error';
  if (rem <= 50) return 'warning';
  return 'success';
};

export const formatAgWindowValueLabel = (win: AntigravityWindow): string => {
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

export const formatAgWindowCompactValueLabel = (win: AntigravityWindow): string | null => {
  if (win.has_current_usage && win.current_cost > 0) {
    const rem = formatPercent(win.remaining_percent);
    if (win.has_forecast && win.forecast_cost > 0) {
      return `${rem} · ${formatUsd(win.current_cost)}/${formatUsd(win.forecast_cost)}`;
    }
    return `${rem} · ${formatUsd(win.current_cost)}`;
  }
  // Omit valueLabel when there is no cost so OpenChamber natively renders the short percentage
  // and automatically respects the user's remaining/used display mode.
  return null;
};

export const MOBILE_COMPACT_ROW_MAX_PX = 282;
export const MOBILE_COMPACT_GAP_PX = 12;

export const isRequestsOnlyAisModel = (
  model: Pick<AIStudioModelSummary, 'limit_tokens'>,
): boolean => !Number.isFinite(model.limit_tokens) || (model.limit_tokens ?? 0) <= 0;

/**
 * Conservative 14px UI sans-serif (tabular-nums) width estimator for OpenChamber
 * 360dp mobile UsageProviderCards (~286px usable row width; target <= 282px).
 */
export const estimateMobileTextWidthPx = (text: string): number => {
  let width = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (
      (code >= 0x2e80 && code <= 0x9fff)
      || (code >= 0xf900 && code <= 0xfaff)
      || (code >= 0xff00 && code <= 0xffef)
    ) {
      width += 14.0;
    } else if (ch >= '0' && ch <= '9') {
      width += 8.4;
    } else if (ch === '%') {
      width += 11.0;
    } else if (ch === '/' || ch === '·' || ch === '-') {
      width += 5.0;
    } else if (ch === '(' || ch === ')') {
      width += 4.5;
    } else if (ch === '.' || ch === ':' || ch === ',') {
      width += 4.0;
    } else if (ch === ' ') {
      width += 4.0;
    } else if (ch === 'i' || ch === 'l' || ch === 'j' || ch === 'I') {
      width += 3.5;
    } else if (ch === 'f' || ch === 'r' || ch === 't') {
      width += 5.0;
    } else if (ch === 'm' || ch === 'w' || ch === 'M' || ch === 'W') {
      width += 11.6;
    } else if (ch >= 'a' && ch <= 'z') {
      width += 7.8;
    } else if (ch >= 'A' && ch <= 'Z') {
      width += 9.4;
    } else {
      width += 8.4;
    }
  }
  return round1(width);
};

export const formatAisModelValueLabel = (model: AIStudioModelSummary): string => {
  const acct = `${model.available_accounts}/${model.eligible_accounts}号`;
  const remReq = `${model.effective_remaining_requests}次`;
  const pct = formatPercent(model.effective_percent);
  if (isRequestsOnlyAisModel(model)) {
    return `${acct} · ${pct} · 剩${remReq}`;
  }
  const remTok = formatTokens(model.effective_remaining_tokens);
  return `${acct} · ${pct} · 剩${remReq}/${remTok}`;
};

export const formatAisModelCompactValueLabel = (model: AIStudioModelSummary): string | null => {
  const modelKey = model.id || model.label || '';
  const idLen = modelKey.length;
  const elig = Math.max(0, Math.round(model.eligible_accounts || 0));
  const avail = Math.max(0, Math.round(model.available_accounts || 0));
  const rawLeftPx = estimateMobileTextWidthPx(`${modelKey} · 每日`);
  const leftWidthPx = Math.max(rawLeftPx, idLen >= 27 ? 215 : idLen >= 22 ? 192 : 0);
  const budgetPx = MOBILE_COMPACT_ROW_MAX_PX - MOBILE_COMPACT_GAP_PX - leftWidthPx;

  const pickFitting = (candidates: string[]): string => {
    for (const candidate of candidates) {
      if (estimateMobileTextWidthPx(candidate) <= budgetPx) {
        return candidate;
      }
    }
    return candidates[candidates.length - 1]!;
  };

  if (elig <= 0) {
    return pickFitting(['0/0号', '0/0']);
  }
  if (avail <= 0) {
    if (idLen > 20) {
      return '耗尽';
    }
    return pickFitting([`0/${elig}·耗尽`, '耗尽']);
  }
  if (avail < elig) {
    const pct = `${Math.round(clampPercent(model.effective_percent))}%`;
    if (idLen > 22) {
      return pickFitting([`${pct}·${avail}`, `${avail}/${elig}`, pct]);
    }
    return pickFitting([`${avail}/${elig}·${pct}`, `${pct}·${avail}`, `${avail}/${elig}`, pct]);
  }
  // All eligible accounts are available: omit valueLabel so OpenChamber natively renders
  // the concise percentage (e.g. "97%"), keeping narrow mobile rows completely overlap-free.
  return null;
};

export const isBottleneckTokens = (
  model: Pick<
    AIStudioModelSummary,
    'limit_requests' | 'effective_remaining_requests' | 'limit_tokens' | 'effective_remaining_tokens'
  >,
): boolean => {
  if (isRequestsOnlyAisModel(model)) return false;
  const reqPct = model.limit_requests > 0 ? (model.effective_remaining_requests / model.limit_requests) * 100 : 100;
  const tokPct = (model.effective_remaining_tokens / model.limit_tokens) * 100;
  return tokPct < reqPct - 0.5;
};

export const truncate = (value: string, max: number): string => (
  value.length <= max ? value : `${value.slice(0, Math.max(1, max - 1))}…`
);
