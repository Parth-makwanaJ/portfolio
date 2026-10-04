import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { imageCdn, site } from "@/content/site";

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
  // The headline face is fetched with the HTML, before the CSS asks for it. Geist is requested by the
  // inlined CSS straight away; preloading it too only took bandwidth from the headline font.
  preload("/fonts/instrument-serif-subset.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous", fetchPriority: "high" });
  return (
    <html lang="en" suppressHydrationWarning>
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
