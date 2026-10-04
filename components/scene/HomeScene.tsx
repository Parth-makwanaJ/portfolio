"use client";

/**
 * The fixed canvas behind the home page. Starts the scroll/pointer input at once (it also drives the
 * pinned services), then loads three.js and the scene as a separate chunk after the page has loaded,
 * so the HTML text always paints first. Unmounting (leaving the home page) disposes the WebGL context:
 * inner pages never run live WebGL.
 */

import { useEffect, useRef } from "react";
import { startSceneInput } from "@/components/scene/input";

export function HomeScene({ projects }: { projects: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stopInput = startSceneInput();
    let dispose: (() => void) | undefined;
    let cancelled = false;
    let raf = 0;
    const mount = () =>
      void import("@/components/scene/scene").then(({ mountScene }) => {
        if (!cancelled && ref.current) dispose = mountScene(ref.current);
      });
    // After the load event, when the browser is idle, so the canvas never competes with the text.
    const start = () =>
      (raf = requestAnimationFrame(() =>
        "requestIdleCallback" in window ? window.requestIdleCallback(mount, { timeout: 1200 }) : setTimeout(mount, 0),
      ));
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("load", start);
      dispose?.();
      stopInput();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-projects={projects.join(",")}
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh bg-bg bg-cover bg-center data-[scene=static-image]:bg-[url(/scene/static-wide.webp)] max-md:data-[scene=static-image]:bg-[url(/scene/static-tall.webp)]"
    />
  );
}
