import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Services by Parth Makwana: Shopify, backends, speed and SEO";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Services", title: "Shopify, backends, speed and SEO." });
}
