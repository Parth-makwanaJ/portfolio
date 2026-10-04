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
import { testimonials, visibleFaqs } from "@/content/site";

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
    </>
  );
}
