import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'retnews.netlify.app',
      },
      {
        protocol: 'https',
        hostname: 'cakrawalamedia.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'flsvqqofbsrkozgilbsj.supabase.co',
      },
    ],
  },
};

export default nextConfig;
