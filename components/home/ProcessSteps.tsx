"use client";

/**
 * Scroll-linked process sequence. A 1px line draws down beside the steps (scaleY) and each step's
 * red marker scales in as the line reaches it; a sticky counter shows the current step.
 * Step text always stays at full contrast. Transform only, written straight to the DOM once per
 * frame (no re-renders, no library).
 * Without JS, or with reduced motion, everything is shown in full.
 */

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

export function ProcessSteps({ steps }: { steps: { step: string; text: string }[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const list = listRef.current;
    const line = lineRef.current;
    if (!list || !line) return;
    const markers = Array.from(list.querySelectorAll<HTMLElement>("[data-marker]"));

    if (reduce) {
      line.style.transform = "";
      markers.forEach((el) => (el.style.transform = ""));
      return;
    }

    let raf = 0;
    const paint = () => {
      raf = 0;
      const r = list.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the list top reaches 70% of the viewport, 1 when its bottom reaches 55%.
      const start = vh * 0.7;
      const end = vh * 0.55;
      const p = Math.min(1, Math.max(0, (start - r.top) / (r.height - (end - start) || 1)));
      line.style.transform = `scaleY(${p})`;
      let current = 0;
      markers.forEach((el, i) => {
        const on = i === 0 ? p > 0 : p >= i / markers.length + 0.02;
        el.style.transform = on ? "scale(1)" : "scale(0)";
        if (on) current = i;
      });
      if (counterRef.current) counterRef.current.textContent = String(current + 1).padStart(2, "0");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce]);

  return (
    <div className="container-page grid-12 mt-12 md:mt-16">
      <div className="col-span-4 hidden md:col-span-3 md:block">
        <p className="label sticky top-28 text-fg-subtle">
          Step <span ref={counterRef} className="text-fg">01</span> / {String(steps.length).padStart(2, "0")}
        </p>
      </div>
      <div className="relative col-span-4 md:col-span-9">
        <span aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-px bg-rule" />
        <span ref={lineRef} aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-px origin-top bg-signal" />
        <ol ref={listRef}>
          {steps.map((s, i) => (
            <li
              key={s.step}
              className="relative grid grid-cols-[3rem_1fr] gap-x-4 border-b border-rule py-8 pl-6 md:grid-cols-[5rem_1fr_1fr] md:gap-x-(--grid-gap) md:py-10 md:pl-8"
            >
              <span
                data-marker
                aria-hidden="true"
                className="absolute top-[2.6rem] -left-[5px] size-[11px] bg-signal transition-transform duration-(--dur-base) ease-brand md:top-[3.1rem]"
              />
              <span className="label pt-2 text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-h3">{s.step}</h3>
              <p className="col-start-2 mt-2 max-w-[40ch] text-fg-muted md:col-start-3 md:mt-1">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
