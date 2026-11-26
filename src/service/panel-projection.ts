import crypto from 'node:crypto';
import type {
  AntigravityAccountHistory,
  AntigravityHistoryResponse,
  BoardSnapshot,
  PanelAIStudioPool,
  PanelAntigravityAccount,
  PanelAntigravityAccountHistory,
  PanelAntigravityHistoryResponse,
  PanelAntigravityWindow,
  PanelBoardSnapshot,
  PanelHistoryResponse,
  PanelHistorySeries,
  PanelStateResponse,
  PoolQuotaConfig,
  PublicPoolQuotaConfig,
} from '../shared/types.ts';

const shortHash = (payload: unknown): string => (
  crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0, 12)
);

const isFiniteNumber = (value: unknown): value is number => (
  typeof value === 'number' && Number.isFinite(value)
);

const isPositiveFinite = (value: unknown): value is number => (
  typeof value === 'number' && Number.isFinite(value) && value > 0
);

const projectAccountHistory = (
  h: AntigravityAccountHistory | undefined,
): PanelAntigravityAccountHistory | undefined => {
  if (!h) return undefined;

  const cacheFields: Pick<
    PanelAntigravityAccountHistory,
    'cache_hit_rate' | 'cache_hit_rate_24h' | 'cache_saved_cost'
  > = {
    ...(isFiniteNumber(h.cache_hit_rate) ? { cache_hit_rate: h.cache_hit_rate } : {}),
    ...(isFiniteNumber(h.cache_hit_rate_24h) ? { cache_hit_rate_24h: h.cache_hit_rate_24h } : {}),
    ...(isPositiveFinite(h.cache_saved_cost) ? { cache_saved_cost: h.cache_saved_cost } : {}),
  };

  if (h.has_recent_buckets && Array.isArray(h.recent_buckets) && h.recent_buckets.length > 0) {
    return {
      has_recent_buckets: true,
      recent_window_minutes: h.recent_window_minutes || 200,
      recent_window_success: h.recent_window_success || 0,
      recent_window_failure: h.recent_window_failure || 0,
      recent_window_rate: h.recent_window_rate ?? null,
      recent_buckets: h.recent_buckets.map((b) => ({
        ...(b.time ? { time: b.time } : {}),
        success: b.success || 0,
        failed: b.failed || 0,
      })),
      ...cacheFields,
    };
  }

  if (Array.isArray(h.recent_bars) && h.recent_bars.length > 0) {
    return {
      has_recent_buckets: false,
      recent_success_rate: h.recent_success_rate ?? null,
      recent_bars: h.recent_bars.map((b) => ({ ok: Boolean(b.ok) })),
      ...cacheFields,
    };
  }

  const hasCacheRate = isFiniteNumber(h.cache_hit_rate);
  const hasSuccessRate = isFiniteNumber(h.success_rate);
  if (h.available && (hasCacheRate || hasSuccessRate)) {
    return {
      available: true,
      ...cacheFields,
      ...(hasSuccessRate ? { success_rate: h.success_rate } : {}),
    };
  }

  return undefined;
};

const sortRecordKeys = (input: Record<string, number> | undefined): Record<string, number> | undefined => {
  if (!input || typeof input !== 'object') return undefined;
  const entries = Object.entries(input)
    .filter(([, count]) => typeof count === 'number' && Number.isFinite(count) && count > 0)
    .sort(([a], [b]) => a.localeCompare(b));
  if (entries.length === 0) return undefined;
  const out: Record<string, number> = {};
  for (const [k, v] of entries) {
    out[k] = v;
  }
  return out;
};

