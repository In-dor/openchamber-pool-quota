import { connectHost, HostRequestError } from '@openchamber/sdk';
import {
  applyHostReady,
  mountBadge,
  mountBanner,
  mountButton,
  mountEmpty,
  mountSpinner,
  mountSwitch,
  mountTabs,
  mountTextField,
  type ButtonHandle,
  type CheckboxHandle,
  type TabsHandle,
} from '@openchamber/sdk/ui';
import {
  clampPercent,
  forecastLabelFor,
  formatCountdown,
  formatPercent,
  formatSampleFreshness,
  formatTokens,
  formatUsd,
  isBottleneckTokens,
  isRequestsOnlyAisModel,
} from '../shared/format.ts';
import type {
  PanelAIStudioModelSummary,
  PanelAntigravityAccount,
  PanelAntigravityAccountHistory,
  PanelAntigravityHistoryResponse,
  PanelAntigravityWindow,
  PanelBoardSnapshot,
  PanelHistoryResponse,
  PanelHistorySeries,
  PanelStateDataResponse,
  PanelStateResponse,
} from '../shared/types.ts';
import { syncHistoryEstimatedPointsFromSnapshot } from './history-sync.ts';
import { bindPopTip, createPopTipController, type PopTipController } from './pop-tip.ts';
import { PANEL_CSS } from './styles.ts';
import { createPanelVisibilityTracker, type PanelVisibilityTracker } from './visibility.ts';

type HealthLevel = 'full' | 'healthy' | 'moderate' | 'low' | 'empty';
type HistoryWindowKind = '5h' | '7d';

const SVG_NS = 'http://www.w3.org/2000/svg';
const WINDOW_ORDER = ['gemini_5h', 'gemini_weekly', 'claude_5h', 'claude_weekly', 'argon_weekly'];
const SERIES_PAINT_ORDER = ['claude_weekly', 'claude_5h', 'argon_weekly', 'gemini_weekly', 'gemini_5h'];
const SERIES_LEGEND_ORDER = ['gemini_5h', 'gemini_weekly', 'claude_5h', 'claude_weekly', 'argon_weekly'];
const STORAGE_UI_PREFS_KEY = 'pq:panel-ui-prefs:v1';
const AUTO_REFRESH_MS = 15_000;
const HISTORY_FRESH_MS = 13_000;

const RATE_COLOR_STOPS = [
  { r: 239, g: 68, b: 68 },   // 0%
  { r: 245, g: 158, b: 11 },  // 50%
  { r: 16, g: 185, b: 129 },  // 100%
];

let svgGradSeq = 0;

// ---------- Semantic Helpers ----------

const healthLevelFor = (remainingPercent: number, exhaustedOverride = false): HealthLevel => {
  const rem = clampPercent(remainingPercent);
  if (exhaustedOverride || rem <= 0.05) return 'empty';
  if (rem >= 99.95) return 'full';
  if (rem > 60) return 'healthy';
  if (rem >= 25) return 'moderate';
  return 'low';
};

const isArgonKey = (key: string, group?: string): boolean => {
  const k = key.toLowerCase();
  const g = (group ?? '').toLowerCase();
  return k === 'argon_weekly' || g === 'argon' || k.includes('argon');
};

const canShowArgonForTier = (tier: string): boolean => {
  const normalized = String(tier || '').trim().toLowerCase();
  // Ultra strictly hides Argon; only Pro accounts may show an independent Argon window.
  return normalized === 'pro';
};

const filterAccountWindows = (acct: PanelAntigravityAccount): PanelAntigravityWindow[] => {
  const allowArgon = canShowArgonForTier(acct.tier);
  return (acct.windows ?? []).filter((w) => allowArgon || !isArgonKey(w.key, w.group));
};

const isActiveAgWindow = (win: PanelAntigravityWindow): boolean => {
  const rem = clampPercent(win.remaining_percent);
  if (rem < 99.95) return true;
  if (
    typeof win.estimated_remaining_percent === 'number'
    && Number.isFinite(win.estimated_remaining_percent)
    && rem - clampPercent(win.estimated_remaining_percent) >= 0.25
  ) {
    return true;
  }
  return Boolean(win.has_current_usage && (win.current_cost > 0 || win.current_tokens > 0 || win.current_requests > 0));
};

const isActiveAisModel = (model: PanelAIStudioModelSummary): boolean => {
  const rem = clampPercent(model.effective_percent);
  if (rem < 99.95) return true;
  if (model.eligible_accounts > 0 && model.available_accounts < model.eligible_accounts) return true;
  return (model.used_requests ?? 0) > 0 || (model.used_tokens ?? 0) > 0;
};

const seriesColorVar = (key: string, group?: string): string => {
  const k = key.toLowerCase();
  const g = (group ?? '').toLowerCase();
  if (k === 'gemini_5h') return 'var(--pq-series-gemini)';
  if (k === 'gemini_weekly' || g === 'gemini') return 'var(--pq-series-gemini-2)';
  if (k === 'claude_5h') return 'var(--pq-series-claude)';
  if (k === 'claude_weekly' || g === 'claude') return 'var(--pq-series-claude-2)';
  if (k.includes('argon') || g === 'argon') return 'var(--pq-series-argon)';
  return 'var(--pq-full)';
};

const shortSeriesLabel = (series: PanelHistorySeries): string => {
  switch (series.key) {
    case 'gemini_5h': return 'Gemini 5h';
    case 'gemini_weekly': return 'Gemini 周';
    case 'claude_5h': return 'Claude 5h';
    case 'claude_weekly': return 'Claude 周';
    case 'argon_weekly': return 'Argon 周';
    default: return series.label || series.key;
  }
};

const tierClass = (tier: string): string => {
  const t = String(tier || '').trim().toLowerCase();
  if (t === 'ultra') return 'pq-tier-ultra';
  if (t === 'pro') return 'pq-tier-pro';
  return 'pq-tier-free';
};

const accountStatusClass = (status: string): string => {
  switch (String(status || '').toLowerCase()) {
    case 'available':
    case 'ready':
      return 'pq-st-ok';
    case 'limited':
    case 'cooldown':
      return 'pq-st-warn';
    case 'exhausted':
    case 'unavailable':
    case 'auth_required':
      return 'pq-st-err';
    default:
      return 'pq-st-muted';
  }
};

const cacheRateTierClass = (rate: number): 'is-high' | 'is-mid' | 'is-low' => {
  const clamped = clampPercent(rate);
  if (clamped >= 80) return 'is-high';
  if (clamped >= 50) return 'is-mid';
  return 'is-low';
};

const buildCacheTooltip = (opts: {
  rate: number;
  rate24h?: number | null;
  savedCost?: number;
  prefix?: string;
}): string => {
  const parts = [`${opts.prefix ?? '累计缓存命中率'} ${formatPercent(opts.rate)}`];
  if (typeof opts.rate24h === 'number' && Number.isFinite(opts.rate24h)) {
    parts.push(`近 24h ${formatPercent(opts.rate24h)}`);
  }
  if (typeof opts.savedCost === 'number' && Number.isFinite(opts.savedCost) && opts.savedCost > 0) {
    parts.push(`缓存约省 ${formatUsd(opts.savedCost)}`);
  }
  return parts.join(' · ');
};

const rateToRgb = (rate: number): string => {
  const t = Math.max(0, Math.min(1, rate));
  const seg = t < 0.5 ? 0 : 1;
  const localT = seg === 0 ? t * 2 : (t - 0.5) * 2;
  const from = RATE_COLOR_STOPS[seg]!;
  const to = RATE_COLOR_STOPS[seg + 1]!;
  const r = Math.round(from.r + (to.r - from.r) * localT);
  const g = Math.round(from.g + (to.g - from.g) * localT);
  const b = Math.round(from.b + (to.b - from.b) * localT);
  return `rgb(${r}, ${g}, ${b})`;
};

const toMs = (ts: number): number => (ts > 1e12 ? ts : ts * 1000);
const toSec = (ts: number): number => (ts > 1e12 ? ts / 1000 : ts);

const pad2 = (n: number): string => String(n).padStart(2, '0');

