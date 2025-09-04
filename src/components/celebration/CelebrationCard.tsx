"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Headline from "./Headline";
import StarBurst from "./StarBurst";
import confetti from "canvas-confetti";

const CelebrationCard: React.FC = () => {
  // Trigger confetti burst on mount
  useEffect(() => {
    const duration = 1500;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        startVelocity: 25,
        spread: 360,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <motion.div
      className="relative z-10 w-full max-w-lg mx-auto p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Headline />

      {/* subtle floating starburst */}
      <div className="absolute -top-6 -left-6 opacity-70 animate-pulse">
        <StarBurst size={20} />
      </div>
      <div className="absolute -bottom-6 -right-6 opacity-70 animate-pulse">
        <StarBurst size={18} />
      </div>
    </motion.div>
  );
};

export default CelebrationCard;
