import { MagneticButton } from "@/components/motion/MagneticButton";
import { RevealText } from "@/components/motion/RevealText";
import { contact, profile } from "@/content/site";
import { publicLinks } from "@/lib/env";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="section-space border-t border-rule-strong">
      <div className="container-page grid-12 gap-y-10">
        <div className="col-span-4 md:col-span-9">
          <RevealText id="cta-title" text="Have a project in mind?" className="text-h1" />
          <p className="mt-6 max-w-[44ch] text-lead text-fg-muted">
            Tell me what you need, and I will reply with questions or a plan.
          </p>
        </div>
        <div className="col-span-4 flex flex-col gap-6 md:col-span-3 md:justify-end">
          <MagneticButton href="/contact">Start a project</MagneticButton>
          <ul className="space-y-2 text-small">
            <li>
              <a href={`mailto:${contact.email}`} className="underline underline-offset-4 hover:text-signal">
                {contact.email}
              </a>
            </li>
            {publicLinks.whatsapp && (
              <li>
                <a href={publicLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-signal">
                  Message on WhatsApp
                </a>
              </li>
            )}
            {publicLinks.booking && (
              <li>
                <a href={publicLinks.booking} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-signal">
                  Book a call
                </a>
              </li>
            )}
          </ul>
          <p className="label text-fg-subtle">{profile.availability}</p>
        </div>
      </div>
    </section>
  );
}
