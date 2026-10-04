"use client";

/**
 * Loads the motion runtime (Lenis, GSAP, ScrollTrigger, SplitText, the cursor) as its own chunk
 * once the page has loaded and the browser is idle, so none of it is in the JavaScript needed for
 * first paint. Every page's content is complete and visible without it.
 * After each navigation it sets up that page's scroll effects again.
 */

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type Runtime = typeof import("@/lib/motion/runtime");

let runtime: Promise<Runtime> | null = null;
const load = () =>
  (runtime ??= import("@/lib/motion/runtime").then((m) => {
    m.start();
    return m;
  }));

function whenIdle(cb: () => void) {
  const run = () =>
    "requestIdleCallback" in window ? window.requestIdleCallback(cb, { timeout: 1500 }) : setTimeout(cb, 200);
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
}

export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    const go = () =>
      void load().then((m) => {
        if (!cancelled) cleanup = m.initPage();
      });
    if (runtime) go();
    else whenIdle(go);
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pathname]);

  return null;
}
