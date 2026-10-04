import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // radix-ui is one barrel that re-exports every primitive; load only what is used.
    optimizePackageImports: ["radix-ui"],
    // Tailwind output is small (~11 KB gzipped); inlining it removes the render-blocking request.
    inlineCss: true,
  },
  images: {
    // Images are resized by the remote host in content/site.ts (imageCdn), not by this server.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    // The resizer stops cropping above the source width (~1900px), so cap at 1600.
    deviceSizes: [640, 828, 1080, 1280, 1600],
    imageSizes: [256, 384],
  },
  async redirects() {
    return [
      {
        // Old resume URL had a space in the filename.
        source: "/Parth%20Makwana.pdf",
        destination: "/parth-makwana-resume.pdf",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/icon.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
