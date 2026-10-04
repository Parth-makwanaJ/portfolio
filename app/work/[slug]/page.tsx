import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { ProjectFrame } from "@/components/ProjectFrame";
import { ProjectCard } from "@/components/ProjectCard";
import { VideoShowcase } from "@/components/VideoShowcase";
import { FinalCta } from "@/components/home/FinalCta";
import { getProject, getService, imageUrl, nextProject, profile, projects, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.name}: ${p.category} case study`,
    description: p.summary,
    path: `/work/${p.slug}`,
    type: "article",
  });
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const services = project.services.map(getService).filter((s) => s !== undefined);
  const next = nextProject(project.slug);
  const host = project.live ? new URL(project.live).hostname.replace(/^www\./, "") : null;

  const details = [
    {
      k: "Services",
      v: (
        <ul className="space-y-1">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="link-line">
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      ),
    },
    { k: "Stack", v: project.stack.join(", ") },
    ...(project.engagement ? [{ k: "Context", v: project.engagement }] : []),
    ...(project.live && host
      ? [
          {
            k: "Live site",
            v: (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 link-line">
                {host}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Work", href: "/work" },
          { name: project.name, href: `/work/${project.slug}` },
        ]}
      />

      <article aria-labelledby="case-title">
        <header className="container-page pt-12 md:pt-20">
          <p className="label text-fg-muted">Case study · {project.category}</p>
          <h1 id="case-title" className="mt-5 max-w-[14ch] text-h1">
            {project.name}
          </h1>
          <p className="mt-6 max-w-[48ch] text-lead text-fg-muted">{project.summary}</p>
        </header>

        <div className="container-page mt-12 md:mt-16">
          {project.video ? (
            <VideoShowcase mp4={project.video.mp4} webm={project.video.webm} poster={project.video.poster} label={project.video.label} />
          ) : (
            <ProjectFrame image={project.image} sizes="(min-width: 1472px) 1376px, 100vw" preload />
          )}
        </div>

        <div className="container-page grid-12 gap-y-16 py-(--section-space)">
          {/* Sticky details column */}
          <aside aria-label="Project details" className="col-span-4 md:col-span-4">
            <dl className="border-t border-rule text-small md:sticky md:top-24">
              {details.map((row) => (
                <div key={row.k} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-rule py-4">
                  <dt className="text-fg-muted">{row.k}</dt>
                  <dd>{row.v}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <div className="col-span-4 space-y-20 md:col-span-7 md:col-start-6 md:space-y-28">
            <section aria-labelledby="need-title">
              <p className="label text-fg-muted">The need</p>
              <h2 id="need-title" data-reveal className="mt-4 text-h2">
                What the client needed
              </h2>
              <p className="mt-6 max-w-[52ch] text-lead">{project.need}</p>
            </section>

            <section aria-labelledby="built-title">
              <p className="label text-fg-muted">The work</p>
              <h2 id="built-title" data-reveal className="mt-4 text-h2">
                What I built
              </h2>
              <ul className="mt-8 border-t border-rule">
                {project.built.map((b) => (
                  <li key={b} className="flex gap-4 border-b border-rule py-5 text-lead">
                    <span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-fg-muted" />
                    {b}
                  </li>
                ))}
              </ul>
            </section>

            {project.result && (
              <section aria-labelledby="result-title">
                <p className="label text-fg-muted">Result</p>
                <h2 id="result-title" data-reveal className="mt-4 text-h2">
                  The result
                </h2>
                <p className="mt-6 max-w-[52ch] text-lead">{project.result}</p>
              </section>
            )}
          </div>
        </div>

        <nav aria-label="Related" className="container-page grid-12 gap-y-14 border-t border-rule pt-12 pb-(--section-space)">
          <div className="col-span-4 md:col-span-4">
            <p className="label text-fg-muted">Related service</p>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="group inline-flex items-center gap-3 font-display text-h3">
                    {s.name}
                    <ArrowRight className="size-5 transition-transform duration-(--dur-fast) ease-brand group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-4 md:col-span-7 md:col-start-6">
            <p className="label text-fg-muted">Next project</p>
            <ProjectCard project={next} sizes="(min-width: 768px) 55vw, 100vw" className="mt-5" />
          </div>
        </nav>
      </article>

      <FinalCta />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.name,
          headline: `${project.name}: ${project.category} case study`,
          description: project.summary,
          url: `${site.url}/work/${project.slug}`,
          image: imageUrl(project.image),
          keywords: project.stack.join(", "),
          creator: { "@type": "Person", name: profile.name, url: site.url },
          ...(project.live ? { sameAs: project.live } : {}),
        }}
      />
    </>
  );
}
