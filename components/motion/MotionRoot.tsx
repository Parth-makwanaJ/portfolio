"use client";

/**
 * Loads the motion runtime (Lenis, GSAP, ScrollTrigger, SplitText, the cursor) as its own chunk
 * when the start gate opens (idle after load, or the first scroll or pointer move), so none of it is
 * in the JavaScript needed for first paint. Every page's content is complete and visible without it.
 * After each navigation it sets up that page's scroll effects again.
 */

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isPhone, whenInteracted, whenStartAllowed } from "@/lib/motion/start-gate";

type Runtime = typeof import("@/lib/motion/runtime");

let runtime: Promise<Runtime> | null = null;
const nextTask = () => new Promise<void>((resolve) => setTimeout(resolve, 0));
// Evaluating the chunk, starting Lenis and setting up the page each get their own task.
const load = () =>
  (runtime ??= import("@/lib/motion/runtime").then(async (m) => {
    await nextTask();
    m.start();
    await nextTask();
    return m;
  }));

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
    // Phones: the first screen needs nothing from GSAP (the hero is never animated and there is no
    // smooth scrolling or cursor), so it all starts on the first touch or scroll.
    else (isPhone() ? whenInteracted : whenStartAllowed)(go);
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pathname]);

  return null;
}
