import { Navbar } from "@/components/navbar";
import PhotoGallery from "@/components/PhotoGallery";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    // We can call the API handler logic directly or via fetch
    // Using fetch with full URL is safer in Server Components if API logic is complex
    // But direct DB call is faster. Let's do a direct DB call here for speed and type safety.
    // However, since we defined logic in API route, let's reuse the fetch for consistency 
    // or just copy the prisma logic.
    // Ideally, extract logic to a lib, but for now let's fetch the internal API.
    
    // Actually, calling the DB directly in Server Component is Best Practice in Next.js 13+
    const { prisma } = await import("@/lib/prisma");
    const images = await prisma.galleryImage.findMany({
       orderBy: { createdAt: "desc" },
    });
    
    const years = [...new Set(images.map((img) => img.year))].sort().reverse();
    const events = [...new Set(images.map((img) => img.event))].sort();

    return {
      images: images.map(img => ({
        id: img.id,
        src: img.src,
        year: img.year,
        event: img.event,
        width: img.width ?? 800,
        height: img.height ?? 600
      })),
      filters: { years, events }
    };

  } catch (e) {
    console.error(e);
    return { images: [], filters: { years: [], events: [] } };
  }
}

export default async function GalleryPage() {
  const data = await getData();

  return (
    <>
      <Navbar />
      <PhotoGallery initialData={data} />
    </>
  );
}