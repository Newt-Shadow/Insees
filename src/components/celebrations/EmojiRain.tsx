import { motion } from "framer-motion";

const emojis = ["🎉", "✨", "🎂", "🥳", "🌟"];

export default function EmojiRain() {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl"
          initial={{ x: `${Math.random() * 100}vw`, y: -50 }}
          animate={{ y: "110vh" }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          {emojis[i % emojis.length]}
        </motion.div>
      ))}
    </>
  );
}
