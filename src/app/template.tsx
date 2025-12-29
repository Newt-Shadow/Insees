"use client";
import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ ease: "circOut", duration: 0.75 }}
    >
      {/* Glitch Overlay on Mount */}
      <motion.div 
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="fixed inset-0 bg-oz-emerald origin-top z-[9999] pointer-events-none opacity-20"
      />
      {children}
    </motion.div>
  );
}