const formatAxisTime = (ms: number, mode: 'hm' | 'md'): string => {
  const d = new Date(ms);
  if (mode === 'md') return `${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}`;
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

const formatScrubTime = (ms: number): string => {
  const d = new Date(ms);
  return `${pad2(d.getMonth() + 1)}/${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

const urlHostLabel = (rawUrl: string): string => {
  try {
    const parsed = new URL(rawUrl);
    return parsed.host;
  } catch {
    return rawUrl;
  }
};

// ---------- Styles ----------

const injectStyles = (): void => {
  if (document.getElementById('pq-styles')) return;
  const style = document.createElement('style');
  style.id = 'pq-styles';
  style.textContent = PANEL_CSS;
  document.head.appendChild(style);
};

// ---------- DOM & SVG Helpers ----------

const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const svgEl = <K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] => {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    node.setAttribute(k, String(v));
  }
  return node;
};

const createGearIcon = (): SVGSVGElement => {
  const svg = svgEl('svg', {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
  });
  svg.appendChild(svgEl('circle', { cx: 12, cy: 12, r: 3 }));
  svg.appendChild(svgEl('path', {
    d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  }));
  return svg;
};

// ---------- Host & State ----------

const host = connectHost();
const root = document.querySelector<HTMLElement>('#root')!;

let mounted = false;
let loading = false;
let saving = false;
let savingShowAis = false;
let savingCompact = false;
let currentState: PanelStateDataResponse | null = null;
let currentRev: string | null = null;
let lastFetchedAtMs = 0;
let settingsExpanded = false;
let aisFullExpanded = false;
let draftUrl = 'http://127.0.0.1:18380';
let draftPasscode = '';
let draftDirty = false;
let settingsFeedback: { tone: 'success' | 'error' | 'info'; text: string } | null = null;
let activeScrubCount = 0;

interface CachedPanelHistory {
  data: PanelAntigravityHistoryResponse;
  hrev?: string;
  fetchedAtMs: number;
}

const accountHistoryWindow = new Map<string, HistoryWindowKind>();
const historyCache = new Map<string, CachedPanelHistory>();
const historyInFlight = new Set<string>();
const chartBodyClearer = new WeakMap<HTMLElement, () => void>();

let activeDisposers: Array<() => void> = [];
let settingsDisposers: Array<() => void> = [];
let activeChartClearers = new Set<() => void>();
let refreshBtnHandle: ButtonHandle | null = null;
let gearBtnEl: HTMLButtonElement | null = null;
let settingsCardEl: HTMLElement | null = null;
let footerTimeEl: HTMLElement | null = null;
let showAisSwitchHandle: CheckboxHandle | null = null;
let compactSwitchHandle: CheckboxHandle | null = null;
let autoRefreshTimer: number | null = null;
let visibilityTracker: PanelVisibilityTracker | null = null;
const popTip: PopTipController = createPopTipController();

const getAccountWindow = (accountId: string): HistoryWindowKind => (
  accountHistoryWindow.get(accountId) ?? '5h'
);

const historyKey = (accountId: string, win: HistoryWindowKind): string => `${accountId}|${win}`;

const disposeList = (list: Array<() => void>): void => {
  for (const fn of list) {
    try {
      fn();
    } catch {
      // ignore
    }
  }
};

const clearAllScrubs = (): void => {
  for (const fn of activeChartClearers) {
    try {
      fn();
    } catch {
      // ignore
    }
  }
};

document.addEventListener('pointerdown', (e) => {
  const target = e.target as Element | null;
  if (!target?.closest('.pq-chart-box')) {
    clearAllScrubs();
  } else {
    popTip.hide();
  }
});

// ---------- Persistent UI Preferences (host.storage) ----------

const loadUiPrefs = async (): Promise<void> => {
  try {
    const saved = await host.storage.get(STORAGE_UI_PREFS_KEY);
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      const record = saved as Record<string, unknown>;
      if (typeof record.aisFullExpanded === 'boolean' && record.aisFullExpanded !== aisFullExpanded) {
        aisFullExpanded = record.aisFullExpanded;
        if (currentState?.snapshot) {
          render();
        }
      }
    }
  } catch {
    // Storage unavailable on older host; keep in-memory default
  }
};

const persistUiPrefs = (): void => {
  void host.storage.set(STORAGE_UI_PREFS_KEY, {
    aisFullExpanded,
  }).catch(() => {
    // ignore storage errors
  });
};

// ---------- Scroll Preservation ----------

interface ScrollSnapshot {
  winX: number;
  winY: number;
  docTop: number;
  bodyTop: number;
  rootTop: number;
  prevHeight: number;
}

const captureScroll = (): ScrollSnapshot => ({
  winX: window.scrollX || 0,
  winY: window.scrollY || 0,
  docTop: document.documentElement?.scrollTop || 0,
  bodyTop: document.body?.scrollTop || 0,
  rootTop: root.scrollTop || 0,
  prevHeight: root.getBoundingClientRect().height,
});

const restoreScroll = (saved: ScrollSnapshot): void => {
  const apply = (): void => {
    if (saved.rootTop > 0) root.scrollTop = saved.rootTop;
    if (saved.docTop > 0 && document.documentElement) {
      document.documentElement.scrollTop = saved.docTop;
    }
    if (saved.bodyTop > 0 && document.body) {
      document.body.scrollTop = saved.bodyTop;
    }
    const targetY = saved.winY || saved.docTop || saved.bodyTop;
    if (targetY > 0 || saved.winX > 0) {
      window.scrollTo({ left: saved.winX, top: targetY, behavior: 'instant' as ScrollBehavior });
    }
  };
  apply();
  requestAnimationFrame(() => {
    apply();
    root.style.minHeight = '';
  });
};

// ---------- Service Calls ----------

const callService = async <T>(
  method: 'GET' | 'POST',
  path: string,
  options: { query?: Record<string, string>; body?: Record<string, unknown> } = {},
): Promise<T> => {
  const res = await host.serviceRequest({
    method,
    path,
    ...(options.query ? { query: options.query } : {}),
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  let parsed: unknown = null;
  try {
    parsed = res.body ? JSON.parse(res.body) : null;
  } catch {
    parsed = null;
  }
  if (res.status < 200 || res.status >= 300) {
    const msg = parsed && typeof parsed === 'object' && 'error' in parsed && typeof (parsed as { error: unknown }).error === 'string'
      ? (parsed as { error: string }).error
      : `服务返回 HTTP ${res.status}`;
    throw new Error(msg);
  }
  return parsed as T;
};

const cacheHistory = (
  data: PanelAntigravityHistoryResponse | null | undefined,
  hrev?: string,
  fetchedAtMs: number = Date.now(),
): void => {
  if (!data || !data.account_id) return;
  const win: HistoryWindowKind = data.window === '7d' ? '7d' : '5h';
  const key = historyKey(data.account_id, win);
  const prev = historyCache.get(key);
  historyCache.set(key, {
    data,
    hrev: hrev || prev?.hrev,
    fetchedAtMs,
  });
};

const syncCachedHistoriesFromSnapshot = (
  snapshot: PanelBoardSnapshot | null | undefined,
  fetchedAtMs: number,
  skipKey?: string,
): void => {
  if (!snapshot) return;
  for (const [key, entry] of historyCache.entries()) {
    if (skipKey && key === skipKey) continue;
    const synced = syncHistoryEstimatedPointsFromSnapshot(entry.data, snapshot, fetchedAtMs);
    if (synced !== entry.data) {
      historyCache.set(key, {
        data: synced,
        hrev: entry.hrev,
        fetchedAtMs: entry.fetchedAtMs,
      });
    }
  }
};

// ---------- Mini Cycle Burn Trend SVG ----------

const CYCLE_RESET_FALLBACK_JUMP = 5;

const extractSeriesResetTimes = (s: PanelHistorySeries): number[] => {
  const out: number[] = [];

  if (Array.isArray(s.cycle_resets) && s.cycle_resets.length > 0) {
    for (const t of s.cycle_resets) {
      if (typeof t === 'number' && Number.isFinite(t) && t > 0) {
        out.push(toMs(t));
      }
    }
  } else if (Array.isArray(s.resets) && s.resets.length >= 2) {
    const pts = Array.isArray(s.points) ? s.points : [];
    const lastRemainingBefore = (targetMs: number): number | null => {
      let rem: number | null = null;
      for (let j = 0; j < pts.length; j += 1) {
        const pt = pts[j]!;
        const ptMs = toMs(pt[0]);
        if (ptMs < targetMs) {
          rem = clampPercent(pt[1]);
        } else {
          break;
        }
      }
      return rem;
    };

    for (let i = 1; i < s.resets.length; i += 1) {
      const prev = s.resets[i - 1]!;
      const cur = s.resets[i]!;
      if (!Array.isArray(prev) || !Array.isArray(cur) || prev.length < 2 || cur.length < 2) {
        continue;
      }
      const prevEff = toSec(prev[1]);
      const curEff = toSec(cur[1]);
      const curT = toMs(cur[0]);
      if (!Number.isFinite(curT) || curT <= 0) continue;

      if (prevEff > 0 && curEff > prevEff + 60) {
        out.push(curT);
      } else if (prevEff > 0 && curEff === 0) {
        const preRem = lastRemainingBefore(curT);
        if (preRem !== null && preRem < 99.999) {
          out.push(curT);
        }
      }
    }
  }

  if (out.length <= 1) return out;
  out.sort((a, b) => a - b);
  const deduped: number[] = [out[0]!];
  for (let i = 1; i < out.length; i += 1) {
    if (out[i]! > deduped[deduped.length - 1]!) {
      deduped.push(out[i]!);
    }
  }
  return deduped;
};

const getValidEstimatedPoint = (s: PanelHistorySeries): { t: number; r: number } | null => {
  if (!Array.isArray(s.estimated_point) || s.estimated_point.length < 2) return null;
  const rawT = s.estimated_point[0];
  const rawR = s.estimated_point[1];
  if (typeof rawT !== 'number' || !Number.isFinite(rawT) || rawT <= 0) return null;
  if (typeof rawR !== 'number' || !Number.isFinite(rawR)) return null;
  const lastRaw = s.points[s.points.length - 1];
  if (!lastRaw) return null;
  const estT = toMs(rawT);
  const lastT = toMs(lastRaw[0]);
  if (estT <= lastT) return null;
  return { t: estT, r: clampPercent(rawR) };
};

const buildHistorySvg = (
  history: PanelAntigravityHistoryResponse,
  windowKind: HistoryWindowKind,
  acct: PanelAntigravityAccount,
  clearers: Set<() => void>,
): HTMLElement => {
  const box = el('div');
  const allowArgon = canShowArgonForTier(acct.tier);

  const rawSeries = (history.series ?? []).filter((s) => {
    if (!allowArgon && isArgonKey(s.key, s.group)) return false;
    return Array.isArray(s.points) && s.points.length >= 2;
  });

  if (rawSeries.length === 0) {
    box.appendChild(el('div', 'pq-chart-empty', `暂无 ${windowKind === '7d' ? '7d' : '5h'} 历史采样曲线`));
    return box;
  }

  const paintSeries = [...rawSeries].sort((a, b) => {
    const ia = SERIES_PAINT_ORDER.indexOf(a.key);
    const ib = SERIES_PAINT_ORDER.indexOf(b.key);
    return (ia === -1 ? 0 : ia) - (ib === -1 ? 0 : ib);
  });

  const legendSeries = [...rawSeries].sort((a, b) => {
    const ia = SERIES_LEGEND_ORDER.indexOf(a.key);
    const ib = SERIES_LEGEND_ORDER.indexOf(b.key);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  const W = 320;
  const H = 112;
  const PAD_L = 30;
  const PAD_R = 8;
  const PAD_T = 10;
  const PAD_B = 18;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const yBase = PAD_T + innerH;

  const estimatedBySeries = new Map<string, { t: number; r: number }>();
  let minT = Number.POSITIVE_INFINITY;
  let maxT = Number.NEGATIVE_INFINITY;
  for (const s of rawSeries) {
    for (const pt of s.points) {
      const tMs = toMs(pt[0]);
      if (tMs < minT) minT = tMs;
      if (tMs > maxT) maxT = tMs;
    }
    const est = getValidEstimatedPoint(s);
    if (est) {
      estimatedBySeries.set(s.key, est);
      if (est.t > maxT) maxT = est.t;
    }
  }
  const spanT = Math.max(1, maxT - minT);
  const xFor = (tMs: number): number => PAD_L + ((tMs - minT) / spanT) * innerW;
  const yFor = (rem: number): number => PAD_T + innerH * (1 - clampPercent(rem) / 100);

  // Interactive readout strip above SVG
  const readoutBar = el('div', 'pq-chart-readout');

  const renderDefaultReadout = (): void => {
    readoutBar.classList.remove('is-scrubbing');
    readoutBar.replaceChildren();
    const items = el('div', 'pq-readout-items');
    for (const s of legendSeries) {
      const latestRem = clampPercent(s.points[s.points.length - 1]?.[1] ?? s.remaining);
      const lv = healthLevelFor(latestRem);
      const item = el('span', 'pq-readout-item');
      const dot = el('span', 'pq-fam-dot');
      dot.style.background = seriesColorVar(s.key, s.group);
      item.appendChild(dot);
      item.appendChild(el('span', 'pq-muted', shortSeriesLabel(s)));
      item.appendChild(el('strong', `pq-mono pq-lv-${lv}`, formatPercent(latestRem)));
      items.appendChild(item);
    }
    readoutBar.appendChild(items);
    readoutBar.appendChild(el('span', 'pq-readout-hint', '悬停/滑动'));
  };

  renderDefaultReadout();
  box.appendChild(readoutBar);

  // SVG Canvas
  const svgWrap = el('div', 'pq-chart-svg-wrap');
  const svg = svgEl('svg', {
    viewBox: `0 0 ${W} ${H}`,
    class: 'pq-chart-svg',
    role: 'img',
    'aria-label': `${windowKind} 周期剩余趋势`,
  });

  const defs = svgEl('defs');
  const gradIdByKey = new Map<string, string>();
  for (const s of paintSeries) {
    const gid = `pq-grad-${++svgGradSeq}`;
    gradIdByKey.set(s.key, gid);
    const color = seriesColorVar(s.key, s.group);
    const grad = svgEl('linearGradient', { id: gid, x1: '0', y1: '0', x2: '0', y2: '1' });
    grad.appendChild(svgEl('stop', { offset: '0%', 'stop-color': color, 'stop-opacity': '0.26' }));
    grad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': color, 'stop-opacity': '0.01' }));
    defs.appendChild(grad);
  }
  svg.appendChild(defs);

  // Y-axis grid lines & micro-labels (100% / 50% / 0% + subtle 25% warning line)
  for (const pct of [100, 50, 25, 0]) {
    const y = yFor(pct);
    const isWarn = pct === 25;
    const isZero = pct === 0;
    svg.appendChild(svgEl('line', {
      x1: PAD_L,
      x2: W - PAD_R,
      y1: y.toFixed(1),
      y2: y.toFixed(1),
      stroke: isWarn ? 'var(--pq-low)' : 'var(--pq-border)',
      'stroke-opacity': isWarn ? '0.26' : isZero ? '0.75' : '0.45',
      'stroke-dasharray': isZero ? '' : '2.5 3',
      'stroke-width': '1',
    }));

    if (pct === 100 || pct === 50 || pct === 0) {
      const label = svgEl('text', {
        x: PAD_L - 4,
        y: (y + 3).toFixed(1),
        'text-anchor': 'end',
        class: 'pq-svg-axis',
      });
      label.textContent = `${pct}%`;
      svg.appendChild(label);
    }
  }

  // Series area gradients, crisp strokes, and latest point markers
  const normalizedPoints = new Map<string, Array<{ t: number; r: number; x: number; y: number; estimated?: boolean }>>();

  for (const s of paintSeries) {
    const color = seriesColorVar(s.key, s.group);
    const gid = gradIdByKey.get(s.key)!;
    const pts: Array<{ t: number; r: number; x: number; y: number; estimated?: boolean }> = s.points.map((pt) => {
      const t = toMs(pt[0]);
      const r = clampPercent(pt[1]);
      return { t, r, x: xFor(t), y: yFor(r) };
    });
    const scrubPts = [...pts];
    const est = estimatedBySeries.get(s.key);
    const estCoord = est ? { t: est.t, r: est.r, x: xFor(est.t), y: yFor(est.r), estimated: true } : null;
    if (estCoord) {
      scrubPts.push(estCoord);
    }
    normalizedPoints.set(s.key, scrubPts);

    // Split segments on authoritative cycle reset timestamps or >= 5% upward jump fallback
    const resetTimes = extractSeriesResetTimes(s);
    let resetIdx = 0;
    const segments: Array<typeof pts> = [];
    const resetJumps: Array<{ x: number; yFrom: number; yTo: number }> = [];
    let currentSeg: typeof pts = [];
    for (let i = 0; i < pts.length; i += 1) {
      const p = pts[i]!;
      const prev = currentSeg[currentSeg.length - 1];
      if (prev) {
        while (resetIdx < resetTimes.length && resetTimes[resetIdx]! <= prev.t) {
          resetIdx += 1;
        }
        const crossedReset = resetIdx < resetTimes.length && resetTimes[resetIdx]! <= p.t;
        if (crossedReset || p.r - prev.r >= CYCLE_RESET_FALLBACK_JUMP) {
          // Extend previous segment horizontally to reset boundary to avoid blank gaps
          currentSeg.push({ t: p.t, r: prev.r, x: p.x, y: prev.y });
          segments.push(currentSeg);
          resetJumps.push({ x: p.x, yFrom: prev.y, yTo: p.y });
          currentSeg = [p];
          continue;
        }
      }
      currentSeg.push(p);
    }
    if (currentSeg.length > 0) segments.push(currentSeg);

    for (const seg of segments) {
      if (seg.length >= 2) {
        const lineD = seg.map((p, idx) => `${idx === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
        const first = seg[0]!;
        const last = seg[seg.length - 1]!;
        const areaD = `M${first.x.toFixed(1)},${yBase.toFixed(1)} ${seg.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} L${last.x.toFixed(1)},${yBase.toFixed(1)} Z`;

        svg.appendChild(svgEl('path', {
          d: areaD,
          fill: `url(#${gid})`,
          stroke: 'none',
        }));

        svg.appendChild(svgEl('path', {
          d: lineD,
          fill: 'none',
          stroke: color,
          'stroke-width': '1.9',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        }));
      } else if (seg.length === 1) {
        // Protect freshly reset single-point cycle so 100% state stays visible on the chart
        const only = seg[0]!;
        const x1 = only.x + 1.5 <= W - PAD_R ? only.x : Math.max(PAD_L, only.x - 1.5);
        const x2 = only.x + 1.5 <= W - PAD_R ? only.x + 1.5 : only.x;
        svg.appendChild(svgEl('line', {
          x1: x1.toFixed(1),
          x2: x2.toFixed(1),
          y1: only.y.toFixed(1),
          y2: only.y.toFixed(1),
          stroke: color,
          'stroke-width': '1.9',
          'stroke-linecap': 'round',
        }));
      }
    }

    // Subtle vertical dashed connector showing step-up cycle resets
    for (const jump of resetJumps) {
      if (Math.abs(jump.yTo - jump.yFrom) < 1) continue;
      svg.appendChild(svgEl('line', {
        x1: jump.x.toFixed(1),
        x2: jump.x.toFixed(1),
        y1: jump.yFrom.toFixed(1),
        y2: jump.yTo.toFixed(1),
        stroke: color,
        'stroke-opacity': '0.32',
        'stroke-width': '1',
        'stroke-dasharray': '2 2',
        'pointer-events': 'none',
      }));
    }

    // Soft dashed tail from last authoritative sample to live estimated point (if present)
    const lastPt = pts[pts.length - 1];
    if (lastPt && estCoord) {
      svg.appendChild(svgEl('line', {
        x1: lastPt.x.toFixed(1),
        y1: lastPt.y.toFixed(1),
        x2: estCoord.x.toFixed(1),
        y2: estCoord.y.toFixed(1),
        stroke: color,
        'stroke-opacity': '0.72',
        'stroke-width': '1.6',
        'stroke-dasharray': '3 2.5',
        'stroke-linecap': 'round',
        'pointer-events': 'none',
      }));
      svg.appendChild(svgEl('circle', {
        cx: estCoord.x.toFixed(1),
        cy: estCoord.y.toFixed(1),
        r: '2.2',
        fill: 'var(--pq-surface)',
        stroke: color,
        'stroke-opacity': '0.85',
        'stroke-width': '1.4',
        'pointer-events': 'none',
      }));
    }

    // Latest point glowing halo + crisp marker dot
    if (lastPt) {
      svg.appendChild(svgEl('circle', {
        cx: lastPt.x.toFixed(1),
        cy: lastPt.y.toFixed(1),
        r: '4.6',
        fill: color,
        'fill-opacity': '0.24',
      }));
      svg.appendChild(svgEl('circle', {
        cx: lastPt.x.toFixed(1),
        cy: lastPt.y.toFixed(1),
        r: '2.5',
        fill: color,
        stroke: 'var(--pq-surface)',
        'stroke-width': '1.2',
      }));
    }
  }

  // X-axis start / mid / end time micro-labels (tabular-nums)
  const axisMode: 'hm' | 'md' = (windowKind === '7d' || spanT >= 36 * 3600 * 1000) ? 'md' : 'hm';
  const xTicks: Array<{ x: number; t: number; anchor: 'start' | 'middle' | 'end' }> = [
    { x: PAD_L, t: minT, anchor: 'start' },
    { x: PAD_L + innerW / 2, t: minT + spanT / 2, anchor: 'middle' },
    { x: W - PAD_R, t: maxT, anchor: 'end' },
  ];
  for (const tick of xTicks) {
    const label = svgEl('text', {
      x: tick.x.toFixed(1),
      y: String(H - 3),
      'text-anchor': tick.anchor,
      class: 'pq-svg-axis',
    });
    label.textContent = formatAxisTime(tick.t, axisMode);
    svg.appendChild(label);
  }

  // Scrub hairline + active point highlight circles
  const scrubLine = svgEl('line', {
    x1: PAD_L,
    x2: PAD_L,
    y1: PAD_T,
    y2: yBase,
    stroke: 'var(--pq-fg)',
    'stroke-opacity': '0.42',
    'stroke-width': '1',
    'stroke-dasharray': '2.5 2.5',
    'pointer-events': 'none',
  });
  scrubLine.style.display = 'none';
  svg.appendChild(scrubLine);

  const scrubDots = new Map<string, SVGCircleElement>();
  for (const s of paintSeries) {
    const dot = svgEl('circle', {
      cx: PAD_L,
      cy: PAD_T,
      r: '3.6',
      fill: 'var(--pq-surface)',
      stroke: seriesColorVar(s.key, s.group),
      'stroke-width': '2',
      'pointer-events': 'none',
    });
    dot.style.display = 'none';
    svg.appendChild(dot);
    scrubDots.set(s.key, dot);
  }

  // Transparent pointer hit area
  const hitRect = svgEl('rect', {
    x: PAD_L,
    y: PAD_T,
    width: innerW,
    height: innerH,
    fill: 'transparent',
  });
  hitRect.style.cursor = 'crosshair';
  svg.appendChild(hitRect);

  let scrubbing = false;
  let touchDragging = false;

  const clearScrub = (): void => {
    if (!scrubbing) return;
    scrubbing = false;
    touchDragging = false;
    activeScrubCount = Math.max(0, activeScrubCount - 1);
    scrubLine.style.display = 'none';
    for (const dot of scrubDots.values()) {
      dot.style.display = 'none';
    }
    renderDefaultReadout();
  };

  const findNearestPoint = (
    pts: Array<{ t: number; r: number; x: number; y: number; estimated?: boolean }>,
    targetT: number,
  ) => {
    let best = pts[0]!;
    let bestDist = Math.abs(best.t - targetT);
    for (let i = 1; i < pts.length; i += 1) {
      const p = pts[i]!;
      const d = Math.abs(p.t - targetT);
      if (d <= bestDist) {
        best = p;
        bestDist = d;
      } else if (p.t > targetT) {
        break;
      }
    }
    return best;
  };

  const updateScrubAtClientX = (clientX: number, isTouch: boolean): void => {
    const rect = svg.getBoundingClientRect();
    if (!rect.width) return;
    const relX = Math.max(PAD_L, Math.min(W - PAD_R, ((clientX - rect.left) / rect.width) * W));
    const tHover = minT + ((relX - PAD_L) / innerW) * spanT;

    if (!scrubbing) {
      scrubbing = true;
      activeScrubCount += 1;
    }

    let snappedTime = tHover;
    const entries: Array<{ s: PanelHistorySeries; r: number; estimated?: boolean }> = [];

    for (const s of legendSeries) {
      const pts = normalizedPoints.get(s.key);
      if (!pts || pts.length === 0) continue;
      const nearest = findNearestPoint(pts, tHover);
      snappedTime = nearest.t;
      entries.push({ s, r: nearest.r, estimated: nearest.estimated });
      const dot = scrubDots.get(s.key);
      if (dot) {
        dot.setAttribute('cx', nearest.x.toFixed(1));
        dot.setAttribute('cy', nearest.y.toFixed(1));
        dot.style.display = '';
      }
    }

    const lineX = xFor(snappedTime);
    scrubLine.setAttribute('x1', lineX.toFixed(1));
    scrubLine.setAttribute('x2', lineX.toFixed(1));
    scrubLine.style.display = '';

    readoutBar.classList.add('is-scrubbing');
    readoutBar.replaceChildren();
    const items = el('div', 'pq-readout-items');
    items.appendChild(el('span', 'pq-readout-time pq-mono', formatScrubTime(snappedTime)));
    for (const { s, r, estimated } of entries) {
      const lv = healthLevelFor(r);
      const item = el('span', 'pq-readout-item');
      const dot = el('span', 'pq-fam-dot');
      dot.style.background = seriesColorVar(s.key, s.group);
      item.appendChild(dot);
      item.appendChild(el('span', 'pq-muted', shortSeriesLabel(s)));
      item.appendChild(el('strong', `pq-mono pq-lv-${lv}`, estimated ? `~${r.toFixed(1)}%` : formatPercent(r)));
      items.appendChild(item);
    }
    readoutBar.appendChild(items);

    if (isTouch) {
      const closeBtn = el('button', 'pq-readout-clear', '×');
      closeBtn.type = 'button';
      closeBtn.title = '关闭读数';
      closeBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        clearScrub();
      });
      readoutBar.appendChild(closeBtn);
    }
  };

  svg.addEventListener('pointerdown', (e) => {
    const isTouch = e.pointerType !== 'mouse';
    if (isTouch) touchDragging = true;
    updateScrubAtClientX(e.clientX, isTouch);
  });

  svg.addEventListener('pointermove', (e) => {
    const isTouch = e.pointerType !== 'mouse';
    if (!isTouch || touchDragging) {
      updateScrubAtClientX(e.clientX, isTouch);
    }
  });

  svg.addEventListener('pointerup', () => {
    touchDragging = false;
  });

  svg.addEventListener('pointercancel', () => {
    touchDragging = false;
  });

  svg.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'mouse') {
      clearScrub();
    }
  });

  clearers.add(clearScrub);
  (box as HTMLElement & { __pqClearScrub?: () => void }).__pqClearScrub = clearScrub;
  svgWrap.appendChild(svg);
  box.appendChild(svgWrap);
  return box;
};

