import Link from "next/link";
import { BackToTop } from "@/components/site/BackToTop";
import { contact, profile, services, socials } from "@/content/site";
import { publicLinks } from "@/lib/env";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-rule-strong">
      <div className="container-page grid-12 gap-y-10 py-12 md:py-16">
        <div className="col-span-4 md:col-span-4">
          <p className="text-h3">{profile.name}</p>
          <p className="mt-3 max-w-[30ch] text-small text-fg-muted">
            {profile.jobTitle}. {profile.location.city}, {profile.location.country}.
          </p>
        </div>

        <nav aria-label="Footer" className="col-span-2 md:col-span-2 md:col-start-6">
          <p className="label text-fg-subtle">Site</p>
          <ul className="mt-3 space-y-2 text-small">
            <li><Link href="/work" className="hover:text-signal">Work</Link></li>
            <li><Link href="/services" className="hover:text-signal">Services</Link></li>
            <li><Link href="/about" className="hover:text-signal">About</Link></li>
            <li><Link href="/contact" className="hover:text-signal">Contact</Link></li>
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-3">
          <p className="label text-fg-subtle">Services</p>
          <ul className="mt-3 space-y-2 text-small">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-signal">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-4 md:col-span-2">
          <p className="label text-fg-subtle">Contact</p>
          <ul className="mt-3 space-y-2 text-small">
            <li>
              <a href={`mailto:${contact.email}`} className="break-all hover:text-signal">
                {contact.email}
              </a>
            </li>
            {publicLinks.whatsapp && (
              <li>
                <a href={publicLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-signal">
                  WhatsApp
                </a>
              </li>
            )}
            {socials.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer me" className="hover:text-signal">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-page flex flex-wrap items-center justify-between gap-4 border-t border-rule py-5">
        <p className="label text-fg-subtle">
          © {year} {profile.name}
        </p>
        <a href={profile.resume} className="label text-fg-muted hover:text-fg" download>
          Resume (PDF)
        </a>
        <BackToTop />
      </div>
    </footer>
  );
}
