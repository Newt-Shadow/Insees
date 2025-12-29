"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export const YellowBrickRoad = () => {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-0 left-0 right-0 h-1.5 z-[95] pointer-events-none">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-yellow-600 via-oz-gold to-yellow-200 shadow-[0_0_20px_rgba(255,215,0,0.8)]"
        style={{ scaleX }}
      />
    </div>,
    document.body
  );
};
