import { cn } from "@/lib/utils";

/**
 * Section heading: a small label, the serif heading and an optional intro.
 * h2s rise line by line from a mask as they enter (data-reveal, run by the motion runtime);
 * page titles (h1) are never animated: they are often the largest element on the page.
 */
export function SectionHeader({
  label,
  title,
  intro,
  id,
  as = "h2",
  className,
  children,
}: {
  label: string;
  title: string;
  intro?: string;
  id: string;
  as?: "h1" | "h2";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("container-page", className)}>
      <p className="label text-fg-muted">{label}</p>
      {as === "h1" ? (
        <h1 id={id} className="mt-5 max-w-[16ch] text-h1">
          {title}
        </h1>
      ) : (
        <h2 id={id} data-reveal className="mt-5 max-w-[18ch] text-h2">
          {title}
        </h2>
      )}
      {intro && <p className="mt-6 max-w-[50ch] text-lead text-fg-muted">{intro}</p>}
      {children}
    </div>
  );
}
