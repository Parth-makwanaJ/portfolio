import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeaderShell } from "@/components/site/HeaderShell";
import { MainNav } from "@/components/site/MainNav";
import { MobileMenu } from "@/components/site/MobileMenu";
import { contact, profile } from "@/content/site";

export const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <>
      {/* The bar is fixed; this spacer holds its place so content never shifts. */}
      <div aria-hidden="true" className="h-14 md:h-16" />
      <HeaderShell>
        <div className="container-page grid-12 h-14 items-center md:h-16">
          <Link
            href="/"
            className="col-span-2 text-small font-medium tracking-tight text-fg md:col-span-3"
            aria-label={`${profile.name}, home`}
          >
            {profile.name}
          </Link>

          <MainNav links={navLinks} />

          <div className="col-span-2 flex items-center justify-end gap-2 md:col-span-3">
            <ThemeToggle />
            <Link
              href="/contact"
              className="hidden h-9 items-center bg-signal px-4 text-small font-medium text-on-signal transition-opacity duration-(--dur-fast) ease-brand hover:opacity-90 sm:inline-flex"
            >
              Start a project
            </Link>
            <MobileMenu links={navLinks} email={contact.email} />
          </div>
        </div>
      </HeaderShell>
    </>
  );
}
