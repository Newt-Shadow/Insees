"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  SiGithub,
  SiVercel,
  SiApple,
  SiGooglechrome,
  SiFigma,
  SiReact,
} from "react-icons/si";

const ICONS = [SiApple, SiGithub, SiVercel, SiFigma, SiReact, SiGooglechrome];

export default function PreLoader() {
  const pathname = usePathname();
  const [iconIndex, setIconIndex] = useState(0);

  // Cycle favicons
  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((i) => (i + 1) % ICONS.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = ICONS[iconIndex];

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center pointer-events-none">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.1, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-12"
      >
        {/* Dynamic Island Core */}
        <motion.div
          animate={{ width: ["90px", "148px", "90px"] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            relative h-9 rounded-full
            vision-glass
            shadow-[0_0_50px_rgba(255,255,255,0.1)]
            flex items-center justify-center
          "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={iconIndex}
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 0.9, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.9 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="text-white/80 text-sm"
            >
              <ActiveIcon />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Semantic Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/70 text-sm tracking-wide font-light"
        >
          {getSemanticLabel(pathname)}
        </motion.div>
      </motion.div>
    </div>
  );
}

function getSemanticLabel(path: string) {
  if (path.includes("team")) return "Gathering the team...";
  if (path.includes("gallery")) return "Developing photos...";
  if (path.includes("resources")) return "Organizing archives...";
  if (path.includes("developers")) return "Compiling code...";
  if (path === "/" || path === "") return "Initializing system...";
  return "Loading...";
}