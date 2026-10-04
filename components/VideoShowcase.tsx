"use client";

/**
 * Muted, looping product video. Nothing downloads until it is near the viewport; it pauses when
 * it leaves. Accepts mp4 and/or webm. The poster (next/image) reserves the space, so no shift.
 * With prefers-reduced-motion it does not autoplay; the native controls are shown instead.
 */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "@/lib/hooks";
import type { Image as ImageData } from "@/content/site";
import { cx } from "@/lib/cx";

export function VideoShowcase({
  mp4,
  webm,
  poster,
  label,
  className,
}: {
  mp4?: string;
  webm?: string;
  poster: ImageData;
  /** Describes what the video shows, for screen readers. */
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const near = useInView(ref, { once: false, rootMargin: "200px 0px" });
  // Becomes true the first time the video comes near and stays true: the sources mount then.
  const load = useInView(ref, { rootMargin: "200px 0px" });
  const reduce = useReducedMotion();

  // Sources were just added: ask the element to pick one.
  useEffect(() => {
    if (load) ref.current?.load();
  }, [load]);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    if (near) void v.play().catch(() => {});
    else v.pause();
  }, [near, reduce, load]);

  return (
    <div
      className={cx("relative overflow-hidden bg-surface", className)}
      style={{ aspectRatio: `${poster.width} / ${poster.height}` }}
    >
      <Image
        src={poster.src}
        alt=""
        width={poster.width}
        height={poster.height}
        sizes="(min-width: 768px) 66vw, 100vw"
        className="absolute inset-0 size-full object-cover"
      />
      <video
        ref={ref}
        aria-label={label}
        className="absolute inset-0 size-full object-cover"
        muted
        loop
        playsInline
        preload="none"
        controls={!!reduce}
      >
        {load && webm && <source src={webm} type="video/webm" />}
        {load && mp4 && <source src={mp4} type="video/mp4" />}
      </video>
    </div>
  );
}
