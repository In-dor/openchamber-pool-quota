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
} from '@openchamber/sdk/ui';
import {
  clampPercent,
  formatCountdown,
  formatPercent,
  formatTokens,
  formatUsd,
  isBottleneckTokens,
  toneForRemaining,
} from '../shared/format.ts';
import type {
  AntigravityHistoryResponse,
  AntigravityWindow,
  BoardSnapshot,
  PanelStateResponse,
} from '../shared/types.ts';

const WINDOW_ORDER = ['gemini_5h', 'gemini_weekly', 'claude_5h', 'claude_weekly'];

const injectStyles = (): void => {
  if (document.getElementById('pq-styles')) return;
  const style = document.createElement('style');
  style.id = 'pq-styles';
  style.textContent = `
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: transparent;
      color: var(--foreground, #e5e7eb);
      font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
      font-size: var(--oc-font-size, 13px);
      line-height: 1.45;
    }
    .pq-wrap {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      max-width: 100%;
    }
    .pq-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .pq-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .pq-title {
      font-size: 1.05em;
      font-weight: 600;
      margin: 0;
      white-space: nowrap;
    }
    .pq-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .pq-card {
      background: var(--card, rgba(127, 127, 127, 0.08));
      border: 1px solid var(--border, rgba(127, 127, 127, 0.22));
      border-radius: var(--radius, 8px);
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .pq-card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .pq-card-title {
      font-weight: 600;
      font-size: 0.95em;
      margin: 0;
    }
    .pq-muted {
      color: var(--muted-foreground, rgba(160, 160, 170, 0.9));
      font-size: 0.85em;
    }
    .pq-mono {
      font-family: var(--font-mono, ui-monospace, SFMono-Regular, monospace);
      font-variant-numeric: tabular-nums;
    }
    .pq-win-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .pq-win {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .pq-win-top {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
    }
    .pq-win-name {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pq-win-val {
      font-family: var(--font-mono, ui-monospace, monospace);
      font-variant-numeric: tabular-nums;
      font-size: 0.9em;
      white-space: nowrap;
    }
    .pq-bar-track {
      width: 100%;
      height: 6px;
      border-radius: 999px;
      background: var(--muted, rgba(127, 127, 127, 0.2));
      overflow: hidden;
    }
    .pq-bar-fill {
      height: 100%;
      border-radius: 999px;
      transition: width 0.2s ease;
    }
    .pq-tone-success { background: var(--success, #22c55e); }
    .pq-tone-warning { background: var(--warning, #f59e0b); }
    .pq-tone-error { background: var(--destructive, #ef4444); }
    .pq-text-success { color: var(--success-text, var(--success, #22c55e)); }
    .pq-text-warning { color: var(--warning-text, var(--warning, #f59e0b)); }
    .pq-text-error { color: var(--error-text, var(--destructive, #ef4444)); }
    .pq-win-sub {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 0.8em;
      color: var(--muted-foreground, rgba(160, 160, 170, 0.9));
      flex-wrap: wrap;
    }
    .pq-chart-box {
      border-top: 1px solid var(--border, rgba(127, 127, 127, 0.16));
      padding-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .pq-chart-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .pq-chart-svg {
      width: 100%;
      height: 84px;
      display: block;
    }
    .pq-legend {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.8em;
      color: var(--muted-foreground, rgba(160, 160, 170, 0.9));
      flex-wrap: wrap;
    }
    .pq-legend-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 4px;
      vertical-align: middle;
    }
    .pq-model-list {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .pq-model-row {
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding: 6px 8px;
      border-radius: 6px;
      background: var(--muted, rgba(127, 127, 127, 0.08));
    }
    .pq-model-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
    }
    .pq-model-name {
      font-weight: 500;
      font-size: 0.9em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pq-pill {
      display: inline-flex;
      align-items: center;
      padding: 1px 6px;
      border-radius: 999px;
      font-size: 0.75em;
      background: var(--border, rgba(127, 127, 127, 0.2));
      color: var(--muted-foreground, inherit);
      white-space: nowrap;
    }
    .pq-settings-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
    .pq-settings-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 6px;
      border-top: 1px solid var(--border, rgba(127, 127, 127, 0.16));
    }
    .pq-settings-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .pq-footer-note {
      font-size: 0.78em;
      color: var(--muted-foreground, rgba(160, 160, 170, 0.85));
    }
  `;
  document.head.appendChild(style);
};

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

