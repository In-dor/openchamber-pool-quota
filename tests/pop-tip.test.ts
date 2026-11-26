import fs from 'node:fs';
import { describe, expect, it } from 'bun:test';
import {
  POP_TIP_EDGE_MARGIN,
  POP_TIP_GAP,
  POP_TIP_SCROLL_GUARD_MS,
  bindPopTip,
  computePopTipPosition,
  createPopTipController,
  type PopTipRect,
} from '../src/panel/pop-tip.ts';
import { PANEL_CSS } from '../src/panel/styles.ts';
import { minifyCss } from '../scripts/build.ts';

class FakeClassList {
  private readonly set = new Set<string>();

  syncFrom(className: string): void {
    this.set.clear();
    for (const part of className.split(/\s+/)) {
      if (part) this.set.add(part);
    }
  }

  add(...tokens: string[]): void {
    for (const t of tokens) {
      if (t) this.set.add(t);
    }
  }

  remove(...tokens: string[]): void {
    for (const t of tokens) {
      this.set.delete(t);
    }
  }

  toggle(token: string, force?: boolean): boolean {
    if (force === undefined) {
      if (this.set.has(token)) {
        this.set.delete(token);
        return false;
      }
      this.set.add(token);
      return true;
    }
    if (force) {
      this.set.add(token);
      return true;
    }
    this.set.delete(token);
    return false;
  }

  contains(token: string): boolean {
    return this.set.has(token);
  }
}

class FakeElement {
  readonly tagName: string;
  readonly dataset: Record<string, string | undefined> = {};
  readonly style: Record<string, string> = {};
  readonly classList = new FakeClassList();
  readonly attributes = new Map<string, string>();
  readonly children: FakeElement[] = [];
  parentNode: FakeElement | null = null;
  hidden = false;
  textContent = '';
  type = '';
  rect: PopTipRect = { left: 0, top: 0, right: 160, bottom: 36, width: 160, height: 36 };

  constructor(tag: string) {
    this.tagName = tag.toUpperCase();
  }

  get className(): string {
    return this.attributes.get('class') ?? '';
  }

  set className(value: string) {
    this.attributes.set('class', value);
    this.classList.syncFrom(value);
  }

  get isConnected(): boolean {
    let cur: FakeElement | null = this;
    while (cur) {
      if (cur.tagName === 'BODY') return true;
      cur = cur.parentNode;
    }
    return false;
  }

