"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";

export function MainNav({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden md:block">
      <ul className="flex items-center gap-8">
        {links.map((l) => {
          const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "relative text-small transition-colors duration-(--dur-fast) ease-brand hover:text-fg",
                  active ? "text-fg" : "text-fg-muted",
                )}
              >
                {active && (
                  <span aria-hidden="true" className="absolute top-1/2 -left-3 size-1 -translate-y-1/2 rounded-full bg-signal" />
                )}
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
