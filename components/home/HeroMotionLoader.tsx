"use client";

/**
 * Adds the hero's 3D layer after first paint, only where it makes sense:
 * screens 768px and wider with a fine pointer, no prefers-reduced-motion, no data saver,
 * and at least 4 CPU cores (a rough low-power check). Everywhere else the static
 * composition stays as it is. The motion code is a separate chunk loaded when idle.
 * Turns itself off again if reduced motion is switched on.
 */

import { useEffect } from "react";

const QUERY = "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

type NavigatorExtras = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

export function HeroMotionLoader({ heroId }: { heroId: string }) {
  useEffect(() => {
    const nav = navigator as NavigatorExtras;
    const lowPower =
      (nav.hardwareConcurrency ?? 8) < 4 || (nav.deviceMemory ?? 8) < 4 || nav.connection?.saveData === true;
    if (lowPower) return;

    const mq = window.matchMedia(QUERY);
    let stop: (() => void) | undefined;
    let cancelled = false;
    let idle = 0;

    const start = () => {
      if (stop || !mq.matches) return;
      const run = () =>
        import("@/components/home/heroMotion").then(({ initHeroMotion }) => {
          const hero = document.getElementById(heroId);
          if (!cancelled && hero && mq.matches && !stop) stop = initHeroMotion(hero);
        });
      idle = typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(run, { timeout: 2000 })
        : globalThis.setTimeout(run, 300) as unknown as number;
    };
    const onChange = () => {
      if (mq.matches) start();
      else {
        stop?.();
        stop = undefined;
      }
    };

    start();
    mq.addEventListener("change", onChange);
    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      else globalThis.clearTimeout(idle);
      mq.removeEventListener("change", onChange);
      stop?.();
    };
  }, [heroId]);

  return null;
}
