import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://insees.vercel.app', lastModified: new Date() },
    { url: 'https://insees.vercel.app/team', lastModified: new Date() },
    { url: 'https://insees.vercel.app/gallery', lastModified: new Date() },
    { url: 'https://insees.vercel.app/resources', lastModified: new Date() },
  ];
}