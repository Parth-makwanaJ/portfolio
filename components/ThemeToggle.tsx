"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const next = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      className="grid size-10 place-items-center rounded-(--radius) border border-rule text-fg-muted transition-colors duration-(--dur-fast) ease-brand hover:border-rule-strong hover:text-fg"
    >
      {/* Both icons render on the server; CSS shows the right one, so nothing shifts on hydration. */}
      <Sun className="hidden size-4 dark:block" aria-hidden="true" />
      <Moon className="size-4 dark:hidden" aria-hidden="true" />
    </button>
  );
}
