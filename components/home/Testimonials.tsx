import { SectionHeader } from "@/components/SectionHeader";
import { testimonials } from "@/content/site";

/** Hidden until real testimonials are added to content/site.ts. */
export function Testimonials({ number }: { number: string }) {
  if (testimonials.length === 0) return null;
  return (
    <section aria-labelledby="testimonials-title" className="section-space pt-0">
      <SectionHeader number={number} label="Clients" id="testimonials-title" title="What clients say" />
      <ul className="container-page mt-12 grid grid-cols-1 gap-px border border-rule-strong bg-rule-strong md:mt-16 md:grid-cols-2">
        {testimonials.map((t) => (
          <li key={t.name} className="bg-bg p-5 md:p-8">
            <figure>
              <blockquote className="text-lead">“{t.quote}”</blockquote>
              <figcaption className="mt-6 text-small">
                <span className="font-medium">{t.name}</span>
                <span className="text-fg-muted">
                  , {t.role}, {t.company}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
