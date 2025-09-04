"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export interface GalleryImage {
  id?: number;
  src: string;
  category: string;
}

export interface GalleryConfig {
  images: GalleryImage[];
}

interface PhotoGalleryProps {
  initialGalleryConfig?: GalleryConfig | null;
  initialCategories?: string[];
}

const GalleryGrid = lazy(() => import("./GalleryGrid"));

const BATCH_SIZE = 10;
const SMALL_THRESHOLD = 12;

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  initialGalleryConfig,
  initialCategories = [],
}) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [imagesByCategory, setImagesByCategory] = useState<
    Record<string, GalleryImage[]>
  >({});
  const [visibleImages, setVisibleImages] = useState<GalleryImage[]>([]);

  // 🔹 Setup categories & grouping
  useEffect(() => {
    if (!initialGalleryConfig?.images?.length) return;

    const catSet =
      initialCategories.length > 0
        ? initialCategories
        : Array.from(
            new Set(initialGalleryConfig.images.map((img) => img.category))
          );

    setCategories(["All", ...catSet]);

    const grouped: Record<string, GalleryImage[]> = {};
    for (const img of initialGalleryConfig.images) {
      if (!grouped[img.category]) grouped[img.category] = [];
      grouped[img.category].push(img);
    }
    grouped["All"] = initialGalleryConfig.images;
    setImagesByCategory(grouped);

    // ✅ If small, show all at once
    if (initialGalleryConfig.images.length <= SMALL_THRESHOLD) {
      setVisibleImages(initialGalleryConfig.images);
    } else {
      setVisibleImages(initialGalleryConfig.images.slice(0, BATCH_SIZE));
    }
  }, [initialGalleryConfig, initialCategories]);

  // 🔹 Load more images in batches
  const loadMore = () => {
    const current = imagesByCategory[activeCategory] || [];
    const nextCount = visibleImages.length + BATCH_SIZE;
    setVisibleImages(current.slice(0, nextCount));
  };

  // 🔹 Handle category change
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    const selected = imagesByCategory[cat] || [];

    if (selected.length <= SMALL_THRESHOLD) {
      setVisibleImages(selected);
    } else {
      setVisibleImages(selected.slice(0, BATCH_SIZE));
    }
  };

  const noImages = !initialGalleryConfig?.images?.length;

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Hero Banner */}
      <div className="relative w-full h-[60vh] flex items-center justify-center">
        <Image
          src="/image.png"
          alt="gallery"
          fill
          priority
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/90" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-10 py-8 text-center shadow-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
            Photo Gallery
          </h1>
          <p className="mt-4 text-gray-200 text-sm md:text-lg">
            Instrumentation and Electronics Engineering Society <br />
            National Institute of Technology, Silchar
          </p>
        </motion.div>
      </div>

      {/* Category Tabs + Gallery */}
      <section className="px-4 sm:px-6 py-12">
        {noImages ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center text-gray-400">
            <p className="text-lg sm:text-xl md:text-2xl font-medium">
              📸 No images available yet
            </p>
            <p className="mt-2 text-sm sm:text-base text-gray-500">
              Check back soon — our gallery is being updated.
            </p>
          </div>
        ) : (
          <>
            {/* Category Tabs */}
            <div className="flex gap-4 sm:gap-6 mt-8 mb-12 flex-wrap justify-center">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCategoryChange(cat)}
                  className={`relative px-5 py-2 rounded-full cursor-pointer text-sm md:text-base font-medium transition`}
                >
                  <span
                    className={
                      activeCategory === cat
                        ? "text-white"
                        : "text-gray-400 hover:text-teal-300"
                    }
                  >
                    {cat}
                  </span>
                  {activeCategory === cat && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 right-0 -bottom-1 h-[2px] bg-gradient-to-r from-teal-400 to-blue-400 rounded-full"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Suspense per category */}
            <div className="space-y-16">
              <Suspense
                fallback={
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 max-w-7xl mx-auto animate-pulse">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-full aspect-square bg-gray-800 rounded-xl"
                      />
                    ))}
                  </div>
                }
              >
                <GalleryGrid category={activeCategory} images={visibleImages} />
              </Suspense>

              {/* Load more button — only for big sets */}
              {/* {visibleImages.length <
                (imagesByCategory[activeCategory]?.length || 0) &&
                (imagesByCategory[activeCategory]?.length || 0) >
                  SMALL_THRESHOLD && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={loadMore}
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium shadow hover:opacity-90"
                    >
                      Load More
                    </button>
                  </div>
                )} */}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default PhotoGallery;
