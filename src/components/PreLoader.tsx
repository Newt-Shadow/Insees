"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BOOT_SEQUENCE = [
  "INITIALIZING KERNEL...",
  "LOADING MODULES: [OZ_CORE, GLITCH_UI, NEURAL_NET]",
  "ESTABLISHING UPLINK TO NIT SILCHAR...",
  "DECRYPTING SECURE DATA...",
  "SYSTEM READY."
];

export default function PreLoader() {
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (currentLine < BOOT_SEQUENCE.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentLine((prev) => prev + 1);
      }, 400 + Math.random() * 400); // Random typing delay
      return () => clearTimeout(timeout);
    }
  }, [currentLine]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black text-oz-emerald font-mono flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-2">
        {BOOT_SEQUENCE.slice(0, currentLine + 1).map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm md:text-base border-l-2 border-oz-emerald pl-4"
          >
            <span className="text-gray-500 mr-2">{`>`}</span>
            {line}
          </motion.div>
        ))}
        
        {/* Blinking Cursor */}
        <motion.div
           animate={{ opacity: [0, 1, 0] }}
           transition={{ duration: 0.8, repeat: Infinity }}
           className="w-3 h-5 bg-oz-emerald mt-2 ml-6"
        />
      </div>
      
      {/* Loading Bar */}
      <div className="absolute bottom-10 left-10 right-10 max-w-xl mx-auto">
        <div className="h-1 bg-gray-800 w-full overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="h-full bg-oz-emerald shadow-[0_0_10px_#50C878]"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
           <span>MEM: 64TB OK</span>
           <span>CPU: QUANTUM CORE</span>
        </div>
      </div>
    </div>
  );
}