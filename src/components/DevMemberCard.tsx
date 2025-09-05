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
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-white/10 shadow-lg w-64 text-center overflow-hidden hover:shadow-purple-500/20 hover:border-purple-400/40"
    >
      {/* Top rectangular image */}
      <div className="w-full h-40 overflow-hidden">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name and Expertise */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-gray-400 text-sm">{expertise}</p>

        {/* Social Links */}
        {socials && (
          <div className="flex justify-center gap-4 mt-3">
            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-400 transition" />
              </a>
            )}
            {socials.facebook && (
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-500 transition" />
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-400 transition" />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
