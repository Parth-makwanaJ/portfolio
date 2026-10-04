"use client";

/**
 * Word-by-word reveal for section headings.
 * Adapted from Vengeance UI "stagger-text" (MIT, (c) 2025-2026 Ashutoshx7,
 * https://github.com/Ashutoshx7/VengenceUI): same per-word mask and upward slide with a stagger.
 * Changes: driven by CSS transitions and an IntersectionObserver instead of Motion (keeps the
 * home page JavaScript small), so the text is fully visible
 * without JavaScript (hidden state applies only under html.js); reduced motion gets a fade only;
 * Swiss timing tokens. Never use this on the hero headline.
 */

import { Fragment, useRef } from "react";
import { useInView } from "@/lib/hooks";
import { cx } from "@/lib/cx";

export function RevealText({
  text,
  as = "h2",
  id,
  className,
}: {
  text: string;
  as?: "h2" | "h3" | "p";
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const Tag = as as "h2";
  const inView = useInView(ref, { rootMargin: "0px 0px -15% 0px" });
  const words = text.split(" ");

  return (
    <Tag ref={ref} id={id} aria-label={text} data-in={inView ? "" : undefined} className={cx("reveal", className)}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span aria-hidden="true" className="reveal-word">
            <span style={{ "--i": i } as React.CSSProperties}>{word}</span>
          </span>
          {/* The space sits outside the inline-block mask, where it would collapse. */}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
