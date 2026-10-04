import type { MetadataRoute } from "next";
import { projects, services, site } from "@/content/site";

// Content changes ship with a build, so the build time is the last-modified date.
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  });
  return [
    page("", 1),
    page("/work", 0.8),
    page("/services", 0.8),
    page("/about", 0.7),
    page("/contact", 0.7),
    ...services.map((s) => page(`/services/${s.slug}`, 0.8)),
    ...projects.map((p) => page(`/work/${p.slug}`, 0.6)),
  ];
}
