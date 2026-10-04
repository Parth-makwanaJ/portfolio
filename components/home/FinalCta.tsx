import { MagneticButton } from "@/components/motion/MagneticButton";
import { contact, profile } from "@/content/site";
import { publicLinks } from "@/lib/env";

/**
 * Closing call to action. On the home page (scene) it is the last scene state: the particles settle
 * into a slowly turning sphere behind the very large type. Elsewhere it closes the page.
 */
export function FinalCta({ scene = false }: { scene?: boolean }) {
  return (
    <section
      id={scene ? "contact" : undefined}
      data-stop-mark={scene ? "7" : undefined}
      aria-labelledby="cta-title"
      className={scene ? "relative flex min-h-svh flex-col justify-center py-24" : "section-space border-t border-rule"}
    >
      <div className="container-page">
        <div data-scene-text className="w-fit max-w-full">
          <p className="label text-fg-muted">Contact</p>
          <h2 id="cta-title" data-reveal className={`mt-5 max-w-[11ch] ${scene ? "text-mega" : "text-h1"}`}>
            Have a project in mind?
          </h2>
        </div>
        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-center md:gap-12">
          <MagneticButton href="/contact" className="w-fit">
            Start a project
          </MagneticButton>
          <div data-scene-text className="space-y-1.5 text-small">
            <p className="text-fg-muted">Tell me what you need, and I will reply with questions or a plan.</p>
            <p className="flex flex-wrap gap-x-5 gap-y-1">
              <a href={`mailto:${contact.email}`} className="link-line">
                {contact.email}
              </a>
              {publicLinks.whatsapp && (
                <a href={publicLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="link-line">
                  WhatsApp
                </a>
              )}
              {publicLinks.booking && (
                <a href={publicLinks.booking} target="_blank" rel="noopener noreferrer" className="link-line">
                  Book a call
                </a>
              )}
              <span className="text-fg-muted">{profile.availability}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
