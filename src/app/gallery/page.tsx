import { Navbar } from "@/components/navbar";
import PhotoGallery from "@/components/PhotoGallery";
import { fetchGalleryData } from "@/lib/gallery-service"; // Import the new service

// Force dynamic so it doesn't get stuck with old data at build time
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  // 🔹 DIRECT CALL: Works on Vercel, Localhost, anywhere. No URL needed.
  const data = await fetchGalleryData();

  const formattedGallery = {
    images: data.images
  };

  return (
    <>
      <Navbar />
      <PhotoGallery
        initialGalleryConfig={formattedGallery}
        initialCategories={data.categories}
      />
    </>
  );
}