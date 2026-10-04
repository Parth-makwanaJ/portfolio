import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectFrame } from "@/components/ProjectFrame";
import type { Project } from "@/content/site";
import { cx } from "@/lib/cx";

/**
 * Project card: framed screenshot, name, one line, tags.
 * Hover / focus: the screenshot lifts slightly inside its frame and the arrow turns signal red.
 * Transform and colour only; the whole card is one link with a descriptive name.
 */
export function ProjectCard({
  project,
  index,
  sizes,
  large = false,
  headingLevel = "h3",
  preload = false,
  className,
}: {
  project: Project;
  index?: number;
  sizes: string;
  large?: boolean;
  headingLevel?: "h2" | "h3";
  /** Load the screenshot first (only for a card that is visible on load). */
  preload?: boolean;
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <Link
      href={`/work/${project.slug}`}
      className={cx("group flex h-full flex-col bg-bg p-4 md:p-5", className)}
    >
      <ProjectFrame
        image={project.image}
        sizes={sizes}
        preload={preload}
        imageClassName="transition-transform duration-(--dur-slow) ease-brand group-hover:-translate-y-[2%] group-hover:scale-[1.02] group-focus-visible:-translate-y-[2%] group-focus-visible:scale-[1.02] motion-reduce:transform-none"
      />
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="label flex gap-3 text-fg-subtle">
            {index !== undefined && <span>{String(index + 1).padStart(2, "0")}</span>}
            <span>{project.category}</span>
          </p>
          <Heading className={cx("mt-2 font-extrabold tracking-tight", large ? "text-h3" : "text-xl")}>
            {project.name}
          </Heading>
        </div>
        <ArrowUpRight
          className="mt-1 size-5 shrink-0 transition-[color,transform] duration-(--dur-fast) ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal"
          aria-hidden="true"
        />
      </div>
      <p className={cx("mt-2 text-fg-muted", large ? "max-w-[52ch] text-body" : "text-small")}>{project.summary}</p>
      {project.result && <p className="mt-2 text-small font-medium">{project.result}</p>}
      <p className="label mt-auto pt-4 text-fg-subtle">{project.stack.join(" · ")}</p>
    </Link>
  );
}
