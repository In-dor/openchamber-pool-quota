import { clampPercent } from '../shared/format.ts';
import type {
  PanelAntigravityHistoryResponse,
  PanelAntigravityWindow,
  PanelBoardSnapshot,
} from '../shared/types.ts';

const round3 = (value: number): number => Math.round(value * 1000) / 1000;

const toEpochSec = (ts: number): number => (ts > 1e12 ? Math.floor(ts / 1000) : Math.floor(ts));

/**
 * Updates locally cached history's live dashed-tail `estimated_point` and `to_sec`
 * from the latest snapshot whenever `/panel/state` returns `historyUnchanged: true`
 * or `/panel/history` returns `unchanged: true`, matching Pool Status Board's
 * post-sample estimation rules without retransmitting historical sample points.
 */
export const syncHistoryEstimatedPointsFromSnapshot = (
  history: PanelAntigravityHistoryResponse,
  snapshot: PanelBoardSnapshot,
  nowMsFallback: number = Date.now(),
): PanelAntigravityHistoryResponse => {
  const acct = snapshot.antigravity?.accounts?.find((a) => a.id === history.account_id);
  if (!acct || !Array.isArray(history.series)) {
    return history;
  }

  const winByKey = new Map<string, PanelAntigravityWindow>();
  for (const w of acct.windows ?? []) {
    winByKey.set(w.key, w);
  }

  const genMs = snapshot.generated_at_ms > 0 ? snapshot.generated_at_ms : nowMsFallback;
  const nowSec = Math.floor(genMs / 1000);

  const nextSeries = history.series.map((s) => {
    const w = winByKey.get(s.key);
    if (!w) return s;

    const nextRemaining = Number.isFinite(w.remaining_percent)
      ? clampPercent(w.remaining_percent)
      : s.remaining;

    const pts = Array.isArray(s.points) ? s.points : [];
    const lastPt = pts[pts.length - 1];
    let nextEstimatedPoint: [number, number] | null = null;

    if (!w.stale && lastPt) {
      const lastTSec = toEpochSec(lastPt[0]);
      const lastRem = clampPercent(lastPt[1]);
      const resetSec = w.reset_at_ms > 0 ? Math.floor(w.reset_at_ms / 1000) : 0;
      const afterSample = nowSec > lastTSec + 20;
      const beforeReset = resetSec === 0 || nowSec < resetSec;

      if (afterSample && lastRem > 0 && beforeReset) {
        const hasLiveEstimate = typeof w.estimated_remaining_percent === 'number'
          && Number.isFinite(w.estimated_remaining_percent);
        const estClamped = hasLiveEstimate ? clampPercent(w.estimated_remaining_percent!) : null;

        if (estClamped !== null && estClamped < lastRem) {
          nextEstimatedPoint = [nowSec, round3(estClamped)];
        } else if (
          (w.post_sample_requests ?? 0) === 0
          && (w.post_sample_cost_usd ?? 0) === 0
          && (w.post_sample_tokens ?? 0) === 0
          && (s.estimated_point != null || typeof w.post_sample_requests === 'number')
        ) {
          nextEstimatedPoint = [nowSec, round3(lastRem)];
        }
      }
    }

    return {
      ...s,
      remaining: nextRemaining,
      estimated_point: nextEstimatedPoint,
    };
  });

  return {
    ...history,
    to_sec: Math.max(history.to_sec ?? 0, nowSec),
    series: nextSeries,
  };
};
