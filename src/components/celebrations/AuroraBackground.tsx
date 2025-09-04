import { motion } from "framer-motion";

export default function AuroraBackground({ parallax }: { parallax: { x: number; y: number } }) {
  return (
    <>
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-500/40 via-pink-500/30 to-blue-500/40 blur-3xl"
        animate={{ x: parallax.x * 0.4, y: parallax.y * 0.4 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,200,255,0.25),transparent_60%)]"
        animate={{ x: -parallax.x * 0.3, y: -parallax.y * 0.3 }}
      />
    </>
  );
}
