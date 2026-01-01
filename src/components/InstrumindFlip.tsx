import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function InstrumindFlipCard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative group">
      {/* Glow frame */}
      <div className="absolute -inset-4 bg-gradient-to-br from-oz-emerald/30 to-oz-gold/30 
                      rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition" />

      <div className="relative bg-zinc-900/80 backdrop-blur-xl rounded-2xl 
                      border border-white/10 p-6 shadow-2xl overflow-hidden">

        <AnimatePresence mode="wait">
          {!open ? (
            /* ================= COVER ================= */
            <motion.div
              key="cover"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <Image
                src="/instrumind-cover.png"
                alt="Instrumind Magazine Cover"
                width={260}
                height={380}
                className="rounded-xl object-contain border border-white/10 shadow-xl"
              />

              {/* Hover hint */}
              <div className="absolute inset-0 flex items-center justify-center 
                              bg-black/40 opacity-0 group-hover:opacity-100 
                              transition">
                <span className="px-4 py-2 text-sm font-mono text-black bg-oz-emerald rounded-full">
                  OPEN MAGAZINE
                </span>
              </div>
            </motion.div>
          ) : (
            /* ================= FLIPBOOK ================= */
            <motion.div
              key="flipbook"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-[260px] h-[380px]"
            >
              <iframe
                src="https://online.fliphtml5.com/svrwe/aupi/index.html?mode=doublepage"
                className="w-full h-full rounded-xl border border-white/10"
                allow="fullscreen"
                loading="lazy"
              />

              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-2 right-2 text-xs font-mono 
                           px-2 py-1 bg-black/70 text-white rounded 
                           hover:bg-red-500 transition"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] 
                        bg-oz-emerald/60 animate-scan 
                        shadow-[0_0_10px_#50C878]" />
      </div>
    </div>
  );
}
