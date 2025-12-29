"use client";
import { useState } from "react";
import { alphaContent } from "@/data/alphaCrescendoData";
import { motion } from "framer-motion";
import { SponsorshipTiers } from "./SponsorshipTiers";

// --- The Robust Sponsor Card ---
const SponsorCard = ({ name, domain }: { name: string; domain: string }) => {
  // 0 = Try Local, 1 = Try API, 2 = Show Text
  const [loadState, setLoadState] = useState<0 | 1 | 2>(0);

  const handleImageError = () => {
    if (loadState === 0) setLoadState(1); // Local failed, try API
    else if (loadState === 1) setLoadState(2); // API failed, show text
  };

  const imgSrc = 
    loadState === 0 ? `/sponsors/${domain}.png` : 
    loadState === 1 ? `https://logo.clearbit.com/${domain}` : 
    "";

  return (
    <div className="flex flex-col items-center justify-center gap-4 mx-8 group min-w-[140px] select-none">
      <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg group-hover:shadow-oz-gold/20 group-hover:border-oz-gold/50 transition-all duration-300 overflow-hidden">
        
        {loadState < 2 ? (
          <img
            src={imgSrc}
            alt={name}
            onError={handleImageError}
            className="w-20 h-20 md:w-24 md:h-24 object-contain opacity-70 group-hover:opacity-100 grayscale-0 group-hover:grayscale-0 transition-all duration-300"
          />
        ) : (
          // FALLBACK: Stylish Text
          <div className="text-xl font-bold text-gray-400 group-hover:text-oz-gold font-orbitron text-center px-2 leading-tight">
            {name}
          </div>
        )}
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </div>
  );
};

export const Sponsors = () => {
  // Duplicate list 4 times to ensure it covers wide screens and loops perfectly
  const carouselItems = [
    ...alphaContent.sponsors.past,
    ...alphaContent.sponsors.past,
    ...alphaContent.sponsors.past,
    ...alphaContent.sponsors.past,
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-black via-oz-dark/20 to-black">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

      <div className="max-w-full mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white font-orbitron tracking-wider">
          PAST <span className="text-oz-gold">SPONSORS</span>
        </h2>
        <p className="text-gray-400 mb-16 font-poppins">Our previous partners in innovation</p>
        
        {/* --- INFINITE CAROUSEL --- */}
        <div className="relative w-full overflow-hidden mb-24">
          
          {/* Gradient Masks (Fade In/Out edges) */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-20 bg-gradient-to-r from-black to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-20 bg-gradient-to-l from-black to-transparent" />

          {/* Marquee Track */}
          <motion.div 
            className="flex items-center w-max"
            animate={{ x: ["0%", "-50%"] }} 
            transition={{ 
              ease: "linear", 
              duration: 40, // Adjust speed here (higher = slower)
              repeat: Infinity 
            }}
          >
            {carouselItems.map((sponsor, i) => (
               <SponsorCard key={`${sponsor.name}-${i}`} {...sponsor} />
            ))}
          </motion.div>
        </div>

        <SponsorshipTiers />

        {/* --- CTA CARD --- */}
        <div className="px-4">
          <div className="relative max-w-5xl mx-auto bg-gradient-to-r from-[#064e3b] to-[#022c22] rounded-3xl p-10 md:p-16 border border-white/10 overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
              
              <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 font-orbitron">
                  Join the <span className="text-oz-emerald">Emerald Legacy</span>
                  </h3>
                  <p className="text-emerald-100/80 text-lg mb-8 max-w-2xl mx-auto font-poppins">
                  {alphaContent.sponsors.cta}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                  <button className="px-8 py-3 rounded-full bg-white text-emerald-900 font-bold hover:bg-oz-gold hover:text-black transition-colors duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] transform hover:scale-105">
                      Download Prospectus
                  </button>
                  <button className="px-8 py-3 rounded-full border border-white/30 text-white font-bold hover:bg-white/10 transition-colors backdrop-blur-md">
                      Contact Us
                  </button>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};