import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["ws", "redis", "@prisma/client", "@prisma/adapter-pg", "pg"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
