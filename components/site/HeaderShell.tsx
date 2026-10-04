"use client";

import { useEffect, useState } from "react";

/**
 * Fixed header bar: transparent over the top of the page, a solid bar with a hairline once the
 * page scrolls (colour only, no layout change).
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
      data-scrolled={scrolled ? "" : undefined}
      className="fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color] duration-(--dur-base) ease-brand data-scrolled:border-rule data-scrolled:bg-bg"
    >
      {children}
    </header>
  );
}
