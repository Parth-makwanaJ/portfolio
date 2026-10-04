"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

/** True once the element has entered the viewport (or while it is in view, if once is false). */
export function useInView(
  ref: RefObject<Element | null>,
  { once = true, rootMargin = "0px" }: { once?: boolean; rootMargin?: string } = {},
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, rootMargin]);
  return inView;
}

const REDUCE = "(prefers-reduced-motion: reduce)";

/** Live value of prefers-reduced-motion. false on the server. */
export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(REDUCE);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );
}
