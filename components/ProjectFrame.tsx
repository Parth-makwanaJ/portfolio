import Image from "next/image";
import type { Image as ImageData } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * The one frame every project screenshot sits in: a fixed 2:1 box with a 1px rule and a flat mat.
 * Screenshots keep their own ratio (object-contain), so nothing is cropped; the mat absorbs the
 * small differences between sources (2.0 to 2.14 : 1). The fixed ratio means no layout shift.
 */
export function ProjectFrame({
  image,
  sizes,
  preload = false,
  className,
  imageClassName,
}: {
  image: ImageData;
  sizes: string;
  preload?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={cn("relative aspect-[2/1] overflow-hidden border border-rule-strong bg-surface p-[3%]", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        preload={preload}
        className={cn("size-full object-contain", imageClassName)}
      />
    </div>
  );
}
