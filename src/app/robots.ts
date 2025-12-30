import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/_next/'],
    },
    // Point to the correct domain
    sitemap: 'https://insees.tech/sitemap.xml',
  };
}