"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import galleryData from "../../public/data/gallery.json";

const categories = ["All", "Alpha Cresando", "Orientation", "Freshers", "Farewell"];

export const PhotoGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [displayImages, setDisplayImages] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let selectedImages =
      activeCategory === "All"
        ? [...galleryData.images] // all images
        : galleryData.images.filter((img) => img.category === activeCategory);

    if (activeCategory === "All") {
      // shuffle only once per reload
      selectedImages = selectedImages.sort(() => Math.random() - 0.5);
    }

    setHasMore(selectedImages.length > 9);
    setDisplayImages(selectedImages.slice(0, 9));
  }, [activeCategory]);

  const getSeeMoreLink = () => {
    if (galleryData.driveLink) {
      return galleryData.driveLink;
    }
    return `/gallery/${activeCategory.toLowerCase().replace(/\s+/g, "-")}`;
  };

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
        <div className="grid grid-cols-3 grid-rows-3 gap-3 max-w-6xl w-full aspect-square mx-auto">
          {displayImages.map((img, i) => {
            const isLastTile = hasMore && i === displayImages.length - 1;

            return (
              <div key={i} className="relative w-full h-full overflow-hidden rounded-lg">
                <Image
                  src={img.src}
                  alt={img.category}
                  fill
                  sizes="(max-width: 768px) 100vw,
                         (max-width: 1200px) 50vw,
                         33vw"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="/blur.png" // small placeholder image
                />
                {isLastTile && (
                  <a
                    href={getSeeMoreLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/70 transition"
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
      </section>
    </div>
  );
};
