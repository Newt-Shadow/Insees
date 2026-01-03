// src/app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.insees.in";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    
    {
      url: `${baseUrl}/alpha-crescendo`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
