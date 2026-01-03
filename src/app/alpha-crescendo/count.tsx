import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const STATES = [
  "IN FORMATION",
  "TAKING SHAPE",
  "GAINING MOMENTUM",
  "APPROACHING",
  "NEAR",
];

export default function FestivalPresence() {
  // internal timeline (never shown)
  const TARGET = new Date("2026-01-27T00:00:00Z").getTime();
  const ARC = 1000 * 60 * 60 * 24 * 45;
  const START = TARGET - ARC;

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setTick(t => t + 1), 4000);
    return () => clearInterval(i);
  }, []);

  const now = Date.now();
  const raw = Math.min(1, Math.max(0, (now - START) / ARC));
  const progress = Math.pow(raw, 0.65);

  const state =
    STATES[Math.min(STATES.length - 1, Math.floor(progress * STATES.length))];

  return (
    <div className="mt-24 flex flex-col items-center text-center relative z-20">

      {/* MAIN LINE */}
      <motion.h3
        key={state}
        initial={{ opacity: 0, letterSpacing: "0.2em" }}
        animate={{ opacity: 1, letterSpacing: "0.4em" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-sm md:text-base scale-[1.2] font-mono uppercase text-white/90"
      >
        {state}
      </motion.h3>

      {/* SUBTLE MOTION LINE */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="mt-6 h-px w-32 bg-white/40"
      />

      {/* SECONDARY TEXT */}
      <motion.p
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="mt-6 text-[11px] tracking-[0.35em] text-gray-400"
      >
        A FESTIVAL OF TECHNOLOGY AND CULTURE
      </motion.p>
    </div>
  );
}
