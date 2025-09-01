import PhotoGallery, { GalleryConfig } from "@/components/PhotoGallery";
import { Navbar } from "@/components/navbar";
import { prisma } from "@/lib/prisma";

export default async function GalleryPage() {
  const galleryConfig = await prisma.galleryConfig.findFirst({
    include: { images: true },
  });

  const formattedGallery: GalleryConfig | null = galleryConfig
    ? {
        driveLink: galleryConfig.driveLink,
        images: galleryConfig.images.map((img) => ({
          id: img.id,
          src: img.src,
          category: img.category,
        })),
      }
    : null;

  return (
    <>
      <Navbar />
      <PhotoGallery initialGalleryConfig={formattedGallery} />
    </>
  );
}
