"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuroraBackground from "./AuroraBackground";
import Starfield from "./Starfield";
import ConfettiLayer from "./ConfettiLayer";
import Balloons from "./Balloons";
import EmojiRain from "./EmojiRain";
import CelebrationCard from "./CelebrationCard";
import Accessibility from "./Accessibility";
import AudioCue from "./AudioCue";

export default function CelebrationOverlay({
  autoStart = false,
  autoCloseAfter = 8000,
}: {
  autoStart?: boolean;
  autoCloseAfter?: number;
}) {
  const [active, setActive] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const confettiFn = useRef<(() => void) | null>(null);

  // Activate
  const trigger = () => {
    if (active) return;
    setActive(true);
    confettiFn.current?.();
    setTimeout(() => setActive(false), autoCloseAfter);
  };

  // Gesture: "welcome" typing
  useEffect(() => {
    let buffer = "";
    const listener = (e: KeyboardEvent) => {
      buffer += e.key.toLowerCase();
      if (buffer.includes("welcome")) {
        trigger();
        buffer = "";
      }
      if (buffer.length > 20) buffer = buffer.slice(-20);
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [active]);

  // Gesture: circle gesture on mobile
  useEffect(() => {
    let points: { x: number; y: number }[] = [];
    const handleTouch = (e: TouchEvent) => {
      if (e.type === "touchstart") points = [];
      if (e.type === "touchmove") {
        const t = e.touches[0];
        points.push({ x: t.clientX, y: t.clientY });
      }
      if (e.type === "touchend") {
        if (points.length > 10) {
          const xs = points.map((p) => p.x);
          const ys = points.map((p) => p.y);
          const minX = Math.min(...xs),
            maxX = Math.max(...xs);
          const minY = Math.min(...ys),
            maxY = Math.max(...ys);
          const w = maxX - minX,
            h = maxY - minY;
          if (w > 50 && h > 50 && Math.abs(w - h) < 40) trigger();
        }
      }
    };
    window.addEventListener("touchstart", handleTouch);
    window.addEventListener("touchmove", handleTouch);
    window.addEventListener("touchend", handleTouch);
    return () => {
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("touchend", handleTouch);
    };
  }, [active]);

  // Mouse parallax
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setParallax({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // Auto start
  useEffect(() => {
    if (autoStart) trigger();
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-label="Celebration overlay"
          aria-modal="true"
          role="dialog"
          onClick={() => setActive(false)}
        >
          {/* Effects */}
          <AuroraBackground parallax={parallax} />
          <Starfield />
          <ConfettiLayer registerConfetti={(fn) => (confettiFn.current = fn)} />
          <Balloons />
          <EmojiRain />

          {/* Card */}
          <CelebrationCard parallax={parallax} />

          {/* Accessibility + Sound */}
          <Accessibility active={active} />
          <AudioCue active={active} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
