import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { profile } from "@/content/site";

export const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Phase 3 adds: shrink on scroll, mobile menu, active link state.
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule-strong bg-bg">
      <div className="container-page grid-12 h-14 items-center md:h-16">
        <Link
          href="/"
          className="col-span-2 text-small font-medium tracking-tight text-fg md:col-span-3"
          aria-label={`${profile.name}, home`}
        >
          {profile.name}
        </Link>

        <nav aria-label="Main" className="hidden md:col-span-6 md:col-start-4 md:block">
          <ul className="grid grid-cols-4">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-small font-medium text-fg-muted transition-colors duration-(--dur-fast) ease-brand hover:text-fg"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 flex items-center justify-end gap-2 md:col-span-3">
          <ThemeToggle />
          <Link
            href="/contact"
            className="hidden h-9 items-center bg-signal px-4 text-small font-medium text-on-signal transition-opacity duration-(--dur-fast) ease-brand hover:opacity-90 sm:inline-flex"
          >
            Start a project
          </Link>
        </div>
      </div>
    </header>
  );
}
