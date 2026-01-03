import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "public.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
        pathname: "/**",
      },
      {
      protocol: "https",
      hostname: "lh3.googleusercontent.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "avatars.githubusercontent.com",
      pathname: "/**",
    },
    ],
  },

  // ✅ ADD THIS BLOCK
  async redirects() {
  return [
    {
      source: "/:path*",
      has: [{ type: "host", value: "insees.tech" }],
      destination: "https://insees.in/:path*",
      permanent: true,
    },
    {
      source: "/:path*",
      has: [{ type: "host", value: "www.insees.tech" }],
      destination: "https://insees.in/:path*",
      permanent: true,
    },
  ];
},

};

export default nextConfig;
