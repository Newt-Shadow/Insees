import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com", // ✅ allow all subdomains of Vercel Blob
      },
    ],
  },
  /* other config options */
};



export default nextConfig;
