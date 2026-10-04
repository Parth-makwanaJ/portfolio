import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Shared Open Graph image (1200x630) in the Swiss style: grid, heavy headline, one red mark. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontDir = join(process.cwd(), "assets/fonts");

export async function renderOg({ eyebrow, title, footer }: { eyebrow: string; title: string; footer?: string }) {
  const [heavy, regular, mono] = await Promise.all([
    readFile(join(fontDir, "inter-tight-latin-800-normal.woff")),
    readFile(join(fontDir, "inter-tight-latin-400-normal.woff")),
    readFile(join(fontDir, "ibm-plex-mono-latin-400-normal.woff")),
  ]);

  // Long titles step down in size so they always fit in three lines.
  const size = title.length > 48 ? 76 : title.length > 28 ? 92 : 112;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          color: "#111111",
          padding: "56px 64px",
          position: "relative",
          fontFamily: "Inter Tight",
        }}
      >
        {/* 12-column grid lines */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", padding: "0 64px", gap: 20 }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={{ flex: 1, borderLeft: "1px solid #ececec", borderRight: i === 11 ? "1px solid #ececec" : "none" }} />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #111111",
            paddingTop: 14,
            fontFamily: "IBM Plex Mono",
            fontSize: 22,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          <span>Parth Makwana</span>
          <span style={{ color: "#555555" }}>{eyebrow}</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: size,
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: -size * 0.045,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26 }}>
          <span style={{ color: "#555555", fontWeight: 400 }}>{footer ?? "Shopify · Laravel · Node.js · Speed · SEO"}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "IBM Plex Mono", fontSize: 22 }}>
            <div style={{ width: 28, height: 28, background: "#E30613" }} />
            parthdev.co.in
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Inter Tight", data: heavy, weight: 800, style: "normal" },
        { name: "Inter Tight", data: regular, weight: 400, style: "normal" },
        { name: "IBM Plex Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
