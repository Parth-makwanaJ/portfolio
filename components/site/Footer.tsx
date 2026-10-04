import Link from "next/link";
import { BackToTop } from "@/components/site/BackToTop";
import { contact, profile, services, socials } from "@/content/site";
import { publicLinks } from "@/lib/env";

export function Footer() {
  const year = new Date().getFullYear();
  const link = "text-fg-muted transition-colors duration-(--dur-fast) ease-brand hover:text-fg";
  return (
    <footer className="relative z-10 border-t border-rule bg-bg">
      <div className="container-page grid-12 gap-y-12 py-16 md:py-20">
        <div className="col-span-4 md:col-span-5">
          <p className="font-display text-h3">{profile.name}</p>
          <p className="mt-3 max-w-[32ch] text-small text-fg-muted">
            {profile.jobTitle}. {profile.location.city}, {profile.location.country}.
          </p>
        </div>

        <nav aria-label="Footer" className="col-span-2 md:col-span-2">
          <p className="label text-fg-muted">Site</p>
          <ul className="mt-4 space-y-2.5 text-small">
            <li><Link href="/work" className={link}>Work</Link></li>
            <li><Link href="/services" className={link}>Services</Link></li>
            <li><Link href="/about" className={link}>About</Link></li>
            <li><Link href="/contact" className={link}>Contact</Link></li>
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-3">
          <p className="label text-fg-muted">Services</p>
          <ul className="mt-4 space-y-2.5 text-small">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={link}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-4 md:col-span-2">
          <p className="label text-fg-muted">Contact</p>
          <ul className="mt-4 space-y-2.5 text-small">
            <li>
              <a href={`mailto:${contact.email}`} className={`break-all ${link}`}>
                {contact.email}
              </a>
            </li>
            {publicLinks.whatsapp && (
              <li>
                <a href={publicLinks.whatsapp} target="_blank" rel="noopener noreferrer" className={link}>
                  WhatsApp
                </a>
              </li>
            )}
            {socials.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer me" className={link}>
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-page flex flex-wrap items-center justify-between gap-4 border-t border-rule py-6 text-small">
        <p className="text-fg-muted">
          © {year} {profile.name}
        </p>
        <a href={profile.resume} className={link} download>
          Resume (PDF)
        </a>
        <BackToTop />
      </div>
    </footer>
  );
}
