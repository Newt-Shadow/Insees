"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface GalleryImage {
  src: string;
  category: string;
  id?: number;
}

interface GalleryConfig {
  driveLink?: string;
  images: GalleryImage[];
}

const categories = ["All", "Alpha Cresando", "Orientation", "Freshers", "Farewell"];

export const PhotoGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [displayImages, setDisplayImages] = useState<GalleryImage[]>([]);
  const [galleryConfig, setGalleryConfig] = useState<GalleryConfig | null>(null);

  // ---------------- Fetch Gallery ----------------
  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery?t=" + Date.now());
      const data: GalleryConfig = await res.json();
      setGalleryConfig(data);
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
    }
  };

  useEffect(() => {
    fetchGallery();
    const interval = setInterval(fetchGallery, 60000);
    return () => clearInterval(interval);
  }, []);

  // ---------------- Filter Images ----------------
  useEffect(() => {
    if (!galleryConfig?.images) return;

    const filteredImages =
      activeCategory === "All"
        ? [...galleryConfig.images]
        : galleryConfig.images.filter((img) => img.category === activeCategory);

    // Take first 9 images only
    const finalImages = filteredImages.slice(0, 9);
    setDisplayImages(finalImages);
  }, [galleryConfig, activeCategory]);

  const getSeeMoreLink = () =>
    `/gallery/${activeCategory.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Hero Banner */}
      <div className="relative w-full h-[60vh] flex items-center justify-center">
        <Image
          src="/image.png"
          alt="gallery"
          fill
          className="object-cover grayscale"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative bg-black/50 rounded-xl px-8 py-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">Photo Gallery</h1>
          <p className="mt-4 text-gray-200 text-sm md:text-base">
            Instrumentation and Electronics Engineering Society <br />
            National Institute of Technology, Silchar
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <section className="px-6 py-12">
        <div className="flex gap-6 mt-8 mb-10 flex-wrap justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-1 rounded-full text-sm ${
                activeCategory === cat
                  ? "bg-white/10 text-white"
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {displayImages.length === 0 ? (
          <p className="text-center text-gray-400">
            No images found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-3 grid-rows-3 gap-3 max-w-6xl w-full mx-auto">
            {displayImages.map((img, i) => {
              const isLast = i === displayImages.length - 1; // always overlay last
              return (
                <div
                  key={i}
                  className="relative w-full h-64 overflow-hidden rounded-lg group"
                >
                  <Image
                    src={img.src}
                    alt={img.category}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="/blur.png"
                  />
                  {isLast && (
                    <a
                      href={getSeeMoreLink()}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 hover:bg-black/80 transition"
                    >
                      <span className="text-lg font-medium text-white">
                        See More →
                      </span>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