const buildHistorySvg = (history: AntigravityHistoryResponse): HTMLElement => {
  const container = el('div');
  const validSeries = (history.series ?? []).filter((s) => Array.isArray(s.points) && s.points.length >= 2);
  if (validSeries.length === 0) {
    container.appendChild(el('div', 'pq-muted', '暂无历史采样曲线'));
    return container;
  }

  const W = 320;
  const H = 84;
  const PAD_X = 6;
  const PAD_Y = 8;
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_Y * 2;

  let minT = Number.POSITIVE_INFINITY;
  let maxT = Number.NEGATIVE_INFINITY;
  for (const s of validSeries) {
    for (const pt of s.points) {
      if (pt[0] < minT) minT = pt[0];
      if (pt[0] > maxT) maxT = pt[0];
    }
  }
  const spanT = Math.max(1, maxT - minT);

  const colors: Record<string, string> = {
    gemini_5h: 'var(--primary, #3b82f6)',
    gemini_weekly: 'var(--primary, #3b82f6)',
    claude_5h: 'var(--success, #22c55e)',
    claude_weekly: 'var(--success, #22c55e)',
  };

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('class', 'pq-chart-svg');

  // Subtle horizontal guide lines at 100%, 50%, 20%
  for (const pct of [100, 50, 20]) {
    const y = PAD_Y + innerH * (1 - pct / 100);
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', String(PAD_X));
    line.setAttribute('x2', String(W - PAD_X));
    line.setAttribute('y1', y.toFixed(1));
    line.setAttribute('y2', y.toFixed(1));
    line.setAttribute('stroke', pct === 20 ? 'var(--destructive, #ef4444)' : 'var(--border, rgba(127,127,127,0.3))');
    line.setAttribute('stroke-opacity', pct === 20 ? '0.4' : '0.6');
    line.setAttribute('stroke-dasharray', '3 3');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
  }

  for (const s of validSeries) {
    const stroke = colors[s.key] ?? 'var(--info, #06b6d4)';
    // Break path when remaining jumps sharply upward (window reset)
    let d = '';
    let prevR: number | null = null;
    for (let i = 0; i < s.points.length; i += 1) {
      const [t, rRaw] = s.points[i]!;
      const r = clampPercent(rRaw);
      const x = PAD_X + ((t - minT) / spanT) * innerW;
      const y = PAD_Y + innerH * (1 - r / 100);
      const isJump = prevR !== null && r - prevR > 12;
      d += `${i === 0 || isJump ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `;
      prevR = r;
    }
    const pathEl = document.createElementNS(svgNS, 'path');
    pathEl.setAttribute('d', d.trim());
    pathEl.setAttribute('fill', 'none');
    pathEl.setAttribute('stroke', stroke);
    pathEl.setAttribute('stroke-width', '2');
    pathEl.setAttribute('stroke-linecap', 'round');
    pathEl.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(pathEl);
  }

  container.appendChild(svg);

  const legend = el('div', 'pq-legend');
  for (const s of validSeries) {
    const item = el('span');
    const dot = el('span', 'pq-legend-dot');
    dot.style.background = colors[s.key] ?? 'var(--info, #06b6d4)';
    item.appendChild(dot);
    item.appendChild(document.createTextNode(`${s.label} ${formatPercent(s.remaining)}`));
    legend.appendChild(item);
  }
  container.appendChild(legend);
  return container;
};

const host = connectHost();
const root = document.querySelector<HTMLElement>('#root')!;

