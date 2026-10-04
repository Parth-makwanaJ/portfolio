import type { Metadata } from "next";
import { Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/site/Header";
import { GridOverlay } from "@/components/site/GridOverlay";
import { imageCdn } from "@/content/site";
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

export const metadata: Metadata = {
  title: "Parth Makwana | Developer and tech lead",
  description:
    "Parth Makwana builds fast Shopify stores and Laravel and Node.js backends, and fixes slow sites. Based in Ahmedabad, India.",
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
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <a
            href="#main"
            className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-signal focus:px-4 focus:py-3 focus:text-on-signal"
          >
            Skip to content
          </a>
          <GridOverlay />
          <Header />
          <main id="main" className="relative z-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
