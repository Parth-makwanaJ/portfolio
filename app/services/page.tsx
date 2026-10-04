import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeader } from "@/components/SectionHeader";
import { FinalCta } from "@/components/home/FinalCta";
import { projectsForService, services } from "@/content/site";

export const metadata: Metadata = {
  title: "Services | Parth Makwana",
  description: "Shopify development, Laravel and Node.js backends, speed and Core Web Vitals fixes, and technical SEO audits.",
};

export default function ServicesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Services", href: "/services" }]} />
      <section aria-labelledby="services-title" className="pt-10 pb-(--section-space) md:pt-16">
        <SectionHeader
          as="h1"
          number="—"
          label="Services"
          id="services-title"
          title="Services"
          intro="What I build and fix for businesses. Pick one to see what is included and the projects behind it."
        />
        <ol className="container-page mt-12 border-t border-rule-strong md:mt-16">
          {services.map((s, i) => {
            const count = projectsForService(s.slug).length;
            return (
              <li key={s.slug} className="border-b border-rule-strong">
                <Link
                  href={`/services/${s.slug}`}
                  className="group grid-12 gap-y-4 py-8 transition-colors duration-(--dur-fast) ease-brand hover:bg-surface md:py-10"
                >
                  <span className="label col-span-4 text-fg-subtle md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="col-span-4 text-h2 md:col-span-5">{s.name}</h2>
                  <p className="col-span-4 max-w-[44ch] text-body text-fg-muted md:col-span-4">{s.short}</p>
                  <span className="col-span-4 flex items-start justify-between gap-4 md:col-span-2">
                    <span className="label text-fg-subtle">
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
        </ol>
      </section>
      <FinalCta />
    </>
  );
}
