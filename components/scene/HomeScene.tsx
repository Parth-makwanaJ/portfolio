"use client";

/**
 * The fixed canvas behind the home page. Starts the scroll/pointer input at once (it also drives the
 * pinned services). Until the scene starts, a still of the particle field is drawn into a 2D canvas
 * (a canvas is never the LCP element, so it can't compete with the headline). three.js and the scene
 * load when the start gate opens: on desktop idle after load or the first input; on phones only the
 * first touch or scroll.
 * Unmounting (leaving the home page) disposes the WebGL context: inner pages never run live WebGL.
 */

import { useEffect, useRef } from "react";
import { startSceneInput } from "@/components/scene/input";
import { isPhone, whenInteracted, whenStartAllowed } from "@/lib/motion/start-gate";

/** Draws the still (cover-fit) once the page has loaded, fetched at low priority. */
function drawStill(container: HTMLElement) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
  container.append(canvas);
  const img = new Image();
  img.decoding = "async";
  img.fetchPriority = "low";
  img.onload = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    const pr = Math.min(window.devicePixelRatio, 2);
    canvas.width = Math.round(w * pr);
    canvas.height = Math.round(h * pr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const k = Math.max(canvas.width / img.width, canvas.height / img.height);
    const dw = img.width * k;
    const dh = img.height * k;
    ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
  };
  img.src = window.innerWidth < 768 ? "/scene/static-tall.webp" : "/scene/static-wide.webp";
  return () => canvas.remove();
}

export function HomeScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stopInput = startSceneInput();
    let dispose: (() => void) | undefined;
    let removeStill: (() => void) | undefined;
    let cancelled = false;
    const still = () => {
      if (!cancelled && ref.current && !dispose) removeStill = drawStill(ref.current);
    };
    if (document.readyState === "complete") still();
    else window.addEventListener("load", still, { once: true });
    // Desktop: on idle (or first input), with the opening animation. Phones: nothing is downloaded
    // until the first touch or scroll; the live scene then fades in over the still, core already formed.
    const phone = isPhone();
    (phone ? whenInteracted : whenStartAllowed)(
      () =>
        void import("@/components/scene/scene").then(({ mountScene }) => {
          if (!cancelled && ref.current) dispose = mountScene(ref.current, { skipIntro: phone });
        }),
    );
    return () => {
      cancelled = true;
      window.removeEventListener("load", still);
      dispose?.();
      removeStill?.();
      stopInput();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh bg-bg bg-cover bg-center data-[scene=static-image]:bg-[url(/scene/static-wide.webp)] max-md:data-[scene=static-image]:bg-[url(/scene/static-tall.webp)]"
    />
  );
}
