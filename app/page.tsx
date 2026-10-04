import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Process } from "@/components/home/Process";
import { Numbers } from "@/components/home/Numbers";
import { Testimonials } from "@/components/home/Testimonials";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { HomeScene } from "@/components/scene/HomeScene";
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
  const faqs = visibleFaqs();

  return (
    <>
      <HomeScene />
      <Hero />
      <Services />
      <SelectedWork />
      <Process />
      <Numbers />
      {testimonials.length > 0 && <Testimonials />}
      {faqs.length > 0 && <Faq items={faqs} />}
      <FinalCta scene />
      <JsonLd data={[websiteSchema(), personSchema(), professionalServiceSchema()]} />
    </>
  );
}
