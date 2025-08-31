"use client";
import React from "react";
import { useParams } from "next/navigation";
import galleryData from "../../../../public/data/gallery.json";

export default function GalleryCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const formattedCategory = category
    ? category.replace(/-/g, " ")
    : "all";

  const images =
    formattedCategory === "all"
      ? galleryData.images
      : galleryData.images.filter(
          (img) =>
            img.category.toLowerCase() === formattedCategory.toLowerCase()
        );

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

      {/* Full Gallery */}
      <section className="px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-7xl mx-auto">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative w-full h-64 overflow-hidden rounded-lg"
            >
              <img
                src={img.src}
                alt={img.category}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
