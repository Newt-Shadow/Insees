import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/_next/image",
          "/_next/static",
        ],
        disallow: [
          "/admin",
          "/api/",
        ],
      },
    ],
    sitemap: "https://www.insees.in/sitemap.xml",
  };
}
