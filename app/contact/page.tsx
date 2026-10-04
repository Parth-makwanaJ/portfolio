import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactForm } from "@/components/contact/ContactForm";
import { contact, profile } from "@/content/site";
import { publicLinks } from "@/lib/env";

export const metadata = pageMetadata({
  title: "Contact: start a project",
  description: "Tell Parth Makwana about your Shopify store, backend, speed or SEO project by email, WhatsApp or the contact form.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} />
      <section aria-labelledby="contact-title" className="container-page grid-12 gap-y-12 pt-10 pb-(--section-space) md:pt-16">
        <div className="col-span-4 md:col-span-12">
          <p className="label text-fg-subtle">Contact</p>
          <h1 id="contact-title" className="mt-4 text-h1">
            Start a project
          </h1>
          <p className="mt-6 max-w-[48ch] text-lead text-fg-muted">
            Tell me what you need. The more detail you give, the more useful my first reply will be.
          </p>
        </div>

        <div className="col-span-4 border-t border-rule-strong pt-6 md:col-span-7">
          <ContactForm projectTypes={contact.projectTypes} budgets={contact.budgets} />
        </div>

        <aside aria-label="Other ways to reach me" className="col-span-4 border-t border-rule-strong pt-6 md:col-span-4 md:col-start-9">
          <dl className="space-y-6">
            <div>
              <dt className="label text-fg-subtle">Email</dt>
              <dd className="mt-2 text-lead">
                <a href={`mailto:${contact.email}`} className="break-all underline underline-offset-4 hover:text-signal">
                  {contact.email}
                </a>
              </dd>
            </div>
            {publicLinks.whatsapp && (
              <div>
                <dt className="label text-fg-subtle">WhatsApp</dt>
                <dd className="mt-2 text-lead">
                  <a href={publicLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-signal">
                    Send a message
                  </a>
                </dd>
              </div>
            )}
            {publicLinks.booking && (
              <div>
                <dt className="label text-fg-subtle">Call</dt>
                <dd className="mt-2 text-lead">
                  <a href={publicLinks.booking} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-signal">
                    Book a call
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt className="label text-fg-subtle">Based in</dt>
              <dd className="mt-2 text-lead">
                {profile.location.city}, {profile.location.country}
              </dd>
            </div>
            <div>
              <dt className="label text-fg-subtle">Status</dt>
              <dd className="mt-2 text-lead">{profile.availability}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </>
  );
}
