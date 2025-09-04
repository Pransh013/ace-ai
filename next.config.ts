import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    useCache: true,
  },
  images: {
    remotePatterns: [{ hostname: "assets.aceternity.com", protocol: "https" }],
  },
};

export default nextConfig;
