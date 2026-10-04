import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
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
