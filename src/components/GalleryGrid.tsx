"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryImage } from "./PhotoGallery";

interface GalleryGridProps {
  category: string;
  images: GalleryImage[];
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ category, images }) => {
  const previewImages = images.slice(0, 9);

  const getSeeMoreLink = () =>
    `/gallery/${category.toLowerCase().replace(/\s+/g, "-")}`;

  if (previewImages.length === 0) {
    return (
      <p className="text-center text-gray-400 py-10">
        No images in {category}.
      </p>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="grid"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 max-w-7xl mx-auto"
      >
        {previewImages.map((img, i) => {
          const isLast = i === previewImages.length - 1;
          return (
            <motion.div
              key={i}
              className="relative w-full aspect-square overflow-hidden rounded-xl group shadow-md"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={img.src}
                alt={img.src}
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
    </AnimatePresence>
  );
};

export default GalleryGrid;
