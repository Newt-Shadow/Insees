"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function MeetDevelopersButton() {
  return (
    <Link href="/developers">
      <motion.div
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-5 py-3 rounded-full shadow-lg cursor-pointer font-bold text-sm md:text-base"
        whileHover={{ scale: 1.1, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: [0, -6, 0],
          boxShadow: [
            "0 0 20px rgba(168,85,247,0.6)",
            "0 0 40px rgba(59,130,246,0.6)",
            "0 0 20px rgba(168,85,247,0.6)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        Meet Our Developers ✨
      </motion.div>
    </Link>
  );
}
