"use client";

import { notFound, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

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

const BATCH_SIZE = 12;

export default function GalleryCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const formattedCategory = formatCategory(category);

  // 🔹 Fetch images in batches
  const fetchGallery = useCallback(
    async (pageNum: number) => {
      try {
        const res = await fetch(
          `/api/gallery?category=${category || "all"}&limit=${BATCH_SIZE}&offset=${
            pageNum * BATCH_SIZE
          }`,
          { cache: "no-store" }
        );
        if (!res.ok) notFound();
        const data: GalleryApiResponse = await res.json();

        setImages((prev) => [...prev, ...data.images]);
        if (data.images.length < BATCH_SIZE) setHasMore(false);
      } catch (err) {
        console.error("❌ Failed to fetch gallery:", err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [category]
  );

  // 🔹 First load (reset state on category change)
  useEffect(() => {
    setImages([]);
    setPage(0);
    setHasMore(true);
    setLoading(true);
    fetchGallery(0);
  }, [category, fetchGallery]);

  // 🔹 Infinite scroll observer
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loading, hasMore]);

  // 🔹 Fetch new batch when page changes
  useEffect(() => {
    if (page > 0) fetchGallery(page);
  }, [page, fetchGallery]);

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
        {loading && images.length === 0 ? (
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
                  <Image
                    src={img.src}
                    alt={img.category}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    placeholder="blur"
                    blurDataURL="/placeholder.png" // 🔹 low-quality placeholder
                    loading={i < BATCH_SIZE ? "eager" : "lazy"} // eager load first batch
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Infinite scroll trigger */}
        {hasMore && (
          <div ref={observerRef} className="h-16 flex justify-center items-center">
            <p className="text-gray-500">Loading more...</p>
          </div>
        )}
      </section>
    </div>
  );
}