  appendChild(child: FakeElement): FakeElement {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  remove(): void {
    if (!this.parentNode) return;
    const idx = this.parentNode.children.indexOf(this);
    if (idx >= 0) this.parentNode.children.splice(idx, 1);
    this.parentNode = null;
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
    if (name === 'class') this.classList.syncFrom(value);
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }

  removeAttribute(name: string): void {
    this.attributes.delete(name);
  }

  contains(node: unknown): boolean {
    let cur = node as FakeElement | null;
    while (cur) {
      if (cur === this) return true;
      cur = cur.parentNode;
    }
    return false;
  }

  matchesSelector(selector: string): boolean {
    if (selector === '[data-pq-tip]') {
      return typeof this.dataset.pqTip === 'string' && this.dataset.pqTip.length > 0;
    }
    if (selector.startsWith('.')) {
      return this.classList.contains(selector.slice(1));
    }
    const idMatch = /^\[data-pq-tip-id="(.+)"\]$/.exec(selector);
    if (idMatch) {
      const expected = idMatch[1]!.replace(/\\(.)/g, '$1');
      return this.dataset.pqTipId === expected;
    }
    return false;
  }

  closest(selector: string): FakeElement | null {
    let cur: FakeElement | null = this;
    while (cur) {
      if (cur.matchesSelector(selector)) return cur;
      cur = cur.parentNode;
    }
    return null;
  }

  querySelector(selector: string): FakeElement | null {
    for (const child of this.children) {
      if (child.matchesSelector(selector)) return child;
      const found = child.querySelector(selector);
      if (found) return found;
    }
    return null;
  }

  getBoundingClientRect(): PopTipRect {
    return { ...this.rect };
  }
}

const createFakeDom = (viewport = { width: 360, height: 640 }) => {
  const body = new FakeElement('body');
  const root = new FakeElement('div');
  body.appendChild(root);

  const docListeners = new Map<string, Array<(e: unknown) => void>>();
  const winListeners = new Map<string, Array<(e: unknown) => void>>();

  const add = (map: Map<string, Array<(e: unknown) => void>>, type: string, fn: (e: unknown) => void) => {
    const list = map.get(type) ?? [];
    list.push(fn);
    map.set(type, list);
  };
  const remove = (map: Map<string, Array<(e: unknown) => void>>, type: string, fn: (e: unknown) => void) => {
    const list = map.get(type);
    if (!list) return;
    const idx = list.indexOf(fn);
    if (idx >= 0) list.splice(idx, 1);
  };

  const doc = {
    body,
    createElement: (tag: string) => new FakeElement(tag),
    addEventListener: (type: string, fn: (e: unknown) => void) => add(docListeners, type, fn),
    removeEventListener: (type: string, fn: (e: unknown) => void) => remove(docListeners, type, fn),
    dispatch: (type: string, event: Record<string, unknown>) => {
      for (const fn of [...(docListeners.get(type) ?? [])]) {
        fn(event);
      }
    },
  };

  const win = {
    innerWidth: viewport.width,
    innerHeight: viewport.height,
    addEventListener: (type: string, fn: (e: unknown) => void) => add(winListeners, type, fn),
    removeEventListener: (type: string, fn: (e: unknown) => void) => remove(winListeners, type, fn),
    dispatch: (type: string, event: Record<string, unknown> = {}) => {
      for (const fn of [...(winListeners.get(type) ?? [])]) {
        fn(event);
      }
    },
  };

  return { body, root, doc, win };
};

describe('popover tooltip CSS & bundle invariants', () => {
  it('preserves .pq-pop-tip calc(100vw - 16px) and [data-pq-tip] styles losslessly after minifyCss', () => {
    const minified = minifyCss(PANEL_CSS);
    expect(minified).toContain('.pq-pop-tip{position:fixed;');
    expect(minified).toContain('z-index:120;');
    expect(minified).toContain('max-width:min(296px,calc(100vw - 16px));');
    expect(minified).not.toContain('calc(100vw-16px)');
    expect(minified).toContain('padding:7px 10px;border-radius:9px;');
    expect(minified).toContain('font-size:11.5px;line-height:1.45;');
    expect(minified).toContain('.pq-pop-tip-title{');
    expect(minified).toContain('.pq-pop-tip-body{');
    expect(minified).toContain('.pq-pop-tip-close{');
    expect(minified).toContain('[data-pq-tip]{cursor:pointer;');
    expect(minified).toContain('-webkit-tap-highlight-color:transparent;');
    expect(minified).toContain('[data-pq-tip].is-tip-open{box-shadow:0 0 0 1.5px color-mix(in srgb,var(--pq-accent,#38bdf8) 55%,transparent)}');
  });

  it('ships touch-tap popover logic & styles inside bundled panel/main.js', () => {
    const bundle = fs.readFileSync(new URL('../panel/main.js', import.meta.url), 'utf8');
    expect(bundle).toContain('data-pq-tip');
    expect(bundle).toContain('data-pq-tip-id');
    expect(bundle).toContain('pq-pop-tip');
    expect(bundle).toContain('pq-pop-tip-close');
    expect(bundle).toContain('calc(100vw - 16px)');
    expect(bundle).not.toContain('calc(100vw-16px)');
    expect(bundle).toContain('ag-pool-cache');
    expect(bundle).toContain('ag-cache-');
    expect(bundle).toContain('ag-fallback-');
    expect(bundle).toContain('ag-win-age-');
    expect(bundle).toContain('ag-win-forecast-');
    expect(bundle).toContain('ag-win-est-');
  });
});

describe('computePopTipPosition viewport clamping & auto-flip', () => {
  it('places 6px above anchor when top room >= 8px and flips 6px below when near top edge', () => {
    const tipSize = { width: 200, height: 48 };
    const viewport = { width: 360, height: 640 };

    // Ample top room: top = 120 - 48 - 6 = 66 >= 8
    const above = computePopTipPosition(
      { left: 140, top: 120, right: 220, bottom: 140, width: 80, height: 20 },
      tipSize,
      viewport,
    );
    expect(above.placement).toBe('top');
    expect(above.top).toBe(120 - tipSize.height - POP_TIP_GAP);
    expect(above.left).toBe(80); // center 180 - 100

    // Near top edge (e.g. header pill at top=30): 30 - 48 - 6 = -24 < 8 -> flips below (bottom + 6)
    const below = computePopTipPosition(
      { left: 140, top: 30, right: 220, bottom: 50, width: 80, height: 20 },
      tipSize,
      viewport,
    );
    expect(below.placement).toBe('bottom');
    expect(below.top).toBe(50 + POP_TIP_GAP);
  });

  it('strictly clamps horizontal left into [8, innerWidth - tipW - 8] for 280px sidebar and 360px mobile drawer', () => {
    // 280px narrow desktop sidebar
    const narrowVp = { width: 280, height: 600 };
    const tip220 = { width: 220, height: 44 };

    const leftEdge = computePopTipPosition(
      { left: 10, top: 200, right: 54, bottom: 218, width: 44, height: 18 },
      tip220,
      narrowVp,
    );
    expect(leftEdge.left).toBe(POP_TIP_EDGE_MARGIN);
    expect(leftEdge.left + tip220.width).toBeLessThanOrEqual(narrowVp.width - POP_TIP_EDGE_MARGIN);

    const rightEdge = computePopTipPosition(
      { left: 210, top: 200, right: 270, bottom: 218, width: 60, height: 18 },
      tip220,
      narrowVp,
    );
    expect(rightEdge.left).toBe(narrowVp.width - tip220.width - POP_TIP_EDGE_MARGIN);
    expect(rightEdge.left + tip220.width).toBe(narrowVp.width - POP_TIP_EDGE_MARGIN);

    // 360px mobile drawer with max-width 296px tooltip near right edge
    const mobileVp = { width: 360, height: 740 };
    const tip296 = { width: 296, height: 56 };
    const mobileRight = computePopTipPosition(
      { left: 280, top: 180, right: 348, bottom: 200, width: 68, height: 20 },
      tip296,
      mobileVp,
    );
    expect(mobileRight.left).toBe(mobileVp.width - tip296.width - POP_TIP_EDGE_MARGIN);
    expect(mobileRight.left).toBe(56);
    expect(mobileRight.left + tip296.width).toBe(352);
  });
});

describe('bindPopTip & PopTipController interactions', () => {
  it('binds dataset & aria-label without setting native title, and cleans up empty text', () => {
    const el = new FakeElement('span');
    el.setAttribute('title', 'legacy native tooltip');
    bindPopTip(el as unknown as HTMLElement, {
      id: 'ag-cache-acct1',
      title: '缓存效率',
      text: '累计缓存命中率 89.8% · 近 24h 93.2%',
    });

    expect(el.dataset.pqTip).toBe('累计缓存命中率 89.8% · 近 24h 93.2%');
    expect(el.dataset.pqTipId).toBe('ag-cache-acct1');
    expect(el.dataset.pqTipTitle).toBe('缓存效率');
    expect(el.getAttribute('title')).toBeNull();
    expect(el.getAttribute('aria-label')).toBe('缓存效率：累计缓存命中率 89.8% · 近 24h 93.2%');

    bindPopTip(el as unknown as HTMLElement, { id: 'ag-cache-acct1', text: '   ' });
    expect(el.dataset.pqTip).toBeUndefined();
    expect(el.dataset.pqTipId).toBeUndefined();
    expect(el.dataset.pqTipTitle).toBeUndefined();
  });

  it('handles desktop mouse hover, touch click pin/switch/toggle, scroll 150ms guard, Escape, and 15s re-render sync', () => {
    let clockMs = 1_000;
    const rafQueue: Array<() => void> = [];
    const { body, root, doc, win } = createFakeDom({ width: 360, height: 640 });

    const pillA = new FakeElement('span');
    pillA.rect = { left: 220, top: 140, right: 310, bottom: 160, width: 90, height: 20 };
    bindPopTip(pillA as unknown as HTMLElement, {
      id: 'ag-cache-a1',
      title: '缓存效率',
      text: '累计缓存命中率 89.8%',
    });
    const pillAChild = new FakeElement('strong');
    pillA.appendChild(pillAChild);
    root.appendChild(pillA);

    const pillB = new FakeElement('span');
    pillB.rect = { left: 20, top: 24, right: 110, bottom: 44, width: 90, height: 20 };
    bindPopTip(pillB as unknown as HTMLElement, {
      id: 'ag-win-age-a1-gemini_5h',
      title: '真实采样时间',
      text: 'Gemini 5h 最近权威采样：10:15:00',
    });
    root.appendChild(pillB);

    const blankArea = new FakeElement('div');
    root.appendChild(blankArea);

    const ctrl = createPopTipController({
      doc: doc as unknown as Document,
      win: win as unknown as Window,
      now: () => clockMs,
      raf: (cb) => { rafQueue.push(cb); },
    });

    // 1. Desktop mouse hover opens unpinned tip; moving to child does not flicker; leaving hides
    doc.dispatch('pointerover', { pointerType: 'mouse', target: pillA });
    expect(ctrl.isOpen()).toBe(true);
    expect(ctrl.isPinned()).toBe(false);
    expect(pillA.classList.contains('is-tip-open')).toBe(true);
    const tipEl = body.querySelector('.pq-pop-tip')!;
    expect(tipEl).not.toBeNull();
    expect(tipEl.hidden).toBe(false);
    expect(tipEl.classList.contains('is-pinned')).toBe(false);

    doc.dispatch('pointerout', { pointerType: 'mouse', target: pillA, relatedTarget: pillAChild });
    expect(ctrl.isOpen()).toBe(true);

    doc.dispatch('pointerout', { pointerType: 'mouse', target: pillA, relatedTarget: blankArea });
    expect(ctrl.isOpen()).toBe(false);
    expect(pillA.classList.contains('is-tip-open')).toBe(false);

    // 2. Touch click opens pinned tip and stops event propagation
    let stopped = false;
    doc.dispatch('click', {
      target: pillAChild,
      stopPropagation: () => { stopped = true; },
    });
    expect(stopped).toBe(true);
    expect(ctrl.isOpen()).toBe(true);
    expect(ctrl.isPinned()).toBe(true);
    expect(ctrl.getActiveTipId()).toBe('ag-cache-a1');
    expect(tipEl.classList.contains('is-pinned')).toBe(true);

    // Mouse pointerover/out on another trigger does NOT hijack or dismiss a pinned tip
    doc.dispatch('pointerover', { pointerType: 'mouse', target: pillB });
    expect(ctrl.getActiveTipId()).toBe('ag-cache-a1');
    doc.dispatch('pointerout', { pointerType: 'mouse', target: pillA, relatedTarget: blankArea });
    expect(ctrl.isOpen()).toBe(true);

    // 3. Scroll within 150ms tap guard does NOT close the tip
    clockMs += POP_TIP_SCROLL_GUARD_MS - 30;
    win.dispatch('scroll');
    expect(ctrl.isOpen()).toBe(true);

    // 4. Seamless switch to pillB near top edge -> flips to bottom placement
    doc.dispatch('click', {
      target: pillB,
      stopPropagation: () => {},
    });
    expect(ctrl.isOpen()).toBe(true);
    expect(ctrl.getActiveTipId()).toBe('ag-win-age-a1-gemini_5h');
    expect(pillA.classList.contains('is-tip-open')).toBe(false);
    expect(pillB.classList.contains('is-tip-open')).toBe(true);
    expect(tipEl.dataset.placement).toBe('bottom');

    // 5. 15s polling DOM re-render preserves open tip, restores .is-tip-open & refreshes text
    ctrl.markRenderSyncing();
    root.children.length = 0;
    const pillBNext = new FakeElement('span');
    pillBNext.rect = { left: 20, top: 24, right: 110, bottom: 44, width: 90, height: 20 };
    bindPopTip(pillBNext as unknown as HTMLElement, {
      id: 'ag-win-age-a1-gemini_5h',
      title: '真实采样时间',
      text: 'Gemini 5h 最近权威采样：10:15:15',
    });
    root.appendChild(pillBNext);
    // Simulated restoreScroll event right during render does not dismiss open tip
    win.dispatch('scroll');
    ctrl.syncAfterRender(root as unknown as ParentNode);
    expect(ctrl.isOpen()).toBe(true);
    expect(pillBNext.classList.contains('is-tip-open')).toBe(true);
    expect(tipEl.querySelector('.pq-pop-tip-body')?.textContent).toBe('Gemini 5h 最近权威采样：10:15:15');
    while (rafQueue.length > 0) rafQueue.shift()?.();
    expect(ctrl.isOpen()).toBe(true);

    // 6. Scroll after 150ms guard automatically dismisses the tip
    clockMs += POP_TIP_SCROLL_GUARD_MS + 10;
    win.dispatch('scroll');
    expect(ctrl.isOpen()).toBe(false);
    expect(pillBNext.classList.contains('is-tip-open')).toBe(false);

    // 7. Clicking close button (×), blank area, Escape, and same trigger toggle
    doc.dispatch('click', { target: pillBNext, stopPropagation: () => {} });
    expect(ctrl.isOpen()).toBe(true);
    const closeBtn = tipEl.querySelector('.pq-pop-tip-close')!;
    doc.dispatch('click', { target: closeBtn, stopPropagation: () => {} });
    expect(ctrl.isOpen()).toBe(false);

    doc.dispatch('click', { target: pillBNext, stopPropagation: () => {} });
    expect(ctrl.isOpen()).toBe(true);
    doc.dispatch('keydown', { key: 'Escape' });
    expect(ctrl.isOpen()).toBe(false);

    doc.dispatch('click', { target: pillBNext, stopPropagation: () => {} });
    expect(ctrl.isOpen()).toBe(true);
    doc.dispatch('click', { target: blankArea, stopPropagation: () => {} });
    expect(ctrl.isOpen()).toBe(false);

    // iOS Safari blank-area tap dismissal via pointerdown (while pointerdown on trigger/tip keeps open)
    doc.dispatch('click', { target: pillBNext, stopPropagation: () => {} });
    expect(ctrl.isOpen()).toBe(true);
    doc.dispatch('pointerdown', { pointerType: 'touch', target: tipEl });
    expect(ctrl.isOpen()).toBe(true);
    doc.dispatch('pointerdown', { pointerType: 'touch', target: blankArea });
    expect(ctrl.isOpen()).toBe(false);

    // Toggle same trigger off on 2nd tap
    doc.dispatch('click', { target: pillBNext, stopPropagation: () => {} });
    expect(ctrl.isOpen()).toBe(true);
    doc.dispatch('click', { target: pillBNext, stopPropagation: () => {} });
    expect(ctrl.isOpen()).toBe(false);

    // Re-render when active trigger disappears closes tip gracefully
    doc.dispatch('click', { target: pillBNext, stopPropagation: () => {} });
    expect(ctrl.isOpen()).toBe(true);
    root.children.length = 0;
    ctrl.syncAfterRender(root as unknown as ParentNode);
    expect(ctrl.isOpen()).toBe(false);

    ctrl.dispose();
  });
});
