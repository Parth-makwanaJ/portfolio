"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";

export function MainNav({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden md:col-span-6 md:col-start-4 md:block">
      <ul className="grid grid-cols-4">
        {links.map((l) => {
          const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "text-small font-medium transition-colors duration-(--dur-fast) ease-brand hover:text-fg",
                  active ? "text-fg underline decoration-signal decoration-2 underline-offset-[6px]" : "text-fg-muted",
                )}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
