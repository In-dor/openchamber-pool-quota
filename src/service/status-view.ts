import {
  GUEST_STATUS_VIEW_CHART_POINTS_MAX,
  GUEST_STATUS_VIEW_NOTE_MAX,
  GUEST_STATUS_VIEW_ROWS_MAX,
  type GuestStatusRow,
  type GuestStatusView,
} from '@openchamber/sdk';
import {
  clampPercent,
  forecastLabelFor,
  formatCountdown,
  formatPercent,
  formatSampleFreshness,
  formatTokens,
  formatUsd,
  toneForRemaining,
  truncate,
} from '../shared/format.ts';
import type {
  AIStudioModelSummary,
  AntigravityHistoryResponse,
  AntigravityWindow,
  BoardSnapshot,
  PoolQuotaConfig,
} from '../shared/types.ts';

const WINDOW_ORDER = ['gemini_5h', 'gemini_weekly', 'claude_5h', 'claude_weekly'];
const CORE_AIS_MODELS = ['gemini-4-carbon', 'gemini-4-neon', 'gemini-4-argon', 'gemini-4-hydrogen'];

const toKebabId = (raw: string, fallback: string): string => {
  const cleaned = raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 36);
  return cleaned || fallback;
};

const shortAgLabel = (win: AntigravityWindow): string => {
  switch (win.key) {
    case 'gemini_5h': return 'AG Gemini 5h';
    case 'gemini_weekly': return 'AG Gemini 7d';
    case 'claude_5h': return 'AG Claude 5h';
    case 'claude_weekly': return 'AG Claude 7d';
    default: return truncate(win.label || win.key, 40);
  }
};

const shortModelLabel = (model: AIStudioModelSummary): string => {
  const map: Record<string, string> = {
    'gemini-4-carbon': 'AIS Carbon',
    'gemini-4-neon': 'AIS Neon',
    'gemini-4-argon': 'AIS Argon',
    'gemini-4-hydrogen': 'AIS Hydrogen',
    'gemini-3.1-pro-preview': 'AIS 3.1 Pro',
    'gemini-3.8-flash': 'AIS 3.8 Flash',
  };
  return map[model.id] ?? truncate(`AIS ${model.label || model.id}`, 40);
};

export const buildStatusErrorView = (
  cfg: PoolQuotaConfig,
  errorMessage: string,
  errorCode: string | null,
): GuestStatusView => ({
  rows: [
    {
      kind: 'line',
      id: 'pool-ais-toggle',
      label: '显示 AIS 号池',
      dot: 'warning',
      value: cfg.showAis ? '开启' : '关闭',
      actions: [
        {
          kind: 'switch',
          id: 'toggle-ais',
          label: '显示 AIS 号池',
          checked: cfg.showAis,
        },
      ],
    },
    {
      kind: 'note',
      id: 'pool-error',
      text: truncate(errorMessage, GUEST_STATUS_VIEW_NOTE_MAX),
      tone: errorCode === 'unauthorized' ? 'warning' : 'error',
    },
  ],
  controls: [
    { kind: 'button', id: 'refresh', label: '刷新' },
  ],
});