export const projectPanelSnapshot = (
  snap: BoardSnapshot,
  cfg: Pick<PoolQuotaConfig, 'showAis'>,
): PanelBoardSnapshot => {
  const ag = snap.antigravity;
  const ais = snap.aistudio;
  const rawAccounts = Array.isArray(ag?.accounts) ? ag.accounts : [];

  const projectedAccounts: PanelAntigravityAccount[] = rawAccounts.map((acct) => {
    const projectedHistory = projectAccountHistory(acct.history);
    const projectedWindows: PanelAntigravityWindow[] = (Array.isArray(acct.windows) ? acct.windows : []).map((w) => ({
      key: w.key,
      label: w.label,
      group: w.group,
      remaining_percent: w.remaining_percent,
      reset_at_ms: w.reset_at_ms,
      observed_at_ms: w.observed_at_ms,
      stale: Boolean(w.stale),
      has_current_usage: Boolean(w.has_current_usage),
      current_requests: w.current_requests ?? 0,
      current_tokens: w.current_tokens ?? 0,
      current_cost: w.current_cost ?? 0,
      has_forecast: Boolean(w.has_forecast),
      ...(w.forecast_basis ? { forecast_basis: w.forecast_basis } : {}),
      forecast_cost: w.forecast_cost ?? 0,
      ...(typeof w.post_sample_cost_usd === 'number' && Number.isFinite(w.post_sample_cost_usd) && w.post_sample_cost_usd > 0
        ? { post_sample_cost_usd: w.post_sample_cost_usd }
        : {}),
      ...(typeof w.post_sample_tokens === 'number' && Number.isFinite(w.post_sample_tokens) && w.post_sample_tokens > 0
        ? { post_sample_tokens: w.post_sample_tokens }
        : {}),
      ...(typeof w.post_sample_requests === 'number' && Number.isFinite(w.post_sample_requests)
        ? { post_sample_requests: w.post_sample_requests }
        : {}),
      ...(typeof w.estimated_remaining_percent === 'number' && Number.isFinite(w.estimated_remaining_percent)
        ? { estimated_remaining_percent: w.estimated_remaining_percent }
        : {}),
    }));

    return {
      id: acct.id,
      code_name: acct.code_name,
      tier: acct.tier,
      status: acct.status,
      status_label: acct.status_label,
      ...(projectedHistory ? { history: projectedHistory } : {}),
      windows: projectedWindows,
      has_history: Boolean(acct.has_history),
    };
  });

  const sortedTiers = projectedAccounts.length > 1
    ? sortRecordKeys(ag?.summary?.tier_counts)
    : undefined;

  const multiSummaryCache = projectedAccounts.length > 1
    ? {
      ...(isFiniteNumber(ag?.summary?.weighted_cache_hit_rate)
        ? { weighted_cache_hit_rate: ag.summary.weighted_cache_hit_rate }
        : {}),
      ...(isFiniteNumber(ag?.summary?.weighted_cache_hit_rate_24h)
        ? { weighted_cache_hit_rate_24h: ag.summary.weighted_cache_hit_rate_24h }
        : {}),
      ...(isPositiveFinite(ag?.summary?.total_cache_saved_cost)
        ? { total_cache_saved_cost: ag.summary.total_cache_saved_cost }
        : {}),
    }
    : {};

  const projectedAis: PanelAIStudioPool = cfg.showAis
    ? {
      online: Boolean(ais?.online),
      status: ais?.status || 'unknown',
      ...(ais?.status_message ? { status_message: ais.status_message } : {}),
      next_reset_ms: ais?.next_reset_ms ?? 0,
      account_counts: {
        enabled: ais?.account_counts?.enabled ?? 0,
        ready: ais?.account_counts?.ready ?? 0,
      },
      playground: {
        requests: ais?.playground?.requests ?? 0,
      },
      models: (Array.isArray(ais?.models) ? ais.models : []).map((m) => ({
        id: m.id,
        label: m.label,
        eligible_accounts: m.eligible_accounts,
        available_accounts: m.available_accounts,
        cooling_accounts: m.cooling_accounts,
        limit_requests: m.limit_requests,
        used_requests: m.used_requests,
        effective_remaining_requests: m.effective_remaining_requests,
        limit_tokens: m.limit_tokens,
        used_tokens: m.used_tokens,
        effective_remaining_tokens: m.effective_remaining_tokens,
        effective_percent: m.effective_percent,
      })),
    }
    : {
      online: Boolean(ais?.online),
      status: ais?.status || 'unknown',
      ...(ais?.status_message ? { status_message: ais.status_message } : {}),
      account_counts: {
        enabled: ais?.account_counts?.enabled ?? 0,
        ready: ais?.account_counts?.ready ?? 0,
      },
    };

  return {
    generated_at_ms: Number.isFinite(snap.generated_at_ms) ? snap.generated_at_ms : 0,
    antigravity: {
      online: Boolean(ag?.online),
      status: ag?.status || 'unknown',
      ...(ag?.status_message ? { status_message: ag.status_message } : {}),
      summary: {
        active_accounts: ag?.summary?.active_accounts ?? projectedAccounts.length,
        ...(sortedTiers ? { tier_counts: sortedTiers } : {}),
        ...multiSummaryCache,
      },
      accounts: projectedAccounts,
    },
    aistudio: projectedAis,
  };
};

