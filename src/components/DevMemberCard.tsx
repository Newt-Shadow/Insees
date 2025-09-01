"use client";

import { motion } from "framer-motion";

interface DevProps {
  name: string;
  expertise: string;
  img: string; // new photo field
}

export const DevMemberCard = ({ name, expertise, img }: DevProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.07 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-white/10 shadow-lg p-6 w-64 text-center hover:shadow-purple-500/20 hover:border-purple-400/40"
    >
      {/* Profile Image */}
      <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border border-white/20 shadow-md mb-4">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-gray-400 text-sm">{expertise}</p>
    </motion.div>
  );
};
