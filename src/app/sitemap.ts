import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Base URL set to your custom domain
  const baseUrl = 'https://insees.tech';

  return [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/alpha-crescendo`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 }, // Added your event page
  ];
}