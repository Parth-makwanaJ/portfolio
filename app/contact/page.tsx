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
      <section aria-labelledby="contact-title" className="container-page grid-12 gap-y-14 pt-12 pb-(--section-space) md:pt-20">
        <div className="col-span-4 md:col-span-12">
          <p className="label text-fg-muted">Contact</p>
          <h1 id="contact-title" className="mt-5 text-h1">
            Start a project
          </h1>
          <p className="mt-6 max-w-[48ch] text-lead text-fg-muted">
            Tell me what you need. The more detail you give, the more useful my first reply will be.
          </p>
        </div>

        <div className="col-span-4 md:col-span-7">
          <ContactForm projectTypes={contact.projectTypes} budgets={contact.budgets} />
        </div>

        <aside aria-label="Other ways to reach me" className="col-span-4 md:col-span-4 md:col-start-9">
          <dl className="border-t border-rule">
            <div className="border-b border-rule py-5">
              <dt className="text-small text-fg-muted">Email</dt>
              <dd className="mt-2 text-lead">
                <a href={`mailto:${contact.email}`} className="break-all link-line">
                  {contact.email}
                </a>
              </dd>
            </div>
            {publicLinks.whatsapp && (
              <div className="border-b border-rule py-5">
                <dt className="text-small text-fg-muted">WhatsApp</dt>
                <dd className="mt-2 text-lead">
                  <a href={publicLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="link-line">
                    Send a message
                  </a>
                </dd>
              </div>
            )}
            {publicLinks.booking && (
              <div className="border-b border-rule py-5">
                <dt className="text-small text-fg-muted">Call</dt>
                <dd className="mt-2 text-lead">
                  <a href={publicLinks.booking} target="_blank" rel="noopener noreferrer" className="link-line">
                    Book a call
                  </a>
                </dd>
              </div>
            )}
            <div className="border-b border-rule py-5">
              <dt className="text-small text-fg-muted">Based in</dt>
              <dd className="mt-2 text-lead">
                {profile.location.city}, {profile.location.country}
              </dd>
            </div>
            <div className="border-b border-rule py-5">
              <dt className="text-small text-fg-muted">Status</dt>
              <dd className="mt-2 text-lead">{profile.availability}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </>
  );
}
