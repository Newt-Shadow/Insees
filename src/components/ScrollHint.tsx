"use client";
import { motion } from "framer-motion";
import React from "react";

export const ScrollHint: React.FC = () => {
  const handleScroll = () => {
    window.scrollBy({
      top: window.innerHeight * 0.8,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/80 select-none cursor-pointer"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      onClick={handleScroll}
    >
      {/* Text */}
      <motion.span
        className="mb-3 tracking-[0.4em] text-xs md:text-sm font-light uppercase"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Scroll
      </motion.span>

      {/* Glowing Button */}
      <motion.div
        className="relative flex items-center justify-center w-10 h-10 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-[0_0_25px_rgba(168,85,247,0.7)]"
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        {/* Pulsing Rings */}
        <motion.div
          className="absolute w-full h-full rounded-full border border-purple-400"
          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="absolute w-full h-full rounded-full border border-pink-400"
          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
        />

        {/* Down Arrow */}
        <motion.span
          className="text-xl md:text-2xl font-bold text-white drop-shadow-lg"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          ↓
        </motion.span>
      </motion.div>
    </motion.div>
  );
};
