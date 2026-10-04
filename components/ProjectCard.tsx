import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectFrame } from "@/components/ProjectFrame";
import type { Project } from "@/content/site";
import { cx } from "@/lib/cx";

/**
 * Project card: large framed screenshot, then category, name and one line.
 * Hover / focus: the screenshot scales up slightly inside its frame and the arrow turns lime.
 * The whole card is one link with a descriptive name; the custom cursor reads "View" over it.
 */
export function ProjectCard({
  project,
  sizes,
  headingLevel = "h3",
  preload = false,
  className,
}: {
  project: Project;
  sizes: string;
  headingLevel?: "h2" | "h3";
  /** Load the screenshot first (only for a card that is visible on load). */
  preload?: boolean;
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <Link href={`/work/${project.slug}`} data-cursor="view" className={cx("group block", className)}>
      <ProjectFrame
        image={project.image}
        sizes={sizes}
        preload={preload}
        imageClassName="transition-transform duration-(--dur-fast) ease-brand group-hover:scale-[1.025] group-focus-visible:scale-[1.025] motion-reduce:transform-none"
      />
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <p className="label text-fg-muted">{project.category}</p>
          <Heading className="mt-2 text-h3">{project.name}</Heading>
        </div>
        <ArrowUpRight
          className="mt-1 size-5 shrink-0 text-fg-muted transition-[color,transform] duration-(--dur-fast) ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal"
          aria-hidden="true"
        />
      </div>
      <p className="mt-3 max-w-[52ch] text-fg-muted">{project.summary}</p>
      {project.result && <p className="mt-2 text-small font-medium">{project.result}</p>}
    </Link>
  );
}
