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
  title: "Premium Portfolio UI",
  description: "A minimal 3D Next.js portfolio website",
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
