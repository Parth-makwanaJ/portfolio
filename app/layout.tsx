import type { Metadata } from "next";
import { Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { GridOverlay } from "@/components/site/GridOverlay";
import { Footer } from "@/components/site/Footer";
import { imageCdn, site } from "@/content/site";
import { cn } from "@/lib/utils";

const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400"],
});

const themeScript =
  "(function(){var d=document.documentElement;d.classList.add('js');try{if(localStorage.getItem('theme')==='dark')d.classList.add('dark')}catch(e){}})()";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description:
    "Parth Makwana builds fast Shopify stores and Laravel and Node.js backends, and fixes slow sites. Based in Ahmedabad, India.",
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(sans.variable, mono.variable)} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href={imageCdn.resizer} />
        <link rel="dns-prefetch" href={imageCdn.resizer} />
        {/* Runs before paint: applies the saved theme (light by default) and marks JS as available,
            so reveal effects only ever hide content when JS is running. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-signal focus:px-4 focus:py-3 focus:text-on-signal"
        >
          Skip to content
        </a>
        <GridOverlay />
        <Header />
        <main id="main" tabIndex={-1} className="relative z-10 outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
