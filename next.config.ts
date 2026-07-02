import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "static.legitscript.com" },
      { protocol: "https", hostname: "aum-videos.s3.us-west-1.amazonaws.com" },
      { protocol: "https", hostname: "d3959x8cuku1ma.cloudfront.net" },
    ],
  },
  experimental: {
    optimizePackageImports: ["react-icons"],
  },
};

export default nextConfig;
