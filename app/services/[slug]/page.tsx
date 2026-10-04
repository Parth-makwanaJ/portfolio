import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { FinalCta } from "@/components/home/FinalCta";
import { getService, profile, projectsForService, services, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata({ title: s.name, description: s.summary.length <= 155 ? s.summary : s.short, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const related = projectsForService(service.slug);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Services", href: "/services" },
          { name: service.name, href: `/services/${service.slug}` },
        ]}
      />

      <header className="container-page pt-12 md:pt-20">
        <p className="label text-fg-muted">Service</p>
        <h1 className="mt-5 max-w-[14ch] text-h1">{service.name}</h1>
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[52ch] text-lead text-fg-muted">{service.summary}</p>
          <MagneticButton href="/contact" className="w-fit">
            Start a project
          </MagneticButton>
        </div>
      </header>

      <div className="space-y-(--section-space) py-(--section-space)">
        <section aria-labelledby="included-title">
          <SectionHeader label="Included" id="included-title" title="What is included" />
          <ul className="container-page mt-12 grid grid-cols-1 gap-x-(--grid-gap) md:grid-cols-2">
            {service.included.map((item) => (
              <li key={item} className="flex gap-4 border-t border-rule py-6 text-lead">
                <span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-fg-muted" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="for-title">
          <SectionHeader label="Who it is for" id="for-title" title="Who it is for" />
          <ul className="container-page mt-12">
            {service.forWho.map((w) => (
              <li key={w} className="border-t border-rule py-6 font-display text-h3 last:border-b">
                {w}
              </li>
            ))}
          </ul>
        </section>

        {related.length > 0 && (
          <section aria-labelledby="related-title">
            <SectionHeader label="Projects" id="related-title" title={`${service.name} projects`} />
            <ul className="container-page mt-12 grid grid-cols-1 gap-x-(--grid-gap) gap-y-16 md:mt-16 md:grid-cols-2">
              {related.map((p) => (
                <li key={p.slug}>
                  <ProjectCard project={p} sizes="(min-width: 768px) 45vw, 100vw" />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <FinalCta />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          serviceType: service.name,
          description: service.summary,
          url: `${site.url}/services/${service.slug}`,
          provider: { "@type": "Person", name: profile.name, url: site.url },
        }}
      />
    </>
  );
}