let mounted = false;
let loading = false;
let saving = false;
let currentState: PanelStateResponse | null = null;
let historyWindow: '5h' | '7d' = '5h';
let settingsExpanded = false;
let draftUrl = 'http://127.0.0.1:18380';
let draftPasscode = '';
let draftDirty = false;
let settingsFeedback: { tone: 'success' | 'error' | 'info'; text: string } | null = null;
let activeDisposers: Array<() => void> = [];

const disposeUi = (): void => {
  for (const fn of activeDisposers) {
    try {
      fn();
    } catch {
      // ignore
    }
  }
  activeDisposers = [];
};

const track = <T extends { dispose: () => void }>(handle: T): T => {
  activeDisposers.push(() => handle.dispose());
  return handle;
};

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

const loadState = async (force = false): Promise<void> => {
  loading = true;
  render();
  try {
    const state = await callService<PanelStateResponse>('GET', '/panel/state', {
      query: {
        force: force ? '1' : '0',
        window: historyWindow,
        range: historyWindow === '7d' ? '7d' : '24h',
      },
    });
    currentState = state;
    if (!draftDirty) {
      draftUrl = state.config.url;
    }
    if (state.errorCode === 'unauthorized' || state.errorCode === 'unreachable') {
      settingsExpanded = true;
    }
  } catch (err) {
    const msg = err instanceof HostRequestError && err.code === 'NO_SERVICE'
      ? '请先在 Settings → Extensions 中批准本扩展的本地服务权限。'
      : (err instanceof Error ? err.message : String(err));
    currentState = {
      config: currentState?.config ?? { url: draftUrl, hasPasscode: false, showAis: true },
      snapshot: currentState?.snapshot ?? null,
      history: currentState?.history ?? null,
      error: msg,
      errorCode: 'unreachable',
      fetchedAtMs: Date.now(),
    };
  } finally {
    loading = false;
    render();
  }
};

const toggleShowAis = async (next: boolean): Promise<void> => {
  if (currentState) {
    currentState = { ...currentState, config: { ...currentState.config, showAis: next } };
    render();
  }
  try {
    const updated = await callService<PanelStateResponse>('POST', '/panel/config', {
      body: { showAis: next },
    });
    currentState = updated;
    void host.toast({
      kind: 'success',
      message: next ? '已开启 AIStudio 号池显示（Usage 页点击刷新后同步）' : '已隐藏 AIStudio 号池（Usage 页点击刷新后同步）',
    });
  } catch (err) {
    void host.toast({
      kind: 'error',
      message: err instanceof Error ? err.message : '切换失败',
    });
  } finally {
    render();
  }
};

