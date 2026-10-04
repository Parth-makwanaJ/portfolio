import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const links = [
  { href: "/", label: "Home", note: "Start from the beginning" },
  { href: "/work", label: "Work", note: "All projects" },
  { href: "/contact", label: "Contact", note: "Start a project" },
];

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="container-page pt-20 pb-(--section-space) md:pt-28">
      <p className="label text-fg-muted">Error 404</p>
      <h1 id="nf-title" className="mt-5 text-display">
        Page not found
      </h1>
      <p className="mt-6 max-w-[44ch] text-lead text-fg-muted">
        The page you asked for does not exist or has moved. These will get you back on track.
      </p>
      <ul className="mt-14 max-w-3xl border-t border-rule">
        {links.map((l) => (
          <li key={l.href} className="border-b border-rule">
            <Link href={l.href} className="group flex items-center justify-between gap-6 py-6">
              <span className="flex flex-wrap items-baseline gap-x-5">
                <span className="font-display text-h3">{l.label}</span>
                <span className="text-small text-fg-muted">{l.note}</span>
              </span>
              <ArrowRight
                className="size-5 transition-[color,transform] duration-(--dur-fast) ease-brand group-hover:translate-x-1 group-hover:text-signal"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
