import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['l6npf9rjvqqf6owa.public.blob.vercel-storage.com','localhost'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
