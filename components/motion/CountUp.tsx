"use client";

/**
 * Count-up number for the stats row.
 * Adapted from Vengeance UI "stats-counter" (MIT, (c) 2025-2026 Ashutoshx7,
 * https://github.com/Ashutoshx7/VengenceUI): same idea, counting up once the number scrolls into view.
 * Changes: the server renders the real value (correct without JavaScript and for crawlers);
 * the count runs with requestAnimationFrame and an ease-out curve instead of a Motion spring
 * (keeps the home page JavaScript small); reduced motion shows the value at once.
 */

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cx } from "@/lib/cx";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function CountUp({
  value,
  suffix = "",
  duration = 900,
  className,
}: {
  value: number;
  suffix?: string;
  /** ms */
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { rootMargin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const done = useRef(false);

  // Park below-the-fold numbers at 0 so the count can run when they arrive.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || done.current) return;
    if (el.getBoundingClientRect().top > window.innerHeight) el.textContent = `0${suffix}`;
  }, [reduce, suffix]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce || done.current) return;
    done.current = true;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      el.textContent = `${Math.round(easeOut(t) * value)}${suffix}`;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = `${value}${suffix}`;
    };
  }, [inView, reduce, value, suffix, duration]);

  return (
    <span ref={ref} className={cx("tabular-nums", className)}>
      {value}
      {suffix}
    </span>
  );
}
