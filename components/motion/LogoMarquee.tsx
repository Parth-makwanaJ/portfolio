/**
 * Infinite marquee of client names (text wordmarks).
 * Adapted from Vengeance UI "logo-slider" (MIT, (c) 2025-2026 Ashutoshx7,
 * https://github.com/Ashutoshx7/VengenceUI): same API (items, speed, direction, pauseOnHover).
 * Changes: the progressive blur edges are removed (no blur in this design); its animation CSS
 * is not shipped in the registry, so the track animation lives in globals.css (.marquee);
 * the second copy of the list is aria-hidden; pauses on hover and keyboard focus;
 * reduced motion shows a static, wrapping list. Server component: no JavaScript.
 */

import { cn } from "@/lib/utils";

export function LogoMarquee({
  items,
  speed = 40,
  direction = "left",
  pauseOnHover = true,
  label,
  className,
}: {
  items: React.ReactNode[];
  /** seconds for one full loop */
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn("marquee", className)}
      data-direction={direction}
      data-pause={pauseOnHover ? "" : undefined}
      style={{ "--marquee-duration": `${speed}s` } as React.CSSProperties}
    >
      <div className="marquee__track">
        <ul aria-label={label} className="marquee__list">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <ul aria-hidden="true" className="marquee__list marquee__copy">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
