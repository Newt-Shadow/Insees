import { motion } from "framer-motion";
import Headline from "./Headline";

export default function CelebrationCard({ parallax }: { parallax: { x: number; y: number } }) {
  return (
    <motion.div
      className="relative p-8 rounded-2xl shadow-2xl bg-black/30 backdrop-blur-xl border border-white/20"
      style={{
        transform: `rotateX(${parallax.y * 0.1}deg) rotateY(${parallax.x * 0.1}deg)`,
      }}
    >
      <div className="mb-4 text-sm uppercase tracking-wider text-pink-300 font-semibold">
        🎊 Celebration Unlocked
      </div>
      <Headline text="Welcome to the Celebration!" />
      <p className="mt-3 text-white/80">Click anywhere to continue...</p>
    </motion.div>
  );
}
