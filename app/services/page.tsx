import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeader } from "@/components/SectionHeader";
import { FinalCta } from "@/components/home/FinalCta";
import { projectsForService, services } from "@/content/site";

export const metadata = pageMetadata({
  title: "Services: Shopify, backends, speed and SEO",
  description: "Shopify development, Laravel and Node.js backends, speed and Core Web Vitals fixes, and technical SEO audits by Parth Makwana.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Services", href: "/services" }]} />
      <section aria-labelledby="services-title" className="pt-12 pb-(--section-space) md:pt-20">
        <SectionHeader
          as="h1"
          label="Services"
          id="services-title"
          title="Services"
          intro="What I build and fix for businesses. Pick one to see what is included and the projects behind it."
        />
        <ul className="container-page mt-14 md:mt-20">
          {services.map((s) => {
            const count = projectsForService(s.slug).length;
            return (
              <li key={s.slug} className="border-t border-rule last:border-b">
                <Link href={`/services/${s.slug}`} className="group grid-12 gap-y-4 py-10 md:py-14">
                  <h2 className="col-span-4 text-h2 transition-transform duration-(--dur-fast) ease-brand group-hover:translate-x-2 motion-reduce:transform-none md:col-span-6">
                    {s.name}
                  </h2>
                  <p className="col-span-4 max-w-[44ch] text-fg-muted md:col-span-4 md:pt-3">{s.short}</p>
                  <span className="col-span-4 flex items-start justify-between gap-4 md:col-span-2 md:pt-3">
                    <span className="text-small text-fg-muted">
                      {count} {count === 1 ? "project" : "projects"}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-6 transition-[color,transform] duration-(--dur-fast) ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <FinalCta />
    </>
  );
}
