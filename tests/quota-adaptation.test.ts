import fs from 'node:fs';
import http from 'node:http';
import { describe, expect, it } from 'bun:test';
import {
  MOBILE_COMPACT_GAP_PX,
  MOBILE_COMPACT_ROW_MAX_PX,
  estimateMobileTextWidthPx,
  formatAisModelCompactValueLabel,
  formatAisModelValueLabel,
  isBottleneckTokens,
  isRequestsOnlyAisModel,
} from '../src/shared/format.ts';
import type { AIStudioModelSummary, BoardSnapshot, PoolQuotaConfig } from '../src/shared/types.ts';
import { buildQuotaUsageData } from '../src/service/quota-view.ts';
import { buildStatusView } from '../src/service/status-view.ts';
import serverPlugin from '../plugin/index.js';

const ALL_14_MODELS: Array<{ id: string; label: string; category?: string; limit_tokens: number }> = [
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

const makeModel = (
  base: { id: string; label: string; category?: string; limit_tokens: number },
  overrides: Partial<AIStudioModelSummary> = {},
): AIStudioModelSummary => ({
  id: base.id,
  label: base.label,
  ...(base.category ? { category: base.category } : {}),
  eligible_tiers: ['Pro', 'Ultra'],
  eligible_accounts: 13,
  available_accounts: 13,
  cooling_accounts: 0,
  exhausted_accounts: 0,
  unavailable_accounts: 0,
  limit_requests: 650,
  used_requests: 0,
  effective_remaining_requests: 650,
  limit_tokens: base.limit_tokens,
  used_tokens: 0,
  effective_remaining_tokens: base.limit_tokens,
  effective_percent: 100,
  ...overrides,
});

const makeSnapshot = (models: AIStudioModelSummary[]): BoardSnapshot => ({
  generated_at_ms: Date.now(),
  refresh_interval_seconds: 15,
  antigravity: {
    online: true,
    status: 'healthy',
    cpamp_status: 'healthy',
    updated_at_ms: Date.now(),
    summary: {
      active_accounts: 1,
      tier_counts: { Ultra: 1 },
      total_requests: 10,
      total_tokens: 100_000,
      total_cost: 1.5,
      weighted_success_rate: 100,
      window_averages: [],
    },
    accounts: [
      {
        id: 'ag-1',
        code_name: 'Account-1',
        tier: 'Ultra',
        status: 'available',
        status_label: '可用',
        has_history: false,
        windows: [
          {
            key: 'gemini_5h',
            label: 'Gemini 5h',
            group: 'gemini',
            duration_seconds: 18_000,
            remaining_percent: 85,
            used_percent: 15,
            reset_at_ms: Date.now() + 3_600_000,
            observed_at_ms: Date.now() - 30_000,
            stale: false,
            has_current_usage: true,
            current_requests: 5,
            current_tokens: 50_000,
            current_cost: 0.8,
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
    status: 'healthy',
    updated_at_ms: Date.now(),
    service_state: 'ready',
    service_ready: true,
    active_requests: 0,
    cycle_start_ms: Date.now() - 3_600_000,
    next_reset_ms: Date.now() + 7_200_000,
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
      requests: 42,
      succeeded: 42,
      failed: 0,
      canceled: 0,
      rate_limited: 0,
      success_rate: 100,
      input_tokens: 10_000,
      reply_tokens: 20_000,
      total_tokens: 30_000,
      first_event_avg_ms: 400,
      first_event_p50_ms: 350,
      first_event_p95_ms: 700,
      active_cooldowns: 0,
    },
    models,
  },
});

const DEFAULT_CFG: PoolQuotaConfig = {
  url: 'http://127.0.0.1:18380',
  passcode: '',
  showAis: true,
  compactQuota: true,
};

describe('requests-only models (limit_tokens <= 0)', () => {
  it('detects requests-only mode and never flags token bottleneck', () => {
    const imgModel = makeModel(ALL_14_MODELS[13]!, {
      effective_remaining_requests: 500,
      used_requests: 150,
      used_tokens: 1_250_000,
      effective_remaining_tokens: 0,
      effective_percent: 76.9,
    });
    expect(isRequestsOnlyAisModel(imgModel)).toBe(true);
    expect(isBottleneckTokens(imgModel)).toBe(false);

    const textModel = makeModel(ALL_14_MODELS[1]!, {
      limit_requests: 150,
      effective_remaining_requests: 140,
      limit_tokens: 20_000_000,
      effective_remaining_tokens: 5_000_000,
      effective_percent: 25,
    });
    expect(isRequestsOnlyAisModel(textModel)).toBe(false);
    expect(isBottleneckTokens(textModel)).toBe(true);
  });

  it('omits /0 token suffix in formatAisModelValueLabel when limit_tokens <= 0', () => {
    const imgModel = makeModel(ALL_14_MODELS[10]!, {
      available_accounts: 12,
      eligible_accounts: 13,
      effective_remaining_requests: 600,
      effective_remaining_tokens: 0,
      effective_percent: 92.3,
    });
    const label = formatAisModelValueLabel(imgModel);
    expect(label).toBe('12/13号 · 92.3% · 剩600次');
    expect(label).not.toContain('/0');

    const textModel = makeModel(ALL_14_MODELS[0]!, {
      available_accounts: 13,
      eligible_accounts: 13,
      effective_remaining_requests: 650,
      effective_remaining_tokens: 150_000_000,
      effective_percent: 100,
    });
    expect(formatAisModelValueLabel(textModel)).toBe('13/13号 · 100% · 剩650次/150M');
  });
});

describe('mobile <286px compact width budget across all 14 models', () => {
  const scenarios: Array<{
    name: string;
    overrides: Partial<AIStudioModelSummary>;
    expectNull?: boolean;
  }> = [
    { name: 'all available (100%)', overrides: { available_accounts: 13, eligible_accounts: 13, effective_percent: 100 }, expectNull: true },
    { name: 'all available (92.3%)', overrides: { available_accounts: 13, eligible_accounts: 13, effective_percent: 92.3 }, expectNull: true },
    { name: 'zero eligible (0/0)', overrides: { available_accounts: 0, eligible_accounts: 0, effective_percent: 0 } },
    { name: 'exhausted (0/13)', overrides: { available_accounts: 0, eligible_accounts: 13, effective_percent: 0 } },
    { name: 'partial worst 12/13 @ 92%', overrides: { available_accounts: 12, eligible_accounts: 13, effective_percent: 92 } },
    { name: 'partial worst 12/13 @ 92.3%', overrides: { available_accounts: 12, eligible_accounts: 13, effective_percent: 92.3 } },
    { name: 'partial worst 12/13 @ 99.6%', overrides: { available_accounts: 12, eligible_accounts: 13, effective_percent: 99.6 } },
    { name: 'partial worst 12/13 @ 100%', overrides: { available_accounts: 12, eligible_accounts: 13, effective_percent: 100 } },
    { name: 'partial 9/13 @ 100%', overrides: { available_accounts: 9, eligible_accounts: 13, effective_percent: 100 } },
    { name: 'partial 1/13 @ 8.4%', overrides: { available_accounts: 1, eligible_accounts: 13, effective_percent: 8.4 } },
  ];

  it('keeps left + 12px gap + right <= 282px (< 286px) for every model and scenario', () => {
    for (const def of ALL_14_MODELS) {
      const leftMeasured = estimateMobileTextWidthPx(`${def.id} · 每日`);
      const leftFloor = def.id.length >= 27 ? 215 : def.id.length >= 22 ? 192 : leftMeasured;
      const leftPx = Math.max(leftMeasured, leftFloor);

      for (const scenario of scenarios) {
        const model = makeModel(def, scenario.overrides);
        const compact = formatAisModelCompactValueLabel(model);
        if (scenario.expectNull) {
          expect(compact).toBeNull();
        } else {
          expect(compact).not.toBeNull();
        }
        const displayedRight = compact ?? '100%';
        const rightPx = estimateMobileTextWidthPx(displayedRight);
        const totalPx = leftPx + MOBILE_COMPACT_GAP_PX + rightPx;

        expect(totalPx).toBeLessThanOrEqual(MOBILE_COMPACT_ROW_MAX_PX);
        expect(totalPx).toBeLessThan(286);
      }
    }
  });

  it('uses ultra-compact labels for 27-char Lite image and tightened no-space labels for <=22-char models', () => {
    const lite27 = ALL_14_MODELS[13]!;
    expect(lite27.id.length).toBe(27);
    expect(formatAisModelCompactValueLabel(makeModel(lite27, { available_accounts: 0, eligible_accounts: 13, effective_percent: 0 }))).toBe('耗尽');
    expect(formatAisModelCompactValueLabel(makeModel(lite27, { available_accounts: 12, eligible_accounts: 13, effective_percent: 92.3 }))).toBe('92%·12');
    expect(formatAisModelCompactValueLabel(makeModel(lite27, { available_accounts: 12, eligible_accounts: 13, effective_percent: 100 }))).toBe('12/13');

    const banana21 = ALL_14_MODELS[10]!;
    expect(banana21.id.length).toBe(22);
    expect(formatAisModelCompactValueLabel(makeModel(banana21, { available_accounts: 0, eligible_accounts: 13, effective_percent: 0 }))).toBe('耗尽');
    expect(formatAisModelCompactValueLabel(makeModel(banana21, { available_accounts: 12, eligible_accounts: 13, effective_percent: 92.3 }))).toBe('12/13·92%');
    expect(formatAisModelCompactValueLabel(makeModel(banana21, { available_accounts: 12, eligible_accounts: 13, effective_percent: 100 }))).toBe('100%·12');

    const bananaPro = ALL_14_MODELS[11]!;
    expect(bananaPro.id.length).toBe(18);
    expect(formatAisModelCompactValueLabel(makeModel(bananaPro, { available_accounts: 0, eligible_accounts: 13, effective_percent: 0 }))).toBe('0/13·耗尽');
    expect(formatAisModelCompactValueLabel(makeModel(bananaPro, { available_accounts: 12, eligible_accounts: 13, effective_percent: 92.3 }))).toBe('12/13·92%');
  });
});

describe('quota-view & status-view integration', () => {
  it('preserves all 14 raw model.id keys in buildQuotaUsageData and never emits /0', () => {
    const models = ALL_14_MODELS.map((def, idx) => makeModel(def, {
      available_accounts: idx >= 10 ? 12 : 13,
      effective_percent: idx >= 10 ? 92.3 : 100,
      effective_remaining_requests: idx >= 10 ? 600 : 650,
    }));
    const snap = makeSnapshot(models);

    const compactData = buildQuotaUsageData(snap, { ...DEFAULT_CFG, compactQuota: true });
    expect(compactData.ok).toBe(true);
    expect(Object.keys(compactData.usage?.models ?? {})).toEqual(ALL_14_MODELS.map((m) => m.id));
    expect(compactData.usage?.models?.['gemini-3.1-flash-lite-image']?.windows.daily?.valueLabel).toBe('92%·12');

    const detailedData = buildQuotaUsageData(snap, { ...DEFAULT_CFG, compactQuota: false });
    const liteLabel = detailedData.usage?.models?.['gemini-3.1-flash-lite-image']?.windows.daily?.valueLabel ?? '';
    expect(liteLabel).toBe('12/13号 · 92.3% · 剩600次');
    expect(liteLabel).not.toContain('/0');
  });

  it('uses Nano Banana short labels and omits / 0 tok in status-view tooltips', () => {
    const models = ALL_14_MODELS.map((def) => {
      if (def.category === 'image') {
        return makeModel(def, {
          available_accounts: 3,
          eligible_accounts: 13,
          effective_percent: 25,
          effective_remaining_requests: 120,
          used_requests: 530,
          used_tokens: def.id === 'gemini-nano-banana-2.1' ? 1_400_000 : 0,
        });
      }
      return makeModel(def);
    });
    const snap = makeSnapshot(models);
    const view = buildStatusView(snap, null, DEFAULT_CFG);
    const lineRows = view.rows.filter((r) => r.kind === 'line');
    const byId = new Map(lineRows.map((r) => [r.id, r]));

    // Check whichever Nano Banana rows fit within GUEST_STATUS_VIEW_ROWS_MAX
    const banana21 = byId.get('ais-gemini-nano-banana-2-1');
    expect(banana21).toBeDefined();
    expect(banana21?.label).toBe('AIS Banana 2.1');
    expect(banana21?.tooltip).toContain('剩 120次 · 已耗 1.4M tok');
    expect(banana21?.tooltip).not.toContain('/ 0 tok');

    const bananaPro = byId.get('ais-gemini-3-pro-image');
    expect(bananaPro?.label).toBe('AIS Banana Pro');
    expect(bananaPro?.tooltip).toContain('剩 120次');
    expect(bananaPro?.tooltip).not.toContain('/ 0 tok');
    expect(bananaPro?.tooltip).not.toContain('已耗');

    // Verify the remaining two short labels directly with a minimal snapshot containing only the 4 image models
    const imageOnlySnap = makeSnapshot(models.filter((m) => m.category === 'image'));
    const imageOnlyView = buildStatusView(imageOnlySnap, null, DEFAULT_CFG);
    const labels = imageOnlyView.rows
      .filter((r) => r.kind === 'line' && r.id.startsWith('ais-gemini-'))
      .map((r) => r.label);
    expect(labels).toEqual([
      'AIS Banana 2.1',
      'AIS Banana Pro',
      'AIS Banana 2',
      'AIS Banana Lite',
    ]);
  });
});

describe('plugin/index.js pool_quota server tool', () => {
  it('removes hardcoded 10 models text and outputs requests_only metadata for image models', async () => {
    const models = ALL_14_MODELS.map((def) => makeModel(def, {
      used_tokens: def.category === 'image' ? 2_500_000 : 12_000_000,
      effective_remaining_requests: 500,
      effective_percent: 80,
    }));
    const snap = makeSnapshot(models);

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
    const addr = server.address();
    const port = typeof addr === 'object' && addr ? addr.port : 0;

    try {
      let registeredTool: {
        name: string;
        description: string;
        input: { properties: { include_models: { description: string } } };
        execute: (input: Record<string, unknown>, ctx?: unknown) => Promise<{ content: string }>;
      } | null = null;

      await serverPlugin.setup({
        options: { url: `http://127.0.0.1:${port}`, showAis: true },
        tool: {
          transform: async (fn: (editor: { add: (tool: typeof registeredTool) => void }) => void) => {
            fn({
              add: (tool) => {
                registeredTool = tool;
              },
            });
          },
        },
      });

      expect(registeredTool).not.toBeNull();
      expect(registeredTool!.description).not.toContain('10 models');
      expect(registeredTool!.input.properties.include_models.description).not.toContain('10');

      const result = await registeredTool!.execute({ scope: 'aistudio', include_models: true, refresh: true });
      const parsed = JSON.parse(result.content) as {
        aistudio: {
          models: Array<{
            id: string;
            category?: string;
            remaining_tokens: string | null;
            used_tokens: string;
            quota_mode: string;
          }>;
        };
      };

      expect(parsed.aistudio.models).toHaveLength(14);

      const liteImg = parsed.aistudio.models.find((m) => m.id === 'gemini-3.1-flash-lite-image')!;
      expect(liteImg.category).toBe('image');
      expect(liteImg.remaining_tokens).toBeNull();
      expect(liteImg.used_tokens).toBe('2.5M');
      expect(liteImg.quota_mode).toBe('requests_only');

      const carbon = parsed.aistudio.models.find((m) => m.id === 'gemini-4-carbon')!;
      expect(carbon.remaining_tokens).toBe('120M');
      expect(carbon.used_tokens).toBe('12.0M');
      expect(carbon.quota_mode).toBe('requests_and_tokens');
    } finally {
      server.close();
    }
  });
});

describe('plugin/tui.tsx TSX validity and Nano Banana formatting', () => {
  it('transpiles cleanly, computes dynamic ID width >= 28 for 27-char Lite model, and shortens footer names', () => {
    const src = fs.readFileSync(new URL('../plugin/tui.tsx', import.meta.url), 'utf8');
    const transpiler = new Bun.Transpiler({ loader: 'tsx' });
    expect(() => transpiler.transformSync(src)).not.toThrow();

    expect(src).toContain('aisIdColWidth');
    expect(src).not.toContain('m.id.padEnd(23, " ")');
    expect(src).toContain('isRequestsOnlyModel');
    expect(src).toContain('"gemini-nano-banana-2.1": "banana-2.1"');
    expect(src).toContain('"gemini-3-pro-image": "banana-pro"');
    expect(src).toContain('"gemini-3.1-flash-image": "banana-2"');
    expect(src).toContain('"gemini-3.1-flash-lite-image": "banana-lite"');

    const dynamicWidth = Math.max(23, ...ALL_14_MODELS.map((m) => m.id.length + 1));
    expect(dynamicWidth).toBe(28);
    // Worst-case TUI dialog row display columns:
    // "▸ " (2) + padEnd(28) + " " (1) + bar(10) + " 100%" (6) + " 13/13号" (8) + " 剩1500次/250M" (15) = 70 cols
    const worstCols = 2 + dynamicWidth + 1 + 10 + 6 + 8 + 15;
    expect(worstCols).toBeLessThanOrEqual(76);
  });
});
