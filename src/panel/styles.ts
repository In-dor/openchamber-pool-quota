export const PANEL_CSS = `
    :root {
      --pq-bg: var(--oc-bg, var(--surface-background, transparent));
      --pq-surface: var(--oc-elevated, var(--surface-elevated, rgba(127, 127, 127, 0.05)));
      --pq-surface-2: var(--oc-muted-surface, var(--surface-muted, rgba(127, 127, 127, 0.08)));
      --pq-fg: var(--oc-fg, var(--surface-foreground, #0f172a));
      --pq-muted: var(--oc-muted, var(--surface-muted-foreground, #64748b));
      --pq-border: var(--oc-border, var(--interactive-border, rgba(127, 127, 127, 0.22)));
      --pq-hover: var(--oc-hover, var(--interactive-hover, rgba(127, 127, 127, 0.1)));
      --pq-primary: var(--oc-primary, var(--primary, #0284c7));
      --pq-radius: var(--oc-radius, var(--radius, 10px));

      /* 5-level health palette (Light theme) */
      --pq-full: #0284c7;
      --pq-full-bar: #0ea5e9;
      --pq-full-bg: rgba(2, 132, 199, 0.11);

      --pq-healthy: #059669;
      --pq-healthy-bar: #10b981;
      --pq-healthy-bg: rgba(5, 150, 105, 0.11);

      --pq-moderate: #d97706;
      --pq-moderate-bar: #f59e0b;
      --pq-moderate-bg: rgba(217, 119, 6, 0.13);

      --pq-low: #dc2626;
      --pq-low-bar: #ef4444;
      --pq-low-bg: rgba(220, 38, 38, 0.12);

      --pq-empty: #991b1b;
      --pq-empty-bar: #991b1b;
      --pq-empty-bg: rgba(153, 27, 27, 0.16);
      --pq-empty-track: repeating-linear-gradient(
        -45deg,
        rgba(153, 27, 27, 0.18),
        rgba(153, 27, 27, 0.18) 4px,
        rgba(153, 27, 27, 0.06) 4px,
        rgba(153, 27, 27, 0.06) 8px
      );

      /* Tier badges (Light): Ultra 金紫, Pro 蓝, Free 灰 */
      --pq-tier-ultra-bg: linear-gradient(135deg, rgba(139, 92, 246, 0.16), rgba(217, 119, 6, 0.17));
      --pq-tier-ultra-fg: #6d28d9;
      --pq-tier-ultra-bd: rgba(139, 92, 246, 0.34);

      --pq-tier-pro-bg: rgba(37, 99, 235, 0.11);
      --pq-tier-pro-fg: #1d4ed8;
      --pq-tier-pro-bd: rgba(37, 99, 235, 0.25);

      --pq-tier-free-bg: rgba(100, 116, 139, 0.12);
      --pq-tier-free-fg: #475569;
      --pq-tier-free-bd: rgba(100, 116, 139, 0.22);

      /* Model family chart palette (Light) */
      --pq-series-gemini: #0284c7;
      --pq-series-gemini-2: #06b6d4;
      --pq-series-claude: #9333ea;
      --pq-series-claude-2: #ec4899;
      --pq-series-argon: #d97706;
    }

    :root[data-oc-theme="dark"] {
      --pq-fg: var(--oc-fg, var(--surface-foreground, #f1f5f9));
      --pq-muted: var(--oc-muted, var(--surface-muted-foreground, #94a3b8));

      /* 5-level health palette (Dark theme) */
      --pq-full: #38bdf8;
      --pq-full-bar: #38bdf8;
      --pq-full-bg: rgba(56, 189, 248, 0.16);

      --pq-healthy: #34d399;
      --pq-healthy-bar: #34d399;
      --pq-healthy-bg: rgba(52, 211, 153, 0.15);

      --pq-moderate: #fbbf24;
      --pq-moderate-bar: #fbbf24;
      --pq-moderate-bg: rgba(251, 191, 36, 0.16);

      --pq-low: #f87171;
      --pq-low-bar: #f87171;
      --pq-low-bg: rgba(248, 113, 113, 0.17);

      --pq-empty: #fda4af;
      --pq-empty-bar: #dc2626;
      --pq-empty-bg: rgba(220, 38, 38, 0.28);
      --pq-empty-track: repeating-linear-gradient(
        -45deg,
        rgba(220, 38, 38, 0.34),
        rgba(220, 38, 38, 0.34) 4px,
        rgba(220, 38, 38, 0.12) 4px,
        rgba(220, 38, 38, 0.12) 8px
      );

      /* Tier badges (Dark): Ultra 金紫, Pro 蓝, Free 灰 */
      --pq-tier-ultra-bg: linear-gradient(135deg, rgba(167, 139, 250, 0.24), rgba(251, 191, 36, 0.2));
      --pq-tier-ultra-fg: #f3e8ff;
      --pq-tier-ultra-bd: rgba(216, 180, 254, 0.36);

      --pq-tier-pro-bg: rgba(59, 130, 246, 0.2);
      --pq-tier-pro-fg: #93c5fd;
      --pq-tier-pro-bd: rgba(96, 165, 250, 0.34);

      --pq-tier-free-bg: rgba(148, 163, 184, 0.16);
      --pq-tier-free-fg: #cbd5e1;
      --pq-tier-free-bd: rgba(148, 163, 184, 0.24);

      /* Model family chart palette (Dark) */
      --pq-series-gemini: #38bdf8;
      --pq-series-gemini-2: #22d3ee;
      --pq-series-claude: #c084fc;
      --pq-series-claude-2: #f472b6;
      --pq-series-argon: #fbbf24;
    }

    @media (prefers-color-scheme: dark) {
      :root:not([data-oc-theme="light"]) {
        --pq-full: #38bdf8;
        --pq-full-bar: #38bdf8;
        --pq-full-bg: rgba(56, 189, 248, 0.16);
        --pq-healthy: #34d399;
        --pq-healthy-bar: #34d399;
        --pq-healthy-bg: rgba(52, 211, 153, 0.15);
        --pq-moderate: #fbbf24;
        --pq-moderate-bar: #fbbf24;
        --pq-moderate-bg: rgba(251, 191, 36, 0.16);
        --pq-low: #f87171;
        --pq-low-bar: #f87171;
        --pq-low-bg: rgba(248, 113, 113, 0.17);
        --pq-empty: #fda4af;
        --pq-empty-bar: #dc2626;
        --pq-empty-bg: rgba(220, 38, 38, 0.28);
        --pq-series-gemini: #38bdf8;
        --pq-series-gemini-2: #22d3ee;
        --pq-series-claude: #c084fc;
        --pq-series-claude-2: #f472b6;
        --pq-series-argon: #fbbf24;
      }
    }

    *, *::before, *::after { box-sizing: border-box; }

    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      overflow-x: hidden;
      background: transparent;
      color: var(--pq-fg);
      font-family: var(--oc-font, var(--font-sans, system-ui, -apple-system, sans-serif));
      font-size: var(--oc-font-size, 13px);
      line-height: 1.45;
      -webkit-font-smoothing: antialiased;
    }

    .pq-wrap {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 10px 10px 16px;
      width: 100%;
      max-width: 100%;
      min-width: 0;
    }

    .pq-num {
      font-variant-numeric: tabular-nums;
    }

    .pq-mono {
      font-family: var(--oc-mono, var(--font-mono, ui-monospace, SFMono-Regular, monospace));
      font-variant-numeric: tabular-nums;
    }

    .pq-muted {
      color: var(--pq-muted);
      font-size: 0.84em;
    }

    /* Compact Header */
    .pq-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      flex-wrap: wrap;
      min-width: 0;
      padding: 2px 1px;
    }

    .pq-brand {
      display: flex;
      align-items: center;
      gap: 7px;
      min-width: 0;
      flex: 1 1 auto;
    }

    .pq-title {
      font-size: 1.02em;
      font-weight: 700;
      letter-spacing: -0.01em;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pq-pool-dots {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      flex-shrink: 0;
    }

    .pq-dot-chip {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 1px 6px;
      border-radius: 999px;
      font-size: 0.72em;
      font-weight: 600;
      border: 1px solid var(--pq-border);
      background: var(--pq-surface);
      color: var(--pq-muted);
      white-space: nowrap;
    }

    .pq-dot-chip .pq-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
      flex-shrink: 0;
    }

    .pq-dot-chip.is-ok { color: var(--pq-healthy); border-color: color-mix(in srgb, var(--pq-healthy) 30%, transparent); background: var(--pq-healthy-bg); }
    .pq-dot-chip.is-warn { color: var(--pq-moderate); border-color: color-mix(in srgb, var(--pq-moderate) 32%, transparent); background: var(--pq-moderate-bg); }
    .pq-dot-chip.is-err { color: var(--pq-low); border-color: color-mix(in srgb, var(--pq-low) 32%, transparent); background: var(--pq-low-bg); }

    .pq-actions {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .pq-icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 24px;
      padding: 0;
      border-radius: calc(var(--pq-radius) - 3px);
      border: 1px solid var(--pq-border);
      background: transparent;
      color: var(--pq-muted);
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
      flex-shrink: 0;
    }

    .pq-icon-btn:hover {
      background: var(--pq-hover);
      color: var(--pq-fg);
    }

    .pq-icon-btn[aria-expanded="true"] {
      color: var(--pq-full);
      border-color: color-mix(in srgb, var(--pq-full) 40%, var(--pq-border));
      background: var(--pq-full-bg);
    }

    /* Cards */
    .pq-card {
      background: var(--pq-surface);
      border: 1px solid var(--pq-border);
      border-radius: var(--pq-radius);
      padding: 11px 11px;
      display: flex;
      flex-direction: column;
      gap: 9px;
      min-width: 0;
      transition: border-color 0.18s ease;
    }

    .pq-card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      min-width: 0;
    }

    .pq-card-head-left {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      flex-wrap: wrap;
    }

    .pq-card-title {
      font-weight: 700;
      font-size: 0.94em;
      letter-spacing: -0.01em;
      margin: 0;
      white-space: nowrap;
    }

    /* Badges & Pills */
    .pq-pill {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 1px 6px;
      border-radius: 999px;
      font-size: 0.72em;
      font-weight: 600;
      line-height: 1.45;
      white-space: nowrap;
      border: 1px solid transparent;
      flex-shrink: 0;
    }

    .pq-tier-ultra {
      background: var(--pq-tier-ultra-bg);
      color: var(--pq-tier-ultra-fg);
      border-color: var(--pq-tier-ultra-bd);
    }

    .pq-tier-pro {
      background: var(--pq-tier-pro-bg);
      color: var(--pq-tier-pro-fg);
      border-color: var(--pq-tier-pro-bd);
    }

    .pq-tier-free {
      background: var(--pq-tier-free-bg);
      color: var(--pq-tier-free-fg);
      border-color: var(--pq-tier-free-bd);
    }

    .pq-st-ok { background: var(--pq-healthy-bg); color: var(--pq-healthy); }
    .pq-st-warn { background: var(--pq-moderate-bg); color: var(--pq-moderate); }
    .pq-st-err { background: var(--pq-low-bg); color: var(--pq-low); }
    .pq-st-muted { background: var(--pq-surface-2); color: var(--pq-muted); }

    .pq-bottleneck-tok {
      background: var(--pq-moderate-bg);
      color: var(--pq-moderate);
      border-color: color-mix(in srgb, var(--pq-moderate) 28%, transparent);
    }

    .pq-bottleneck-req {
      background: var(--pq-full-bg);
      color: var(--pq-full);
      border-color: color-mix(in srgb, var(--pq-full) 28%, transparent);
    }

    .pq-pill-mode {
      background: color-mix(in srgb, var(--pq-border) 38%, transparent);
      color: var(--pq-muted);
      border-color: color-mix(in srgb, var(--pq-border) 65%, transparent);
    }

    .pq-pill-empty {
      background: var(--pq-empty-bg);
      color: var(--pq-empty);
      border-color: color-mix(in srgb, var(--pq-empty-bar) 40%, transparent);
    }

    .pq-pill-cache {
      font-variant-numeric: tabular-nums;
    }

    .pq-pill-cache.is-high {
      background: var(--pq-healthy-bg);
      color: var(--pq-healthy);
      border-color: color-mix(in srgb, var(--pq-healthy) 26%, transparent);
    }

    .pq-pill-cache.is-mid {
      background: var(--pq-full-bg);
      color: var(--pq-full);
      border-color: color-mix(in srgb, var(--pq-full) 26%, transparent);
    }

    .pq-pill-cache.is-low {
      background: var(--pq-surface-2);
      color: var(--pq-muted);
      border-color: color-mix(in srgb, var(--pq-border) 70%, transparent);
    }

    /* 5-Level Health Colors */
    .pq-lv-full { color: var(--pq-full); }
    .pq-lv-healthy { color: var(--pq-healthy); }
    .pq-lv-moderate { color: var(--pq-moderate); }
    .pq-lv-low { color: var(--pq-low); }
    .pq-lv-empty { color: var(--pq-empty); font-weight: 700; }

    .pq-bar-track {
      width: 100%;
      height: 6px;
      border-radius: 999px;
      background: var(--pq-surface-2);
      overflow: hidden;
      position: relative;
    }

    .pq-bar-track.is-thin { height: 3.5px; }
    .pq-bar-track.is-empty { background: var(--pq-empty-track); }

    .pq-bar-fill {
      height: 100%;
      border-radius: 999px;
      transition: width 0.25s ease;
    }

    .pq-bar-full { background: var(--pq-full-bar); }
    .pq-bar-healthy { background: var(--pq-healthy-bar); }
    .pq-bar-moderate { background: var(--pq-moderate-bar); }
    .pq-bar-low { background: var(--pq-low-bar); }
    .pq-bar-empty { background: var(--pq-empty-bar); }

    /* Antigravity Account Blocks */
    .pq-acct-list {
      display: flex;
      flex-direction: column;
      gap: 11px;
      min-width: 0;
    }

    .pq-acct-block {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }

    .pq-acct-block + .pq-acct-block {
      padding-top: 11px;
      border-top: 1px solid var(--pq-border);
    }

    .pq-acct-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px 6px;
      flex-wrap: wrap;
      min-width: 0;
    }

    .pq-acct-id {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      flex: 1 1 100px;
    }

    .pq-acct-badges {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;
      justify-content: flex-end;
      margin-left: auto;
      flex-shrink: 0;
      max-width: 100%;
    }

    .pq-acct-name {
      font-weight: 700;
      font-size: 0.9em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }

    /* Recent 200m Micro-Capsule Bar */
    .pq-recent-strip {
      background: var(--pq-surface-2);
      border: 1px solid color-mix(in srgb, var(--pq-border) 75%, transparent);
      border-radius: calc(var(--pq-radius) - 3px);
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-width: 0;
    }

    .pq-recent-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      font-size: 0.76em;
      min-width: 0;
    }

    .pq-recent-label {
      color: var(--pq-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }

    .pq-recent-meta {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .pq-recent-ok { color: var(--pq-healthy); font-weight: 600; }
    .pq-recent-fail { color: var(--pq-low); font-weight: 600; }

    .pq-rate-capsule {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
      height: 17px;
      border-radius: 999px;
      font-size: 0.92em;
      font-weight: 700;
      background: color-mix(in srgb, var(--pq-border) 55%, transparent);
      color: var(--pq-muted);
      white-space: nowrap;
    }

    .pq-rate-capsule.is-high { background: var(--pq-healthy-bg); color: var(--pq-healthy); }
    .pq-rate-capsule.is-med { background: var(--pq-moderate-bg); color: var(--pq-moderate); }
    .pq-rate-capsule.is-low { background: var(--pq-low-bg); color: var(--pq-low); }
    .pq-rate-capsule.is-cache-high { background: var(--pq-healthy-bg); color: var(--pq-healthy); }
    .pq-rate-capsule.is-cache-mid { background: var(--pq-full-bg); color: var(--pq-full); }
    .pq-rate-capsule.is-cache-low { background: var(--pq-surface-2); color: var(--pq-muted); }

    .pq-buckets {
      display: flex;
      align-items: center;
      gap: 2px;
      width: 100%;
      min-width: 0;
      height: 10px;
    }

    .pq-bucket {
      flex: 1 1 0;
      min-width: 2px;
      height: 5px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--pq-border) 70%, transparent);
      opacity: 0.55;
      cursor: pointer;
      transition: transform 0.12s ease, opacity 0.12s ease;
    }

    .pq-bucket.is-active { opacity: 0.92; }
    .pq-bucket:hover,
    .pq-bucket.is-focus {
      transform: scaleY(1.75);
      opacity: 1;
    }

    /* Active Quota Windows */
    .pq-win-list {
      display: flex;
      flex-direction: column;
      gap: 7px;
      min-width: 0;
    }

    .pq-win-active {
      background: var(--pq-surface-2);
      border: 1px solid color-mix(in srgb, var(--pq-border) 75%, transparent);
      border-radius: calc(var(--pq-radius) - 3px);
      padding: 8px 9px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-width: 0;
      transition: border-color 0.15s ease;
    }

    .pq-win-active.is-empty {
      border-color: color-mix(in srgb, var(--pq-empty-bar) 45%, var(--pq-border));
    }

    .pq-win-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-width: 0;
    }

    .pq-win-name-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      flex: 1 1 auto;
    }

    .pq-fam-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .pq-win-name {
      font-weight: 600;
      font-size: 0.89em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }

    .pq-win-val-wrap {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      flex-shrink: 0;
    }

    .pq-win-val {
      font-family: var(--oc-mono, var(--font-mono, ui-monospace, monospace));
      font-variant-numeric: tabular-nums;
      font-size: 0.9em;
      font-weight: 700;
      white-space: nowrap;
    }

    .pq-win-sub {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px 8px;
      font-size: 0.77em;
      color: var(--pq-muted);
      flex-wrap: wrap;
      min-width: 0;
    }

    .pq-win-usage {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;
      min-width: 0;
    }

    .pq-win-reset {
      white-space: nowrap;
      margin-left: auto;
    }

    .pq-sample-age {
      display: inline-flex;
      align-items: center;
      padding: 0 5px;
      height: 16px;
      border-radius: 999px;
      font-size: 0.69em;
      font-weight: 500;
      color: var(--pq-muted);
      background: color-mix(in srgb, var(--pq-border) 42%, transparent);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .pq-sample-age.is-stale {
      color: var(--pq-moderate);
      background: var(--pq-moderate-bg);
    }

    .pq-win-est {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px 8px;
      flex-wrap: wrap;
      font-size: 0.75em;
      padding-top: 3px;
      border-top: 1px dashed color-mix(in srgb, var(--pq-border) 62%, transparent);
      min-width: 0;
    }

    .pq-est-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-weight: 600;
      white-space: nowrap;
    }

    .pq-est-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: currentColor;
      opacity: 0.85;
      flex-shrink: 0;
    }

    .pq-est-delta {
      color: var(--pq-muted);
      white-space: nowrap;
      margin-left: auto;
    }

    /* Compact Idle 100% Windows */
    .pq-win-idle-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 6px;
      min-width: 0;
    }

    .pq-win-idle-grid.is-single {
      grid-template-columns: minmax(0, 1fr);
    }

    .pq-win-idle-tile {
      background: color-mix(in srgb, var(--pq-full-bg) 48%, var(--pq-surface-2));
      border: 1px solid color-mix(in srgb, var(--pq-full) 20%, var(--pq-border));
      border-radius: calc(var(--pq-radius) - 3px);
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .pq-win-idle-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      min-width: 0;
    }

    .pq-win-idle-name {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 0.8em;
      font-weight: 600;
      min-width: 0;
      overflow: hidden;
    }

    .pq-win-idle-name span:last-child {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pq-win-idle-pct {
      font-size: 0.8em;
      font-weight: 700;
      color: var(--pq-full);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .pq-win-idle-sub {
      font-size: 0.72em;
      color: var(--pq-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Trend Chart */
    .pq-chart-box {
      border-top: 1px solid color-mix(in srgb, var(--pq-border) 70%, transparent);
      padding-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .pq-chart-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      min-width: 0;
    }

    .pq-chart-title {
      font-size: 0.8em;
      font-weight: 600;
      color: var(--pq-muted);
      white-space: nowrap;
    }

    .pq-chart-tabs .oc-sdk-tabs {
      padding: 1px;
    }

    .pq-chart-tabs .oc-sdk-tab {
      height: 22px;
      padding: 0 8px;
      font-size: 0.76em;
    }

    .pq-chart-body {
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-height: 132px;
      min-width: 0;
    }

    .pq-chart-loading,
    .pq-chart-empty {
      min-height: 126px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      border-radius: calc(var(--pq-radius) - 3px);
      background: var(--pq-surface-2);
      border: 1px dashed color-mix(in srgb, var(--pq-border) 80%, transparent);
      color: var(--pq-muted);
      font-size: 0.8em;
      padding: 10px;
      text-align: center;
    }

    .pq-chart-readout {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px 8px;
      flex-wrap: wrap;
      min-height: 24px;
      padding: 3px 7px;
      border-radius: calc(var(--pq-radius) - 4px);
      background: var(--pq-surface-2);
      border: 1px solid color-mix(in srgb, var(--pq-border) 70%, transparent);
      font-size: 0.75em;
      transition: border-color 0.14s ease, background-color 0.14s ease;
    }

    .pq-chart-readout.is-scrubbing {
      border-color: color-mix(in srgb, var(--pq-full) 55%, var(--pq-border));
      background: color-mix(in srgb, var(--pq-full-bg) 55%, var(--pq-surface-2));
    }

    .pq-readout-items {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 4px 8px;
      min-width: 0;
    }

    .pq-readout-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
    }

    .pq-readout-time {
      font-weight: 700;
      color: var(--pq-fg);
      white-space: nowrap;
    }

    .pq-readout-hint {
      color: var(--pq-muted);
      font-size: 0.92em;
      margin-left: auto;
      white-space: nowrap;
    }

    .pq-readout-clear {
      border: 1px solid var(--pq-border);
      background: var(--pq-surface);
      color: var(--pq-muted);
      border-radius: 999px;
      padding: 0 6px;
      height: 17px;
      font-size: 0.9em;
      line-height: 1;
      cursor: pointer;
      margin-left: auto;
    }

    .pq-chart-svg-wrap {
      width: 100%;
      min-width: 0;
      user-select: none;
      -webkit-user-select: none;
    }

    .pq-chart-svg {
      width: 100%;
      height: auto;
      display: block;
      overflow: visible;
      touch-action: pan-y;
    }

    .pq-svg-axis {
      fill: var(--pq-muted);
      font-family: var(--oc-mono, var(--font-mono, ui-monospace, monospace));
      font-size: 9px;
      font-variant-numeric: tabular-nums;
      pointer-events: none;
    }

    /* AIStudio Model List & Full-Health Fold Group */
    .pq-ais-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      flex-wrap: wrap;
      font-size: 0.78em;
      color: var(--pq-muted);
    }

    .pq-model-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .pq-model-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 7px 9px;
      border-radius: calc(var(--pq-radius) - 3px);
      background: var(--pq-surface-2);
      border: 1px solid color-mix(in srgb, var(--pq-border) 72%, transparent);
      min-width: 0;
      transition: border-color 0.15s ease;
    }

    .pq-model-row.is-empty {
      border-color: color-mix(in srgb, var(--pq-empty-bar) 45%, var(--pq-border));
    }

    .pq-model-row.is-full-compact {
      padding: 6px 8px;
      gap: 3px;
      background: color-mix(in srgb, var(--pq-full-bg) 36%, var(--pq-surface-2));
      border-color: color-mix(in srgb, var(--pq-full) 18%, var(--pq-border));
    }

    .pq-model-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      min-width: 0;
    }

    .pq-model-name {
      font-weight: 600;
      font-size: 0.88em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
      flex: 1 1 auto;
    }

    .pq-model-right {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      flex-shrink: 0;
    }

    .pq-full-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .pq-full-toggle {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 7px 9px;
      border-radius: calc(var(--pq-radius) - 3px);
      border: 1px dashed color-mix(in srgb, var(--pq-full) 38%, var(--pq-border));
      background: color-mix(in srgb, var(--pq-full-bg) 42%, transparent);
      color: var(--pq-fg);
      font: inherit;
      font-size: 0.81em;
      font-weight: 600;
      cursor: pointer;
      text-align: left;
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }

    .pq-full-toggle:hover {
      background: color-mix(in srgb, var(--pq-full-bg) 72%, transparent);
      border-color: color-mix(in srgb, var(--pq-full) 55%, var(--pq-border));
    }

    .pq-full-toggle-left {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      overflow: hidden;
    }

    .pq-full-toggle-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pq-chevron {
      display: inline-block;
      font-size: 0.88em;
      color: var(--pq-muted);
      transition: transform 0.16s ease;
      flex-shrink: 0;
    }

    .pq-chevron.is-open {
      transform: rotate(180deg);
    }

    .pq-full-list {
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-width: 0;
    }

    .pq-full-list[hidden] {
      display: none;
    }

    /* Bottom Collapsible Settings Card */
    .pq-settings-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      cursor: pointer;
      user-select: none;
      background: transparent;
      border: 0;
      padding: 0;
      width: 100%;
      color: inherit;
      font: inherit;
      text-align: left;
    }

    .pq-settings-summary {
      font-size: 0.77em;
      color: var(--pq-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pq-settings-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-top: 9px;
      border-top: 1px solid var(--pq-border);
      min-width: 0;
    }

    .pq-settings-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }

    .pq-settings-group + .pq-settings-group {
      padding-top: 9px;
      border-top: 1px solid color-mix(in srgb, var(--pq-border) 65%, transparent);
    }

    .pq-settings-section-label {
      font-size: 0.76em;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: var(--pq-muted);
      text-transform: uppercase;
    }

    .pq-settings-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .pq-footer-note {
      font-size: 0.75em;
      color: var(--pq-muted);
      padding: 0 2px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      flex-wrap: wrap;
    }

    @media (max-width: 260px) {
      .pq-win-idle-grid {
        grid-template-columns: minmax(0, 1fr);
      }
    }
`;