export const buildStatusView = (
  snapshot: BoardSnapshot,
  history: AntigravityHistoryResponse | null,
  cfg: PoolQuotaConfig,
): GuestStatusView => {
  const rows: GuestStatusRow[] = [];
  const alerts: string[] = [];

  const pushRow = (row: GuestStatusRow): void => {
    if (rows.length < GUEST_STATUS_VIEW_ROWS_MAX) {
      rows.push(row);
    }
  };

  // Row 1: Inline AIS Pool toggle switch + board link chip
  const agOnline = snapshot.antigravity?.online === true;
  const aisOnline = snapshot.aistudio?.online === true;
  const aisReady = snapshot.aistudio?.account_counts?.ready ?? 0;
  const aisEnabled = snapshot.aistudio?.account_counts?.enabled ?? 0;

  pushRow({
    kind: 'line',
    id: 'pool-controls',
    label: 'AIS 号池',
    dot: agOnline && (!cfg.showAis || aisOnline) ? 'success' : 'warning',
    value: cfg.showAis ? `${aisReady}/${aisEnabled}号就绪` : '已隐藏',
    valueTone: cfg.showAis ? 'default' : 'muted',
    actions: [
      {
        kind: 'switch',
        id: 'toggle-ais',
        label: '显示 AIS 号池',
        checked: cfg.showAis,
      },
    ],
  });

  // Rows 2..5: Antigravity primary 4 windows
  const agAccounts = snapshot.antigravity?.accounts ?? [];
  const primaryAccount = agAccounts[0];
  if (primaryAccount && primaryAccount.windows.length > 0) {
    const sorted = [...primaryAccount.windows].sort((a, b) => {
      const ia = WINDOW_ORDER.indexOf(a.key);
      const ib = WINDOW_ORDER.indexOf(b.key);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    for (const win of sorted.slice(0, 4)) {
      const rem = clampPercent(win.remaining_percent);
      const tone = toneForRemaining(rem);
      const costPart = win.has_current_usage && win.current_cost > 0
        ? (win.has_forecast && win.forecast_cost > 0
          ? ` · ${formatUsd(win.current_cost)}/${forecastLabelFor(win.forecast_basis, true)}${formatUsd(win.forecast_cost)}`
          : ` · ${formatUsd(win.current_cost)}`)
        : '';
      const resetPart = win.reset_at_ms > 0 ? ` · ${formatCountdown(win.reset_at_ms)}` : '';
      const estRem = typeof win.estimated_remaining_percent === 'number' && Number.isFinite(win.estimated_remaining_percent)
        ? clampPercent(win.estimated_remaining_percent)
        : null;
      const showEst = estRem !== null && (rem - estRem) >= 0.25;
      const freshness = formatSampleFreshness(win.observed_at_ms);
      const tooltipParts = [
        `${win.label}: 剩余 ${formatPercent(rem)}`,
        showEst ? `实时估算 ~${estRem.toFixed(1)}%` : '',
        freshness ?? '',
        win.has_current_usage ? `本轮已用 ${formatUsd(win.current_cost)} (${win.current_requests}次)` : '本轮暂无消耗',
        win.has_forecast && win.forecast_cost > 0
          ? `${forecastLabelFor(win.forecast_basis, false)} ${formatUsd(win.forecast_cost)}`
          : '',
        win.reset_at_ms > 0 ? `重置倒计时 ${formatCountdown(win.reset_at_ms)}` : '',
      ].filter(Boolean);

      pushRow({
        kind: 'line',
        id: `ag-${toKebabId(win.key, 'win')}`,
        label: shortAgLabel(win),
        content: { kind: 'bar', value: rem, tone },
        value: truncate(`${formatPercent(rem)}${costPart}${resetPart}`, 80),
        valueTone: tone === 'success' ? 'default' : tone,
        tooltip: truncate(tooltipParts.join(' · '), 200),
      });

      if (rem < 20) {
        alerts.push(`${win.label} 仅剩 ${formatPercent(rem)}`);
      }
    }
  } else if (!agOnline) {
    alerts.push('Antigravity 号池当前离线');
  }

  // Row 6: Gemini 5h 24h remaining trend sparkline (from /api/antigravity/history)
  const geminiSeries = history?.series?.find((s) => s.key === 'gemini_5h' && s.points.length >= 2)
    ?? history?.series?.find((s) => s.points.length >= 2);
  if (geminiSeries) {
    const rawVals = geminiSeries.points.map((pt) => clampPercent(pt[1]));
    const vals = rawVals.slice(-GUEST_STATUS_VIEW_CHART_POINTS_MAX);
    const step = history?.sample_step_sec && history.sample_step_sec > 0 && history.sample_step_sec <= 3600
      ? history.sample_step_sec
      : 900;
    const latest = vals[vals.length - 1] ?? 0;
    pushRow({
      kind: 'line',
      id: 'ag-trend-24h',
      label: '24h 剩余趋势',
      content: {
        kind: 'chart',
        values: vals,
        max: 100,
        tone: toneForRemaining(latest) === 'success' ? 'accent' : toneForRemaining(latest),
        unit: 'percent',
        step,
      },
      value: `${geminiSeries.label} ${formatPercent(latest)}`,
      tooltip: truncate(`${geminiSeries.label} 近 24 小时剩余额度曲线（共 ${vals.length} 个采样点）`, 200),
    });
  }

  // Rows 7..12: AIStudio core models (only when showAis === true)
  if (cfg.showAis) {
    if (aisOnline) {
      const allModels = snapshot.aistudio?.models ?? [];
      // Show core 4 models first, plus any other model that is low (<50%) or exhausted
      const picked: AIStudioModelSummary[] = [];
      const seen = new Set<string>();
      for (const id of CORE_AIS_MODELS) {
        const m = allModels.find((item) => item.id === id);
        if (m) {
          picked.push(m);
          seen.add(m.id);
        }
      }
      for (const m of allModels) {
        if (seen.has(m.id)) continue;
        if (m.available_accounts === 0 || m.effective_percent < 50) {
          picked.push(m);
          seen.add(m.id);
        }
      }

      const maxAisRows = Math.max(0, GUEST_STATUS_VIEW_ROWS_MAX - rows.length - 2);
      for (const model of picked.slice(0, maxAisRows)) {
        const rem = clampPercent(model.effective_percent);
        const tone = model.available_accounts === 0 ? 'error' : toneForRemaining(rem);
        pushRow({
          kind: 'line',
          id: `ais-${toKebabId(model.id, 'model')}`,
          label: shortModelLabel(model),
          content: { kind: 'bar', value: rem, tone },
          value: truncate(
            `${model.available_accounts}/${model.eligible_accounts}号 · ${formatPercent(rem)}`,
            80,
          ),
          valueTone: tone === 'success' ? 'default' : tone,
          tooltip: truncate(
            `${model.label}: 可用 ${model.available_accounts}/${model.eligible_accounts} 号 · 剩 ${model.effective_remaining_requests}次 / ${formatTokens(model.effective_remaining_tokens)} tok · 重置 ${formatCountdown(snapshot.aistudio.next_reset_ms)}`,
            200,
          ),
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
          kind: 'line',
          id: 'ais-reset',
          label: 'AIS 每日重置',
          content: {
            kind: 'chips',
            chips: [
              { id: 'ais-reset-chip', label: `16:00 · ${formatCountdown(snapshot.aistudio.next_reset_ms)}`, tone: 'info' },
              { id: 'board-link', label: '打开看板', tone: 'accent', url: cfg.url },
            ],
          },
        });
      }
    } else {
      alerts.push('AIStudio2API 号池当前离线');
    }
  } else if (rows.length < GUEST_STATUS_VIEW_ROWS_MAX - (alerts.length > 0 ? 1 : 0)) {
    pushRow({
      kind: 'line',
      id: 'board-shortcut',
      label: '完整看板',
      content: {
        kind: 'chips',
        chips: [{ id: 'board-link', label: '打开 Pool Status Board', tone: 'accent', url: cfg.url }],
      },
    });
  }

  if (alerts.length > 0) {
    pushRow({
      kind: 'note',
      id: 'quota-alert',
      text: truncate(`预警：${alerts.join('；')}`, GUEST_STATUS_VIEW_NOTE_MAX),
      tone: alerts.some((a) => a.includes('归零') || a.includes('离线')) ? 'error' : 'warning',
    });
  }

  return {
    rows,
    controls: [
      { kind: 'button', id: 'refresh', label: '刷新' },
    ],
  };
};
