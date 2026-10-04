import type { Metadata } from "next";
import { site } from "@/content/site";

/**
 * Per-page metadata: unique title and description, canonical URL, Open Graph and Twitter tags.
 * The share image comes from the opengraph-image file in the page's route folder.
 * Keep titles under 60 characters and descriptions under 155 (checked by scripts/check-seo).
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  type = "website",
}: {
  title: string;
  description: string;
  /** Path starting with "/", e.g. "/work". */
  path: string;
  /** Use the title as is, without the " | Parth Makwana" suffix. */
  absoluteTitle?: boolean;
  type?: "website" | "article" | "profile";
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: site.name,
      locale: site.locale,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
