import { Navbar } from "@/components/navbar";
import PhotoGallery, { GalleryConfig } from "@/components/PhotoGallery";

// --- Types (Ensure these match your API response) ---
type ApiImage = {
  src: string;
  category: string;
};

type ApiResponse = {
  categories: string[];
  images: ApiImage[];
};

// --- Fetch Function ---
async function fetchGallery(): Promise<ApiResponse | null> {
  try {
    // Fallback to empty string if env var is missing to prevent crash during build
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ""; 
    const res = await fetch(`${baseUrl}/api/gallery`, {
      next: { revalidate: 900 }, // Revalidate every 15 mins
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("❌ Gallery fetch error:", err);
    return null;
  }
}

export default async function GalleryPage() {
  const data = await fetchGallery();

  const formattedGallery: GalleryConfig | null = data?.images
    ? {
        images: data.images.map((img, i) => ({
          id: i,
          src: img.src,
          category: img.category,
        })),
      }
    : null;

  return (
    <>
      <Navbar />
      <PhotoGallery
        initialGalleryConfig={formattedGallery}
        initialCategories={data?.categories || []}
      />
    </>
  );
}