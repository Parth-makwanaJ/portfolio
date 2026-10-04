"use client";

import { ArrowUp } from "lucide-react";

/** Scrolls to the top and moves focus to the skip-link target so keyboard users land at the start. */
export function BackToTop() {
  const onClick = () => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="label inline-flex items-center gap-2 text-fg-muted transition-colors duration-(--dur-fast) ease-brand hover:text-fg"
    >
      Back to top
      <ArrowUp className="size-3.5" aria-hidden="true" />
    </button>
  );
}
