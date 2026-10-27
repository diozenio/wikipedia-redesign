import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ["bullmq", "ioredis", "@prisma/adapter-pg"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "thumb.wikimedia.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
};

export default nextConfig;
