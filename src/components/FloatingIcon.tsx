"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

type Props = {
  className?: string;
  color: "amber" | "blue" | "green" | "orange";
  src: string; // svg path
  float?: number; // amplitude
  delay?: number;
};

export const FloatingIcon: React.FC<Props> = ({
  className = "",
  color,
  src,
  float = 18,
  delay = 0,
}) => {
  const colorStyles = {
    amber: {
      backgroundColor: "#f59e0b",
      boxShadow: "0 0 0 1px rgba(245,158,11,.3), 0 0 38px 8px rgba(245,158,11,.3)",
    },
    blue: {
      backgroundColor: "#2563eb",
      boxShadow: "0 0 0 1px rgba(59,130,246,.3), 0 0 40px 6px rgba(59,130,246,.25)",
    },
    green: {
      backgroundColor: "#16a34a",
      boxShadow: "0 0 0 1px rgba(34,197,94,.3), 0 0 38px 6px rgba(34,197,94,.25)",
    },
    orange: {
      backgroundColor: "#f97316",
      boxShadow: "0 0 0 1px rgba(249,115,22,.3), 0 0 40px 8px rgba(249,115,22,.3)",
    },
  }[color];

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -float, 0] }}
      transition={{
        duration: 30, // long smooth float
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={`hang-line ${className}`}
    >
      <div className="relative rounded-xl ">
        <div
          className="w-10 h-10 md:w-[60px] md:h-[60px] rounded-xl grid place-items-center"
          style={colorStyles}
        >
          <Image src={src} alt="icon" width={36} height={36} />
        </div>
      </div>
    </motion.div>
  );
};