const testAndSaveSettings = async (clearPasscode = false): Promise<void> => {
  saving = true;
  settingsFeedback = { tone: 'info', text: '正在测试连接...' };
  render();
  try {
    const res = await callService<{ ok: boolean; summary?: string; message?: string }>('POST', '/panel/test', {
      body: {
        url: draftUrl.trim() || 'http://127.0.0.1:18380',
        ...(draftPasscode ? { passcode: draftPasscode } : {}),
        ...(clearPasscode ? { clearPasscode: true } : {}),
        showAis: currentState?.config.showAis ?? true,
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
    settingsFeedback = { tone: 'success', text: res.summary || '连接成功并已保存' };
    void host.toast({ kind: 'success', message: res.summary || '配置已保存' });
    await loadState(true);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    settingsFeedback = { tone: 'error', text: msg };
    void host.toast({ kind: 'error', message: msg });
  } finally {
    saving = false;
    render();
  }
};

const renderAgCard = (snapshot: BoardSnapshot): HTMLElement => {
  const card = el('div', 'pq-card');
  const ag = snapshot.antigravity;

  const head = el('div', 'pq-card-head');
  head.appendChild(el('h4', 'pq-card-title', 'Antigravity 号池'));
  const badgeWrap = el('div');
  track(mountBadge(badgeWrap, {
    label: ag.online ? `${ag.summary?.active_accounts ?? ag.accounts.length} 号在线` : '离线',
    tone: ag.online ? 'success' : 'error',
  }));
  head.appendChild(badgeWrap);
  card.appendChild(head);

  const primary = ag.accounts[0];
  if (!ag.online || !primary) {
    card.appendChild(el('div', 'pq-muted', ag.status_message || '暂无活跃 Antigravity 账号数据'));
    return card;
  }

  const list = el('div', 'pq-win-list');
  const sorted = [...(primary.windows ?? [])].sort((a: AntigravityWindow, b: AntigravityWindow) => {
    const ia = WINDOW_ORDER.indexOf(a.key);
    const ib = WINDOW_ORDER.indexOf(b.key);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  for (const win of sorted) {
    const rem = clampPercent(win.remaining_percent);
    const tone = toneForRemaining(rem);
    const row = el('div', 'pq-win');

    const top = el('div', 'pq-win-top');
    top.appendChild(el('span', 'pq-win-name', win.label || win.key));
    top.appendChild(el('span', `pq-win-val pq-text-${tone}`, `剩 ${formatPercent(rem)}`));
    row.appendChild(top);

    const trackBar = el('div', 'pq-bar-track');
    const fill = el('div', `pq-bar-fill pq-tone-${tone}`);
    fill.style.width = `${rem}%`;
    trackBar.appendChild(fill);
    row.appendChild(trackBar);

    const sub = el('div', 'pq-win-sub');
    const costText = win.has_current_usage && win.current_cost > 0
      ? (win.has_forecast && win.forecast_cost > 0
        ? `已用 ${formatUsd(win.current_cost)} · 满额预测 ${formatUsd(win.forecast_cost)}`
        : `已用 ${formatUsd(win.current_cost)}`)
      : '本轮暂无消耗';
    sub.appendChild(el('span', 'pq-mono', costText));
    if (win.reset_at_ms > 0) {
      sub.appendChild(el('span', 'pq-mono', `重置 ${formatCountdown(win.reset_at_ms)}`));
    }
    row.appendChild(sub);
    list.appendChild(row);
  }
  card.appendChild(list);

  // Trend chart section
  const chartBox = el('div', 'pq-chart-box');
  const chartHead = el('div', 'pq-chart-head');
  chartHead.appendChild(el('span', 'pq-muted', '周期剩余趋势'));
  const tabsRoot = el('div');
  track(mountTabs(tabsRoot, {
    items: [
      { id: '5h', label: '5h / 24h' },
      { id: '7d', label: '7d 周期' },
    ],
    activeId: historyWindow,
    onChange: (next) => {
      if (next !== '5h' && next !== '7d') return;
      historyWindow = next;
      void loadState(false);
    },
  }));
  chartHead.appendChild(tabsRoot);
  chartBox.appendChild(chartHead);

  if (currentState?.history) {
    chartBox.appendChild(buildHistorySvg(currentState.history));
  } else {
    chartBox.appendChild(el('div', 'pq-muted', '暂无历史趋势数据'));
  }
  card.appendChild(chartBox);

  return card;
};

const renderAisCard = (snapshot: BoardSnapshot): HTMLElement => {
  const card = el('div', 'pq-card');
  const ais = snapshot.aistudio;

  const head = el('div', 'pq-card-head');
  head.appendChild(el('h4', 'pq-card-title', 'AIStudio2API 号池'));
  const badgeWrap = el('div');
  const ready = ais.account_counts?.ready ?? 0;
  const enabled = ais.account_counts?.enabled ?? 0;
  track(mountBadge(badgeWrap, {
    label: ais.online ? `${ready}/${enabled} 号就绪` : '离线',
    tone: ais.online ? (ready === enabled ? 'success' : 'warning') : 'error',
  }));
  head.appendChild(badgeWrap);
  card.appendChild(head);

  if (!ais.online) {
    card.appendChild(el('div', 'pq-muted', ais.status_message || 'AIStudio2API 当前离线'));
    return card;
  }

  const meta = el('div', 'pq-win-sub');
  const pg = ais.playground;
  meta.appendChild(el('span', 'pq-mono', `Playground ${pg?.requests ?? 0}次`));
  if (ais.next_reset_ms > 0) {
    meta.appendChild(el('span', 'pq-mono', `16:00 重置 · ${formatCountdown(ais.next_reset_ms)}`));
  }
  card.appendChild(meta);

  const list = el('div', 'pq-model-list');
  for (const model of ais.models ?? []) {
    const rem = clampPercent(model.effective_percent);
    const tone = model.available_accounts === 0 ? 'error' : toneForRemaining(rem);
    const row = el('div', 'pq-model-row');

    const top = el('div', 'pq-model-top');
    top.appendChild(el('span', 'pq-model-name', model.label || model.id));
    const right = el('div', 'pq-actions');
    if (model.eligible_accounts > 0 && rem < 99.5) {
      right.appendChild(el('span', 'pq-pill', isBottleneckTokens(model) ? 'Token瓶颈' : '次数瓶颈'));
    }
    right.appendChild(el('span', `pq-win-val pq-text-${tone}`, `${formatPercent(rem)}`));
    top.appendChild(right);
    row.appendChild(top);

    const bar = el('div', 'pq-bar-track');
    const fill = el('div', `pq-bar-fill pq-tone-${tone}`);
    fill.style.width = `${rem}%`;
    bar.appendChild(fill);
    row.appendChild(bar);

    const sub = el('div', 'pq-win-sub');
    sub.appendChild(el('span', 'pq-mono', `可用 ${model.available_accounts}/${model.eligible_accounts} 号`));
    sub.appendChild(el('span', 'pq-mono', `剩 ${model.effective_remaining_requests}次 / ${formatTokens(model.effective_remaining_tokens)}`));
    row.appendChild(sub);

    list.appendChild(row);
  }
  card.appendChild(list);
  return card;
};

const renderSettingsCard = (): HTMLElement => {
  const card = el('div', 'pq-card');
  const hasPasscode = currentState?.config.hasPasscode === true;

  const toggleBtn = el('button', 'pq-settings-toggle');
  toggleBtn.type = 'button';
  toggleBtn.appendChild(el('span', 'pq-card-title', '连接设置（看板地址与口令）'));
  toggleBtn.appendChild(el('span', 'pq-muted', settingsExpanded ? '收起 ▲' : '展开 ▼'));
  toggleBtn.addEventListener('click', () => {
    settingsExpanded = !settingsExpanded;
    render();
  });
  card.appendChild(toggleBtn);

  if (!settingsExpanded) {
    card.appendChild(el('div', 'pq-muted pq-mono', `${currentState?.config.url ?? draftUrl} · ${hasPasscode ? '已保存口令' : '无口令'}`));
    return card;
  }

  const body = el('div', 'pq-settings-body');

  const urlRoot = el('div');
  const urlField = track(mountTextField(urlRoot, {
    label: '看板地址 URL',
    value: draftUrl,
    placeholder: 'http://127.0.0.1:18380 或 https://your-board.example.com',
    mono: true,
    onChange: (value) => {
      draftUrl = value;
      draftDirty = true;
      urlField.update({ value });
    },
  }));
  body.appendChild(urlRoot);

  const passRoot = el('div');
  const passField = track(mountTextField(passRoot, {
    label: '访问口令 (X-View-Passcode)',
    value: draftPasscode,
    password: true,
    placeholder: hasPasscode ? '已保存口令（留空保存将保持原口令不变）' : '若看板未设口令可留空',
    helper: '仅写入本机 0600 配置文件，不会回显给前端或暴露给对话上下文。',
    onChange: (value) => {
      draftPasscode = value;
      passField.update({ value });
    },
  }));
  body.appendChild(passRoot);

  if (settingsFeedback) {
    const fbRoot = el('div');
    track(mountBanner(fbRoot, {
      tone: settingsFeedback.tone,
      title: settingsFeedback.text,
    }));
    body.appendChild(fbRoot);
  }

  const actions = el('div', 'pq-settings-actions');
  const saveRoot = el('div');
  track(mountButton(saveRoot, {
    label: saving ? '测试中...' : '测试并保存',
    size: 'sm',
    loading: saving,
    disabled: saving,
    onClick: () => void testAndSaveSettings(false),
  }));
  actions.appendChild(saveRoot);

  if (hasPasscode) {
    const clearRoot = el('div');
    track(mountButton(clearRoot, {
      label: '清空口令',
      variant: 'outline',
      size: 'sm',
      disabled: saving,
      onClick: () => void testAndSaveSettings(true),
    }));
    actions.appendChild(clearRoot);
  }

  body.appendChild(actions);
  card.appendChild(body);
  return card;
};

const render = (): void => {
  disposeUi();
  root.innerHTML = '';

  const wrap = el('div', 'pq-wrap');

  // Header
  const header = el('div', 'pq-header');
  const titleRow = el('div', 'pq-title-row');
  titleRow.appendChild(el('h3', 'pq-title', 'Pool Quota'));
  if (loading && !currentState) {
    const spinRoot = el('div');
    track(mountSpinner(spinRoot, { size: 'sm' }));
    titleRow.appendChild(spinRoot);
  }
  header.appendChild(titleRow);

  const actions = el('div', 'pq-actions');
  const refreshRoot = el('div');
  track(mountButton(refreshRoot, {
    label: '刷新',
    variant: 'outline',
    size: 'xs',
    loading,
    onClick: () => void loadState(true),
  }));
  actions.appendChild(refreshRoot);

  if (currentState?.config.url) {
    const openRoot = el('div');
    track(mountButton(openRoot, {
      label: '打开看板',
      variant: 'ghost',
      size: 'xs',
      onClick: () => {
        if (currentState?.config.url) {
          void host.openUrl(currentState.config.url);
        }
      },
    }));
    actions.appendChild(openRoot);
  }
  header.appendChild(actions);
  wrap.appendChild(header);

  // Quick AIS switch card
  const toggleCard = el('div', 'pq-card');
  const switchRoot = el('div');
  const showAis = currentState?.config.showAis ?? true;
  track(mountSwitch(switchRoot, {
    label: '显示 AIStudio 号池',
    description: '同时控制顶栏/Usage 总卡、Work Status 与本面板是否展示 AIS 模型余量',
    checked: showAis,
    onChange: (checked) => void toggleShowAis(checked),
  }));
  toggleCard.appendChild(switchRoot);
  wrap.appendChild(toggleCard);

  // Error banner
  if (currentState?.error) {
    const errRoot = el('div');
    track(mountBanner(errRoot, {
      tone: currentState.errorCode === 'unauthorized' ? 'warning' : 'error',
      title: currentState.errorCode === 'unauthorized' ? '需要访问口令' : '看板连接异常',
      body: currentState.error,
    }));
    wrap.appendChild(errRoot);
  }

  // Main pools
  if (currentState?.snapshot) {
    wrap.appendChild(renderAgCard(currentState.snapshot));
    if (showAis) {
      wrap.appendChild(renderAisCard(currentState.snapshot));
    }
  } else if (!loading && !currentState?.error) {
    const emptyRoot = el('div');
    track(mountEmpty(emptyRoot, {
      title: '尚未读取到号池数据',
      body: '请在下方连接设置中填写看板地址与访问口令后点击测试并保存。',
      action: { label: '重试', onClick: () => void loadState(true) },
    }));
    wrap.appendChild(emptyRoot);
  }

  // Settings card
  wrap.appendChild(renderSettingsCard());

  if (currentState?.fetchedAtMs) {
    const t = new Date(currentState.fetchedAtMs).toLocaleTimeString();
    wrap.appendChild(el('div', 'pq-footer-note pq-mono', `上次更新：${t} · 原生总卡在 Settings → Usage 中可勾选置顶到顶栏`));
  }

  root.appendChild(wrap);
};

injectStyles();
host.onReady((ctx) => {
  applyHostReady(ctx, document.documentElement);
  if (mounted) return;
  mounted = true;
  render();
  void loadState(false);
});
