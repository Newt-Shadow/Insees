"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export interface GalleryImage {
  id?: number;
  src: string;
  category: string;
}

export interface GalleryConfig {
  driveLink?: string;
  images: GalleryImage[];
}

interface PhotoGalleryProps {
  initialGalleryConfig?: GalleryConfig | null;
}

const categories = ["All", "Alpha Cresando", "Orientation", "Freshers", "Farewell"];

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ initialGalleryConfig }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [displayImages, setDisplayImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    if (!initialGalleryConfig?.images) return;

    const filtered =
      activeCategory === "All"
        ? initialGalleryConfig.images
        : initialGalleryConfig.images.filter((img) => img.category === activeCategory);

    setDisplayImages(filtered.slice(0, 9));
  }, [activeCategory, initialGalleryConfig]);

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
          <p className="text-center text-gray-400">No images found in this category.</p>
        ) : (
          <div className="grid grid-cols-3 grid-rows-3 gap-3 max-w-6xl w-full mx-auto">
            {displayImages.map((img, i) => {
              const isLast = i === displayImages.length - 1;
              return (
                <div
                  key={i}
                  className="relative w-full h-64 overflow-hidden rounded-lg group"
                >
                  <Image
                    src={img.src}
                    alt={img.category}
                    fill
                    className="object-cover"
                  />
                  {isLast && (
                    <a
                      href={getSeeMoreLink()}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 hover:bg-black/80 transition"
                    >
                      <span className="text-lg font-medium text-white">See More →</span>
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

export default PhotoGallery;