// ---------- Account History In-Place Loader ----------

const swapChartBodyNode = (chartBody: HTMLElement, nextNode: HTMLElement): void => {
  const prevClear = chartBodyClearer.get(chartBody);
  if (prevClear) {
    try {
      prevClear();
    } catch {
      // ignore
    }
    activeChartClearers.delete(prevClear);
    chartBodyClearer.delete(chartBody);
  }
  const nextClear = (nextNode as HTMLElement & { __pqClearScrub?: () => void }).__pqClearScrub;
  if (nextClear) {
    chartBodyClearer.set(chartBody, nextClear);
  }
  chartBody.replaceChildren(nextNode);
};

const mountChartContent = (
  chartBody: HTMLElement,
  acct: PanelAntigravityAccount,
  win: HistoryWindowKind,
  forceFetch = false,
): void => {
  const key = historyKey(acct.id, win);
  const cached = historyCache.get(key);
  const now = Date.now();

  if (cached) {
    swapChartBodyNode(chartBody, buildHistorySvg(cached.data, win, acct, activeChartClearers));
    if (!forceFetch && now - cached.fetchedAtMs < HISTORY_FRESH_MS) {
      return;
    }
  } else {
    const loadingBox = el('div', 'pq-chart-loading');
    loadingBox.textContent = `加载 ${win === '7d' ? '7d' : '5h'} 燃烧趋势…`;
    swapChartBodyNode(chartBody, loadingBox);
  }

  if (historyInFlight.has(key)) return;
  historyInFlight.add(key);

  void callService<PanelHistoryResponse>('GET', '/panel/history', {
    query: {
      account: acct.id,
      window: win,
      range: win === '7d' ? '7d' : '24h',
      ...(cached?.hrev ? { hrev: cached.hrev } : {}),
      ...(forceFetch ? { refresh: '1', force: '1' } : {}),
    },
  })
    .then((res) => {
      if ('unchanged' in res && res.unchanged === true) {
        if (!cached) return;
        const synced = currentState?.snapshot
          ? syncHistoryEstimatedPointsFromSnapshot(cached.data, currentState.snapshot)
          : cached.data;
        cacheHistory(synced, res.hrev || cached.hrev, Date.now());
        if (!chartBody.isConnected || getAccountWindow(acct.id) !== win) return;
        swapChartBodyNode(chartBody, buildHistorySvg(synced, win, acct, activeChartClearers));
        return;
      }
      cacheHistory(res, res.hrev, Date.now());
      if (!chartBody.isConnected) return;
      if (getAccountWindow(acct.id) !== win) return;
      swapChartBodyNode(chartBody, buildHistorySvg(res, win, acct, activeChartClearers));
    })
    .catch(() => {
      if (!chartBody.isConnected) return;
      if (getAccountWindow(acct.id) !== win) return;
      if (!cached) {
        swapChartBodyNode(chartBody, el('div', 'pq-chart-empty', '历史趋势暂不可用'));
      }
    })
    .finally(() => {
      historyInFlight.delete(key);
    });
};

