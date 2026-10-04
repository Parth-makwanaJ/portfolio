"use client";

/**
 * The open mobile menu: shadcn/ui Sheet (Radix Dialog) for focus trapping, Escape to close and
 * aria-modal. Restyled to the Swiss tokens: full-screen, square, 1px rules, numbered links.
 * Loaded on demand by MobileMenu, so Radix is not in the initial JavaScript.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";

export default function MobileMenuSheet({
  links,
  email,
  open,
  setOpen,
  returnFocus,
}: {
  links: { href: string; label: string }[];
  email: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  returnFocus: () => void;
}) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        showCloseButton={false}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          returnFocus();
        }}
        className="w-full gap-0 border-l border-rule-strong bg-bg p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-none"
      >
        <div className="flex h-14 items-center justify-between border-b border-rule-strong px-(--gutter)">
          <SheetTitle className="label">Menu</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
          <SheetClose aria-label="Close menu" className="grid size-9 place-items-center border border-rule-strong">
            <X className="size-4" aria-hidden="true" />
          </SheetClose>
        </div>

        <nav aria-label="Mobile" className="px-(--gutter)">
          <ol>
            {links.map((l, i) => {
              const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <li key={l.href} className="border-b border-rule">
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className="flex items-baseline gap-4 py-5"
                  >
                    <span className="label text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`text-h2 ${active ? "text-signal" : ""}`}>{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-auto space-y-4 border-t border-rule-strong p-(--gutter)">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="flex h-12 items-center justify-center bg-signal font-medium text-on-signal"
          >
            Start a project
          </Link>
          <a href={`mailto:${email}`} className="block text-small text-fg-muted underline underline-offset-4">
            {email}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
