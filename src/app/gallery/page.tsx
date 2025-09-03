import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import PhotoGallery, { GalleryConfig } from "@/components/PhotoGallery";

type ApiImage = {
  src: string;
  category: string;
};

type ApiResponse = {
  categories: string[];
  images: ApiImage[];
};

async function fetchGallery(): Promise<ApiResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gallery`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch gallery");
  return res.json();
}

async function GalleryContent() {
  const { categories, images } = await fetchGallery();

  const formattedGallery: GalleryConfig = {
    images: images.map((img, i) => ({
      id: i,
      src: img.src,
      category: img.category,
    })),
  };

  return (
    <PhotoGallery
      initialGalleryConfig={formattedGallery}
      initialCategories={categories}
    />
  );
}

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      {/* <Suspense */}
      {/* //   fallback={ */}
      {/* //     <div className="min-h-screen flex items-center justify-center text-white">
      //       <p className="animate-pulse text-gray-400">Loading gallery...</p>
      //     </div>
      //   }
      // > */}
        <GalleryContent />
      {/* </Suspense> */}
    </>
  );
}