// ---------- Antigravity Recent 200m Micro-Capsule Strip ----------

const renderRecent200mStrip = (
  history: PanelAntigravityAccountHistory | undefined,
  snapshotMs: number,
  accountId: string,
): HTMLElement | null => {
  if (!history) return null;

  if (history.has_recent_buckets && Array.isArray(history.recent_buckets) && history.recent_buckets.length > 0) {
    const buckets = history.recent_buckets;
    const okTotal = history.recent_window_success || 0;
    const failTotal = history.recent_window_failure || 0;
    const hasData = okTotal + failTotal > 0;
    const rate = history.recent_window_rate;
    const windowMins = history.recent_window_minutes || 200;
    const defaultLabelText = `近 ${windowMins}m 成功率`;

    const strip = el('div', 'pq-recent-strip');
    const top = el('div', 'pq-recent-top');
    const labelEl = el('span', 'pq-recent-label pq-num', defaultLabelText);
    top.appendChild(labelEl);

    const meta = el('div', 'pq-recent-meta pq-mono');
    if (hasData) {
      meta.appendChild(el('span', 'pq-recent-ok', `✓${okTotal}`));
      if (failTotal > 0) {
        meta.appendChild(el('span', 'pq-recent-fail', `✕${failTotal}`));
      }
    }

    const rateCls = !hasData || rate == null
      ? ''
      : rate >= 95
        ? 'is-high'
        : rate >= 80
          ? 'is-med'
          : 'is-low';
    const rateText = hasData && rate != null ? formatPercent(rate) : '空闲';
    meta.appendChild(el('span', `pq-rate-capsule ${rateCls}`, rateText));
    top.appendChild(meta);
    strip.appendChild(top);

    const bucketRow = el('div', 'pq-buckets');
    const bucketMs = 10 * 60 * 1000;
    const startMs = (snapshotMs || Date.now()) - buckets.length * bucketMs;
    let focusedNode: HTMLElement | null = null;

    buckets.forEach((b, idx) => {
      const ok = b.success || 0;
      const fail = b.failed || 0;
      const tot = ok + fail;
      const idle = tot === 0;
      const cell = el('div', `pq-bucket${idle ? '' : ' is-active'}`);
      if (!idle) {
        cell.style.background = rateToRgb(ok / tot);
      }
      const rangeStr = b.time || `${formatAxisTime(startMs + idx * bucketMs, 'hm')}-${formatAxisTime(startMs + (idx + 1) * bucketMs, 'hm')}`;
      const detailText = idle
        ? `${rangeStr} · 无请求`
        : `${rangeStr} · ✓${ok}${fail > 0 ? ` ✕${fail}` : ''} (${formatPercent((ok / tot) * 100)})`;
      cell.title = detailText;

      const focusCell = (): void => {
        if (focusedNode && focusedNode !== cell) focusedNode.classList.remove('is-focus');
        focusedNode = cell;
        cell.classList.add('is-focus');
        labelEl.textContent = detailText;
      };

      cell.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'mouse') focusCell();
      });
      cell.addEventListener('click', (e) => {
        e.stopPropagation();
        if (focusedNode === cell) {
          cell.classList.remove('is-focus');
          focusedNode = null;
          labelEl.textContent = defaultLabelText;
        } else {
          focusCell();
        }
      });

      bucketRow.appendChild(cell);
    });

    bucketRow.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse') {
        if (focusedNode) focusedNode.classList.remove('is-focus');
        focusedNode = null;
        labelEl.textContent = defaultLabelText;
      }
    });

    strip.appendChild(bucketRow);
    return strip;
  }

  if (Array.isArray(history.recent_bars) && history.recent_bars.length > 0) {
    const bars = history.recent_bars;
    const rate = history.recent_success_rate;
    const strip = el('div', 'pq-recent-strip');
    const top = el('div', 'pq-recent-top');
    top.appendChild(el('span', 'pq-recent-label pq-num', `近 ${bars.length} 次请求`));
    const rateCls = rate == null ? '' : rate >= 95 ? 'is-high' : rate >= 80 ? 'is-med' : 'is-low';
    top.appendChild(el('span', `pq-rate-capsule pq-mono ${rateCls}`, rate != null ? formatPercent(rate) : '--'));
    strip.appendChild(top);

    const row = el('div', 'pq-buckets');
    for (const bar of bars) {
      const cell = el('div', 'pq-bucket is-active');
      cell.style.background = bar.ok ? 'var(--pq-healthy-bar)' : 'var(--pq-low-bar)';
      row.appendChild(cell);
    }
    strip.appendChild(row);
    return strip;
  }

  if (history.available) {
    if (typeof history.cache_hit_rate === 'number' && Number.isFinite(history.cache_hit_rate)) {
      const strip = el('div', 'pq-recent-strip');
      const top = el('div', 'pq-recent-top');
      top.appendChild(el('span', 'pq-recent-label', '累计缓存命中'));
      const r = history.cache_hit_rate;
      const tier = cacheRateTierClass(r);
      const cacheCls = tier === 'is-high'
        ? 'is-cache-high'
        : tier === 'is-mid'
          ? 'is-cache-mid'
          : 'is-cache-low';
      const capsule = el('span', `pq-rate-capsule pq-mono ${cacheCls}`, formatPercent(r));
      bindPopTip(capsule, {
        id: `ag-fallback-${accountId}`,
        title: '缓存效率',
        text: buildCacheTooltip({
          rate: r,
          rate24h: history.cache_hit_rate_24h,
          savedCost: history.cache_saved_cost,
        }),
      });
      top.appendChild(capsule);
      strip.appendChild(top);
      return strip;
    }

    if (typeof history.success_rate === 'number' && Number.isFinite(history.success_rate)) {
      const strip = el('div', 'pq-recent-strip');
      const top = el('div', 'pq-recent-top');
      top.appendChild(el('span', 'pq-recent-label', '历史成功率'));
      const r = history.success_rate;
      const rateCls = r >= 95 ? 'is-high' : r >= 80 ? 'is-med' : 'is-low';
      const capsule = el('span', `pq-rate-capsule pq-mono ${rateCls}`, formatPercent(r));
      bindPopTip(capsule, {
        id: `ag-fallback-${accountId}`,
        title: '历史成功率',
        text: `历史请求累计成功率 ${formatPercent(r)}`,
      });
      top.appendChild(capsule);
      strip.appendChild(top);
      return strip;
    }
  }

  return null;
};

// ---------- Antigravity Card ----------

