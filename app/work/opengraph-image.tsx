import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Work by Parth Makwana: Shopify stores, backends and web apps";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Work", title: "Shopify stores, backends and web apps." });
}
