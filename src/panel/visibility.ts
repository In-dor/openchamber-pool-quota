export interface VisibilityDocumentLike {
  readonly visibilityState: string;
  readonly documentElement: Element | null;
  addEventListener(type: 'visibilitychange', listener: () => void): void;
  removeEventListener(type: 'visibilitychange', listener: () => void): void;
}

export interface VisibilityWindowLike {
  readonly innerWidth: number;
  readonly innerHeight: number;
  addEventListener(type: 'resize', listener: () => void): void;
  removeEventListener(type: 'resize', listener: () => void): void;
}

export interface IntersectionObserverEntryLike {
  readonly isIntersecting: boolean;
}

export interface IntersectionObserverLike {
  observe(target: Element): void;
  disconnect(): void;
}

export interface IntersectionObserverCtorLike {
  new (
    callback: (entries: IntersectionObserverEntryLike[]) => void,
    options?: { root?: Element | Document | null; threshold?: number | number[] },
  ): IntersectionObserverLike;
}

export interface ResizeObserverLike {
  observe(target: Element): void;
  disconnect(): void;
}

export interface ResizeObserverCtorLike {
  new (callback: () => void): ResizeObserverLike;
}

export interface PanelVisibilityTrackerOptions {
  doc?: VisibilityDocumentLike;
  win?: VisibilityWindowLike;
  IntersectionObserverCtor?: IntersectionObserverCtorLike | null;
  ResizeObserverCtor?: ResizeObserverCtorLike | null;
  onBecomeVisible?: () => void;
}

export interface PanelVisibilityTracker {
  isVisible(): boolean;
  evaluate(): boolean;
  dispose(): void;
}

/**
 * Tracks real panel visibility inside an OpenChamber iframe across desktop and mobile:
 *  1. Document visibilityState === 'visible' (tab switch / backgrounded app / lock screen)
 *  2. Non-zero viewport size: innerWidth > 0 && innerHeight > 0 (desktop display: none)
 *  3. Top-level viewport intersection via IntersectionObserver({ root: null, threshold: 0.01 })
 *     (mobile drawer translated off-screen with transform: translateX(100%) + visibility: hidden)
 *
 * Defaults `intersecting` to true before the first IntersectionObserver callback so initial paint
 * is never blocked, and degrades gracefully if IntersectionObserver / ResizeObserver is absent.
 */
export const createPanelVisibilityTracker = (
  options: PanelVisibilityTrackerOptions = {},
): PanelVisibilityTracker => {
  const doc: VisibilityDocumentLike = options.doc ?? document;
  const win: VisibilityWindowLike = options.win ?? window;
  const IOCtor: IntersectionObserverCtorLike | null = options.IntersectionObserverCtor !== undefined
    ? options.IntersectionObserverCtor
    : (typeof IntersectionObserver === 'function' ? IntersectionObserver : null);
  const ROCtor: ResizeObserverCtorLike | null = options.ResizeObserverCtor !== undefined
    ? options.ResizeObserverCtor
    : (typeof ResizeObserver === 'function' ? ResizeObserver : null);

  let intersecting = true;

  const isVisible = (): boolean => (
    doc.visibilityState === 'visible'
    && win.innerWidth > 0
    && win.innerHeight > 0
    && intersecting
  );

  let wasVisible = isVisible();

  const evaluate = (): boolean => {
    const nowVisible = isVisible();
    const becameVisible = !wasVisible && nowVisible;
    wasVisible = nowVisible;
    if (becameVisible) {
      options.onBecomeVisible?.();
    }
    return nowVisible;
  };

  const onVisibilityChange = (): void => {
    evaluate();
  };

  const onResize = (): void => {
    evaluate();
  };

  doc.addEventListener('visibilitychange', onVisibilityChange);
  win.addEventListener('resize', onResize);

  let io: IntersectionObserverLike | null = null;
  if (IOCtor && doc.documentElement) {
    try {
      io = new IOCtor(
        (entries) => {
          const latest = entries[entries.length - 1];
          if (!latest) return;
          intersecting = Boolean(latest.isIntersecting);
          evaluate();
        },
        { root: null, threshold: 0.01 },
      );
      io.observe(doc.documentElement);
    } catch {
      io = null;
      intersecting = true;
    }
  }

  let ro: ResizeObserverLike | null = null;
  if (ROCtor && doc.documentElement) {
    try {
      ro = new ROCtor(() => {
        evaluate();
      });
      ro.observe(doc.documentElement);
    } catch {
      ro = null;
    }
  }

  const dispose = (): void => {
    doc.removeEventListener('visibilitychange', onVisibilityChange);
    win.removeEventListener('resize', onResize);
    try {
      io?.disconnect();
    } catch {
      // ignore
    }
    try {
      ro?.disconnect();
    } catch {
      // ignore
    }
    io = null;
    ro = null;
  };

  return { isVisible, evaluate, dispose };
};