const renderAgWindowActive = (win: PanelAntigravityWindow, accountId: string): HTMLElement => {
  const rem = clampPercent(win.remaining_percent);
  const lv = healthLevelFor(rem);
  const box = el('div', `pq-win-active${lv === 'empty' ? ' is-empty' : ''}`);

  const top = el('div', 'pq-win-top');
  const nameWrap = el('div', 'pq-win-name-wrap');
  const dot = el('span', 'pq-fam-dot');
  dot.style.background = seriesColorVar(win.key, win.group);
  nameWrap.appendChild(dot);
  nameWrap.appendChild(el('span', 'pq-win-name', win.label || win.key));

  const freshness = formatSampleFreshness(win.observed_at_ms);
  if (freshness) {
    const ageEl = el('span', `pq-sample-age pq-num${win.stale ? ' is-stale' : ''}`, freshness);
    const obsMs = toMs(win.observed_at_ms);
    ageEl.dataset.pqObservedMs = String(obsMs);
    bindPopTip(ageEl, {
      id: `ag-win-age-${accountId}-${win.key}`,
      title: '真实采样时间',
      text: `${win.label || win.key} 最近权威采样：${new Date(obsMs).toLocaleTimeString()}${win.stale ? '（已过期，待采样）' : ''}`,
    });
    nameWrap.appendChild(ageEl);
  }
  top.appendChild(nameWrap);

  const valWrap = el('div', 'pq-win-val-wrap');
  if (lv === 'empty') {
    valWrap.appendChild(el('span', 'pq-pill pq-pill-empty', '已耗尽'));
  }
  valWrap.appendChild(el('span', `pq-win-val pq-lv-${lv}`, `剩 ${formatPercent(rem)}`));
  top.appendChild(valWrap);
  box.appendChild(top);

  const trackBar = el('div', `pq-bar-track${lv === 'empty' ? ' is-empty' : ''}`);
  const fill = el('div', `pq-bar-fill pq-bar-${lv}`);
  fill.style.width = `${rem}%`;
  trackBar.appendChild(fill);
  box.appendChild(trackBar);

  const sub = el('div', 'pq-win-sub');
  const usageWrap = el('div', 'pq-win-usage pq-mono');
  if (win.has_current_usage && (win.current_cost > 0 || win.current_tokens > 0)) {
    const parts = [`已用 ${formatUsd(win.current_cost)}`];
    if (win.current_tokens > 0) parts.push(formatTokens(win.current_tokens));
    usageWrap.appendChild(el('span', '', parts.join(' / ')));
    if (win.has_forecast && win.forecast_cost > 0) {
      const tag = forecastLabelFor(win.forecast_basis, true);
      const fullForecastLabel = forecastLabelFor(win.forecast_basis, false);
      const forecastEl = el('span', 'pq-tip-inline', `· ${tag} ${formatUsd(win.forecast_cost)}`);
      bindPopTip(forecastEl, {
        id: `ag-win-forecast-${accountId}-${win.key}`,
        title: fullForecastLabel,
        text: `${fullForecastLabel} ${formatUsd(win.forecast_cost)}（本窗已用 ${formatUsd(win.current_cost)}）`,
      });
      usageWrap.appendChild(forecastEl);
    }
  } else if (win.has_forecast && win.forecast_cost > 0) {
    const tag = forecastLabelFor(win.forecast_basis, false);
    usageWrap.appendChild(el('span', '', `${tag} ${formatUsd(win.forecast_cost)}`));
  } else {
    usageWrap.appendChild(el('span', '', '本窗暂无费用记录'));
  }
  sub.appendChild(usageWrap);

  if (win.stale) {
    sub.appendChild(el('span', 'pq-win-reset pq-mono', '待采样'));
  } else if (win.reset_at_ms > 0) {
    const resetEl = el('span', 'pq-win-reset pq-mono', `重置 ${formatCountdown(win.reset_at_ms)}`);
    resetEl.dataset.pqResetMs = String(win.reset_at_ms);
    resetEl.dataset.pqResetPrefix = '重置 ';
    sub.appendChild(resetEl);
  }
  box.appendChild(sub);

  const estRem = typeof win.estimated_remaining_percent === 'number' && Number.isFinite(win.estimated_remaining_percent)
    ? clampPercent(win.estimated_remaining_percent)
    : null;
  if (estRem !== null && (rem - estRem) >= 0.25) {
    const estLv = healthLevelFor(estRem);
    const estRow = el('div', 'pq-win-est');
    const estBadge = el('span', `pq-est-badge pq-mono pq-lv-${estLv}`);
    estBadge.appendChild(el('span', 'pq-est-dot'));
    estBadge.appendChild(document.createTextNode(`实时估算 ~${estRem.toFixed(1)}%`));
    estRow.appendChild(estBadge);

    const postParts: string[] = [];
    if (typeof win.post_sample_cost_usd === 'number' && win.post_sample_cost_usd > 0) {
      postParts.push(`+${formatUsd(win.post_sample_cost_usd)}`);
    }
    if (typeof win.post_sample_requests === 'number' && win.post_sample_requests > 0) {
      postParts.push(`${Math.round(win.post_sample_requests)}次`);
    } else if (typeof win.post_sample_tokens === 'number' && win.post_sample_tokens > 0) {
      postParts.push(`+${formatTokens(win.post_sample_tokens)}`);
    }
    if (postParts.length > 0) {
      const deltaEl = el('span', 'pq-est-delta pq-mono', `采样后 ${postParts.join(' · ')}`);
      estRow.appendChild(deltaEl);
    }
    bindPopTip(estRow, {
      id: `ag-win-est-${accountId}-${win.key}`,
      title: '采样后实时推算',
      text: `基于采样后实时用量推算约剩 ${estRem.toFixed(1)}%（权威采样值仍为 ${formatPercent(rem)}）`,
    });
    box.appendChild(estRow);
  }

  return box;
};

const renderAgWindowIdleTile = (win: PanelAntigravityWindow): HTMLElement => {
  const tile = el('div', 'pq-win-idle-tile');

  const top = el('div', 'pq-win-idle-top');
  const nameWrap = el('span', 'pq-win-idle-name');
  const dot = el('span', 'pq-fam-dot');
  dot.style.background = seriesColorVar(win.key, win.group);
  nameWrap.appendChild(dot);
  nameWrap.appendChild(el('span', '', win.label || win.key));
  top.appendChild(nameWrap);
  top.appendChild(el('span', 'pq-win-idle-pct pq-mono', '100%'));
  tile.appendChild(top);

  const trackBar = el('div', 'pq-bar-track is-thin');
  const fill = el('div', 'pq-bar-fill pq-bar-full');
  fill.style.width = '100%';
  trackBar.appendChild(fill);
  tile.appendChild(trackBar);

  const hasReset = !win.stale && win.reset_at_ms > 0;
  const subEl = el(
    'div',
    'pq-win-idle-sub pq-mono',
    hasReset ? `满血 · ${formatCountdown(win.reset_at_ms)}` : '满血未动用',
  );
  if (hasReset) {
    subEl.dataset.pqResetMs = String(win.reset_at_ms);
    subEl.dataset.pqResetPrefix = '满血 · ';
  }
  tile.appendChild(subEl);
  return tile;
};

