import { motion } from "framer-motion";

export default function Balloons() {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          initial={{ y: "100vh", x: `${Math.random() * 100}vw`, rotate: 0 }}
          animate={{ y: "-20vh", rotate: 360 }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.6,
          }}
        >
          🎈
        </motion.div>
      ))}
    </>
  );
}
