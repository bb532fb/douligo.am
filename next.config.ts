import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["ws", "redis"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
