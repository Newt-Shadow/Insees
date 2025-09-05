"use client";

import { motion } from "framer-motion";
import { Linkedin, Instagram, Facebook } from "lucide-react";

interface DevProps {
  name: string;
  expertise: string;
  img: string;
  socials?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
}

export const DevMemberCard = ({ name, expertise, img, socials }: DevProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="relative group bg-white/5 backdrop-blur-xl border border-white/10 
                 rounded-2xl shadow-lg p-6 w-72 text-center overflow-hidden"
    >
      {/* Profile Image */}
      <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-purple-400/40 shadow-md mb-4 group-hover:border-pink-400/60 transition">
        <img src={img} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Name & Expertise */}
      <h3 className="text-xl font-bold mb-1 text-white group-hover:text-purple-300 transition">
        {name}
      </h3>
      <p className="text-gray-400 text-sm mb-4 group-hover:text-gray-300 transition">
        {expertise}
      </p>

      {/* Social Links */}
      <div className="flex justify-center gap-6">
        {socials?.linkedin && (
          <motion.a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2 }}
            className="text-gray-400 hover:text-blue-500 transition"
          >
            <Linkedin className="w-5 h-5" />
          </motion.a>
        )}
        {socials?.instagram && (
          <motion.a
            href={socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2 }}
            className="text-gray-400 hover:text-pink-500 transition"
          >
            <Instagram className="w-5 h-5" />
          </motion.a>
        )}
        {socials?.facebook && (
          <motion.a
            href={socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2 }}
            className="text-gray-400 hover:text-blue-600 transition"
          >
            <Facebook className="w-5 h-5" />
          </motion.a>
        )}
      </div>

      {/* Bottom Accent Line (animated from center outward) */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 
                   bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500
                   w-0 group-hover:w-2/3 opacity-0 group-hover:opacity-100
                   transition-all duration-500"
      />
    </motion.div>
  );
};
