import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://insees.in';

  const staticRoutes = [
    '',
    '/team',
    '/gallery',
    '/events',
    '/resources',
    '/alpha-crescendo',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date('2026-01-01'),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const galleryImages = await prisma.galleryImage.findMany({
    select: { event: true },
    distinct: ['event'],
  });

  const galleryRoutes = galleryImages.map((img) => ({
    url: `${baseUrl}/gallery/${encodeURIComponent(img.event)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...galleryRoutes];
}
