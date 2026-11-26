import fs from 'node:fs';
import http from 'node:http';
import { describe, expect, it, mock } from 'bun:test';
import type {
  AIStudioModelSummary,
  AntigravityHistoryResponse,
  BoardSnapshot,
  PanelBoardSnapshot,
  PanelHistoryResponse,
  PanelStateDataResponse,
  PanelStateResponse,
  PoolQuotaConfig,
} from '../src/shared/types.ts';
import { toPublicConfig } from '../src/shared/config.ts';
import {
  clearBoardCache,
  fetchAntigravityHistory,
  fetchBoardSnapshot,
} from '../src/service/client.ts';
import { createServiceHandler } from '../src/service/handler.ts';
import {
  computeHistoryRev,
  computeSnapshotRev,
  projectPanelHistory,
  projectPanelSnapshot,
} from '../src/service/panel-projection.ts';
import { syncHistoryEstimatedPointsFromSnapshot } from '../src/panel/history-sync.ts';
import {
  createPanelVisibilityTracker,
  type IntersectionObserverEntryLike,
} from '../src/panel/visibility.ts';
import { PANEL_CSS } from '../src/panel/styles.ts';
import { minifyCss } from '../scripts/build.ts';
import serverPlugin from '../plugin/index.js';

const MODEL_DEFS: Array<{ id: string; label: string; category?: string; limit_tokens: number }> = [
  { id: 'gemini-4-argon', label: 'Gemini 4 Argon', limit_tokens: 150_000_000 },
  { id: 'gemini-4-carbon', label: 'Gemini 4 Carbon', limit_tokens: 120_000_000 },
  { id: 'gemini-4-neon', label: 'Gemini 4 Neon', limit_tokens: 150_000_000 },
  { id: 'gemini-4-hydrogen', label: 'Gemini 4 Hydrogen', limit_tokens: 200_000_000 },
  { id: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro Preview', limit_tokens: 130_000_000 },
  { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash', limit_tokens: 200_000_000 },
  { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash', limit_tokens: 200_000_000 },
  { id: 'gemini-3-flash-preview', label: 'Gemini 3 Flash Preview', limit_tokens: 110_000_000 },
  { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash Lite', limit_tokens: 200_000_000 },
  { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash Lite', limit_tokens: 110_000_000 },
  { id: 'gemini-nano-banana-2.1', label: 'Nano Banana 2.1', category: 'image', limit_tokens: 0 },
  { id: 'gemini-3-pro-image', label: 'Nano Banana Pro', category: 'image', limit_tokens: 0 },
  { id: 'gemini-3.1-flash-image', label: 'Nano Banana 2', category: 'image', limit_tokens: 0 },
  { id: 'gemini-3.1-flash-lite-image', label: 'Nano Banana 2 Lite', category: 'image', limit_tokens: 0 },
];

const buildHeavyRawSnapshot = (nowMs = 1_764_100_000_000): BoardSnapshot & Record<string, unknown> => {
  const models: AIStudioModelSummary[] = MODEL_DEFS.map((def, idx) => ({
    id: def.id,
    label: def.label,
    ...(def.category ? { category: def.category } : {}),
    eligible_tiers: ['Pro', 'Ultra'],
    eligible_accounts: 13,
    available_accounts: idx === 10 ? 12 : 13,
    cooling_accounts: idx === 10 ? 1 : 0,
    exhausted_accounts: 0,
    unavailable_accounts: 0,
    limit_requests: 650,
    used_requests: idx === 10 ? 50 : 0,
    effective_remaining_requests: idx === 10 ? 600 : 650,
    limit_tokens: def.limit_tokens,
    used_tokens: def.category === 'image' ? 1_200_000 : 5_000_000,
    effective_remaining_tokens: def.limit_tokens > 0 ? def.limit_tokens - 5_000_000 : 0,
    effective_percent: idx === 10 ? 92.3 : 100,
    earliest_recovery_ms: nowMs + 600_000,
  }));

  // Simulate realistic 55 KB aistudio.accounts (13 accounts x 14 per-account model entries)
  const heavyAccounts = Array.from({ length: 13 }, (_, acctIdx) => ({
    id: `ais-acc-${acctIdx + 1}`,
    code_name: `AIS-${acctIdx + 1}`,
    tier: acctIdx < 3 ? 'Ultra' : 'Pro',
    state: 'ready',
    state_label: '就绪',
    active_requests: 0,
    used_requests: 12,
    used_tokens: 500_000,
    available_models: 14,
    eligible_models: 14,
    cooling_models: 0,
    models: MODEL_DEFS.map((m) => ({
      model_id: m.id,
      status: 'available',
      status_label: '可用',
      limit_requests: 50,
      used_requests: 1,
      raw_remaining_requests: 49,
      effective_remaining_requests: 49,
      limit_tokens: m.limit_tokens,
      used_tokens: 10_000,
      raw_remaining_tokens: m.limit_tokens,
      effective_remaining_tokens: m.limit_tokens,
      effective_percent: 98,
    })),
  }));

  // Simulate realistic 6.6 KB aistudio.hourly_buckets (24 hours)
  const heavyHourlyBuckets = Array.from({ length: 24 }, (_, hr) => ({
    timestamp_ms: nowMs - (23 - hr) * 3_600_000,
    label: `${String(hr).padStart(2, '0')}:00`,
    requests: 10 + hr,
    succeeded: 10 + hr,
    failed: 0,
    other_failed: 0,
    canceled: 0,
    rate_limited: 0,
    input_tokens: 120_000,
    reasoning_tokens: 30_000,
    reply_tokens: 45_000,
    total_tokens: 195_000,
    first_event_p50_ms: 420.5,
    first_event_avg_ms: 480.2,
  }));

  const recentBuckets = Array.from({ length: 20 }, (_, i) => ({
    time: `${String(10 + Math.floor(i / 6)).padStart(2, '0')}:${String((i % 6) * 10).padStart(2, '0')}`,
    success: i % 3 === 0 ? 4 : 0,
    failed: 0,
  }));

  const recentBars = Array.from({ length: 50 }, (_, i) => ({
    ok: i !== 7,
    timestamp_ms: nowMs - i * 30_000,
    status_code: i !== 7 ? 200 : 429,
  }));

  return {
    generated_at_ms: nowMs,
    refresh_interval_seconds: 15,
    antigravity: {
      online: true,
      status: 'online',
      status_message: '',
      cpamp_status: 'ok',
      cpamp_message: '',
      updated_at_ms: nowMs,
      summary: {
        active_accounts: 2,
        tier_counts: { Pro: 1, Ultra: 1 },
        total_requests: 999,
        total_tokens: 99_000_000,
        total_cost: 42.5,
        weighted_success_rate: 99.1,
        window_averages: [
          { key: 'gemini_5h', label: 'Gemini 5h', avg_remaining_percent: 82, account_count: 2 },
        ],
      },
      accounts: [
        {
          id: 'ag-pro-1',
          code_name: 'Account-Pro',
          tier: 'Pro',
          status: 'available',
          status_label: '可用',
          has_history: true,
          trend_24h: [
            {
              key: 'gemini_5h',
              label: 'Gemini 5h',
              points: Array.from({ length: 60 }, (_, idx) => ({ t: nowMs - (60 - idx) * 60_000, r: 90 })),
            },
          ],
          history: {
            available: true,
            status_note: 'ok',
            total_requests: 500,
            success_calls: 495,
            failure_calls: 5,
            total_tokens: 50_000_000,
            total_cost: 20,
            success_rate: 99,
            latest_request_at_ms: nowMs - 10_000,
            has_recent_buckets: true,
            recent_window_minutes: 200,
            recent_window_success: 28,
            recent_window_failure: 0,
            recent_window_rate: 100,
            recent_buckets: recentBuckets,
            recent_success_count: 49,
            recent_failure_count: 1,
            recent_success_rate: 98,
            recent_bars: recentBars,
          },
          windows: [
            {
              key: 'gemini_5h',
              label: 'Gemini 5h',
              group: 'gemini',
              duration_seconds: 18_000,
              remaining_percent: 84,
              used_percent: 16,
              reset_at_ms: nowMs + 7_200_000,
              observed_at_ms: nowMs - 120_000,
              stale: false,
              has_current_usage: true,
              current_requests: 12,
              current_tokens: 120_000,
              current_cost: 1.45,
              has_forecast: true,
              forecast_basis: 'previous',
              forecast_tokens: 750_000,
              forecast_cost: 9.2,
              post_sample_cost_usd: 0.35,
              post_sample_tokens: 28_000,
              post_sample_requests: 3,
              estimated_remaining_percent: 81.2,
            },
            {
              key: 'argon_weekly',
              label: 'Argon 周额度',
              group: 'argon',
              duration_seconds: 604_800,
              remaining_percent: 95,
              used_percent: 5,
              reset_at_ms: nowMs + 400_000_000,
              observed_at_ms: nowMs - 120_000,
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
        },
        {
          id: 'ag-ultra-2',
          code_name: 'Account-Ultra',
          tier: 'Ultra',
          status: 'available',
          status_label: '可用',
          has_history: false,
          history: {
            available: true,
            total_requests: 100,
            success_calls: 98,
            failure_calls: 2,
            total_tokens: 10_000_000,
            total_cost: 5,
            success_rate: 98,
            has_recent_buckets: false,
            recent_window_minutes: 200,
            recent_window_success: 0,
            recent_window_failure: 0,
            recent_window_rate: null,
            recent_buckets: [],
            recent_success_count: 49,
            recent_failure_count: 1,
            recent_success_rate: 98,
            recent_bars: recentBars.slice(0, 10),
          },
          windows: [
            {
              key: 'claude_5h',
              label: 'Claude 5h',
              group: 'claude',
              duration_seconds: 18_000,
              remaining_percent: 100,
              used_percent: 0,
              reset_at_ms: 0,
              observed_at_ms: nowMs - 60_000,
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
        },
      ],
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
      tier_counts: { Pro: 10, Ultra: 3 },
      account_counts: {
        enabled: 13,
        ready: 13,
        busy: 0,
        cooldown: 0,
        auth_required: 0,
        unavailable: 0,
      },
      playground: {
        requests: 88,
        succeeded: 88,
        failed: 0,
        canceled: 0,
        rate_limited: 0,
        success_rate: 100,
        input_tokens: 500_000,
        reply_tokens: 300_000,
        total_tokens: 800_000,
        first_event_avg_ms: 410,
        first_event_p50_ms: 390,
        first_event_p95_ms: 680,
        active_cooldowns: 0,
      },
      models,
      hourly_buckets: heavyHourlyBuckets,
      accounts: heavyAccounts,
    } as BoardSnapshot['aistudio'],
  };
};

const buildSampleHistory = (baseSec = 1_764_099_000, windowKind: '5h' | '7d' = '5h'): AntigravityHistoryResponse => ({
  account_id: 'ag-pro-1',
  window: windowKind,
  range: windowKind === '7d' ? '7d' : '24h',
  from_sec: baseSec - 86_400,
  to_sec: baseSec + 300,
  bucket_seconds: 900,
  sample_step_sec: 900,
  series: [
    {
      key: windowKind === '7d' ? 'gemini_weekly' : 'gemini_5h',
      group: 'gemini',
      label: windowKind === '7d' ? 'Gemini 周额度' : 'Gemini 5h',
      duration_seconds: windowKind === '7d' ? 604_800 : 18_000,
      remaining: 84,
      reset_sec: baseSec + 7_200,
      raw_reset_sec: baseSec + 7_200,
      observed_sec: baseSec,
      points: Array.from({ length: 48 }, (_, i) => [
        baseSec - (47 - i) * 900,
        i === 47 ? 84 : Math.max(84, 100 - Math.floor(i / 3)),
      ]),
      resets: [
        [baseSec - 30_000, baseSec - 18_000],
        [baseSec - 18_000, baseSec + 7_200],
      ],
      cycle_resets: [baseSec - 18_000],
      estimated_point: [baseSec + 300, 81.2],
    },
  ],
});

describe('whitelist DTO projection (projectPanelSnapshot & projectPanelHistory)', () => {
  it('strips >80% of raw 70KB payload while preserving all panel-consumed fields (showAis=true & false)', () => {
    const raw = buildHeavyRawSnapshot();
    const rawBytes = Buffer.byteLength(JSON.stringify(raw), 'utf8');
    expect(rawBytes).toBeGreaterThan(60_000);

    const projectedOn = projectPanelSnapshot(raw, { showAis: true });
    const projectedOnBytes = Buffer.byteLength(JSON.stringify(projectedOn), 'utf8');
    const reductionOn = 1 - projectedOnBytes / rawBytes;

    expect(reductionOn).toBeGreaterThan(0.8);
    expect('accounts' in projectedOn.aistudio).toBe(false);
    expect('hourly_buckets' in projectedOn.aistudio).toBe(false);
    expect('refresh_interval_seconds' in projectedOn).toBe(false);
    expect('cpamp_status' in projectedOn.antigravity).toBe(false);
    expect('window_averages' in projectedOn.antigravity.summary).toBe(false);

    // Account 1: keeps recent_buckets, strips recent_bars & trend_24h, preserves all forecast & live estimate fields + Argon Pro window
    const acct1 = projectedOn.antigravity.accounts[0]!;
    expect(acct1.tier).toBe('Pro');
    expect('trend_24h' in acct1).toBe(false);
    expect(acct1.history?.has_recent_buckets).toBe(true);
    expect(acct1.history?.recent_buckets).toHaveLength(20);
    expect('recent_bars' in (acct1.history ?? {})).toBe(false);
    expect('total_requests' in (acct1.history ?? {})).toBe(false);

    const g5 = acct1.windows.find((w) => w.key === 'gemini_5h')!;
    expect(g5.has_current_usage).toBe(true);
    expect(g5.current_cost).toBe(1.45);
    expect(g5.has_forecast).toBe(true);
    expect(g5.forecast_basis).toBe('previous');
    expect(g5.forecast_cost).toBe(9.2);
    expect(g5.estimated_remaining_percent).toBe(81.2);
    expect(g5.post_sample_requests).toBe(3);
    expect(g5.post_sample_cost_usd).toBe(0.35);
    expect(g5.post_sample_tokens).toBe(28_000);
    expect('duration_seconds' in g5).toBe(false);
    expect('forecast_tokens' in g5).toBe(false);

    const argon = acct1.windows.find((w) => w.key === 'argon_weekly')!;
    expect(argon).toBeDefined();
    expect(argon.group).toBe('argon');

    // Account 2: fallback recent_bars keeps only { ok }
    const acct2 = projectedOn.antigravity.accounts[1]!;
    expect(acct2.tier).toBe('Ultra');
    expect(acct2.history?.has_recent_buckets).toBe(false);
    expect(acct2.history?.recent_bars).toHaveLength(10);
    expect(Object.keys(acct2.history!.recent_bars![0]!)).toEqual(['ok']);

    // AIStudio models: all 14 models including Nano Banana requests-only (limit_tokens: 0, used_tokens kept)
    expect(projectedOn.aistudio.playground).toEqual({ requests: 88 });
    expect(projectedOn.aistudio.account_counts).toEqual({ enabled: 13, ready: 13 });
    expect(projectedOn.aistudio.next_reset_ms).toBeGreaterThan(0);
    expect(projectedOn.aistudio.models).toHaveLength(14);
    const banana21 = projectedOn.aistudio.models!.find((m) => m.id === 'gemini-nano-banana-2.1')!;
    expect(banana21.limit_tokens).toBe(0);
    expect(banana21.used_tokens).toBe(1_200_000);
    expect(banana21.cooling_accounts).toBe(1);
    expect('eligible_tiers' in banana21).toBe(false);
    expect('earliest_recovery_ms' in banana21).toBe(false);

    // showAis=false omits all 14 models and shrinks payload even further
    const projectedOff = projectPanelSnapshot(raw, { showAis: false });
    const projectedOffBytes = Buffer.byteLength(JSON.stringify(projectedOff), 'utf8');
    expect(projectedOff.aistudio.models).toBeUndefined();
    expect(projectedOff.aistudio.playground).toBeUndefined();
    expect(projectedOff.aistudio.online).toBe(true);
    expect(projectedOffBytes).toBeLessThan(projectedOnBytes);
    expect(1 - projectedOffBytes / rawBytes).toBeGreaterThan(0.9);
  });

  it('projects history cleanly: drops unused metadata & redundant resets when cycle_resets exists, keeps resets fallback otherwise', () => {
    const rawHist = buildSampleHistory();
    const projected = projectPanelHistory(rawHist);
    expect('from_sec' in projected).toBe(false);
    expect('bucket_seconds' in projected).toBe(false);
    expect('sample_step_sec' in projected).toBe(false);
    expect(projected.series[0]?.cycle_resets).toEqual(rawHist.series[0]!.cycle_resets);
    expect(projected.series[0]?.resets).toBeUndefined();
    expect(projected.series[0]?.estimated_point).toEqual(rawHist.series[0]!.estimated_point);
    expect('duration_seconds' in (projected.series[0] ?? {})).toBe(false);

    // Fallback: when upstream omits cycle_resets, keep resets for panel fallback
    const legacyHist: AntigravityHistoryResponse = {
      ...rawHist,
      series: [{ ...rawHist.series[0]!, cycle_resets: undefined }],
    };
    const projectedLegacy = projectPanelHistory(legacyHist);
    expect(projectedLegacy.series[0]?.resets).toEqual(rawHist.series[0]!.resets);
  });
});

describe('/panel/state and /panel/history rev/hrev delta negotiation', () => {
  it('supports 3-state responses: full -> unchanged (<180 B) -> historyUnchanged -> window switch', async () => {
    clearBoardCache();
    let currentSnap = buildHeavyRawSnapshot(1_764_100_000_000);
    let currentHist5h = buildSampleHistory(1_764_099_000, '5h');
    const currentHist7d = buildSampleHistory(1_764_099_000, '7d');

    const boardServer = http.createServer((req, res) => {
      const url = new URL(req.url ?? '/', 'http://127.0.0.1');
      if (url.pathname === '/api/snapshot') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(currentSnap));
        return;
      }
      if (url.pathname === '/api/antigravity/history') {
        const win = url.searchParams.get('window') === '7d' ? '7d' : '5h';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(win === '7d' ? currentHist7d : currentHist5h));
        return;
      }
      res.writeHead(404);
      res.end();
    });

    await new Promise<void>((resolve) => boardServer.listen(0, '127.0.0.1', () => resolve()));
    const boardPort = (boardServer.address() as { port: number }).port;
    const cfg: PoolQuotaConfig = {
      url: `http://127.0.0.1:${boardPort}`,
      passcode: '',
      showAis: true,
      compactQuota: true,
    };

    const serviceToken = 'test-svc-token';
    const serviceServer = http.createServer(createServiceHandler({
      serviceToken,
      loadConfigFn: () => cfg,
    }));
    await new Promise<void>((resolve) => serviceServer.listen(0, '127.0.0.1', () => resolve()));
    const svcPort = (serviceServer.address() as { port: number }).port;

    const getPanel = async (pathAndQuery: string) => {
      const res = await fetch(`http://127.0.0.1:${svcPort}${pathAndQuery}`, {
        headers: { Authorization: `Bearer ${serviceToken}` },
      });
      const text = await res.text();
      return { status: res.status, bytes: Buffer.byteLength(text, 'utf8'), json: JSON.parse(text) };
    };

    try {
      // 1. Initial load: full projected snapshot + history
      const first = await getPanel('/panel/state?window=5h&range=24h');
      expect(first.status).toBe(200);
      const firstData = first.json as PanelStateDataResponse;
      expect(firstData.ok).toBe(true);
      expect(firstData.unchanged).toBeUndefined();
      expect(firstData.snapshot).not.toBeNull();
      expect(firstData.history?.series).toHaveLength(1);
      expect(firstData.rev).toMatch(/^[0-9a-f]{12}$/);
      expect(firstData.hrev).toMatch(/^[0-9a-f]{12}$/);

      // 2. Tick forward timestamps only (generated_at_ms / updated_at_ms / to_sec; no business data changed): returns unchanged: true (<180 B)
      clearBoardCache();
      currentSnap = {
        ...currentSnap,
        generated_at_ms: 1_764_100_015_000,
        antigravity: { ...currentSnap.antigravity, updated_at_ms: 1_764_100_015_000 },
        aistudio: { ...currentSnap.aistudio, updated_at_ms: 1_764_100_015_000 },
      };
      currentHist5h = { ...currentHist5h, to_sec: currentHist5h.to_sec + 15 };
      const second = await getPanel(`/panel/state?window=5h&range=24h&rev=${firstData.rev}&hrev=${firstData.hrev}`);
      expect(second.status).toBe(200);
      expect(second.bytes).toBeLessThan(180);
      const secondData = second.json as PanelStateResponse;
      expect('unchanged' in secondData && secondData.unchanged).toBe(true);
      if ('unchanged' in secondData && secondData.unchanged) {
        expect(secondData.rev).toBe(firstData.rev);
        expect(secondData.hrev).toBe(firstData.hrev);
        expect(secondData.generatedAtMs).toBe(1_764_100_015_000);
      }

      // 3. Snapshot changes (live burn drops estimated_remaining_percent), history points unchanged -> historyUnchanged: true
      clearBoardCache();
      const updatedSnap = structuredClone(currentSnap);
      updatedSnap.generated_at_ms = 1_764_100_030_000;
      updatedSnap.antigravity.accounts[0]!.windows[0]!.estimated_remaining_percent = 76.5;
      updatedSnap.antigravity.accounts[0]!.windows[0]!.post_sample_requests = 5;
      currentSnap = updatedSnap;
      const third = await getPanel(`/panel/state?window=5h&range=24h&rev=${firstData.rev}&hrev=${firstData.hrev}`);
      expect(third.status).toBe(200);
      const thirdData = third.json as PanelStateDataResponse;
      expect(thirdData.ok).toBe(true);
      expect(thirdData.historyUnchanged).toBe(true);
      expect(thirdData.history).toBeUndefined();
      expect(thirdData.rev).not.toBe(firstData.rev);
      expect(thirdData.hrev).toBe(firstData.hrev);
      expect(thirdData.snapshot?.antigravity.accounts[0]?.windows[0]?.estimated_remaining_percent).toBe(76.5);

      // Verify local estimated_point sync updates dashed tail immediately on cached history!
      const synced = syncHistoryEstimatedPointsFromSnapshot(firstData.history!, thirdData.snapshot!);
      expect(synced.series[0]?.estimated_point).toEqual([1_764_100_030, 76.5]);
      expect(synced.to_sec).toBe(1_764_100_030);

      // 4. Switch to 7d without matching hrev -> server returns full 7d history
      const fourth = await getPanel(`/panel/state?window=7d&range=7d&rev=${thirdData.rev}`);
      const fourthData = fourth.json as PanelStateDataResponse;
      expect(fourthData.history?.window).toBe('7d');
      expect(fourthData.history?.series[0]?.key).toBe('gemini_weekly');

      // 5. /panel/history supports optional ?hrev= unchanged hit
      const histHit = await getPanel(`/panel/history?account=ag-pro-1&window=5h&range=24h&hrev=${firstData.hrev}`);
      const histHitData = histHit.json as PanelHistoryResponse;
      expect('unchanged' in histHitData && histHitData.unchanged).toBe(true);
      expect(histHit.bytes).toBeLessThan(120);
    } finally {
      serviceServer.close();
      boardServer.close();
      clearBoardCache();
    }
  });

  it('includes public config in rev hash so external showAis toggles invalidate rev', () => {
    const raw = buildHeavyRawSnapshot();
    const cfgOn = toPublicConfig({ url: 'http://127.0.0.1:18380', passcode: '', showAis: true, compactQuota: true });
    const cfgOff = toPublicConfig({ url: 'http://127.0.0.1:18380', passcode: '', showAis: false, compactQuota: true });
    const revOn = computeSnapshotRev(projectPanelSnapshot(raw, cfgOn), cfgOn);
    const revOff = computeSnapshotRev(projectPanelSnapshot(raw, cfgOff), cfgOff);
    expect(revOn).not.toBe(revOff);

    const hist = projectPanelHistory(buildSampleHistory());
    const hrevA = computeHistoryRev(hist);
    const hrevB = computeHistoryRev({
      ...hist,
      to_sec: (hist.to_sec ?? 0) + 60,
      series: [{ ...hist.series[0]!, estimated_point: [(hist.to_sec ?? 0) + 60, 72.1] }],
    });
    expect(hrevA).toBe(hrevB);
  });
});

describe('syncHistoryEstimatedPointsFromSnapshot edge cases', () => {
  it('advances flat hold when confirmed idle and clears estimated_point when stale or past reset', () => {
    const baseSec = 1_764_099_000;
    const hist = projectPanelHistory(buildSampleHistory(baseSec, '5h'));

    // Confirmed idle post-sample -> holds flat dashed tail at last sample remaining (84%)
    const idleSnap: PanelBoardSnapshot = projectPanelSnapshot(buildHeavyRawSnapshot((baseSec + 600) * 1000), { showAis: true });
    const g5 = idleSnap.antigravity.accounts[0]!.windows[0]!;
    g5.estimated_remaining_percent = null;
    g5.post_sample_requests = 0;
    g5.post_sample_cost_usd = 0;
    g5.post_sample_tokens = 0;

    const syncedIdle = syncHistoryEstimatedPointsFromSnapshot(hist, idleSnap);
    expect(syncedIdle.series[0]?.estimated_point).toEqual([baseSec + 600, 84]);

    // Stale window -> clears estimated_point
    const staleSnap = structuredClone(idleSnap);
    staleSnap.antigravity.accounts[0]!.windows[0]!.stale = true;
    const syncedStale = syncHistoryEstimatedPointsFromSnapshot(hist, staleSnap);
    expect(syncedStale.series[0]?.estimated_point).toBeNull();
  });
});

describe('iframe 3-layer PanelVisibilityTracker', () => {
  it('pauses on display:none (0x0), mobile off-screen translateX (IO false), and tab hidden, firing onBecomeVisible on restore', () => {
    let visibilityState = 'visible';
    let innerWidth = 360;
    let innerHeight = 640;
    let visCb: (() => void) | null = null;
    let resizeCb: (() => void) | null = null;
    let ioCb: ((entries: IntersectionObserverEntryLike[]) => void) | null = null;
    let roCb: (() => void) | null = null;
    let ioOptionsCaptured: { root?: Element | Document | null; threshold?: number | number[] } | undefined;

    class MockIO {
      constructor(cb: (entries: IntersectionObserverEntryLike[]) => void, opts?: { root?: Element | Document | null; threshold?: number | number[] }) {
        ioCb = cb;
        ioOptionsCaptured = opts;
      }
      observe(): void {}
      disconnect(): void {}
    }

    class MockRO {
      constructor(cb: () => void) {
        roCb = cb;
      }
      observe(): void {}
      disconnect(): void {}
    }

    let becomeVisibleCount = 0;
    const tracker = createPanelVisibilityTracker({
      doc: {
        get visibilityState() { return visibilityState; },
        documentElement: {} as Element,
        addEventListener: (_t, fn) => { visCb = fn; },
        removeEventListener: () => { visCb = null; },
      },
      win: {
        get innerWidth() { return innerWidth; },
        get innerHeight() { return innerHeight; },
        addEventListener: (_t, fn) => { resizeCb = fn; },
        removeEventListener: () => { resizeCb = null; },
      },
      IntersectionObserverCtor: MockIO,
      ResizeObserverCtor: MockRO,
      onBecomeVisible: () => { becomeVisibleCount += 1; },
    });

    // Starts visible (default intersecting = true so first paint is never blocked)
    expect(ioOptionsCaptured).toEqual({ root: null, threshold: 0.01 });
    expect(tracker.isVisible()).toBe(true);
    expect(becomeVisibleCount).toBe(0);

    // 1. Desktop display:none -> 0x0 viewport
    innerWidth = 0;
    innerHeight = 0;
    roCb?.();
    expect(tracker.isVisible()).toBe(false);
    expect(becomeVisibleCount).toBe(0);

    // Restore desktop sidebar -> triggers onBecomeVisible once
    innerWidth = 320;
    innerHeight = 700;
    resizeCb?.();
    expect(tracker.isVisible()).toBe(true);
    expect(becomeVisibleCount).toBe(1);

    // 2. Mobile drawer closed (translateX(100%)) -> IO isIntersecting = false while visibilityState stays 'visible'
    ioCb?.([{ isIntersecting: false }]);
    expect(tracker.isVisible()).toBe(false);
    expect(becomeVisibleCount).toBe(1);

    // Reopen mobile drawer -> IO isIntersecting = true triggers immediate sync
    ioCb?.([{ isIntersecting: true }]);
    expect(tracker.isVisible()).toBe(true);
    expect(becomeVisibleCount).toBe(2);

    // 3. Background browser tab -> visibilityState = 'hidden'
    visibilityState = 'hidden';
    visCb?.();
    expect(tracker.isVisible()).toBe(false);
    visibilityState = 'visible';
    visCb?.();
    expect(tracker.isVisible()).toBe(true);
    expect(becomeVisibleCount).toBe(3);

    // Duplicate visible event does not double-fire
    resizeCb?.();
    expect(becomeVisibleCount).toBe(3);
    tracker.dispose();
  });

  it('degrades gracefully when IntersectionObserver and ResizeObserver are unavailable', () => {
    const tracker = createPanelVisibilityTracker({
      doc: {
        visibilityState: 'visible',
        documentElement: {} as Element,
        addEventListener: () => {},
        removeEventListener: () => {},
      },
      win: {
        innerWidth: 360,
        innerHeight: 640,
        addEventListener: () => {},
        removeEventListener: () => {},
      },
      IntersectionObserverCtor: null,
      ResizeObserverCtor: null,
    });
    expect(tracker.isVisible()).toBe(true);
    tracker.dispose();
  });
});

describe('upstream clients (?view=compact / ?view=tui, If-None-Match -> 304, legacy 200 OK)', () => {
  it('src/service/client.ts uses ?view=compact, reuses 304 snapshot/history with updated headers, and handles legacy 200 OK', async () => {
    clearBoardCache();
    const seenUrls: string[] = [];
    const seenIfNoneMatch: Array<string | undefined> = [];
    let mode: 'etag' | 'legacy' = 'etag';
    let genMs = 1_764_100_000_000;
    let histToSec = 1_764_099_300;
    const snap = buildHeavyRawSnapshot(genMs);
    const hist = buildSampleHistory(1_764_099_000, '5h');

    const server = http.createServer((req, res) => {
      seenUrls.push(req.url ?? '');
      seenIfNoneMatch.push(req.headers['if-none-match']);
      const url = new URL(req.url ?? '/', 'http://127.0.0.1');

      if (url.pathname === '/api/snapshot') {
        if (mode === 'etag') {
          const etag = 'W/"snap-compact-abc123"';
          if (req.headers['if-none-match'] === etag) {
            res.writeHead(304, { ETag: etag, 'X-Generated-At-Ms': String(genMs) });
            res.end();
            return;
          }
          res.writeHead(200, {
            'Content-Type': 'application/json',
            ETag: etag,
            'X-Generated-At-Ms': String(genMs),
          });
          res.end(JSON.stringify({ ...snap, generated_at_ms: genMs }));
          return;
        }
        // Legacy board: ignores ?view=compact, no ETag header
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ...snap, generated_at_ms: genMs }));
        return;
      }

      if (url.pathname === '/api/antigravity/history') {
        const etag = 'W/"hist-xyz789"';
        if (mode === 'etag' && req.headers['if-none-match'] === etag) {
          res.writeHead(304, { ETag: etag, 'X-History-To-Sec': String(histToSec) });
          res.end();
          return;
        }
        res.writeHead(200, {
          'Content-Type': 'application/json',
          ...(mode === 'etag' ? { ETag: etag, 'X-History-To-Sec': String(histToSec) } : {}),
        });
        res.end(JSON.stringify({ ...hist, to_sec: histToSec }));
        return;
      }

      res.writeHead(404);
      res.end();
    });

    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
    const port = (server.address() as { port: number }).port;
    const cfg: PoolQuotaConfig = {
      url: `http://127.0.0.1:${port}`,
      passcode: '',
      showAis: true,
      compactQuota: true,
    };

    try {
      // 1. Initial snapshot fetch -> ?view=compact, 200 OK with ETag
      const r1 = await fetchBoardSnapshot(cfg, { force: true, fresh: false });
      expect(r1.ok).toBe(true);
      expect(seenUrls[0]).toBe('/api/snapshot?view=compact');
      expect(seenIfNoneMatch[0]).toBeUndefined();

      // 2. Forced fresh fetch -> ?view=compact&fresh=1 + If-None-Match -> 304 reuses cache with updated X-Generated-At-Ms
      genMs = 1_764_100_045_000;
      const r2 = await fetchBoardSnapshot(cfg, { force: true, fresh: true });
      expect(r2.ok).toBe(true);
      if (r2.ok) {
        expect(r2.data.generated_at_ms).toBe(genMs);
        expect(r2.data.aistudio.models).toHaveLength(14);
      }
      expect(seenUrls[1]).toBe('/api/snapshot?view=compact&fresh=1');
      expect(seenIfNoneMatch[1]).toBe('W/"snap-compact-abc123"');

      // 3. History fetch -> 200 then 304 updating X-History-To-Sec
      const h1 = await fetchAntigravityHistory(cfg, { accountId: 'ag-pro-1', window: '5h', range: '24h', force: true });
      expect(h1.ok).toBe(true);
      histToSec = 1_764_099_900;
      const h2 = await fetchAntigravityHistory(cfg, { accountId: 'ag-pro-1', window: '5h', range: '24h', force: true });
      expect(h2.ok).toBe(true);
      if (h2.ok) {
        expect(h2.data.to_sec).toBe(histToSec);
        expect(h2.data.series[0]?.points).toHaveLength(48);
      }
      expect(seenIfNoneMatch[seenIfNoneMatch.length - 1]).toBe('W/"hist-xyz789"');

      // 4. Legacy 200 OK board (no ETag)
      clearBoardCache();
      mode = 'legacy';
      genMs = 1_764_100_090_000;
      const rLegacy = await fetchBoardSnapshot(cfg, { force: true, fresh: false });
      expect(rLegacy.ok).toBe(true);
      if (rLegacy.ok) {
        expect(rLegacy.data.generated_at_ms).toBe(genMs);
      }
    } finally {
      server.close();
      clearBoardCache();
    }
  });

  it('plugin/index.js requests ?view=compact, sends If-None-Match and reuses 304 with X-Generated-At-Ms + legacy 200 OK', async () => {
    const seenUrls: string[] = [];
    const seenHeaders: Array<string | undefined> = [];
    let status304Count = 0;
    let genMs = 1_764_100_100_000;
    let legacyMode = false;
    const snap = buildHeavyRawSnapshot(genMs);

    const server = http.createServer((req, res) => {
      seenUrls.push(req.url ?? '');
      seenHeaders.push(req.headers['if-none-match']);
      if (req.url?.startsWith('/api/snapshot')) {
        if (!legacyMode && req.headers['if-none-match'] === 'W/"snap-compact-srv1"') {
          status304Count += 1;
          res.writeHead(304, {
            ETag: 'W/"snap-compact-srv1"',
            'X-Generated-At-Ms': String(genMs),
          });
          res.end();
          return;
        }
        res.writeHead(200, {
          'Content-Type': 'application/json',
          ...(legacyMode ? {} : { ETag: 'W/"snap-compact-srv1"', 'X-Generated-At-Ms': String(genMs) }),
        });
        res.end(JSON.stringify({ ...snap, generated_at_ms: genMs }));
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
        options: { url: `http://127.0.0.1:${port}`, showAis: true },
        tool: {
          transform: async (fn: (editor: { add: (tool: typeof registeredTool) => void }) => void) => {
            fn({ add: (tool) => { registeredTool = tool; } });
          },
        },
      });

      const res1 = await registeredTool!.execute({ scope: 'all', refresh: false });
      const body1 = JSON.parse(res1.content) as { generated_at: string; aistudio: { models: unknown[] } };
      expect(seenUrls[0]).toBe('/api/snapshot?view=compact');
      expect(body1.aistudio.models).toHaveLength(14);
      expect(body1.generated_at).toBe(new Date(genMs).toISOString());

      // Second call with refresh=true sends ?view=compact&fresh=1 + If-None-Match -> 304 reuse
      genMs = 1_764_100_160_000;
      const res2 = await registeredTool!.execute({ scope: 'all', refresh: true });
      const body2 = JSON.parse(res2.content) as { generated_at: string; aistudio: { models: unknown[] } };
      expect(seenUrls[1]).toBe('/api/snapshot?view=compact&fresh=1');
      expect(seenHeaders[1]).toBe('W/"snap-compact-srv1"');
      expect(status304Count).toBe(1);
      expect(body2.generated_at).toBe(new Date(genMs).toISOString());
      expect(body2.aistudio.models).toHaveLength(14);

      // Legacy 200 OK response
      legacyMode = true;
      genMs = 1_764_100_200_000;
      const res3 = await registeredTool!.execute({ scope: 'all', refresh: true });
      const body3 = JSON.parse(res3.content) as { generated_at: string };
      expect(body3.generated_at).toBe(new Date(genMs).toISOString());
    } finally {
      server.close();
    }
  });

  it('plugin/tui.tsx requests ?view=tui, handles If-None-Match -> 304 + X-Generated-At-Ms, and falls back to legacy 200 OK', async () => {
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

    const tuiMod = await import('../plugin/tui.tsx');
    tuiMod.clearSnapshotCache();

    const seenUrls: string[] = [];
    const seenHeaders: Array<string | undefined> = [];
    let genMs = 1_764_100_300_000;
    let legacyMode = false;
    const snap = buildHeavyRawSnapshot(genMs);

    const server = http.createServer((req, res) => {
      seenUrls.push(req.url ?? '');
      seenHeaders.push(req.headers['if-none-match']);
      if (req.url?.startsWith('/api/snapshot')) {
        if (!legacyMode && req.headers['if-none-match'] === 'W/"snap-tui-999"') {
          res.writeHead(304, {
            ETag: 'W/"snap-tui-999"',
            'X-Generated-At-Ms': String(genMs),
          });
          res.end();
          return;
        }
        res.writeHead(200, {
          'Content-Type': 'application/json',
          ...(legacyMode ? {} : { ETag: 'W/"snap-tui-999"', 'X-Generated-At-Ms': String(genMs) }),
        });
        res.end(JSON.stringify({ ...snap, generated_at_ms: genMs }));
        return;
      }
      res.writeHead(404);
      res.end();
    });

    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
    const port = (server.address() as { port: number }).port;
    const cfg = {
      url: `http://127.0.0.1:${port}`,
      passcode: '',
      showAis: true,
      compactQuota: true,
    };

    try {
      const r1 = await tuiMod.fetchBoardSnapshot(cfg);
      expect(r1.ok).toBe(true);
      expect(seenUrls[0]).toBe('/api/snapshot?view=tui');
      expect(seenHeaders[0]).toBeUndefined();

      genMs = 1_764_100_345_000;
      const r2 = await tuiMod.fetchBoardSnapshot(cfg, { fresh: true });
      expect(r2.ok).toBe(true);
      if (r2.ok) {
        expect(r2.data.generated_at_ms).toBe(genMs);
        expect(r2.data.aistudio?.models).toHaveLength(14);
      }
      expect(seenUrls[1]).toBe('/api/snapshot?view=tui&fresh=1');
      expect(seenHeaders[1]).toBe('W/"snap-tui-999"');

      // Legacy 200 OK fallback
      tuiMod.clearSnapshotCache();
      legacyMode = true;
      genMs = 1_764_100_390_000;
      const r3 = await tuiMod.fetchBoardSnapshot(cfg);
      expect(r3.ok).toBe(true);
      if (r3.ok) {
        expect(r3.data.generated_at_ms).toBe(genMs);
      }
    } finally {
      server.close();
      tuiMod.clearSnapshotCache();
    }
  });
});

describe('manifest invariants & lossless panel CSS minification', () => {
  it('keeps Work Status interval at 15000ms and version at 1.3.1', () => {
    const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
      version: string;
      openchamber: { contributes: { statusSection: { source: { interval: number } } } };
    };
    expect(pkg.version).toBe('1.3.1');
    expect(pkg.openchamber.contributes.statusSection.source.interval).toBe(15_000);
  });

  it('losslessly minifies PANEL_CSS while preserving calc(), color-mix(), theme & media selectors', () => {
    const minified = minifyCss(PANEL_CSS);
    expect(minified.length).toBeLessThan(PANEL_CSS.length * 0.72);
    expect(minified).toContain('calc(var(--pq-radius) - 3px)');
    expect(minified).toContain('color-mix(in srgb,var(--pq-healthy) 30%,transparent)');
    expect(minified).toContain(':root[data-oc-theme="dark"]');
    expect(minified).toContain('@media (max-width:260px)');
    expect(minified).not.toContain('/*');
  });
});
