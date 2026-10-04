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
                "flex h-10 items-center gap-2 border px-4 text-small font-medium transition-colors duration-(--dur-fast) ease-brand",
                active ? "border-fg bg-fg text-bg" : "border-rule-strong hover:bg-surface",
              )}
            >
              {c}
              <span className={cx("label", active ? "text-bg" : "text-fg-subtle")}>{count}</span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        Showing {shown.length} projects
      </p>

      <ul className="mt-8 grid grid-cols-1 border-t border-l border-rule-strong sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <li key={p.slug} className={cx("border-r border-b border-rule-strong bg-bg", !shown.includes(p) && "hidden")}>
            <ProjectCard
              project={p}
              index={i}
              headingLevel="h2"
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            />
          </li>
        ))}
      </ul>
    </>
  );
}