const renderAgAccountBlock = (
  acct: PanelAntigravityAccount,
  snapshotMs: number,
  disposers: Array<() => void>,
): HTMLElement => {
  const block = el('div', 'pq-acct-block');

  // Account Identity Header
  const head = el('div', 'pq-acct-head');
  const idGroup = el('div', 'pq-acct-id');
  idGroup.appendChild(el('span', 'pq-acct-name', acct.code_name || acct.id));
  if (acct.tier) {
    idGroup.appendChild(el('span', `pq-pill ${tierClass(acct.tier)}`, acct.tier));
  }
  head.appendChild(idGroup);

  const badges = el('div', 'pq-acct-badges');
  const h = acct.history;
  if (h && typeof h.cache_hit_rate === 'number' && Number.isFinite(h.cache_hit_rate)) {
    const cachePill = el(
      'span',
      `pq-pill pq-num pq-pill-cache ${cacheRateTierClass(h.cache_hit_rate)}`,
      `缓存 ${formatPercent(h.cache_hit_rate)}`,
    );
    bindPopTip(cachePill, {
      id: `ag-cache-${acct.id}`,
      title: '缓存效率',
      text: buildCacheTooltip({
        rate: h.cache_hit_rate,
        rate24h: h.cache_hit_rate_24h,
        savedCost: h.cache_saved_cost,
      }),
    });
    badges.appendChild(cachePill);
  }
  const statusText = acct.status_label || (acct.status === 'available' ? '可用' : acct.status || '未知');
  badges.appendChild(el('span', `pq-pill ${accountStatusClass(acct.status)}`, statusText));
  head.appendChild(badges);
  block.appendChild(head);

  // Recent 200m success rate capsule / micro-bar
  const recentStrip = renderRecent200mStrip(acct.history, snapshotMs, acct.id);
  if (recentStrip) {
    block.appendChild(recentStrip);
  }

  // Quota Windows: Ultra hides Argon + Active-first layout
  const filtered = filterAccountWindows(acct).sort((a, b) => {
    const ia = WINDOW_ORDER.indexOf(a.key);
    const ib = WINDOW_ORDER.indexOf(b.key);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  const activeWins = filtered.filter(isActiveAgWindow);
  const idleWins = filtered.filter((w) => !isActiveAgWindow(w));

  if (activeWins.length > 0) {
    const activeList = el('div', 'pq-win-list');
    for (const w of activeWins) {
      activeList.appendChild(renderAgWindowActive(w, acct.id));
    }
    block.appendChild(activeList);
  }

  if (idleWins.length > 0) {
    const idleGrid = el('div', `pq-win-idle-grid${idleWins.length === 1 ? ' is-single' : ''}`);
    for (const w of idleWins) {
      idleGrid.appendChild(renderAgWindowIdleTile(w));
    }
    block.appendChild(idleGrid);
  }

  if (filtered.length === 0) {
    block.appendChild(el('div', 'pq-muted', '暂无配额窗口采样'));
  }

  // Mini Cycle Burn Trend Chart (zero-flicker local tab switch)
  if (acct.has_history) {
    const chartBox = el('div', 'pq-chart-box');
    const chartHead = el('div', 'pq-chart-head');
    chartHead.appendChild(el('span', 'pq-chart-title', '周期燃烧趋势'));

    const tabsWrap = el('div', 'pq-chart-tabs');
    const chartBody = el('div', 'pq-chart-body');
    chartBody.dataset.pqChartBody = acct.id;
    const activeWin = getAccountWindow(acct.id);

    let tabsHandle: TabsHandle | null = null;
    tabsHandle = mountTabs(tabsWrap, {
      items: [
        { id: '5h', label: '5h' },
        { id: '7d', label: '7d' },
      ],
      activeId: activeWin,
      trackBackground: true,
      onChange: (next) => {
        if (next !== '5h' && next !== '7d') return;
        accountHistoryWindow.set(acct.id, next);
        tabsHandle?.update({ activeId: next });
        mountChartContent(chartBody, acct, next, false);
      },
    });
    disposers.push(() => tabsHandle?.dispose());

    chartHead.appendChild(tabsWrap);
    chartBox.appendChild(chartHead);
    chartBox.appendChild(chartBody);
    block.appendChild(chartBox);

    mountChartContent(chartBody, acct, activeWin, false);
  }

  return block;
};

const renderAgCard = (snapshot: PanelBoardSnapshot, disposers: Array<() => void>): HTMLElement => {
  const card = el('div', 'pq-card');
  const ag = snapshot.antigravity;

  const head = el('div', 'pq-card-head');
  const headLeft = el('div', 'pq-card-head-left');
  headLeft.appendChild(el('h4', 'pq-card-title', 'Antigravity 号池'));

  // Show compact tier summary pills & weighted cache pill when multi-account pool is active
  if (ag.online && ag.accounts.length > 1) {
    if (ag.summary?.tier_counts) {
      for (const tierName of ['Ultra', 'Pro', 'Free']) {
        const cnt = ag.summary.tier_counts[tierName] ?? 0;
        if (cnt > 0) {
          headLeft.appendChild(el('span', `pq-pill pq-num ${tierClass(tierName)}`, `${tierName}×${cnt}`));
        }
      }
    }
    if (
      typeof ag.summary?.weighted_cache_hit_rate === 'number'
      && Number.isFinite(ag.summary.weighted_cache_hit_rate)
    ) {
      const poolCachePill = el(
        'span',
        `pq-pill pq-num pq-pill-cache ${cacheRateTierClass(ag.summary.weighted_cache_hit_rate)}`,
        `缓存 ${formatPercent(ag.summary.weighted_cache_hit_rate)}`,
      );
      bindPopTip(poolCachePill, {
        id: 'ag-pool-cache',
        title: '号池缓存效率',
        text: buildCacheTooltip({
          prefix: '号池加权缓存命中率',
          rate: ag.summary.weighted_cache_hit_rate,
          rate24h: ag.summary.weighted_cache_hit_rate_24h,
          savedCost: ag.summary.total_cache_saved_cost,
        }),
      });
      headLeft.appendChild(poolCachePill);
    }
  }
  head.appendChild(headLeft);

  const badgeWrap = el('div');
  const activeCount = ag.summary?.active_accounts ?? ag.accounts.length;
  const badgeHandle = mountBadge(badgeWrap, {
    label: ag.online ? `${activeCount} 号在线` : '离线',
    tone: ag.online ? (ag.status === 'degraded' ? 'warning' : 'success') : 'error',
  });
  disposers.push(() => badgeHandle.dispose());
  head.appendChild(badgeWrap);
  card.appendChild(head);

  if (!ag.online || !Array.isArray(ag.accounts) || ag.accounts.length === 0) {
    card.appendChild(el('div', 'pq-muted', ag.status_message || '暂无活跃 Antigravity 账号数据'));
    return card;
  }

  const acctList = el('div', 'pq-acct-list');
  for (const acct of ag.accounts) {
    acctList.appendChild(renderAgAccountBlock(acct, snapshot.generated_at_ms, disposers));
  }
  card.appendChild(acctList);

  return card;
};

// ---------- AIStudio Card (Active-First + Full-Health Fold Group) ----------

const renderAisModelRow = (model: PanelAIStudioModelSummary, compactFull = false): HTMLElement => {
  const rem = clampPercent(model.effective_percent);
  const exhausted = model.eligible_accounts > 0 && model.available_accounts === 0;
  const requestsOnly = isRequestsOnlyAisModel(model);
  const lv = healthLevelFor(rem, exhausted);

  const row = el(
    'div',
    `pq-model-row${lv === 'empty' ? ' is-empty' : ''}${compactFull ? ' is-full-compact' : ''}`,
  );

  const top = el('div', 'pq-model-top');
  top.appendChild(el('span', 'pq-model-name', model.label || model.id));

  const right = el('div', 'pq-model-right');
  if (exhausted) {
    right.appendChild(el('span', 'pq-pill pq-pill-empty', '已耗尽'));
  } else if (
    !compactFull
    && model.eligible_accounts > 0
    && (rem < 99.5 || (model.used_requests ?? 0) > 0 || (model.used_tokens ?? 0) > 0)
  ) {
    if (requestsOnly) {
      right.appendChild(el('span', 'pq-pill pq-pill-mode', '按次计额'));
    } else {
      const tokShort = isBottleneckTokens(model);
      right.appendChild(el(
        'span',
        `pq-pill ${tokShort ? 'pq-bottleneck-tok' : 'pq-bottleneck-req'}`,
        tokShort ? 'Token 短板' : '次数短板',
      ));
    }
  }
  right.appendChild(el('span', `pq-win-val pq-lv-${lv}`, formatPercent(rem)));
  top.appendChild(right);
  row.appendChild(top);

  const bar = el('div', `pq-bar-track${compactFull ? ' is-thin' : ''}${lv === 'empty' ? ' is-empty' : ''}`);
  const fill = el('div', `pq-bar-fill pq-bar-${lv}`);
  fill.style.width = `${rem}%`;
  bar.appendChild(fill);
  row.appendChild(bar);

  const sub = el('div', 'pq-win-sub');
  const acctText = model.cooling_accounts > 0
    ? `可用 ${model.available_accounts}/${model.eligible_accounts} 号 · ${model.cooling_accounts} 冷却`
    : `可用 ${model.available_accounts}/${model.eligible_accounts} 号`;
  sub.appendChild(el('span', 'pq-mono', acctText));
  const remText = requestsOnly
    ? ((model.used_tokens ?? 0) > 0
      ? `剩 ${model.effective_remaining_requests}次 · 已耗 ${formatTokens(model.used_tokens)} tok`
      : `剩 ${model.effective_remaining_requests}次`)
    : `剩 ${model.effective_remaining_requests}次 / ${formatTokens(model.effective_remaining_tokens)}`;
  sub.appendChild(el('span', 'pq-mono', remText));
  row.appendChild(sub);

  return row;
};

const renderAisCard = (snapshot: PanelBoardSnapshot, disposers: Array<() => void>): HTMLElement => {
  const card = el('div', 'pq-card');
  const ais = snapshot.aistudio;

  const head = el('div', 'pq-card-head');
  head.appendChild(el('h4', 'pq-card-title', 'AIStudio2API 号池'));

  const badgeWrap = el('div');
  const ready = ais.account_counts?.ready ?? 0;
  const enabled = ais.account_counts?.enabled ?? 0;
  const badgeHandle = mountBadge(badgeWrap, {
    label: ais.online ? `${ready}/${enabled} 号就绪` : '离线',
    tone: ais.online ? (ready === enabled ? 'success' : 'warning') : 'error',
  });
  disposers.push(() => badgeHandle.dispose());
  head.appendChild(badgeWrap);
  card.appendChild(head);

  if (!ais.online) {
    card.appendChild(el('div', 'pq-muted', ais.status_message || 'AIStudio2API 当前离线'));
    return card;
  }

  const meta = el('div', 'pq-ais-meta pq-mono');
  const pg = ais.playground;
  meta.appendChild(el('span', '', `Playground ${pg?.requests ?? 0}次`));
  if ((ais.next_reset_ms ?? 0) > 0) {
    const resetEl = el('span', '', `16:00 重置 · ${formatCountdown(ais.next_reset_ms)}`);
    resetEl.dataset.pqResetMs = String(ais.next_reset_ms);
    resetEl.dataset.pqResetPrefix = '16:00 重置 · ';
    meta.appendChild(resetEl);
  }
  card.appendChild(meta);

  const allModels = Array.isArray(ais.models) ? ais.models : [];
  if (allModels.length === 0) {
    card.appendChild(el('div', 'pq-muted', savingShowAis ? '加载模型配额中…' : '暂无模型配额数据'));
    return card;
  }

  // Partition into active/consumed models vs untouched 100% full-health models
  const activeModels: PanelAIStudioModelSummary[] = [];
  const fullModels: PanelAIStudioModelSummary[] = [];
  for (const model of allModels) {
    if (isActiveAisModel(model)) {
      activeModels.push(model);
    } else {
      fullModels.push(model);
    }
  }

  // Sort active models by lowest remaining / exhausted first
  activeModels.sort((a, b) => {
    const aZero = a.eligible_accounts > 0 && a.available_accounts === 0 ? 0 : 1;
    const bZero = b.eligible_accounts > 0 && b.available_accounts === 0 ? 0 : 1;
    if (aZero !== bZero) return aZero - bZero;
    return clampPercent(a.effective_percent) - clampPercent(b.effective_percent);
  });

  if (activeModels.length > 0) {
    const activeList = el('div', 'pq-model-list');
    for (const model of activeModels) {
      activeList.appendChild(renderAisModelRow(model, false));
    }
    card.appendChild(activeList);
  }

  if (fullModels.length > 0) {
    const group = el('div', 'pq-full-group');
    const toggleBtn = el('button', 'pq-full-toggle');
    toggleBtn.type = 'button';

    const left = el('span', 'pq-full-toggle-left');
    const dot = el('span', 'pq-fam-dot');
    dot.style.background = 'var(--pq-full-bar)';
    left.appendChild(dot);

    const labelSpan = el('span', 'pq-full-toggle-text');
    const buildToggleText = (expanded: boolean): string => (
      activeModels.length > 0
        ? `其余 ${fullModels.length} 个模型 100% 满血 · ${expanded ? '点击收起' : '点击展开'}`
        : `全部 ${fullModels.length} 个模型 100% 满血 · ${expanded ? '点击收起' : '点击展开'}`
    );
    labelSpan.textContent = buildToggleText(aisFullExpanded);
    left.appendChild(labelSpan);

    const chevron = el('span', `pq-chevron${aisFullExpanded ? ' is-open' : ''}`, '▾');
    toggleBtn.appendChild(left);
    toggleBtn.appendChild(chevron);
    toggleBtn.setAttribute('aria-expanded', String(aisFullExpanded));

    const fullList = el('div', 'pq-full-list');
    fullList.hidden = !aisFullExpanded;
    for (const model of fullModels) {
      fullList.appendChild(renderAisModelRow(model, true));
    }

    // In-place toggle: zero full re-render, zero scroll jump!
    toggleBtn.addEventListener('click', () => {
      aisFullExpanded = !aisFullExpanded;
      persistUiPrefs();
      fullList.hidden = !aisFullExpanded;
      labelSpan.textContent = buildToggleText(aisFullExpanded);
      chevron.classList.toggle('is-open', aisFullExpanded);
      toggleBtn.setAttribute('aria-expanded', String(aisFullExpanded));
    });

    group.appendChild(toggleBtn);
    group.appendChild(fullList);
    card.appendChild(group);
  }

  return card;
};

// ---------- Bottom Collapsible Connection & Display Settings Card ----------

const syncGearButtonState = (): void => {
  if (!gearBtnEl) return;
  gearBtnEl.setAttribute('aria-expanded', String(settingsExpanded));
};

const renderSettingsCardContent = (card: HTMLElement): void => {
  disposeList(settingsDisposers);
  settingsDisposers = [];
  showAisSwitchHandle = null;
  compactSwitchHandle = null;

  const hasPasscode = currentState?.config.hasPasscode === true;
  const showAis = currentState?.config.showAis ?? true;
  const compactQuota = currentState?.config.compactQuota ?? true;
  const url = currentState?.config.url ?? draftUrl;

  const frag = document.createDocumentFragment();

  const toggleBtn = el('button', 'pq-settings-toggle');
  toggleBtn.type = 'button';
  toggleBtn.setAttribute('aria-expanded', String(settingsExpanded));
  toggleBtn.appendChild(el('span', 'pq-card-title', '连接与显示设置'));
  const chevron = el('span', `pq-chevron${settingsExpanded ? ' is-open' : ''}`, '▾');
  toggleBtn.appendChild(chevron);
  toggleBtn.addEventListener('click', () => {
    settingsExpanded = !settingsExpanded;
    syncGearButtonState();
    renderSettingsCardContent(card);
  });
  frag.appendChild(toggleBtn);

  if (!settingsExpanded) {
    const parts = [
      showAis ? 'AIS 显示' : 'AIS 隐藏',
      compactQuota ? '紧凑文案' : '详细文案',
      urlHostLabel(url),
      hasPasscode ? '已设口令' : '无口令',
    ];
    frag.appendChild(el('div', 'pq-settings-summary pq-mono', parts.join(' · ')));
    card.replaceChildren(frag);
    return;
  }

  const body = el('div', 'pq-settings-body');

  // Section 1: Display Preferences (moved down from top to free first screen!)
  const displayGroup = el('div', 'pq-settings-group');
  displayGroup.appendChild(el('div', 'pq-settings-section-label', '显示偏好'));

  const showAisRoot = el('div');
  showAisSwitchHandle = mountSwitch(showAisRoot, {
    label: '显示 AIStudio 号池',
    description: '同时控制顶栏/Usage 总卡、Work Status 与本面板是否展示 AIS 模型余量',
    checked: showAis,
    disabled: savingShowAis,
    onChange: (checked) => void toggleShowAis(checked),
  });
  settingsDisposers.push(() => showAisSwitchHandle?.dispose());
  displayGroup.appendChild(showAisRoot);

  const compactRoot = el('div');
  compactSwitchHandle = mountSwitch(compactRoot, {
    label: '紧凑配额文案（适配手机端）',
    description: '精简手机端浮层与 Usage 总卡文案避免窄屏叠字；本面板始终展示完整数据',
    checked: compactQuota,
    disabled: savingCompact,
    onChange: (checked) => void toggleCompactQuota(checked),
  });
  settingsDisposers.push(() => compactSwitchHandle?.dispose());
  displayGroup.appendChild(compactRoot);

  body.appendChild(displayGroup);

  // Section 2: Board Connection
  const connGroup = el('div', 'pq-settings-group');
  connGroup.appendChild(el('div', 'pq-settings-section-label', '看板连接'));

  const urlRoot = el('div');
  const urlField = mountTextField(urlRoot, {
    label: '看板地址 URL',
    value: draftUrl,
    placeholder: 'http://127.0.0.1:18380 或 https://your-board.example.com',
    mono: true,
    onChange: (value) => {
      draftUrl = value;
      draftDirty = true;
      urlField.update({ value });
    },
  });
  settingsDisposers.push(() => urlField.dispose());
  connGroup.appendChild(urlRoot);

  const passRoot = el('div');
  const passField = mountTextField(passRoot, {
    label: '访问口令 (X-View-Passcode)',
    value: draftPasscode,
    password: true,
    placeholder: hasPasscode ? '已保存口令（留空保存将保持原口令不变）' : '若看板未设口令可留空',
    helper: '仅写入本机 0600 配置文件，不会回显给前端或暴露给对话上下文。',
    onChange: (value) => {
      draftPasscode = value;
      passField.update({ value });
    },
  });
  settingsDisposers.push(() => passField.dispose());
  connGroup.appendChild(passRoot);

  if (settingsFeedback) {
    const fbRoot = el('div');
    const fbHandle = mountBanner(fbRoot, {
      tone: settingsFeedback.tone,
      title: settingsFeedback.text,
    });
    settingsDisposers.push(() => fbHandle.dispose());
    connGroup.appendChild(fbRoot);
  }

  const actions = el('div', 'pq-settings-actions');
  const saveRoot = el('div');
  const saveHandle = mountButton(saveRoot, {
    label: saving ? '测试中...' : '测试并保存',
    size: 'sm',
    loading: saving,
    disabled: saving,
    onClick: () => void testAndSaveSettings(false),
  });
  settingsDisposers.push(() => saveHandle.dispose());
  actions.appendChild(saveRoot);

  if (hasPasscode) {
    const clearRoot = el('div');
    const clearHandle = mountButton(clearRoot, {
      label: '清空口令',
      variant: 'outline',
      size: 'sm',
      disabled: saving,
      onClick: () => void testAndSaveSettings(true),
    });
    settingsDisposers.push(() => clearHandle.dispose());
    actions.appendChild(clearRoot);
  }

  connGroup.appendChild(actions);
  body.appendChild(connGroup);
  frag.appendChild(body);
  card.replaceChildren(frag);
};

// ---------- Actions ----------

const refreshLiveTimeElements = (fetchedAtMs: number): void => {
  if (footerTimeEl && footerTimeEl.isConnected) {
    footerTimeEl.textContent = `更新于 ${new Date(fetchedAtMs).toLocaleTimeString()}`;
  }
  const nowMs = Date.now();
  const resetNodes = root.querySelectorAll<HTMLElement>('[data-pq-reset-ms]');
  for (const node of resetNodes) {
    const ms = Number(node.dataset.pqResetMs);
    if (Number.isFinite(ms) && ms > 0) {
      const prefix = node.dataset.pqResetPrefix ?? '';
      node.textContent = `${prefix}${formatCountdown(ms, nowMs)}`;
    }
  }
  const obsNodes = root.querySelectorAll<HTMLElement>('[data-pq-observed-ms]');
  for (const node of obsNodes) {
    const ms = Number(node.dataset.pqObservedMs);
    const text = formatSampleFreshness(ms, nowMs);
    if (text) {
      node.textContent = text;
    }
  }
  popTip.reposition();
};

const refreshAdditionalAccountHistories = (snapshot: PanelBoardSnapshot, force: boolean): void => {
  const accounts = snapshot.antigravity?.accounts ?? [];
  for (let i = 1; i < accounts.length; i += 1) {
    const acct = accounts[i]!;
    if (!acct.has_history) continue;
    const win = getAccountWindow(acct.id);
    const key = historyKey(acct.id, win);
    const cached = historyCache.get(key);
    if (!force && cached && Date.now() - cached.fetchedAtMs < HISTORY_FRESH_MS) continue;
    if (historyInFlight.has(key)) continue;
    historyInFlight.add(key);
    void callService<PanelHistoryResponse>('GET', '/panel/history', {
      query: {
        account: acct.id,
        window: win,
        range: win === '7d' ? '7d' : '24h',
        ...(cached?.hrev ? { hrev: cached.hrev } : {}),
        ...(force ? { refresh: '1', force: '1' } : {}),
      },
    })
      .then((res) => {
        if ('unchanged' in res && res.unchanged === true) {
          if (!cached) return;
          const synced = syncHistoryEstimatedPointsFromSnapshot(cached.data, snapshot);
          cacheHistory(synced, res.hrev || cached.hrev, Date.now());
          const body = document.querySelector<HTMLElement>(`[data-pq-chart-body="${CSS.escape(acct.id)}"]`);
          if (body && getAccountWindow(acct.id) === win) {
            swapChartBodyNode(body, buildHistorySvg(synced, win, acct, activeChartClearers));
          }
          return;
        }
        cacheHistory(res, res.hrev, Date.now());
        const body = document.querySelector<HTMLElement>(`[data-pq-chart-body="${CSS.escape(acct.id)}"]`);
        if (body && getAccountWindow(acct.id) === win) {
          swapChartBodyNode(body, buildHistorySvg(res, win, acct, activeChartClearers));
        }
      })
      .catch(() => {
        // ignore silent background refresh failures
      })
      .finally(() => {
        historyInFlight.delete(key);
      });
  }
};

const loadState = async (force = false, silent = false): Promise<void> => {
  if (loading) return;
  loading = true;

  if (!currentState) {
    render();
  } else if (!silent) {
    refreshBtnHandle?.update({ loading: true });
  }

  const primaryAccountId = currentState?.snapshot?.antigravity?.accounts?.[0]?.id;
  const primaryWin: HistoryWindowKind = primaryAccountId ? getAccountWindow(primaryAccountId) : '5h';
  const primaryHistKey = primaryAccountId ? historyKey(primaryAccountId, primaryWin) : null;
  const cachedPrimaryHist = primaryHistKey ? historyCache.get(primaryHistKey) : undefined;
  const canNegotiateDelta = Boolean(currentState?.snapshot && !currentState.error && currentRev);

  try {
    const state = await callService<PanelStateResponse>('GET', '/panel/state', {
      query: {
        ...(force ? { refresh: '1', force: '1' } : {}),
        window: primaryWin,
        range: primaryWin === '7d' ? '7d' : '24h',
        ...(canNegotiateDelta && currentRev ? { rev: currentRev } : {}),
        ...(canNegotiateDelta && cachedPrimaryHist?.hrev ? { hrev: cachedPrimaryHist.hrev } : {}),
      },
    });

    if ('unchanged' in state && state.unchanged === true) {
      currentRev = state.rev || currentRev;
      lastFetchedAtMs = state.fetchedAtMs || Date.now();
      if (currentState) {
        currentState.fetchedAtMs = lastFetchedAtMs;
        if (currentState.snapshot && state.generatedAtMs > 0) {
          currentState.snapshot.generated_at_ms = state.generatedAtMs;
        }
      }
      if (cachedPrimaryHist && primaryHistKey) {
        historyCache.set(primaryHistKey, {
          data: cachedPrimaryHist.data,
          hrev: state.hrev || cachedPrimaryHist.hrev,
          fetchedAtMs: lastFetchedAtMs,
        });
      }
      refreshLiveTimeElements(lastFetchedAtMs);
      if (currentState?.snapshot) {
        refreshAdditionalAccountHistories(currentState.snapshot, force);
      }
      return;
    }

    const fetchedAtMs = state.fetchedAtMs || Date.now();
    if (state.error) {
      currentRev = null;
    } else {
      currentRev = state.rev ?? null;
      lastFetchedAtMs = fetchedAtMs;
    }

    if (state.historyUnchanged && state.snapshot) {
      syncCachedHistoriesFromSnapshot(state.snapshot, fetchedAtMs);
      const nextPrimaryId = state.snapshot.antigravity?.accounts?.[0]?.id;
      const nextPrimaryWin: HistoryWindowKind = nextPrimaryId ? getAccountWindow(nextPrimaryId) : primaryWin;
      const nextPrimaryKey = nextPrimaryId ? historyKey(nextPrimaryId, nextPrimaryWin) : primaryHistKey;
      const updatedPrimary = nextPrimaryKey ? historyCache.get(nextPrimaryKey) : undefined;
      if (updatedPrimary && nextPrimaryKey) {
        historyCache.set(nextPrimaryKey, {
          data: updatedPrimary.data,
          hrev: state.hrev || updatedPrimary.hrev,
          fetchedAtMs,
        });
      }
      currentState = {
        ...state,
        history: updatedPrimary?.data ?? currentState?.history ?? null,
      };
    } else {
      currentState = state;
      const receivedHistKey = state.history?.account_id
        ? historyKey(state.history.account_id, state.history.window === '7d' ? '7d' : '5h')
        : undefined;
      if (state.history) {
        cacheHistory(state.history, state.hrev, fetchedAtMs);
      }
      if (state.snapshot) {
        syncCachedHistoriesFromSnapshot(state.snapshot, fetchedAtMs, receivedHistKey);
      }
    }

    if (!draftDirty) {
      draftUrl = state.config.url;
    }
    if (state.errorCode === 'unauthorized' || state.errorCode === 'unreachable') {
      settingsExpanded = true;
    }
    render();
    if (state.snapshot) {
      refreshAdditionalAccountHistories(state.snapshot, force);
    }
  } catch (err) {
    currentRev = null;
    const msg = err instanceof HostRequestError && err.code === 'NO_SERVICE'
      ? '请先在 Settings → Extensions 中批准本扩展的本地服务权限。'
      : (err instanceof Error ? err.message : String(err));
    currentState = {
      config: currentState?.config ?? { url: draftUrl, hasPasscode: false, showAis: true, compactQuota: true },
      snapshot: currentState?.snapshot ?? null,
      history: currentState?.history ?? null,
      error: msg,
      errorCode: 'unreachable',
      fetchedAtMs: Date.now(),
    };
    settingsExpanded = true;
    render();
  } finally {
    loading = false;
    refreshBtnHandle?.update({ loading: false });
  }
};

const toggleShowAis = async (next: boolean): Promise<void> => {
  if (savingShowAis) return;
  savingShowAis = true;
  const prev = currentState?.config.showAis ?? true;
  showAisSwitchHandle?.update({ checked: next, disabled: true });
  if (currentState) {
    currentState = { ...currentState, config: { ...currentState.config, showAis: next } };
    render();
  }
  try {
    const updated = await callService<PanelStateDataResponse>('POST', '/panel/config', {
      body: { showAis: next },
    });
    currentState = updated;
    currentRev = updated.error ? null : (updated.rev ?? null);
    if (!updated.error) {
      lastFetchedAtMs = updated.fetchedAtMs || Date.now();
    }
    cacheHistory(updated.history, updated.hrev, updated.fetchedAtMs || Date.now());
    void host.toast({
      kind: 'success',
      message: next
        ? '已开启 AIStudio 号池显示（Usage 与顶栏刷新后同步）'
        : '已隐藏 AIStudio 号池（Usage 与顶栏刷新后同步）',
    });
  } catch (err) {
    if (currentState) {
      currentState = { ...currentState, config: { ...currentState.config, showAis: prev } };
    }
    void host.toast({
      kind: 'error',
      message: err instanceof Error ? err.message : '切换失败',
    });
  } finally {
    savingShowAis = false;
    render();
  }
};

const toggleCompactQuota = async (next: boolean): Promise<void> => {
  if (savingCompact) return;
  savingCompact = true;
  const prev = currentState?.config.compactQuota ?? true;
  compactSwitchHandle?.update({ checked: next, disabled: true });
  if (currentState) {
    currentState = { ...currentState, config: { ...currentState.config, compactQuota: next } };
  }
  try {
    const updated = await callService<PanelStateDataResponse>('POST', '/panel/config', {
      body: { compactQuota: next },
    });
    currentState = updated;
    currentRev = updated.error ? null : (updated.rev ?? null);
    if (!updated.error) {
      lastFetchedAtMs = updated.fetchedAtMs || Date.now();
    }
    cacheHistory(updated.history, updated.hrev, updated.fetchedAtMs || Date.now());
    void host.toast({
      kind: 'success',
      message: next
        ? '已开启紧凑配额文案（适配手机端，Usage 刷新后同步）'
        : '已切换为详细配额文案（Usage 刷新后同步）',
    });
  } catch (err) {
    if (currentState) {
      currentState = { ...currentState, config: { ...currentState.config, compactQuota: prev } };
    }
    void host.toast({
      kind: 'error',
      message: err instanceof Error ? err.message : '切换失败',
    });
  } finally {
    savingCompact = false;
    compactSwitchHandle?.update({ checked: currentState?.config.compactQuota ?? prev, disabled: false });
  }
};

const testAndSaveSettings = async (clearPasscode = false): Promise<void> => {
  saving = true;
  settingsFeedback = { tone: 'info', text: '正在测试连接...' };
  if (settingsCardEl) renderSettingsCardContent(settingsCardEl);
  try {
    const res = await callService<{ ok: boolean; summary?: string; message?: string }>('POST', '/panel/test', {
      body: {
        url: draftUrl.trim() || 'http://127.0.0.1:18380',
        ...(draftPasscode ? { passcode: draftPasscode } : {}),
        ...(clearPasscode ? { clearPasscode: true } : {}),
        showAis: currentState?.config.showAis ?? true,
        compactQuota: currentState?.config.compactQuota ?? true,
        save: true,
      },
    });
    if (!res.ok) {
      settingsFeedback = { tone: 'error', text: res.message || '连接测试失败' };
      void host.toast({ kind: 'error', message: res.message || '连接测试失败' });
      return;
    }
    draftPasscode = '';
    draftDirty = false;
    currentRev = null;
    historyCache.clear();
    settingsFeedback = { tone: 'success', text: res.summary || '连接成功并已保存' };
    void host.toast({ kind: 'success', message: res.summary || '配置已保存' });
    resetAutoRefreshTimer();
    await loadState(true, false);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    settingsFeedback = { tone: 'error', text: msg };
    void host.toast({ kind: 'error', message: msg });
  } finally {
    saving = false;
    if (settingsCardEl) {
      renderSettingsCardContent(settingsCardEl);
    } else {
      render();
    }
  }
};

// ---------- Main Atomic Render (Zero Scroll Jump) ----------

const render = (): void => {
  const savedScroll = captureScroll();
  if (savedScroll.prevHeight > 0) {
    root.style.minHeight = `${Math.ceil(savedScroll.prevHeight)}px`;
  }

  const nextDisposers: Array<() => void> = [];
  const nextClearers = new Set<() => void>();
  const oldClearers = activeChartClearers;
  activeChartClearers = nextClearers;
  activeScrubCount = 0;

  const wrap = el('div', 'pq-wrap');
  const showAis = currentState?.config.showAis ?? true;

  // Compact Top Header Bar (golden first screen immediately below!)
  const header = el('div', 'pq-header');
  const brand = el('div', 'pq-brand');
  brand.appendChild(el('h3', 'pq-title', 'Pool Quota'));

  if (loading && !currentState) {
    const spinRoot = el('div');
    const spin = mountSpinner(spinRoot, { size: 'sm' });
    nextDisposers.push(() => spin.dispose());
    brand.appendChild(spinRoot);
  } else if (currentState?.snapshot) {
    const dots = el('div', 'pq-pool-dots');
    const ag = currentState.snapshot.antigravity;
    const ais = currentState.snapshot.aistudio;

    const agCls = !ag.online ? 'is-err' : ag.status === 'degraded' ? 'is-warn' : 'is-ok';
    const agChip = el('span', `pq-dot-chip ${agCls}`);
    agChip.appendChild(el('span', 'pq-dot'));
    agChip.appendChild(document.createTextNode('AG'));
    dots.appendChild(agChip);

    if (showAis) {
      const aisReady = ais.account_counts?.ready ?? 0;
      const aisEnabled = ais.account_counts?.enabled ?? 0;
      const aisCls = !ais.online ? 'is-err' : aisReady < aisEnabled ? 'is-warn' : 'is-ok';
      const aisChip = el('span', `pq-dot-chip ${aisCls}`);
      aisChip.appendChild(el('span', 'pq-dot'));
      aisChip.appendChild(document.createTextNode('AIS'));
      dots.appendChild(aisChip);
    }
    brand.appendChild(dots);
  }
  header.appendChild(brand);

  const actions = el('div', 'pq-actions');
  const refreshRoot = el('div');
  const nextRefreshBtn = mountButton(refreshRoot, {
    label: '刷新',
    variant: 'outline',
    size: 'xs',
    loading,
    onClick: () => {
      resetAutoRefreshTimer();
      void loadState(true, false);
    },
  });
  nextDisposers.push(() => nextRefreshBtn.dispose());
  actions.appendChild(refreshRoot);

  if (currentState?.config.url) {
    const openRoot = el('div');
    const openBtn = mountButton(openRoot, {
      label: '看板',
      variant: 'ghost',
      size: 'xs',
      onClick: () => {
        if (currentState?.config.url) {
          void host.openUrl(currentState.config.url);
        }
      },
    });
    nextDisposers.push(() => openBtn.dispose());
    actions.appendChild(openRoot);
  }

  const nextGearBtn = el('button', 'pq-icon-btn');
  nextGearBtn.type = 'button';
  nextGearBtn.title = '连接与显示设置';
  nextGearBtn.setAttribute('aria-label', '连接与显示设置');
  nextGearBtn.setAttribute('aria-expanded', String(settingsExpanded));
  nextGearBtn.appendChild(createGearIcon());
  nextGearBtn.addEventListener('click', () => {
    settingsExpanded = !settingsExpanded;
    syncGearButtonState();
    if (settingsCardEl) {
      renderSettingsCardContent(settingsCardEl);
      if (settingsExpanded) {
        requestAnimationFrame(() => {
          settingsCardEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }
    }
  });
  actions.appendChild(nextGearBtn);

  header.appendChild(actions);
  wrap.appendChild(header);

  // Error banner (when needed)
  if (currentState?.error) {
    const errRoot = el('div');
    const errBanner = mountBanner(errRoot, {
      tone: currentState.errorCode === 'unauthorized' ? 'warning' : 'error',
      title: currentState.errorCode === 'unauthorized' ? '需要访问口令' : '看板连接异常',
      body: currentState.error,
    });
    nextDisposers.push(() => errBanner.dispose());
    wrap.appendChild(errRoot);
  }

  // Primary Quota Pool Cards — First-screen center stage!
  if (currentState?.snapshot) {
    wrap.appendChild(renderAgCard(currentState.snapshot, nextDisposers));

    if (showAis) {
      wrap.appendChild(renderAisCard(currentState.snapshot, nextDisposers));
    }
  } else if (!loading && !currentState?.error) {
    const emptyRoot = el('div');
    const emptyHandle = mountEmpty(emptyRoot, {
      title: '尚未读取到号池数据',
      body: '请在下方「连接与显示设置」中填写看板地址与访问口令后点击测试并保存。',
      action: { label: '重试', onClick: () => void loadState(true, false) },
    });
    nextDisposers.push(() => emptyHandle.dispose());
    wrap.appendChild(emptyRoot);
  }

  // Bottom Collapsible Settings Card (holds low-frequency display switches + URL/Passcode)
  const nextSettingsCard = el('div', 'pq-card');
  wrap.appendChild(nextSettingsCard);

  let nextFooterTimeEl: HTMLElement | null = null;
  if (currentState?.fetchedAtMs) {
    const t = new Date(currentState.fetchedAtMs).toLocaleTimeString();
    const footer = el('div', 'pq-footer-note pq-mono');
    nextFooterTimeEl = el('span', '', `更新于 ${t}`);
    footer.appendChild(nextFooterTimeEl);
    footer.appendChild(el('span', '', 'Settings → Usage 可置顶总卡'));
    wrap.appendChild(footer);
  }

  // Dispose previous handles & swap DOM atomically without zero-height collapse
  const prevDisposers = activeDisposers;
  activeDisposers = nextDisposers;
  refreshBtnHandle = nextRefreshBtn;
  gearBtnEl = nextGearBtn;
  settingsCardEl = nextSettingsCard;
  footerTimeEl = nextFooterTimeEl;

  disposeList(prevDisposers);
  oldClearers.clear();
  renderSettingsCardContent(nextSettingsCard);
  popTip.markRenderSyncing();
  root.replaceChildren(wrap);

  restoreScroll(savedScroll);
  popTip.syncAfterRender(root);
};

// ---------- Silent Visibility-Aware Auto-Refresh ----------

const canSilentAutoRefresh = (): boolean => {
  if (visibilityTracker) {
    if (!visibilityTracker.isVisible()) return false;
  } else if (document.visibilityState !== 'visible' || window.innerWidth <= 0 || window.innerHeight <= 0) {
    return false;
  }
  if (loading || saving || draftDirty || activeScrubCount > 0) return false;
  const activeTag = document.activeElement?.tagName;
  if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return false;
  return true;
};

const resetAutoRefreshTimer = (): void => {
  if (autoRefreshTimer !== null) {
    window.clearInterval(autoRefreshTimer);
  }
  autoRefreshTimer = window.setInterval(() => {
    if (!canSilentAutoRefresh()) return;
    void loadState(false, true);
  }, AUTO_REFRESH_MS);
};

const startSilentAutoRefresh = (): void => {
  if (!visibilityTracker) {
    visibilityTracker = createPanelVisibilityTracker({
      onBecomeVisible: () => {
        if (!canSilentAutoRefresh()) return;
        const hasSuccess = Boolean(currentState?.snapshot && !currentState.error);
        const elapsed = Date.now() - lastFetchedAtMs;
        if (!hasSuccess || elapsed >= AUTO_REFRESH_MS) {
          resetAutoRefreshTimer();
          void loadState(false, hasSuccess);
        }
      },
      onBecomeHidden: () => {
        popTip.hide();
      },
    });
  }
  if (autoRefreshTimer === null) {
    resetAutoRefreshTimer();
  }
};

// ---------- Bootstrap ----------

injectStyles();
host.onReady((ctx) => {
  applyHostReady(ctx, document.documentElement);
  if (mounted) return;
  mounted = true;
  render();
  void loadUiPrefs();
  startSilentAutoRefresh();
  if (!visibilityTracker || visibilityTracker.isVisible()) {
    void loadState(false, false);
  }
});
