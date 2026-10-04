import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import { featuredProjects, projects } from "@/content/site";
import { cn } from "@/lib/utils";

const layout = [
  { cell: "md:col-span-8 md:row-span-2", sizes: "(min-width: 768px) 60vw, 100vw", large: true },
  { cell: "md:col-span-4", sizes: "(min-width: 768px) 30vw, 100vw", large: false },
  { cell: "md:col-span-4", sizes: "(min-width: 768px) 30vw, 100vw", large: false },
  { cell: "md:col-span-6", sizes: "(min-width: 768px) 45vw, 100vw", large: false },
];

export function SelectedWork({ number }: { number: string }) {
  const featured = featuredProjects().slice(0, 4);
  return (
    <section aria-labelledby="work-title" className="section-space pt-0">
      <SectionHeader
        number={number}
        label="Selected work"
        id="work-title"
        title="Recent projects"
        intro="Stores, CMSs and APIs that are live and in use."
      />
      <div className="container-page mt-12 md:mt-16">
        <ul className="grid grid-cols-1 gap-px border border-rule-strong bg-rule-strong md:grid-cols-12">
          {featured.map((p, i) => (
            <li key={p.slug} className={cn("bg-bg", layout[i].cell)}>
              <ProjectCard project={p} index={i} sizes={layout[i].sizes} large={layout[i].large} />
            </li>
          ))}
          <li className="bg-bg md:col-span-6">
            <Link
              href="/work"
              className="group flex h-full min-h-48 flex-col justify-between p-5 transition-colors duration-(--dur-fast) ease-brand hover:bg-surface md:p-8"
            >
              <p className="label text-fg-subtle">Archive</p>
              <p className="flex items-end justify-between gap-6">
                <span className="text-h2">
                  See all {projects.length} projects
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="mb-2 size-8 shrink-0 text-signal transition-transform duration-(--dur-fast) ease-brand group-hover:translate-x-1"
                />
              </p>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
