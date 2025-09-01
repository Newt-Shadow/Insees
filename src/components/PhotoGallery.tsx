"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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

const categories = ["All", "Alpha Crescendo", "Orientation", "Freshers", "Farewell"];

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

      {/* Category Tabs */}
      <section className="px-4 sm:px-6 py-12">
        <div className="flex gap-4 sm:gap-6 mt-8 mb-12 flex-wrap justify-center">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-5 py-2 rounded-full cursor-pointer  text-sm md:text-base font-medium transition`}
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

        {/* Gallery Grid */}
        <AnimatePresence mode="wait">
          {displayImages.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-400"
            >
              No images found in this category.
            </motion.p>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="
                grid 
                grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
                gap-3 sm:gap-4 max-w-7xl mx-auto"
            >
              {displayImages.map((img, i) => {
                const isLast = i === displayImages.length - 1;
                return (
                  <motion.div
                    key={i}
                    className="relative w-full aspect-square overflow-hidden rounded-xl group shadow-md"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={img.src}
                      alt={img.category}
                      fill
                      sizes="(max-width: 640px) 100vw,
                             (max-width: 1024px) 50vw,
                             25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {isLast && (
                      <a
                        href={getSeeMoreLink()}
                        target="_blank"
                        className="absolute inset-0 flex items-center justify-center bg-black/60 hover:bg-black/80 transition"
                      >
                        <span className="px-6 py-3 rounded-lg bg-gradient-to-r text-white font-semibold shadow-lg hover:shadow-xl">
                          See More →
                        </span>
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default PhotoGallery;
