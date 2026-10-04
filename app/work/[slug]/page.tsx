import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { ProjectFrame } from "@/components/ProjectFrame";
import { ProjectCard } from "@/components/ProjectCard";
import { VideoShowcase } from "@/components/VideoShowcase";
import { RevealText } from "@/components/motion/RevealText";
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

  // Number only the sections that render.
  let n = 0;
  const num = () => String(++n).padStart(2, "0");

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Work", href: "/work" },
          { name: project.name, href: `/work/${project.slug}` },
        ]}
      />

      <article aria-labelledby="case-title">
        <header className="container-page grid-12 gap-y-8 pt-10 md:pt-16">
          <div className="col-span-4 md:col-span-8">
            <p className="label text-fg-subtle">Case study · {project.category}</p>
            <h1 id="case-title" className="mt-4 text-h1">
              {project.name}
            </h1>
            <p className="mt-6 max-w-[48ch] text-lead text-fg-muted">{project.summary}</p>
          </div>

          <dl className="col-span-4 self-end border-t border-rule-strong text-small md:col-span-4">
            {[
              {
                k: "Services",
                v: (
                  <ul>
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/services/${s.slug}`} className="underline underline-offset-4 hover:text-signal">
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
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-signal"
                        >
                          {host}
                          <ArrowUpRight className="size-3.5" aria-hidden="true" />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      ),
                    },
                  ]
                : []),
            ].map((row) => (
              <div key={row.k} className="grid grid-cols-[6rem_1fr] gap-4 border-b border-rule py-3">
                <dt className="label pt-0.5 text-fg-subtle">{row.k}</dt>
                <dd>{row.v}</dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="container-page mt-12 md:mt-16">
          {project.video ? (
            <VideoShowcase
              mp4={project.video.mp4}
              webm={project.video.webm}
              poster={project.video.poster}
              label={project.video.label}
            />
          ) : (
            <ProjectFrame image={project.image} sizes="(min-width: 1440px) 1360px, 100vw" preload />
          )}
        </div>

        <div className="section-space space-y-16 md:space-y-24">
          <section aria-labelledby="need-title" className="container-page grid-12 gap-y-4 border-t border-rule-strong pt-4">
            <p className="label col-span-4 text-fg-subtle md:col-span-3">
              <span className="text-fg">{num()}</span> &nbsp; The need
            </p>
            <div className="col-span-4 md:col-span-9">
              <RevealText id="need-title" text="What the client needed" className="text-h2" />
              <p className="mt-6 max-w-[52ch] text-lead">{project.need}</p>
            </div>
          </section>

          <section aria-labelledby="built-title" className="container-page grid-12 gap-y-4 border-t border-rule-strong pt-4">
            <p className="label col-span-4 text-fg-subtle md:col-span-3">
              <span className="text-fg">{num()}</span> &nbsp; The work
            </p>
            <div className="col-span-4 md:col-span-9">
              <RevealText id="built-title" text="What I built" className="text-h2" />
              <ol className="mt-6 border-t border-rule">
                {project.built.map((b, i) => (
                  <li key={b} className="grid grid-cols-[3rem_1fr] border-b border-rule py-4 text-lead">
                    <span className="label pt-1.5 text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                    {b}
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {project.result && (
            <section aria-labelledby="result-title" className="container-page grid-12 gap-y-4 border-t border-rule-strong pt-4">
              <p className="label col-span-4 text-fg-subtle md:col-span-3">
                <span className="text-fg">{num()}</span> &nbsp; Result
              </p>
              <div className="col-span-4 md:col-span-9">
                <RevealText id="result-title" text="The result" className="text-h2" />
                <p className="mt-6 max-w-[52ch] text-lead">{project.result}</p>
              </div>
            </section>
          )}

          <nav aria-label="Related" className="container-page grid-12 gap-y-8 border-t border-rule-strong pt-4">
            <div className="col-span-4 md:col-span-5">
              <p className="label text-fg-subtle">Related service</p>
              <ul className="mt-4 space-y-3">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="group inline-flex items-center gap-3 text-h3 hover:text-signal">
                      {s.name}
                      <ArrowRight className="size-5 transition-transform duration-(--dur-fast) ease-brand group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-4 md:col-span-6 md:col-start-7">
              <p className="label text-fg-subtle">Next project</p>
              <div className="mt-4 border border-rule-strong">
                <ProjectCard project={next} sizes="(min-width: 768px) 45vw, 100vw" />
              </div>
            </div>
          </nav>
        </div>
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
