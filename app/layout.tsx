import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-sans",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Parth Makwana | Backend Developer",
  description: "Portfolio of Parth Makwana, a Backend Developer specializing in scalable architectures, efficient APIs, and high-performance systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("antialiased font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col relative font-sans bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="mesh-bg bg-background transition-colors duration-300" />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
