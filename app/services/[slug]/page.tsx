import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { FinalCta } from "@/components/home/FinalCta";
import { getService, profile, projectsForService, services, site } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return { title: `${s.name} | Parth Makwana`, description: s.short };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const related = projectsForService(service.slug);

  let n = 0;
  const num = () => String(++n).padStart(2, "0");

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Services", href: "/services" },
          { name: service.name, href: `/services/${service.slug}` },
        ]}
      />

      <header className="container-page grid-12 gap-y-8 pt-10 md:pt-16">
        <div className="col-span-4 md:col-span-9">
          <p className="label text-fg-subtle">Service</p>
          <h1 className="mt-4 text-h1">{service.name}</h1>
          <p className="mt-6 max-w-[52ch] text-lead text-fg-muted">{service.summary}</p>
        </div>
        <div className="col-span-4 self-end md:col-span-3">
          <MagneticButton href="/contact">Start a project</MagneticButton>
        </div>
      </header>

      <div className="section-space space-y-16 md:space-y-24">
        <section aria-labelledby="included-title">
          <SectionHeader number={num()} label="Included" id="included-title" title="What is included" />
          <ul className="container-page mt-10 grid grid-cols-1 border-t border-l border-rule-strong sm:grid-cols-2 lg:grid-cols-3">
            {service.included.map((item, i) => (
              <li key={item} className="flex min-h-36 flex-col justify-between gap-6 border-r border-b border-rule-strong p-5 md:p-6">
                <span className="label text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-lead">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="for-title">
          <SectionHeader number={num()} label="Who it is for" id="for-title" title="Who it is for" />
          <ul className="container-page grid-12 mt-10">
            {service.forWho.map((w) => (
              <li key={w} className="col-span-4 border-t border-rule py-4 text-lead md:col-span-9 md:col-start-4">
                {w}
              </li>
            ))}
          </ul>
        </section>

        {related.length > 0 && (
          <section aria-labelledby="related-title">
            <SectionHeader number={num()} label="Projects" id="related-title" title={`${service.name} projects`} />
            <ul className="container-page mt-10 grid grid-cols-1 border-t border-l border-rule-strong sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <li key={p.slug} className="border-r border-b border-rule-strong">
                  <ProjectCard project={p} index={i} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
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
