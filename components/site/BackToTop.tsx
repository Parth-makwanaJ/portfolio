"use client";

import { ArrowUp } from "lucide-react";
import { scrollToTop } from "@/lib/motion/scroll";

/** Scrolls to the top and moves focus to the skip-link target so keyboard users land at the start. */
export function BackToTop() {
  const onClick = () => {
    scrollToTop();
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 items-center gap-2 text-fg-muted transition-colors duration-(--dur-fast) ease-brand hover:text-fg"
    >
      Back to top
      <ArrowUp className="size-3.5" aria-hidden="true" />
    </button>
  );
}
