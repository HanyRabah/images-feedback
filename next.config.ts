import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['https://l6npf9rjvqqf6owa.public.blob.vercel-storage.com','localhost'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
