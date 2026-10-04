import { FaqAccordionLazy } from "@/components/home/FaqAccordionLazy";
import { SectionHeader } from "@/components/SectionHeader";
import { JsonLd } from "@/components/site/JsonLd";
import type { Faq as FaqItem } from "@/content/site";

/**
 * FAQ with the shadcn/ui accordion (Radix: aria-expanded, aria-controls, keyboard support).
 * Renders nothing when there are no confirmed answers. FAQPage JSON-LD uses the same text.
 */
export function Faq({ number, items, id = "faq-title" }: { number: string; items: FaqItem[]; id?: string }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={id} className="section-space pt-0">
      <SectionHeader number={number} label="FAQ" id={id} title="Questions clients ask" />
      <div className="container-page grid-12 mt-12 md:mt-16">
        <FaqAccordionLazy items={items.map(({ question, answer }) => ({ question, answer }))} />
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />
    </section>
  );
}
