"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/** shadcn/ui accordion (Radix): aria-expanded, aria-controls and arrow-key support built in. */
export default function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <Accordion type="single" collapsible className="border-t border-rule md:max-w-[60rem]">
      {items.map((f, i) => (
        <AccordionItem key={f.question} value={`q${i}`} className="border-b border-rule">
          <AccordionTrigger className="py-6 text-left font-display text-h3 font-normal hover:no-underline">
            {f.question}
          </AccordionTrigger>
          <AccordionContent className="max-w-[60ch] pb-6 text-lead text-fg-muted">{f.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
