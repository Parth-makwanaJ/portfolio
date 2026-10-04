"use client";

import { useEffect } from "react";

// Set after the first client render. Never true on the server, so the first page load
// (and its headline) is never animated; only client-side navigations get the transition.
let hydrated = false;

/** Page transition: short fade and 8px rise on navigation. Opacity and transform only (see .page-enter). */
export default function Template({ children }: { children: React.ReactNode }) {
  const animate = typeof window !== "undefined" && hydrated;

  useEffect(() => {
    hydrated = true;
  }, []);

  return <div className={animate ? "page-enter" : undefined}>{children}</div>;
}
