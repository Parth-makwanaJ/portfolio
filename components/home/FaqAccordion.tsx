"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/** shadcn/ui accordion (Radix): aria-expanded, aria-controls and arrow-key support built in. */
export default function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <Accordion type="single" collapsible className="col-span-4 border-t border-rule-strong md:col-span-9 md:col-start-4">
      {items.map((f, i) => (
        <AccordionItem key={f.question} value={`q${i}`} className="border-b border-rule">
          <AccordionTrigger className="py-5 text-left text-lead font-medium hover:no-underline">{f.question}</AccordionTrigger>
          <AccordionContent className="max-w-[60ch] pb-6 text-body text-fg-muted">{f.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
