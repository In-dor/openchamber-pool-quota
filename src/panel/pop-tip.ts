export interface PopTipOptions {
  id: string;
  title?: string;
  text: string;
}

export interface PopTipRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface PopTipPosition {
  left: number;
  top: number;
  placement: 'top' | 'bottom';
}

export interface PopTipControllerOptions {
  doc?: Document;
  win?: Window;
  now?: () => number;
  raf?: (cb: () => void) => void;
}

export interface PopTipController {
  show(trigger: HTMLElement, pinned: boolean): void;
  hide(): void;
  reposition(): void;
  markRenderSyncing(): void;
  syncAfterRender(container: ParentNode): void;
  isOpen(): boolean;
  isPinned(): boolean;
  getActiveTipId(): string | null;
  dispose(): void;
}

export const POP_TIP_EDGE_MARGIN = 8;
export const POP_TIP_GAP = 6;
export const POP_TIP_SCROLL_GUARD_MS = 150;

const escapeAttrSelector = (value: string): string => {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }
  return value.replace(/["\\]/g, '\\$&');
};

/**
 * Computes viewport-clamped fixed coordinates for `.pq-pop-tip`:
 *  - Prefers placing 6px above the anchor (`placement: 'top'`).
 *  - Automatically flips 6px below the anchor (`placement: 'bottom'`) when top space < 8px.
 *  - Clamps horizontal `left` strictly within `[8, viewport.width - tipSize.width - 8]`.
 */
export const computePopTipPosition = (
  anchor: PopTipRect,
  tipSize: { width: number; height: number },
  viewport: { width: number; height: number },
): PopTipPosition => {
  const tipW = Math.max(0, tipSize.width);
  const tipH = Math.max(0, tipSize.height);
  const vpW = Math.max(0, viewport.width);
  const vpH = Math.max(0, viewport.height);

  const idealLeft = anchor.left + anchor.width / 2 - tipW / 2;
  const maxLeft = Math.max(POP_TIP_EDGE_MARGIN, vpW - tipW - POP_TIP_EDGE_MARGIN);
  const left = Math.min(Math.max(idealLeft, POP_TIP_EDGE_MARGIN), maxLeft);

  const aboveTop = anchor.top - tipH - POP_TIP_GAP;
  const belowTop = anchor.bottom + POP_TIP_GAP;
  const maxTop = vpH > 0
    ? Math.max(POP_TIP_EDGE_MARGIN, vpH - tipH - POP_TIP_EDGE_MARGIN)
    : Number.POSITIVE_INFINITY;

  let placement: 'top' | 'bottom';
  let top: number;
  if (aboveTop >= POP_TIP_EDGE_MARGIN) {
    placement = 'top';
    top = Math.min(aboveTop, maxTop);
  } else {
    placement = 'bottom';
    top = Math.min(Math.max(belowTop, POP_TIP_EDGE_MARGIN), maxTop);
  }

  return {
    left: Math.round(left),
    top: Math.round(top),
    placement,
  };
};

/**
 * Binds touch-tap + desktop-hover popover metadata on an element without setting native `title`
 * (preventing duplicate browser tooltips on desktop).
 */
export const bindPopTip = (target: HTMLElement, opts: PopTipOptions): void => {
  const text = opts.text.trim();
  if (!text) {
    delete target.dataset.pqTip;
    delete target.dataset.pqTipId;
    delete target.dataset.pqTipTitle;
    return;
  }

  const title = opts.title?.trim() ?? '';
  target.dataset.pqTip = text;
  target.dataset.pqTipId = opts.id;
  if (title) {
    target.dataset.pqTipTitle = title;
  } else {
    delete target.dataset.pqTipTitle;
  }
  target.removeAttribute('title');
  target.setAttribute('aria-label', title ? `${title}：${text}` : text);
};

export const createPopTipController = (
  options: PopTipControllerOptions = {},
): PopTipController => {
  const doc = options.doc ?? document;
  const win = options.win ?? window;
  const now = options.now ?? (() => Date.now());
  const raf = options.raf ?? ((cb: () => void) => {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(cb);
    }
  });

  let tipEl: HTMLDivElement | null = null;
  let titleEl: HTMLDivElement | null = null;
  let bodyEl: HTMLDivElement | null = null;
  let activeTrigger: HTMLElement | null = null;
  let activeTipId: string | null = null;
  let pinned = false;
  let scrollGuardUntilMs = 0;

  const ensureTipElement = (): HTMLDivElement => {
    if (tipEl && tipEl.isConnected) return tipEl;

    tipEl = doc.createElement('div');
    tipEl.className = 'pq-pop-tip';
    tipEl.setAttribute('role', 'tooltip');
    tipEl.hidden = true;

    const content = doc.createElement('div');
    content.className = 'pq-pop-tip-content';

    titleEl = doc.createElement('div');
    titleEl.className = 'pq-pop-tip-title';
    titleEl.hidden = true;

    bodyEl = doc.createElement('div');
    bodyEl.className = 'pq-pop-tip-body';

    content.appendChild(titleEl);
    content.appendChild(bodyEl);
    tipEl.appendChild(content);

    const closeBtn = doc.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'pq-pop-tip-close';
    closeBtn.textContent = '×';
    closeBtn.setAttribute('aria-label', '关闭提示');
    tipEl.appendChild(closeBtn);

    doc.body.appendChild(tipEl);
    return tipEl;
  };

  const hide = (): void => {
    if (activeTrigger) {
      activeTrigger.classList.remove('is-tip-open');
    }
    activeTrigger = null;
    activeTipId = null;
    pinned = false;
    if (tipEl) {
      tipEl.hidden = true;
      tipEl.classList.remove('is-pinned');
      tipEl.style.visibility = '';
    }
  };

  const applyContentAndPosition = (trigger: HTMLElement): void => {
    const text = trigger.dataset.pqTip?.trim() ?? '';
    if (!text) {
      hide();
      return;
    }

    const title = trigger.dataset.pqTipTitle?.trim() ?? '';
    const tip = ensureTipElement();
    if (titleEl) {
      titleEl.textContent = title;
      titleEl.hidden = !title;
    }
    if (bodyEl) {
      bodyEl.textContent = text;
    }

    tip.classList.toggle('is-pinned', pinned);
    tip.style.visibility = 'hidden';
    tip.style.left = '0px';
    tip.style.top = '0px';
    tip.hidden = false;

    const anchorRect = trigger.getBoundingClientRect();
    if (anchorRect.width === 0 && anchorRect.height === 0) {
      hide();
      return;
    }
    const tipRect = tip.getBoundingClientRect();
    const pos = computePopTipPosition(
      anchorRect,
      { width: tipRect.width, height: tipRect.height },
      { width: win.innerWidth, height: win.innerHeight },
    );

    tip.style.left = `${pos.left}px`;
    tip.style.top = `${pos.top}px`;
    tip.dataset.placement = pos.placement;
    tip.style.visibility = '';
  };

  const show = (trigger: HTMLElement, nextPinned: boolean): void => {
    const text = trigger.dataset.pqTip?.trim() ?? '';
    if (!text) {
      hide();
      return;
    }
    if (activeTrigger && activeTrigger !== trigger) {
      activeTrigger.classList.remove('is-tip-open');
    }
    activeTrigger = trigger;
    activeTipId = trigger.dataset.pqTipId || null;
    pinned = nextPinned;
    scrollGuardUntilMs = Math.max(scrollGuardUntilMs, now() + POP_TIP_SCROLL_GUARD_MS);
    trigger.classList.add('is-tip-open');
    applyContentAndPosition(trigger);
  };

  const reposition = (): void => {
    if (!activeTrigger || !activeTrigger.isConnected) return;
    applyContentAndPosition(activeTrigger);
  };

  const markRenderSyncing = (): void => {
    if (activeTipId || activeTrigger) {
      scrollGuardUntilMs = Math.max(scrollGuardUntilMs, now() + POP_TIP_SCROLL_GUARD_MS);
    }
  };

  const syncAfterRender = (container: ParentNode): void => {
    if (!activeTipId) {
      if (activeTrigger && !activeTrigger.isConnected) {
        hide();
      }
      return;
    }

    const selector = `[data-pq-tip-id="${escapeAttrSelector(activeTipId)}"]`;
    const nextTrigger = container.querySelector<HTMLElement>(selector);
    if (!nextTrigger || !nextTrigger.dataset.pqTip?.trim()) {
      hide();
      return;
    }

    scrollGuardUntilMs = Math.max(scrollGuardUntilMs, now() + POP_TIP_SCROLL_GUARD_MS);
    activeTrigger = nextTrigger;
    nextTrigger.classList.add('is-tip-open');
    applyContentAndPosition(nextTrigger);
    raf(() => {
      if (activeTrigger === nextTrigger && nextTrigger.isConnected) {
        applyContentAndPosition(nextTrigger);
      }
    });
  };

  const onPointerOver = (e: PointerEvent): void => {
    if (e.pointerType !== 'mouse' || pinned) return;
    const target = e.target as Element | null;
    const trigger = target?.closest<HTMLElement>('[data-pq-tip]');
    if (!trigger) return;
    if (trigger !== activeTrigger) {
      show(trigger, false);
    }
  };

  const onPointerOut = (e: PointerEvent): void => {
    if (e.pointerType !== 'mouse' || pinned || !activeTrigger) return;
    const related = e.relatedTarget as Node | null;
    if (related && activeTrigger.contains(related)) return;
    const target = e.target as Element | null;
    if (target && activeTrigger.contains(target)) {
      hide();
    }
  };

  const onClick = (e: MouseEvent): void => {
    const target = e.target as Element | null;
    if (target?.closest('.pq-pop-tip-close')) {
      e.stopPropagation();
      hide();
      return;
    }
    if (target?.closest('.pq-pop-tip')) {
      return;
    }

    const trigger = target?.closest<HTMLElement>('[data-pq-tip]');
    if (trigger) {
      e.stopPropagation();
      if (activeTrigger === trigger && pinned) {
        hide();
      } else {
        show(trigger, true);
      }
      return;
    }

    if (activeTrigger) {
      hide();
    }
  };

  const onPointerDown = (e: PointerEvent): void => {
    if (!activeTrigger) return;
    const target = e.target as Element | null;
    if (target?.closest('.pq-pop-tip') || target?.closest('[data-pq-tip]')) return;
    hide();
  };

  const onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && activeTrigger) {
      hide();
    }
  };

  const onScroll = (): void => {
    if (!activeTrigger) return;
    if (now() < scrollGuardUntilMs) return;
    hide();
  };

  const onResize = (): void => {
    if (!activeTrigger) return;
    if (win.innerWidth <= 0 || win.innerHeight <= 0) {
      hide();
      return;
    }
    reposition();
  };

  doc.addEventListener('pointerover', onPointerOver);
  doc.addEventListener('pointerout', onPointerOut);
  doc.addEventListener('pointerdown', onPointerDown);
  doc.addEventListener('click', onClick, true);
  doc.addEventListener('keydown', onKeyDown);
  doc.addEventListener('scroll', onScroll, { capture: true, passive: true });
  win.addEventListener('scroll', onScroll, { passive: true });
  win.addEventListener('resize', onResize);

  const dispose = (): void => {
    doc.removeEventListener('pointerover', onPointerOver);
    doc.removeEventListener('pointerout', onPointerOut);
    doc.removeEventListener('pointerdown', onPointerDown);
    doc.removeEventListener('click', onClick, true);
    doc.removeEventListener('keydown', onKeyDown);
    doc.removeEventListener('scroll', onScroll, { capture: true });
    win.removeEventListener('scroll', onScroll);
    win.removeEventListener('resize', onResize);
    hide();
    tipEl?.remove();
    tipEl = null;
    titleEl = null;
    bodyEl = null;
  };

  return {
    show,
    hide,
    reposition,
    markRenderSyncing,
    syncAfterRender,
    isOpen: () => activeTrigger !== null && tipEl !== null && !tipEl.hidden,
    isPinned: () => pinned,
    getActiveTipId: () => activeTipId,
    dispose,
  };
};
