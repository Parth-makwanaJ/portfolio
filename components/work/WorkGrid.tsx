"use client";

/**
 * Filterable project grid. All projects are rendered on the server; the filter only hides
 * cards on the client, so every project is in the HTML for crawlers and no-JS visitors.
 */

import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/content/site";
import { cx } from "@/lib/cx";

export function WorkGrid({ projects, categories }: { projects: Project[]; categories: string[] }) {
  const [filter, setFilter] = useState<string>("All");
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {["All", ...categories].map((c) => {
          const count = c === "All" ? projects.length : projects.filter((p) => p.category === c).length;
          const active = filter === c;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(c)}
              className={cx(
                "flex h-11 items-center gap-2.5 rounded-full px-5 text-small font-medium transition-colors duration-(--dur-fast) ease-brand",
                active ? "bg-fg text-bg" : "text-fg shadow-[inset_0_0_0_1px_var(--rule-strong)] hover:shadow-[inset_0_0_0_1px_var(--fg)]",
              )}
            >
              {c}
              <span className={cx("tabular-nums", active ? "text-bg/70" : "text-fg-muted")}>{count}</span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        Showing {shown.length} projects
      </p>

      <ul className="mt-12 grid grid-cols-1 gap-x-(--grid-gap) gap-y-16 md:mt-16 md:grid-cols-2 md:gap-y-24">
        {projects.map((p, i) => (
          <li key={p.slug} className={cx(!shown.includes(p) && "hidden")}>
            <ProjectCard
              project={p}
              headingLevel="h2"
              preload={i === 0}
              sizes="(min-width: 768px) 45vw, 100vw"
            />
          </li>
        ))}
      </ul>
    </>
  );
}
