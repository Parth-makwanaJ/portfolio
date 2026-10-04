import Link from "next/link";
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
      <div aria-hidden="true" className="h-16" />
      <HeaderShell>
        <div data-scene-text className="container-page flex h-16 items-center justify-between gap-6">
          <Link href="/" className="font-display text-[1.375rem] leading-none tracking-[-0.01em]" aria-label={`${profile.name}, home`}>
            {profile.name}
          </Link>
          <div className="flex items-center gap-8">
            <MainNav links={navLinks} />
            <Link href="/contact" className="btn btn-primary hidden h-10 px-5 text-small sm:inline-flex">
              Start a project
            </Link>
            <MobileMenu links={navLinks} email={contact.email} />
          </div>
        </div>
      </HeaderShell>
    </>
  );
}
