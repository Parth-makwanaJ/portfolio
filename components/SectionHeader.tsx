import { RevealText } from "@/components/motion/RevealText";
import { cn } from "@/lib/utils";

/**
 * Numbered Swiss section header on the 12-column grid:
 * a 1px rule, the number and label in mono (cols 1-3), the heading (cols 4-12).
 * h2s get the word reveal; h1s render plain.
 */
export function SectionHeader({
  number,
  label,
  title,
  intro,
  id,
  as = "h2",
  className,
  children,
}: {
  number: string;
  label: string;
  title: string;
  intro?: string;
  id: string;
  as?: "h1" | "h2";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("container-page grid-12 gap-y-4 border-t border-rule-strong pt-4", className)}>
      <p className="label col-span-4 flex gap-4 text-fg-subtle md:col-span-3">
        {number && <span className="text-fg">{number}</span>}
        <span>{label}</span>
      </p>
      <div className="col-span-4 md:col-span-9">
        {/* Page titles (h1) are never animated: they are often the largest element on the page. */}
        {as === "h1" ? (
          <h1 id={id} className="text-h1">
            {title}
          </h1>
        ) : (
          <RevealText id={id} text={title} className="text-h2" />
        )}
        {intro && <p className="mt-5 max-w-[52ch] text-lead text-fg-muted">{intro}</p>}
        {children}
      </div>
    </div>
  );
}
