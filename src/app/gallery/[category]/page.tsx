"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface GalleryImage {
  src: string;
  category: string;
}

interface GalleryConfig {
  driveLink?: string;
  images: GalleryImage[];
}

export default function GalleryCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [galleryConfig, setGalleryConfig] = useState<GalleryConfig | null>(null);
  const [validImages, setValidImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/gallery");
        const data: GalleryConfig = await res.json();
        setGalleryConfig(data);
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    const verifyImages = async () => {
      if (!galleryConfig) return;
      setLoading(true);

      const checks = await Promise.all(
        galleryConfig.images.map(async (img) => {
          try {
            const res = await fetch(img.src, { method: "HEAD" });
            return res.ok ? img : null;
          } catch {
            return null;
          }
        })
      );

      setValidImages(checks.filter(Boolean) as GalleryImage[]);
      setLoading(false);
    };

    verifyImages();
  }, [galleryConfig]);

  // if (loading) return <div className="bg-black text-white min-h-screen flex items-center justify-center">Loading gallery...</div>;
  // if (!galleryConfig) return <div className="bg-black text-white min-h-screen flex items-center justify-center">No gallery found.</div>;

  const formattedCategory = category ? category.replace(/-/g, " ") : "all";

  const images =
    formattedCategory.toLowerCase() === "all"
      ? validImages
      : validImages.filter((img) => img.category.toLowerCase() === formattedCategory.toLowerCase());

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Hero Banner */}
      <div className="relative w-full h-[60vh] flex items-center justify-center">
        <img src="/image.png" alt="gallery" className="absolute inset-0 w-full h-full object-cover grayscale" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative bg-black/50 rounded-xl px-8 py-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold capitalize">{formattedCategory} Gallery</h1>
          <p className="mt-4 text-gray-200 text-sm md:text-base">
            Instrumentation and Electronics Engineering Society <br />
            National Institute of Technology, Silchar
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <section className="px-6 py-12">
        {images.length === 0 ? (
          <p className="text-center text-gray-400">No images found in this category.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-7xl mx-auto">
            {images.map((img, i) => (
              <div key={i} className="relative w-full h-64 overflow-hidden rounded-lg transition-transform hover:scale-105 duration-300">
                <img src={img.src} alt={img.category} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
