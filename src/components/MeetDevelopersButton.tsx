"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Cpu, Terminal } from "lucide-react";

export default function MeetDevelopersButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show only when near bottom of page (footer area)
      const scrolledToBottom = 
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;
      setIsVisible(scrolledToBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Link href="/developers" className="group relative block">
            {/* The Chip Visual */}
            <div className="relative flex items-center gap-3 bg-black/90 backdrop-blur-xl border border-oz-emerald/30 px-5 py-3 rounded-lg overflow-hidden transition-all duration-300 group-hover:border-oz-emerald group-hover:shadow-[0_0_20px_rgba(80,200,120,0.4)]">
              
              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-scan" />
              
              <div className="relative z-10 p-2 bg-oz-emerald/10 rounded-md text-oz-emerald group-hover:bg-oz-emerald group-hover:text-black transition-colors">
                <Terminal size={20} />
              </div>
              
              <div className="relative z-10 flex flex-col">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-hover:text-oz-emerald/70">
                  System Architects
                </span>
                <span className="text-sm font-bold font-orbitron text-white group-hover:text-oz-emerald">
                  MEET THE DEVS
                </span>
              </div>

              {/* Decorative Circuit Lines */}
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-oz-emerald/20" />
              <div className="absolute right-0 top-2 w-2 h-[1px] bg-oz-emerald" />
              <div className="absolute right-0 bottom-2 w-2 h-[1px] bg-oz-emerald" />
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}