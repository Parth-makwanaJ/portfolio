"use client";

/**
 * The open mobile menu: shadcn/ui Sheet (Radix Dialog) for focus trapping, Escape to close and
 * aria-modal. Full-screen, dark, large serif links.
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
        className="w-full gap-0 border-0 bg-bg p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-none"
      >
        <div className="flex h-16 items-center justify-between border-b border-rule px-(--gutter)">
          <SheetTitle className="label font-sans text-fg-muted">Menu</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
          <SheetClose aria-label="Close menu" className="grid size-11 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--rule-strong)]">
            <X className="size-4" aria-hidden="true" />
          </SheetClose>
        </div>

        <nav aria-label="Mobile" className="px-(--gutter) pt-4">
          <ol>
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <li key={l.href} className="border-b border-rule">
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className="flex items-center gap-4 py-4"
                  >
                    <span className="font-display text-h2">{l.label}</span>
                    {active && <span aria-hidden="true" className="size-2 rounded-full bg-signal" />}
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-auto space-y-5 p-(--gutter) pb-8">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="btn btn-primary h-14 w-full text-base"
          >
            Start a project
          </Link>
          <a href={`mailto:${email}`} className="block text-small text-fg-muted link-line">
            {email}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
