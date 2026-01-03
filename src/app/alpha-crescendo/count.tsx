"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const STATES = [
  { text: "IN FORMATION", script: "latin" },
//   { text: "आकार ले रहा है", script: "indic" },   // Hindi
// //   { text: "রূপ নিচ্ছে", script: "indic" },       // Bangla
// //   { text: "ৰূপ লৈছে", script: "indic" },         // Assamese
  { text: "EN FORMATION", script: "latin" },      // French
  { text: "GAINING MOMENTUM", script: "latin" },
];

export default function FestivalPresence() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setIndex((v) => (v + 1) % STATES.length);
    }, 7000);
    return () => clearInterval(i);
  }, []);

  const state = STATES[index];
  const isLatin = state.script === "latin";

  // ✅ GRAPHEME-SAFE SPLITTING (CRITICAL FIX)
  const segments = useMemo(() => {
    if (typeof Intl === "undefined" || !("Segmenter" in Intl)) {
      return Array.from(state.text); // safe fallback
    }

    const segmenter = new Intl.Segmenter(undefined, {
      granularity: "grapheme",
    });

    return Array.from(segmenter.segment(state.text), s => s.segment);
  }, [state.text]);

  return (
    <div className="mt-24 flex flex-col items-center text-center relative z-20">

      {/* WORD MORPH — GRAPHEME SAFE */}
      <div className="relative h-7 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.h3
            key={state.text}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
              text-sm md:text-base text-white/90
              ${isLatin ? "uppercase tracking-[0.35em] font-mono" : "tracking-normal"}
            `}
            style={{
              fontFamily: isLatin
                ? undefined
                : `"Noto Sans Devanagari", "Noto Sans Bengali",
                   "Hind", "Kalimati", system-ui, sans-serif`,
            }}
          >
            {segments.map((grapheme, i) => (
              <motion.span
                key={`${grapheme}-${i}`}
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  visible: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -6 },
                }}
                transition={{
                  duration: 0.6,
                  delay: i * (isLatin ? 0.035 : 0.015),
                  ease: "easeOut",
                }}
                className="inline-block"
              >
                {grapheme === " " ? "\u00A0" : grapheme}
              </motion.span>
            ))}
          </motion.h3>
        </AnimatePresence>
      </div>

      {/* DIVIDER */}
      <motion.div
        animate={{ opacity: [0.25, 0.6, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="mt-6 h-px w-32 bg-white/40"
      />

      {/* SECONDARY LINE */}
      <motion.p
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="mt-6 text-[11px] tracking-[0.35em] text-gray-400"
      >
        A FESTIVAL OF TECHNOLOGY AND CULTURE
      </motion.p>
    </div>
  );
}
