"use client";

import { notFound, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

interface GalleryImage {
  src: string;
  category: string;
}

interface GalleryApiResponse {
  categories: string[];
  images: GalleryImage[];
}

function formatCategory(param?: string): string {
  return param ? param.replace(/-/g, " ") : "all";
}

export default function GalleryCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const formattedCategory = formatCategory(category);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/gallery?category=${category || "all"}`, {
          cache: "no-store",
        });
        if (!res.ok) notFound();
        const data: GalleryApiResponse = await res.json();
        setImages(data.images);
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [category]);

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Hero Banner */}
      <div className="relative w-full h-[60vh] flex items-center justify-center">
        <img
          src="/image.png"
          alt="gallery"
          className="absolute inset-0 w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative bg-black/50 rounded-xl px-8 py-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold capitalize">
            {formattedCategory} Gallery
          </h1>
          <p className="mt-4 text-gray-200 text-sm md:text-base">
            Instrumentation and Electronics Engineering Society <br />
            National Institute of Technology, Silchar
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <section className="px-6 py-12">
        {loading ? (
          <p className="text-center text-gray-400">Loading images...</p>
        ) : images.length === 0 ? (
          <p className="text-center text-gray-400">
            No images found in this category.
          </p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-7xl mx-auto"
            >
              {images.map((img, i) => (
                <motion.div
                  key={i}
                  className="relative w-full h-64 overflow-hidden rounded-lg group shadow-md"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={img.src}
                    alt={img.category}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </div>
  );
}
