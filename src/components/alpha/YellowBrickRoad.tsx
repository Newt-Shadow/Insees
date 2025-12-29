"use client";
import { useScroll, useSpring, motion } from "framer-motion";

export const YellowBrickRoad = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 z-[100] bg-gray-900/50 backdrop-blur-sm">
      <motion.div
        className="h-full bg-gradient-to-r from-yellow-600 via-oz-gold to-yellow-200 origin-left shadow-[0_0_20px_rgba(255,215,0,0.6)]"
        style={{ scaleX }}
      />
    </div>
  );
};