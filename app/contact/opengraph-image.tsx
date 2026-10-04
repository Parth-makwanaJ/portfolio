import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Start a project with Parth Makwana";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Contact", title: "Start a project." });
}
