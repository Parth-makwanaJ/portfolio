"use client";

/**
 * Mobile menu button. The menu itself (Radix-based sheet) is loaded the first time it is needed,
 * starting on hover/focus/touch of the button, so it costs nothing on first load.
 */

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Menu } from "lucide-react";

const loadSheet = () => import("@/components/site/MobileMenuSheet");
const MobileMenuSheet = dynamic(loadSheet, { ssr: false });

export function MobileMenu({ links, email }: { links: { href: string; label: string }[]; email: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const prefetch = () => void loadSheet();

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        onTouchStart={prefetch}
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
        className="grid size-11 place-items-center border border-rule-strong md:hidden"
      >
        <Menu className="size-4" aria-hidden="true" />
      </button>
      {mounted && (
        <MobileMenuSheet
          links={links}
          email={email}
          open={open}
          setOpen={setOpen}
          returnFocus={() => buttonRef.current?.focus()}
        />
      )}
    </>
  );
}
