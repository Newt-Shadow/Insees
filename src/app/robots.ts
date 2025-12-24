import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'], // Hide admin and api from google
    },
    sitemap: 'https://insees.vercel.app/sitemap.xml',
  };
}