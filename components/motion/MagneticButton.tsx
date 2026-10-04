"use client";

/**
 * Primary call-to-action with a small magnetic pull towards the pointer.
 * Own component (no free, licensed magnetic button was available in Vengeance UI or Skiper UI).
 * Transform only, via a CSS transition; mouse/pen only (no effect on touch);
 * off with prefers-reduced-motion. It is a normal Next.js link, so keyboard use is unchanged.
 */

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { cx } from "@/lib/cx";

const PULL = 0.25; // fraction of the pointer offset
const MAX = 10; // px

export function MagneticButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const move = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = Math.max(-MAX, Math.min(MAX, (e.clientX - (r.left + r.width / 2)) * PULL));
    const y = Math.max(-MAX, Math.min(MAX, (e.clientY - (r.top + r.height / 2)) * PULL));
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <Link
      ref={ref}
      href={href}
      onPointerMove={move}
      onPointerLeave={reset}
      onBlur={reset}
      className={cx(
        "group inline-flex h-12 items-center justify-between gap-6 bg-signal px-5 font-medium text-on-signal transition-[transform,opacity] duration-(--dur-base) ease-brand hover:opacity-90",
        className,
      )}
    >
      {children}
      <ArrowRight
        className="size-4 transition-transform duration-(--dur-fast) ease-brand group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}
