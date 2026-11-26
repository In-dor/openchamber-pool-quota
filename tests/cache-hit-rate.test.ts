import fs from 'node:fs';
import http from 'node:http';
import { describe, expect, it, mock } from 'bun:test';
import type { AntigravityAccountHistory, BoardSnapshot } from '../src/shared/types.ts';
import { toPublicConfig } from '../src/shared/config.ts';
import { computeSnapshotRev, projectPanelSnapshot } from '../src/service/panel-projection.ts';
import { PANEL_CSS } from '../src/panel/styles.ts';
import { minifyCss } from '../scripts/build.ts';
import serverPlugin from '../plugin/index.js';

const displayCols = (text: string): number => {
  let cols = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    cols += (
      (code >= 0x2e80 && code <= 0x9fff)
      || (code >= 0xf900 && code <= 0xfaff)
      || (code >= 0xff00 && code <= 0xffef)
    ) ? 2 : 1;
  }
  return cols;
};

const makeBaseSnapshot = (opts: {
  history?: AntigravityAccountHistory;
  summaryCache?: {
    weighted_cache_hit_rate?: number | null;
    weighted_cache_hit_rate_24h?: number | null;
    total_cache_saved_cost?: number;
  };
  extraAccount?: boolean;
} = {}): BoardSnapshot => {
  const nowMs = 1_764_200_000_000;
  const accounts: BoardSnapshot['antigravity']['accounts'] = [
    {
      id: 'ag-1',
      code_name: 'Account-Alpha',
      tier: 'Ultra',
      status: 'available',
      status_label: '可用',
      has_history: true,
      ...(opts.history ? { history: opts.history } : {}),
      windows: [
        {
          key: 'gemini_5h',
          label: 'Gemini 5h',
          group: 'gemini',
          duration_seconds: 18_000,
          remaining_percent: 82,
          used_percent: 18,
          reset_at_ms: nowMs + 7_200_000,
          observed_at_ms: nowMs - 30_000,
          stale: false,
          has_current_usage: true,
          current_requests: 10,
          current_tokens: 100_000,
          current_cost: 1.2,
          has_forecast: false,
          forecast_tokens: 0,
          forecast_cost: 0,
        },
      ],
    },
  ];

  if (opts.extraAccount) {
    accounts.push({
      id: 'ag-2',
      code_name: 'Account-Beta',
      tier: 'Pro',
      status: 'available',
      status_label: '可用',
      has_history: false,
      windows: [
        {
          key: 'claude_5h',
          label: 'Claude 5h',
          group: 'claude',
          duration_seconds: 18_000,
          remaining_percent: 95,
          used_percent: 5,
          reset_at_ms: nowMs + 10_800_000,
          observed_at_ms: nowMs - 30_000,
          stale: false,
          has_current_usage: false,
          current_requests: 0,
          current_tokens: 0,
          current_cost: 0,
          has_forecast: false,
          forecast_tokens: 0,
          forecast_cost: 0,
        },
      ],
    });
  }

  return {
    generated_at_ms: nowMs,
    refresh_interval_seconds: 15,
    antigravity: {
      online: true,
      status: 'online',
      cpamp_status: 'ok',
      updated_at_ms: nowMs,
      summary: {
        active_accounts: accounts.length,
        tier_counts: opts.extraAccount ? { Ultra: 1, Pro: 1 } : { Ultra: 1 },
        total_requests: 1200,
        total_tokens: 120_000_000,
        total_cost: 40,
        weighted_success_rate: 99.5,
        ...(opts.summaryCache ?? {}),
        window_averages: [],
      },
      accounts,
    },
    aistudio: {
      online: true,
      status: 'online',
      updated_at_ms: nowMs,
      service_state: 'ready',
      service_ready: true,
      active_requests: 0,
      cycle_start_ms: nowMs - 3_600_000,
      next_reset_ms: nowMs + 14_400_000,
      reset_rule_note: 'Daily 16:00',
      tier_counts: { Pro: 10 },
      account_counts: {
        enabled: 10,
        ready: 10,
        busy: 0,
        cooldown: 0,
        auth_required: 0,
        unavailable: 0,
      },
      playground: {
        requests: 20,
        succeeded: 20,
        failed: 0,
        canceled: 0,
        rate_limited: 0,
        success_rate: 100,
        input_tokens: 10_000,
        reply_tokens: 10_000,
        total_tokens: 20_000,
        first_event_avg_ms: 300,
        first_event_p50_ms: 280,
        first_event_p95_ms: 500,
        active_cooldowns: 0,
      },
      models: [],
    },
  };
};