export const projectPanelHistory = (
  hist: AntigravityHistoryResponse,
): PanelAntigravityHistoryResponse => {
  const series: PanelHistorySeries[] = (Array.isArray(hist.series) ? hist.series : []).map((s) => {
    const hasCycleResets = Array.isArray(s.cycle_resets) && s.cycle_resets.length > 0;
    const hasFallbackResets = !hasCycleResets && Array.isArray(s.resets) && s.resets.length >= 2;
    const hasEstPoint = Array.isArray(s.estimated_point)
      && s.estimated_point.length >= 2
      && typeof s.estimated_point[0] === 'number'
      && Number.isFinite(s.estimated_point[0])
      && typeof s.estimated_point[1] === 'number'
      && Number.isFinite(s.estimated_point[1]);

    return {
      key: s.key,
      group: s.group,
      label: s.label,
      remaining: s.remaining,
      points: Array.isArray(s.points) ? s.points : [],
      ...(hasCycleResets ? { cycle_resets: s.cycle_resets } : {}),
      ...(hasFallbackResets ? { resets: s.resets } : {}),
      ...(hasEstPoint ? { estimated_point: [s.estimated_point![0], s.estimated_point![1]] as [number, number] } : {}),
    };
  });

  return {
    account_id: hist.account_id,
    window: hist.window,
    range: hist.range,
    ...(typeof hist.to_sec === 'number' && Number.isFinite(hist.to_sec) && hist.to_sec > 0
      ? { to_sec: hist.to_sec }
      : {}),
    series,
  };
};

export const computeSnapshotRev = (
  projectedSnap: PanelBoardSnapshot,
  publicCfg: PublicPoolQuotaConfig,
): string => shortHash({
  config: publicCfg,
  snapshot: {
    ...projectedSnap,
    generated_at_ms: 0,
  },
});

/**
 * Hash only the authoritative curve points and cycle reset markers (excluding
 * ticking to_sec and live estimated_point), so real-time post-sample estimate
 * drops can reuse the cached history curve on the panel without retransmitting
 * hundreds of history points every 15s.
 */
export const computeHistoryRev = (
  projectedHist: PanelAntigravityHistoryResponse,
): string => shortHash({
  account_id: projectedHist.account_id,
  window: projectedHist.window,
  range: projectedHist.range,
  series: projectedHist.series.map((s) => ({
    key: s.key,
    group: s.group,
    label: s.label,
    points: s.points,
    cycle_resets: s.cycle_resets ?? [],
    resets: s.resets ?? [],
  })),
});

export const negotiatePanelState = (params: {
  publicConfig: PublicPoolQuotaConfig;
  snapshot: BoardSnapshot;
  history: AntigravityHistoryResponse | null;
  fetchedAtMs: number;
  clientRev?: string | null;
  clientHrev?: string | null;
}): PanelStateResponse => {
  const projectedSnap = projectPanelSnapshot(params.snapshot, params.publicConfig);
  const projectedHist = params.history ? projectPanelHistory(params.history) : null;
  const currentRev = computeSnapshotRev(projectedSnap, params.publicConfig);
  const currentHrev = projectedHist ? computeHistoryRev(projectedHist) : '';

  const clientRev = params.clientRev?.trim() ?? '';
  const clientHrev = params.clientHrev?.trim() ?? '';

  const revMatches = Boolean(clientRev) && clientRev === currentRev;
  const hrevMatches = currentHrev !== '' && Boolean(clientHrev) && clientHrev === currentHrev;
  const noHistoryUnchanged = currentHrev === '' && !clientHrev;

  if (revMatches && (hrevMatches || noHistoryUnchanged)) {
    return {
      ok: true,
      unchanged: true,
      rev: currentRev,
      ...(currentHrev ? { hrev: currentHrev } : {}),
      generatedAtMs: projectedSnap.generated_at_ms,
      fetchedAtMs: params.fetchedAtMs,
    };
  }

  if (hrevMatches) {
    return {
      ok: true,
      rev: currentRev,
      hrev: currentHrev,
      historyUnchanged: true,
      config: params.publicConfig,
      snapshot: projectedSnap,
      error: null,
      errorCode: null,
      fetchedAtMs: params.fetchedAtMs,
    };
  }

  return {
    ok: true,
    rev: currentRev,
    ...(currentHrev ? { hrev: currentHrev } : {}),
    config: params.publicConfig,
    snapshot: projectedSnap,
    history: projectedHist,
    error: null,
    errorCode: null,
    fetchedAtMs: params.fetchedAtMs,
  };
};

export const negotiatePanelHistory = (params: {
  history: AntigravityHistoryResponse;
  clientHrev?: string | null;
}): PanelHistoryResponse => {
  const projectedHist = projectPanelHistory(params.history);
  const currentHrev = computeHistoryRev(projectedHist);
  const clientHrev = params.clientHrev?.trim() ?? '';

  if (clientHrev && clientHrev === currentHrev) {
    return {
      ok: true,
      unchanged: true,
      hrev: currentHrev,
      ...(projectedHist.to_sec ? { toSec: projectedHist.to_sec } : {}),
    };
  }

  return {
    ok: true,
    hrev: currentHrev,
    ...projectedHist,
  };
};
