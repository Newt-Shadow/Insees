"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

type AuroraProps = {
  hue?: number;
  opacity?: number;
  speed?: number;
  offset?: number;
};

const AuroraSVG: React.FC<AuroraProps> = ({
  hue = 260,
  opacity = 0.12,
  speed = 18,
  offset = 0,
}) => {
  const grad = useMemo(
    () =>
      `linear-gradient(90deg, hsla(${hue} 80% 65% / ${opacity}), hsla(${
        (hue + 60) % 360
      } 80% 72% / ${opacity}), transparent)`,
    [hue, opacity]
  );

  return (
    <motion.div
      aria-hidden
      style={{
        background: grad,
        filter: "blur(40px) saturate(120%)",
        transform: `translateY(${offset}px)`,
        mixBlendMode: "screen",
      }}
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0.1, x: "-8%" }}
      animate={{ x: ["-8%", "8%", "-8%"] }}
      transition={{ duration: speed, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

export default AuroraSVG;