describe('AGY cache hit rate projection & rev stability', () => {
  it('retains lean cache fields across all 3 projectAccountHistory branches while stripping 10-digit token counters', () => {
    // Branch 1: has_recent_buckets = true
    const snapBuckets = makeBaseSnapshot({
      history: {
        available: true,
        total_requests: 800,
        success_calls: 792,
        failure_calls: 8,
        total_tokens: 90_000_000,
        total_cost: 25,
        success_rate: 99,
        input_tokens: 9_876_543_210,
        cached_tokens: 8_869_135_802,
        cache_hit_rate: 89.8,
        cache_saved_cost: 20_100,
        input_tokens_24h: 2_345_678_901,
        cached_tokens_24h: 2_186_172_735,
        cache_hit_rate_24h: 93.2,
        cache_saved_cost_24h: 1_950.4,
        has_recent_buckets: true,
        recent_window_minutes: 200,
        recent_window_success: 15,
        recent_window_failure: 0,
        recent_window_rate: 100,
        recent_buckets: [{ time: '10:00', success: 15, failed: 0 }],
        recent_success_count: 15,
        recent_failure_count: 0,
        recent_success_rate: 100,
        recent_bars: [{ ok: true }],
      },
      summaryCache: {
        weighted_cache_hit_rate: 89.8,
        weighted_cache_hit_rate_24h: 93.2,
        total_cache_saved_cost: 20_100,
      },
    });
    const projBuckets = projectPanelSnapshot(snapBuckets, { showAis: false });
    const h1 = projBuckets.antigravity.accounts[0]!.history!;
    expect(h1.has_recent_buckets).toBe(true);
    expect(h1.cache_hit_rate).toBe(89.8);
    expect(h1.cache_hit_rate_24h).toBe(93.2);
    expect(h1.cache_saved_cost).toBe(20_100);
    expect('input_tokens' in h1).toBe(false);
    expect('cached_tokens' in h1).toBe(false);
    expect('input_tokens_24h' in h1).toBe(false);
    expect('cached_tokens_24h' in h1).toBe(false);
    expect('cache_saved_cost_24h' in h1).toBe(false);
    expect('total_requests' in h1).toBe(false);
    expect('success_rate' in h1).toBe(false);
    // Single-account mode avoids duplicating weighted summary cache fields
    expect('weighted_cache_hit_rate' in projBuckets.antigravity.summary).toBe(false);

    // Branch 2: recent_bars fallback
    const snapBars = makeBaseSnapshot({
      history: {
        available: true,
        total_requests: 50,
        success_calls: 49,
        failure_calls: 1,
        total_tokens: 5_000_000,
        total_cost: 2,
        success_rate: 98,
        input_tokens: 1_500_000_000,
        cached_tokens: 900_000_000,
        cache_hit_rate: 60,
        cache_saved_cost: 0, // non-positive -> stripped
        cache_hit_rate_24h: null, // null -> stripped
        has_recent_buckets: false,
        recent_window_minutes: 200,
        recent_window_success: 0,
        recent_window_failure: 0,
        recent_window_rate: null,
        recent_success_count: 10,
        recent_failure_count: 0,
        recent_success_rate: 100,
        recent_bars: [{ ok: true, timestamp_ms: 123, status_code: 200 }],
      },
    });
    const projBars = projectPanelSnapshot(snapBars, { showAis: false });
    const h2 = projBars.antigravity.accounts[0]!.history!;
    expect(h2.has_recent_buckets).toBe(false);
    expect(h2.recent_bars).toEqual([{ ok: true }]);
    expect(h2.cache_hit_rate).toBe(60);
    expect('cache_hit_rate_24h' in h2).toBe(false);
    expect('cache_saved_cost' in h2).toBe(false);
    expect('input_tokens' in h2).toBe(false);

    // Branch 3a: fallback with cache_hit_rate only (no buckets, no bars, no success_rate)
    const snapFallbackCacheOnly = makeBaseSnapshot({
      history: {
        available: true,
        total_requests: 30,
        success_calls: 30,
        failure_calls: 0,
        total_tokens: 3_000_000,
        total_cost: 1,
        success_rate: null,
        cache_hit_rate: 0, // finite 0 is valid and preserved
        cache_hit_rate_24h: 12.5,
        cache_saved_cost: 3.4,
        has_recent_buckets: false,
        recent_window_minutes: 200,
        recent_window_success: 0,
        recent_window_failure: 0,
        recent_window_rate: null,
        recent_success_count: 0,
        recent_failure_count: 0,
        recent_success_rate: null,
      },
    });
    const h3a = projectPanelSnapshot(snapFallbackCacheOnly, { showAis: false }).antigravity.accounts[0]!.history!;
    expect(h3a).toEqual({
      available: true,
      cache_hit_rate: 0,
      cache_hit_rate_24h: 12.5,
      cache_saved_cost: 3.4,
    });

    // Branch 3b: legacy board with success_rate only (zero cache fields)
    const snapLegacyFallback = makeBaseSnapshot({
      history: {
        available: true,
        total_requests: 30,
        success_calls: 29,
        failure_calls: 1,
        total_tokens: 3_000_000,
        total_cost: 1,
        success_rate: 96.7,
        has_recent_buckets: false,
        recent_window_minutes: 200,
        recent_window_success: 0,
        recent_window_failure: 0,
        recent_window_rate: null,
        recent_success_count: 0,
        recent_failure_count: 0,
        recent_success_rate: null,
      },
    });
    const h3b = projectPanelSnapshot(snapLegacyFallback, { showAis: false }).antigravity.accounts[0]!.history!;
    expect(h3b).toEqual({
      available: true,
      success_rate: 96.7,
    });
  });

  it('keeps rev stable when stripped heavy token counts tick, and invalidates rev when cache_hit_rate changes', () => {
    const pubCfg = toPublicConfig({ url: 'http://127.0.0.1:18380', passcode: '', showAis: false, compactQuota: true });
    const base = makeBaseSnapshot({
      history: {
        available: true,
        total_requests: 500,
        success_calls: 500,
        failure_calls: 0,
        total_tokens: 50_000_000,
        total_cost: 15,
        success_rate: 100,
        input_tokens: 1_000_000_000,
        cached_tokens: 898_000_000,
        cache_hit_rate: 89.8,
        cache_saved_cost: 1250,
        has_recent_buckets: true,
        recent_window_minutes: 200,
        recent_window_success: 10,
        recent_window_failure: 0,
        recent_window_rate: 100,
        recent_buckets: [{ time: '10:00', success: 10, failed: 0 }],
        recent_success_count: 10,
        recent_failure_count: 0,
        recent_success_rate: 100,
      },
    });
    const rev1 = computeSnapshotRev(projectPanelSnapshot(base, pubCfg), pubCfg);

    const tokenTicked = structuredClone(base);
    tokenTicked.antigravity.accounts[0]!.history!.input_tokens = 1_000_050_000;
    tokenTicked.antigravity.accounts[0]!.history!.cached_tokens = 898_045_000;
    const rev2 = computeSnapshotRev(projectPanelSnapshot(tokenTicked, pubCfg), pubCfg);
    expect(rev2).toBe(rev1);

    const rateChanged = structuredClone(base);
    rateChanged.antigravity.accounts[0]!.history!.cache_hit_rate = 90.1;
    const rev3 = computeSnapshotRev(projectPanelSnapshot(rateChanged, pubCfg), pubCfg);
    expect(rev3).not.toBe(rev1);
  });

  it('passes through weighted summary cache fields only in multi-account mode', () => {
    const multiSnap = makeBaseSnapshot({
      extraAccount: true,
      summaryCache: {
        weighted_cache_hit_rate: 85.4,
        weighted_cache_hit_rate_24h: 91.2,
        total_cache_saved_cost: 32_500,
      },
    });
    const projected = projectPanelSnapshot(multiSnap, { showAis: false });
    expect(projected.antigravity.summary.weighted_cache_hit_rate).toBe(85.4);
    expect(projected.antigravity.summary.weighted_cache_hit_rate_24h).toBe(91.2);
    expect(projected.antigravity.summary.total_cache_saved_cost).toBe(32_500);
  });
});

