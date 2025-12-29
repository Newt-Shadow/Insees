"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function SubtleCircuitCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Very calm, precise motion
  const spring = { stiffness: 700, damping: 45, mass: 0.6 };
  const xs = useSpring(x, spring);
  const ys = useSpring(y, spring);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX - 4);
      y.set(e.clientY - 4);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      
    </>
  );
}
