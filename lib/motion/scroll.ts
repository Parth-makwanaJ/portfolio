/**
 * The one smooth-scroll instance (Lenis), registered by the motion runtime on desktop.
 * Kept in this tiny module so components can scroll without loading the runtime.
 */

type Scroller = {
  scrollTo(target: number, options?: { immediate?: boolean; force?: boolean }): void;
};

let scroller: Scroller | null = null;

export const setScroller = (s: Scroller | null) => {
  scroller = s;
};

export function scrollToTop() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (scroller && !reduce) scroller.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}
