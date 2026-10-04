"use client";

import { useEffect, useState } from "react";

/**
 * Fixed header bar that "shrinks" once the page scrolls: the 64px bar slides up 12px and its
 * contents slide down 6px, so the visible bar is 52px. Transform only; no layout change.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-site-chrome
      data-scrolled={scrolled ? "" : undefined}
      className="group/header fixed inset-x-0 top-0 z-50 border-b border-rule-strong bg-bg transition-transform duration-(--dur-base) ease-brand md:data-scrolled:-translate-y-3"
    >
      <div className="transition-transform duration-(--dur-base) ease-brand md:group-data-scrolled/header:translate-y-1.5">
        {children}
      </div>
    </header>
  );
}
