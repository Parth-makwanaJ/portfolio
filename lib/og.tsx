import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Shared Open Graph image (1200x630): warm near-black, serif headline, one lime mark. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontDir = join(process.cwd(), "assets/fonts");

export async function renderOg({ eyebrow, title, footer }: { eyebrow: string; title: string; footer?: string }) {
  const [serif, regular, medium] = await Promise.all([
    readFile(join(fontDir, "instrument-serif-latin-400-normal.woff")),
    readFile(join(fontDir, "geist-sans-latin-400-normal.woff")),
    readFile(join(fontDir, "geist-sans-latin-500-normal.woff")),
  ]);

  // Long titles step down in size so they always fit in three lines.
  const size = title.length > 48 ? 84 : title.length > 28 ? 104 : 124;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0D0C0B",
          color: "#EDE7DD",
          padding: "60px 68px",
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: 2.8,
            color: "#9C9488",
          }}
        >
          <span style={{ color: "#EDE7DD" }}>Parth Makwana</span>
          <span>{eyebrow}</span>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Instrument Serif",
            fontSize: size,
            lineHeight: 0.98,
            letterSpacing: -size * 0.015,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            borderTop: "1px solid rgba(237,231,221,0.16)",
            paddingTop: 26,
          }}
        >
          <span style={{ color: "#9C9488" }}>{footer ?? "Shopify · Laravel · Node.js · Speed · SEO"}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 14, height: 14, borderRadius: 14, background: "#D4FF3A" }} />
            parthdev.co.in
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Instrument Serif", data: serif, weight: 400, style: "normal" },
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
