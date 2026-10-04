"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * next/image loader for the remote resizer configured in content/site.ts (imageCdn).
 * src is built by cdnImage(), e.g.
 *   https://resize.sandesh.com/{size}/plain/epapercdn.sandesh.com/images/2024/09/09/Sandesh.png@webp?ar=0.5625
 * The loader fills {size} with "rs:fill:{width}:{height}/q:{quality}", keeping the aspect ratio (ar = height / width).
 * It imports nothing, so the content file never ends up in the browser bundle.
 * Next.js never processes these images; the browser fetches them straight from the resizer.
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  const [url, query = ""] = src.split("?");
  const ratio = Number(new URLSearchParams(query).get("ar")) || 9 / 16;
  const height = Math.round(width * ratio);
  return url.replace("{size}", `rs:fill:${width}:${height}/q:${quality ?? 75}`);
}
