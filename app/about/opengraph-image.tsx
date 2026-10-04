import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "About Parth Makwana, developer and tech lead in Ahmedabad";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "About", title: "Parth Makwana, developer and tech lead." });
}
