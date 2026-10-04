"use client";

/**
 * Shared input for the lab scenes, written by plain DOM listeners and read inside useFrame,
 * so scrolling and pointer moves never trigger React renders.
 * progress: 0..1 over the whole lab page scroll. pointer: -1..1 on both axes (desktop only).
 */
export const labInput = {
  progress: 0,
  pointer: { x: 0, y: 0 },
  scrollY: 0,
  reduced: false,
  mobile: false,
};

let started = false;

export function startLabInput() {
  if (started || typeof window === "undefined") return () => {};
  started = true;
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mqMobile = window.matchMedia("(max-width: 767px), (pointer: coarse)");
  const sync = () => {
    labInput.reduced = mqReduce.matches;
    labInput.mobile = mqMobile.matches;
  };
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    labInput.scrollY = window.scrollY;
    labInput.progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  };
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    labInput.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    labInput.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  sync();
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("pointermove", onPointer, { passive: true });
  mqReduce.addEventListener("change", sync);
  mqMobile.addEventListener("change", sync);
  return () => {
    started = false;
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    window.removeEventListener("pointermove", onPointer);
    mqReduce.removeEventListener("change", sync);
    mqMobile.removeEventListener("change", sync);
  };
}

/** Smoothstep between edges a and b. */
export const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Splits 0..1 page progress into stop weights for 3 stops.
 * Returns [s0to1, s1to2]: each 0..1, eased, with a hold at every stop.
 */
export const stops = (p: number): [number, number] => [smooth(0.12, 0.45, p), smooth(0.55, 0.88, p)];
