"use client";

/**
 * Light / dark toggle. The theme is applied before paint by the inline script in app/layout.tsx
 * (no flash); this button flips the "dark" class on <html> and remembers the choice.
 * Replaces next-themes to keep the shared JavaScript small.
 */

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const EVENT = "themechange";

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label="Dark theme"
      className="grid size-11 place-items-center md:size-9 border border-rule text-fg-muted transition-colors duration-(--dur-fast) ease-brand hover:border-rule-strong hover:text-fg"
    >
      {/* Both icons are in the HTML; CSS shows the right one, so nothing shifts on hydration. */}
      <Sun className="hidden size-4 dark:block" aria-hidden="true" />
      <Moon className="size-4 dark:hidden" aria-hidden="true" />
    </button>
  );
}
