export interface PoolQuotaConfig {
  url: string;
  passcode: string;
  showAis: boolean;
  compactQuota: boolean;
}

export interface PublicPoolQuotaConfig {
  url: string;
  hasPasscode: boolean;
  showAis: boolean;
  compactQuota: boolean;
}

export interface AntigravityWindow {
  key: string;
  label: string;
  group: string;
  duration_seconds: number;
  remaining_percent: number;
  used_percent: number;
  reset_at_ms: number;
  observed_at_ms: number;
  stale: boolean;
  has_current_usage: boolean;
  current_requests: number;
  current_tokens: number;
  current_cost: number;
  has_forecast: boolean;
  forecast_basis?: string;
  forecast_tokens: number;
  forecast_cost: number;
}

export interface AntigravityTrendSeries {
  key: string;
  label: string;
  points: Array<{ t: number; r: number }>;
}

export interface AntigravityAccount {
  id: string;
  code_name: string;
  tier: string;
  status: string;
  status_label: string;
  windows: AntigravityWindow[];
  has_history: boolean;
  trend_24h?: AntigravityTrendSeries[];
}

export interface AntigravityWindowAverage {
  key: string;
  label: string;
  avg_remaining_percent: number;
  account_count: number;
}

export interface AntigravityPool {
  online: boolean;
  status: string;
  status_message?: string;
  cpamp_status: string;
  cpamp_message?: string;
  updated_at_ms: number;
  summary: {
    active_accounts: number;
    tier_counts: Record<string, number>;
    total_requests: number;
    total_tokens: number;
    total_cost: number;
    weighted_success_rate: number | null;
    window_averages: AntigravityWindowAverage[];
  };
  accounts: AntigravityAccount[];
}

export interface AIStudioChannelSummary {
  requests: number;
  succeeded: number;
  failed: number;
  canceled: number;
  rate_limited: number;
  success_rate: number | null;
  input_tokens: number;
  reply_tokens: number;
  total_tokens: number;
  first_event_avg_ms: number;
  first_event_p50_ms: number;
  first_event_p95_ms: number;
  active_cooldowns: number;
}

export interface AIStudioModelSummary {
  id: string;
  label: string;
  eligible_tiers: string[];
  eligible_accounts: number;
  available_accounts: number;
  cooling_accounts: number;
  exhausted_accounts: number;
  unavailable_accounts: number;
  limit_requests: number;
  used_requests: number;
  effective_remaining_requests: number;
  limit_tokens: number;
  used_tokens: number;
  effective_remaining_tokens: number;
  effective_percent: number;
  earliest_recovery_ms?: number;
}

export interface AIStudioPool {
  online: boolean;
  status: string;
  status_message?: string;
  updated_at_ms: number;
  service_state: string;
  service_ready: boolean;
  active_requests: number;
  cycle_start_ms: number;
  next_reset_ms: number;
  reset_rule_note: string;
  tier_counts: Record<string, number>;
  account_counts: {
    enabled: number;
    ready: number;
    busy: number;
    cooldown: number;
    auth_required: number;
    unavailable: number;
  };
  playground: AIStudioChannelSummary;
  models: AIStudioModelSummary[];
}

export interface BoardSnapshot {
  generated_at_ms: number;
  refresh_interval_seconds: number;
  antigravity: AntigravityPool;
  aistudio: AIStudioPool;
}

export interface AntigravityHistorySeries {
  key: string;
  group: string;
  label: string;
  duration_seconds: number;
  remaining: number;
  reset_sec: number;
  raw_reset_sec: number;
  observed_sec: number;
  points: Array<[number, number]>;
  resets: Array<[number, number]>;
}

export interface AntigravityHistoryResponse {
  account_id: string;
  window: string;
  range: string;
  from_sec: number;
  to_sec: number;
  bucket_seconds: number;
  sample_step_sec: number;
  series: AntigravityHistorySeries[];
}

export interface PanelStateResponse {
  config: PublicPoolQuotaConfig;
  snapshot: BoardSnapshot | null;
  history: AntigravityHistoryResponse | null;
  error: string | null;
  errorCode: 'unauthorized' | 'unreachable' | 'http' | 'invalid' | null;
  fetchedAtMs: number;
}
