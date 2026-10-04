import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Parth Makwana: fast Shopify stores and solid backends for growing businesses";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Developer and tech lead · Ahmedabad", title: "Fast Shopify stores and solid backends." });
}
