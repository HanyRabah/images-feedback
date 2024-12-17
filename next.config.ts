import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