describe('plugin/index.js cache hit rate optional fields & legacy fallback', () => {
  const runToolWithSnapshot = async (snap: BoardSnapshot) => {
    const server = http.createServer((req, res) => {
      if (req.url?.startsWith('/api/snapshot')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(snap));
        return;
      }
      res.writeHead(404);
      res.end();
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
    const port = (server.address() as { port: number }).port;
    try {
      let registeredTool: {
        execute: (input: Record<string, unknown>, ctx?: unknown) => Promise<{ content: string }>;
      } | null = null;
      await serverPlugin.setup({
        options: { url: `http://127.0.0.1:${port}`, showAis: false },
        tool: {
          transform: async (fn: (editor: { add: (tool: typeof registeredTool) => void }) => void) => {
            fn({ add: (tool) => { registeredTool = tool; } });
          },
        },
      });
      const res = await registeredTool!.execute({ scope: 'antigravity', refresh: true });
      return JSON.parse(res.content) as Record<string, unknown>;
    } finally {
      server.close();
    }
  };

  it('includes optional antigravity cache fields while keeping all 7 card bindings intact', async () => {
    const snap = makeBaseSnapshot({
      history: {
        available: true,
        total_requests: 500,
        success_calls: 498,
        failure_calls: 2,
        total_tokens: 50_000_000,
        total_cost: 20,
        success_rate: 99.6,
        cache_hit_rate: 89.8,
        cache_hit_rate_24h: 93.2,
        cache_saved_cost: 20_145.6,
        has_recent_buckets: false,
        recent_window_minutes: 200,
        recent_window_success: 0,
        recent_window_failure: 0,
        recent_window_rate: null,
        recent_success_count: 0,
        recent_failure_count: 0,
        recent_success_rate: null,
      },
    });
    const out = await runToolWithSnapshot(snap);
    for (const key of ['pool_label', 'summary', 'status_badge', 'ag_5h', 'ag_weekly', 'ais_summary', 'next_reset']) {
      expect(typeof out[key]).toBe('string');
    }
    const ag = out.antigravity as Record<string, unknown>;
    expect(ag.cache_hit_rate_percent).toBe(89.8);
    expect(ag.cache_hit_rate_24h_percent).toBe(93.2);
    expect(ag.cache_saved_cost_usd).toBe(20_145.6);
  });

  it('omits optional cache fields on legacy boards without cache metrics', async () => {
    const legacySnap = makeBaseSnapshot();
    const out = await runToolWithSnapshot(legacySnap);
    const ag = out.antigravity as Record<string, unknown>;
    expect('cache_hit_rate_percent' in ag).toBe(false);
    expect('cache_hit_rate_24h_percent' in ag).toBe(false);
    expect('cache_saved_cost_usd' in ag).toBe(false);
  });

  it('prefers summary weighted cache metrics in multi-account mode', async () => {
    const multiSnap = makeBaseSnapshot({
      extraAccount: true,
      history: {
        available: true,
        total_requests: 500,
        success_calls: 500,
        failure_calls: 0,
        total_tokens: 50_000_000,
        total_cost: 20,
        success_rate: 100,
        cache_hit_rate: 95,
        cache_hit_rate_24h: 97,
        cache_saved_cost: 12_000,
        has_recent_buckets: false,
        recent_window_minutes: 200,
        recent_window_success: 0,
        recent_window_failure: 0,
        recent_window_rate: null,
        recent_success_count: 0,
        recent_failure_count: 0,
        recent_success_rate: null,
      },
      summaryCache: {
        weighted_cache_hit_rate: 84.5,
        weighted_cache_hit_rate_24h: 88.1,
        total_cache_saved_cost: 18_500,
      },
    });
    const out = await runToolWithSnapshot(multiSnap);
    const ag = out.antigravity as Record<string, unknown>;
    expect(ag.cache_hit_rate_percent).toBe(84.5);
    expect(ag.cache_hit_rate_24h_percent).toBe(88.1);
    expect(ag.cache_saved_cost_usd).toBe(18_500);
  });
});

describe('plugin/tui.tsx AGY cache header formatting & legacy fallback', () => {
  it('formats single-account, multi-account, compact-fallback, offline, and legacy headers within 65 display columns', async () => {
    mock.module('@opencode/plugin/tui', () => ({
      Plugin: { define: (def: unknown) => def },
    }));
    mock.module('solid-js', () => ({
      For: () => null,
      Show: () => null,
      createMemo: (fn: () => unknown) => fn,
      createSignal: (v: unknown) => [() => v, () => {}],
      onCleanup: () => {},
    }));
    mock.module('@opentui/solid/jsx-dev-runtime', () => ({
      jsxDEV: () => null,
      Fragment: () => null,
    }));
    mock.module('@opentui/solid/jsx-runtime', () => ({
      jsx: () => null,
      jsxs: () => null,
      Fragment: () => null,
    }));

    const { formatAgDialogHeader } = await import('../plugin/tui.tsx');

    // Offline
    expect(formatAgDialogHeader({ online: false })).toBe('Antigravity (离线)');

    // Legacy board (no cache fields): 100% identical to original
    expect(formatAgDialogHeader({
      online: true,
      summary: { active_accounts: 1 },
      accounts: [{ id: 'a1', code_name: 'A1', windows: [] }],
    })).toBe('Antigravity (1号在线)');

    // Single account with full ?view=tui cache fields
    const fullSingle = formatAgDialogHeader({
      online: true,
      summary: { active_accounts: 1, weighted_cache_hit_rate: 89.8, weighted_cache_hit_rate_24h: 93.2 },
      accounts: [{
        id: 'a1',
        code_name: 'A1',
        cache_hit_rate: 89.8,
        cache_hit_rate_24h: 93.2,
        cache_saved_cost: 20_100,
        windows: [],
      }],
    });
    expect(fullSingle).toBe('Antigravity (1号在线 · 缓存 89.8% · 24h 93.2% · 省$20.1k)');
    expect(displayCols(fullSingle)).toBeLessThanOrEqual(65);

    // Single account without 24h or saved cost
    expect(formatAgDialogHeader({
      online: true,
      summary: { active_accounts: 1 },
      accounts: [{
        id: 'a1',
        code_name: 'A1',
        cache_hit_rate: 89.8,
        cache_hit_rate_24h: null,
        cache_saved_cost: 0,
        windows: [],
      }],
    })).toBe('Antigravity (1号在线 · 缓存 89.8%)');

    // Single account fallback to nested history (if board ignored ?view=tui)
    expect(formatAgDialogHeader({
      online: true,
      summary: { active_accounts: 1 },
      accounts: [{
        id: 'a1',
        code_name: 'A1',
        history: { cache_hit_rate: 74.5, cache_hit_rate_24h: 80.0, cache_saved_cost: 350 },
        windows: [],
      }],
    })).toBe('Antigravity (1号在线 · 缓存 74.5% · 24h 80% · 省$350)');

    // Multi-account prefers summary weighted rates and stays compact
    const multiHeader = formatAgDialogHeader({
      online: true,
      summary: { active_accounts: 3, weighted_cache_hit_rate: 85.4, weighted_cache_hit_rate_24h: 91.0 },
      accounts: [
        { id: 'a1', code_name: 'A1', cache_hit_rate: 92, cache_saved_cost: 20_100, windows: [] },
        { id: 'a2', code_name: 'A2', cache_hit_rate: 79, windows: [] },
        { id: 'a3', code_name: 'A3', cache_hit_rate: 85, windows: [] },
      ],
    });
    expect(multiHeader).toBe('Antigravity (3号在线 · 缓存 85.4% · 24h 91%)');
    expect(displayCols(multiHeader)).toBeLessThanOrEqual(65);

    // Multi-account falls back to accounts[0] when summary weighted rate is null
    expect(formatAgDialogHeader({
      online: true,
      summary: { active_accounts: 2, weighted_cache_hit_rate: null },
      accounts: [
        { id: 'a1', code_name: 'A1', cache_hit_rate: 78.2, windows: [] },
        { id: 'a2', code_name: 'A2', windows: [] },
      ],
    })).toBe('Antigravity (2号在线 · 缓存 78.2%)');

    // Verify FooterBadge stays compact without cache text
    const tuiSrc = fs.readFileSync(new URL('../plugin/tui.tsx', import.meta.url), 'utf8');
    const footerSlice = tuiSrc.slice(tuiSrc.indexOf('const FooterBadge'));
    expect(footerSlice).not.toContain('cache_hit_rate');
    expect(footerSlice).toContain('AG ${[gStr, cStr].filter(Boolean).join(" ")}');
  });
});

describe('panel CSS cache pill & layout invariants', () => {
  it('defines efficiency-toned cache pills without harsh red and survives CSS minification', () => {
    const minified = minifyCss(PANEL_CSS);
    expect(minified).toContain('.pq-acct-badges{display:inline-flex');
    expect(minified).toContain('.pq-pill-cache.is-high{');
    expect(minified).toContain('.pq-pill-cache.is-mid{');
    expect(minified).toContain('.pq-pill-cache.is-low{background:var(--pq-surface-2);color:var(--pq-muted)');
    expect(minified).toContain('.pq-rate-capsule.is-cache-high{background:var(--pq-healthy-bg);color:var(--pq-healthy)}');
    expect(minified).toContain('.pq-rate-capsule.is-cache-mid{background:var(--pq-full-bg);color:var(--pq-full)}');
    expect(minified).toContain('.pq-rate-capsule.is-cache-low{background:var(--pq-surface-2);color:var(--pq-muted)}');
  });
});
