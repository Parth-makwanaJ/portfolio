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
    <section aria-labelledby="nf-title" className="container-page grid-12 gap-y-10 pt-16 pb-(--section-space) md:pt-24">
      <p className="label col-span-4 text-fg-subtle md:col-span-3">Error 404</p>
      <div className="col-span-4 md:col-span-9">
        <h1 id="nf-title" className="text-display">
          Page not found<span className="text-signal">.</span>
        </h1>
        <p className="mt-6 max-w-[44ch] text-lead text-fg-muted">
          The page you asked for does not exist or has moved. These will get you back on track.
        </p>
        <ul className="mt-12 border-t border-rule-strong">
          {links.map((l) => (
            <li key={l.href} className="border-b border-rule-strong">
              <Link href={l.href} className="group flex items-center justify-between gap-6 py-5 hover:bg-surface">
                <span>
                  <span className="text-h3">{l.label}</span>
                  <span className="label ml-4 text-fg-subtle">{l.note}</span>
                </span>
                <ArrowRight className="size-5 transition-[color,transform] duration-(--dur-fast) ease-brand group-hover:translate-x-1 group-hover:text-signal" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
