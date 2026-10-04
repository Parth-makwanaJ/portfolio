import { Hero } from "@/components/home/Hero";
import { ClientMarquee } from "@/components/home/ClientMarquee";
import { ServicesBento } from "@/components/home/ServicesBento";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Process } from "@/components/home/Process";
import { Numbers } from "@/components/home/Numbers";
import { Testimonials } from "@/components/home/Testimonials";
import { TechStack } from "@/components/home/TechStack";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { JsonLd } from "@/components/site/JsonLd";
import { testimonials, visibleFaqs } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { personSchema, professionalServiceSchema, websiteSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  title: "Parth Makwana | Shopify and Laravel developer, Ahmedabad",
  absoluteTitle: true,
  description:
    "I build fast Shopify stores and Laravel and Node.js backends, and fix slow sites. Developer and tech lead in Ahmedabad, India, open to freelance work.",
  path: "/",
});

export default function Home() {
  // Number only the sections that render, so hidden blocks leave no gaps (01, 02, 03...).
  let n = 0;
  const next = () => String(++n).padStart(2, "0");
  const faqs = visibleFaqs();

  return (
    <>
      <Hero />
      <ClientMarquee />
      <ServicesBento number={next()} />
      <SelectedWork number={next()} />
      <Process number={next()} />
      <Numbers />
      {testimonials.length > 0 && <Testimonials number={next()} />}
      <TechStack number={next()} />
      {faqs.length > 0 && <Faq number={next()} items={faqs} />}
      <FinalCta />
      <JsonLd data={[websiteSchema(), personSchema(), professionalServiceSchema()]} />
    </>
  );
}
