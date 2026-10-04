import { ogContentType, ogSize, renderOg } from "@/lib/og";
import { getService, services } from "@/content/site";

export const alt = "Service by Parth Makwana";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  return renderOg({ eyebrow: "Service", title: s?.name ?? "Services", footer: s?.short });
}
