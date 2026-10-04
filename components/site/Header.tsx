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
    <header className="sticky top-0 z-50 border-b border-rule bg-bg/85 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center justify-between gap-6 md:h-20">
        <Link href="/" className="label text-fg" aria-label={`${profile.name}, home`}>
          {profile.name}
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-small text-fg-muted transition-colors duration-(--dur-fast) ease-brand hover:text-fg"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/contact"
            className="hidden h-10 items-center rounded-(--radius) bg-signal px-4 text-small font-medium text-on-signal transition-opacity duration-(--dur-fast) ease-brand hover:opacity-90 sm:inline-flex"
          >
            Start a project
          </Link>
        </div>
      </div>
    </header>
  );
}
