import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import CustomCursor from "@/app/components/CustomCursor";
import { ThemeProvider } from "@/app/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
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
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://resize.sandesh.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col relative font-sans bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="mesh-bg bg-background transition-colors duration-300" />
          {/* <CustomCursor /> */}
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
