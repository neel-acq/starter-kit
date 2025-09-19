import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    clientSegmentCache: true,
    nodeMiddleware: true,
  },
  reactStrictMode: true,
  allowedDevOrigins: ["http://192.168.1.38:3000", "http://localhost:3000"],
};

export default nextConfig;
