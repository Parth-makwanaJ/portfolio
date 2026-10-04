import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { featuredProjects, projects } from "@/content/site";

/**
 * Selected work. The project names are plain HTML, one link per case study. The scene shows the
 * project images behind glass slices on the right (top on phones); hovering or focusing a project
 * brings its image forward (data-project-index, read by the scene input).
 */
export function SelectedWork() {
  const featured = featuredProjects().slice(0, 4);
  return (
    <section
      id="work"
      data-stop-mark="5"
      aria-labelledby="work-title"
      className="relative flex min-h-svh flex-col justify-center pt-[38svh] pb-20 md:py-20"
    >
      <div className="container-page">
        <div className="md:w-[52%]">
          <div data-scene-text>
            <p className="label text-fg-muted">Selected work</p>
            <h2 id="work-title" data-reveal className="mt-4 text-h2">
              Recent projects
            </h2>
          </div>
          <ul data-scene-text className="mt-8 border-t border-rule md:mt-12">
            {featured.map((p, i) => (
              <li key={p.slug} className="border-b border-rule">
                <Link
                  href={`/work/${p.slug}`}
                  data-cursor="view"
                  data-project-index={i}
                  className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-4 md:py-6"
                >
                  <span className="font-display text-[clamp(1.75rem,1.2rem+1.9vw,3.25rem)] leading-[1.05] transition-transform duration-(--dur-fast) ease-brand group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transform-none">
                    {p.name}
                  </span>
                  <span className="flex items-center gap-3 text-small text-fg-muted">
                    <span className="max-sm:hidden">{p.category}</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-5 transition-[color,transform] duration-(--dur-fast) ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal"
                    />
                  </span>
                  <span className="col-span-2 mt-2 hidden max-w-[54ch] text-small text-fg-muted md:block">{p.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/work" className="group mt-8 inline-flex items-center gap-2 font-medium link-line">
            See all {projects.length} projects
            <ArrowRight
              className="size-4 transition-transform duration-(--dur-fast) ease-brand group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
