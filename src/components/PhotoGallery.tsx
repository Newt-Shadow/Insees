"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X, Download, Scan, Loader2 } from "lucide-react";
import Image, { ImageLoaderProps } from "next/image";

export type GalleryImage = {
  id: number;
  src: string;
  category: string;
};

export type GalleryConfig = {
  images: GalleryImage[];
};

interface PhotoGalleryProps {
  initialGalleryConfig: GalleryConfig | null;
  initialCategories: string[];
}

// 🔹 HELPER: Generate optimized URL for standard <img> tags
const getOptimizedUrl = (url: string, width: number = 1280) => {
  if (url.includes("cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/w_${width},q_85,f_auto,c_limit/`);
  }
  return url;
};

// 🔹 NEXT.JS LOADER: For grid images
const cloudinaryLoader = ({ src, width, quality }: ImageLoaderProps) => {
  if (src.includes("cloudinary.com") && src.includes("/upload/")) {
    const params = [`w_${width}`, `q_${quality || 75}`, "f_auto", "c_limit"];
    return src.replace("/upload/", `/upload/${params.join(",")}/`);
  }
  return src;
};

// --- 3D TILT CARD COMPONENT ---
const TiltCard = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="relative cursor-pointer rounded-xl overflow-hidden border border-white/10 bg-gray-900 shadow-2xl group"
    >
      <div style={{ transform: "translateZ(50px)" }}>{children}</div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />
    </motion.div>
  );
};

export default function PhotoGallery({ initialGalleryConfig, initialCategories }: PhotoGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const imgRef = useRef<HTMLImageElement>(null);

  const images = initialGalleryConfig?.images || [];
  const filteredImages = selectedCategory === "All" 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  // 🔹 Portal Mount Check
  useEffect(() => {
    setMounted(true);
  }, []);

  // --- LOCK BODY SCROLL & RESET LOADING ---
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
      setIsImageLoading(true);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedImage]);

  const handleDownload = async (e: React.MouseEvent, img: GalleryImage) => {
    e.stopPropagation(); 
    setIsDownloading(true);
    try {
      const response = await fetch(img.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const filename = img.src.split('/').pop() || `insees-gallery-${img.id}.jpg`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
    setIsDownloading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 overflow-hidden relative">
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center mb-16 space-y-4">
        <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-block px-3 py-1 border border-oz-emerald/30 rounded-full bg-oz-emerald/5 text-oz-emerald text-xs font-mono tracking-widest mb-4"
        >
           {"// SECURE ARCHIVE ACCESS"}
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-600">
          MEMORY <span className="text-oz-emerald">BANKS</span>
        </h1>
        <p className="text-gray-400 font-mono text-sm max-w-md mx-auto">
          Decrypted visual logs from the Insees mainframe.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="relative z-10 flex flex-wrap justify-center gap-4 mb-16">
        {["All", ...initialCategories].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`relative px-6 py-2 text-sm font-mono uppercase tracking-wider transition-all clip-path-slant ${
              selectedCategory === cat
                ? "text-blue-300 font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {selectedCategory === cat && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-oz-emerald rounded-sm skew-x-[-10deg]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <motion.div layout className="relative z-10 columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 max-w-7xl mx-auto px-4">
        <AnimatePresence mode="popLayout">
          {filteredImages.map((img) => (
            <div key={img.id} className="break-inside-avoid perspective-1000">
               <TiltCard onClick={() => setSelectedImage(img)}>
                  <div className="relative group bg-gray-900 rounded-xl">
                    <Image
                      loader={cloudinaryLoader}
                      src={img.src}
                      alt={`Gallery ${img.id}`}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover rounded-xl border border-white/5 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 grayscale-[0.3]"
                      priority={img.id < 4} 
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px] rounded-xl">
                      <div className="text-oz-emerald flex flex-col items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Scan size={40} className="animate-pulse" />
                        <span className="font-mono text-xs tracking-[0.2em] bg-black/50 px-2 py-1 rounded border border-oz-emerald/30">
                          ACCESS DATA
                        </span>
                      </div>
                    </div>
                  </div>
               </TiltCard>
            </div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* --- PORTAL LIGHTBOX MODAL (Z-INDEX 9999) --- */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10"
              onClick={() => setSelectedImage(null)}
            >
              {/* Modal Background Noise */}
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none" />

              <div className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center">
                
                {/* Close Button */}
                <button 
                  className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-white transition-all border border-white/10"
                  onClick={() => setSelectedImage(null)}
                >
                  <X size={24} />
                </button>

                <motion.div 
                  initial={{ scale: 0.9, opacity: 0, rotateX: 10 }}
                  animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black shadow-[0_0_50px_rgba(80,200,120,0.1)]"
                  onClick={(e) => e.stopPropagation()}
                >
                   {/* Scanning Line Animation */}
                   <motion.div 
                     initial={{ top: "-10%" }}
                     animate={{ top: "110%" }}
                     transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                     className="absolute left-0 right-0 h-[2px] bg-oz-emerald/50 shadow-[0_0_20px_rgba(80,200,120,1)] z-20 pointer-events-none"
                   />

                   <div className="relative flex justify-center items-center w-full h-full bg-gray-900/50">
                     
                     {/* LOADING SPINNER */}
                     {isImageLoading && (
                       <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                         <div className="flex flex-col items-center gap-3">
                           <Loader2 className="w-10 h-10 text-oz-emerald animate-spin" />
                           <span className="font-mono text-oz-emerald text-xs tracking-widest animate-pulse">DECRYPTING_VISUAL...</span>
                         </div>
                       </div>
                     )}

                     {/* MAIN IMAGE - Using optimized helper */}
                     <img 
                       ref={imgRef}
                       src={getOptimizedUrl(selectedImage.src)} 
                       alt="Full view" 
                       onLoad={() => setIsImageLoading(false)}
                       onError={() => setIsImageLoading(false)}
                       className={`max-w-full max-h-[85vh] object-contain shadow-2xl transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`} 
                     />
                   </div>
                   
                   {/* Cyber UI HUD */}
                   <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent border-t border-white/10 flex flex-col md:flex-row justify-between items-end md:items-center gap-4 backdrop-blur-md">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-oz-emerald animate-pulse" />
                          <p className="font-orbitron text-lg font-bold text-white">IMG_SEQ_00{selectedImage.id}</p>
                        </div>
                        <p className="font-mono text-xs text-oz-emerald/70 uppercase tracking-wider">
                          {"// CLASSIFICATION:"} {selectedImage.category}
                        </p>
                      </div>

                      <div className="flex gap-4">
                         <button 
                           onClick={(e) => handleDownload(e, selectedImage)}
                           disabled={isDownloading}
                           className="cursor-pointer group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-oz-emerald hover:text-black border border-white/20 rounded-lg transition-all duration-300 font-mono text-sm font-bold shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(80,200,120,0.4)]"
                         >
                            {isDownloading ? (
                              <span className="animate-pulse">DECRYPTING...</span>
                            ) : (
                              <>
                                <Download size={18} className="group-hover:scale-110 transition-transform" />
                                DOWNLOAD
                              </>
                            )}
                         </button>
                      </div>
                   </div>

                   {/* Decorative HUD Elements */}
                   <div className="absolute top-4 left-4 text-[10px] font-mono text-white/20">
                      COORD: {Math.random().toFixed(4)} , {Math.random().toFixed(4)}
                   </div>
                   <div className="absolute top-4 right-16 text-[10px] font-mono text-white/20">
                      RES: HIGH_DEF
                   </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}