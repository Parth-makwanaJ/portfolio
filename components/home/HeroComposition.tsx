import type { CSSProperties } from "react";

/**
 * Geometric composition for the hero, built on the page grid.
 * Desktop: 6 columns x 4 rows, sitting on page columns 7-12 so every shape lines up
 * with the visible grid. Phones: 4 x 4 on the full width.
 * Rendered on the server as plain HTML/CSS: this is also the static version shown on
 * phones and with prefers-reduced-motion. Phase 4 animates the shapes between layouts
 * on scroll (transform and opacity only).
 */

type Kind = "square" | "circle" | "quarter" | "half" | "ring" | "frame" | "diagonal" | "bars";
type Cell = [col: number, row: number, colSpan: number, rowSpan: number];
type Shape = { id: string; kind: Kind; tone?: "fg" | "signal"; desktop: Cell; mobile?: Cell };

export const shapes: Shape[] = [
  { id: "a", kind: "square", desktop: [1, 1, 1, 1], mobile: [1, 1, 1, 1] },
  { id: "b", kind: "circle", desktop: [3, 1, 2, 2], mobile: [2, 1, 2, 2] },
  { id: "c", kind: "circle", tone: "signal", desktop: [5, 2, 1, 1], mobile: [4, 2, 1, 1] },
  { id: "d", kind: "half", desktop: [6, 1, 1, 1], mobile: [4, 1, 1, 1] },
  { id: "e", kind: "quarter", desktop: [1, 3, 2, 2], mobile: [1, 3, 2, 2] },
  { id: "f", kind: "frame", desktop: [4, 3, 1, 1], mobile: [3, 4, 1, 1] },
  { id: "g", kind: "diagonal", desktop: [5, 3, 2, 2], mobile: [3, 3, 2, 2] },
  { id: "h", kind: "ring", desktop: [3, 4, 1, 1] },
  { id: "i", kind: "bars", desktop: [2, 1, 1, 2], mobile: [1, 2, 1, 1] },
];

const area = ([c, r, cs, rs]: Cell) => `${r} / ${c} / span ${rs} / span ${cs}`;

function ShapeView({ kind, tone = "fg" }: { kind: Kind; tone?: "fg" | "signal" }) {
  const fill = tone === "signal" ? "bg-signal" : "bg-fg";
  switch (kind) {
    case "square":
      return <div className={`size-full ${fill}`} />;
    case "circle":
      return <div className={`size-full rounded-full ${fill}`} />;
    case "quarter":
      return <div className={`size-full rounded-tr-full ${fill}`} />;
    case "half":
      return (
        <div className="flex size-full items-end">
          <div className={`h-1/2 w-full rounded-t-full ${fill}`} />
        </div>
      );
    case "ring":
      return <div className="size-full rounded-full border border-rule-strong" />;
    case "frame":
      return <div className="size-full border border-rule-strong" />;
    case "diagonal":
      return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full">
          <line x1="0" y1="100" x2="100" y2="0" stroke="var(--fg)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1="0" x2="100" y2="0" stroke="var(--fg)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="100" y1="0" x2="100" y2="100" stroke="var(--fg)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case "bars":
      return (
        <div className="grid size-full grid-cols-4 gap-[12%]">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={fill} />
          ))}
        </div>
      );
  }
}

export function HeroComposition({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`@container ${className}`}>
      <div
        className="grid gap-(--grid-gap) [grid-template-columns:repeat(4,minmax(0,1fr))] [grid-template-rows:repeat(4,calc((100cqw-3*var(--grid-gap))/4))] md:[grid-template-columns:repeat(6,minmax(0,1fr))] md:[grid-template-rows:repeat(4,calc((100cqw-5*var(--grid-gap))/6))]"
      >
        {shapes.map((s) => (
          <div
            key={s.id}
            data-shape={s.id}
            style={{ "--m": s.mobile ? area(s.mobile) : "auto", "--d": area(s.desktop) } as CSSProperties}
            className={`[grid-area:var(--m)] md:[grid-area:var(--d)] ${s.mobile ? "" : "max-md:hidden"}`}
          >
            <ShapeView kind={s.kind} tone={s.tone} />
          </div>
        ))}
      </div>
    </div>
  );
}
