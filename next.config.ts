import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: false,
  outputFileTracingRoot: process.cwd(),
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
