import { ogContentType, ogSize, renderOg } from "@/lib/og";
import { getProject, projects } from "@/content/site";

export const alt = "Case study by Parth Makwana";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  return renderOg({
    eyebrow: `Case study · ${p?.category ?? "Work"}`,
    title: p?.name ?? "Case study",
    footer: p?.stack.join(" · "),
  });
}
