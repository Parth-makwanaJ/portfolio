import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { imageCdn, site } from "@/content/site";
import { cn } from "@/lib/utils";

// display "optional": the font is used if it arrives within ~100ms (it is preloaded), otherwise the
// size-adjusted fallback stays for that page view. Text never re-flows, so no layout shift and
// the headline (the LCP element) is never held back by the font.
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "optional",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "optional",
});

// Marks JS as available before paint, so effects only ever hide content when JS is running.
const jsScript = "document.documentElement.classList.add('js')";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description:
    "Parth Makwana builds fast Shopify stores and Laravel and Node.js backends, and fixes slow sites. Based in Ahmedabad, India.",
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
};

export const viewport: Viewport = {
  themeColor: "#0d0c0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(display.variable, sans.variable)} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href={imageCdn.resizer} />
        <link rel="dns-prefetch" href={imageCdn.resizer} />
        <script dangerouslySetInnerHTML={{ __html: jsScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="label sr-only rounded-full focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-signal focus:px-4 focus:py-3 focus:text-on-signal"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="relative z-10 outline-none">
          {children}
        </main>
        <Footer />
        <MotionRoot />
      </body>
    </html>
  );
}
