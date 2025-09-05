"use client";
import { FaInstagram, FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

interface MemberProps {
  name: string;
  por: string;
  img: string;
  socials: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
  };
}

export const MemberCard = ({ name, por, img, socials }: MemberProps) => {
  const hasImg = img && img.trim() !== "";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="relative group bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] 
                 rounded-2xl overflow-hidden w-64 max-w-[90vw] text-center 
                 border border-white/10 shadow-lg hover:shadow-white/10 
                 hover:border-white/30 backdrop-blur-md"
    >
      {/* Image / Placeholder */}
      <div className="w-full h-48 bg-gray-700 relative group">
        {hasImg ? (
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-400 animate-pulse" />
        )}
        {/* Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition duration-500" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white font-bold text-lg md:text-xl tracking-wide">
          <span className="text-white">{name.split(" ")[0]}</span>{" "}
          <span className="text-gray-400">{name.split(" ")[1] || ""}</span>
        </h3>
        <p className="text-gray-400 text-sm mt-1">{por}</p>

        {/* Socials */}
        <div className="flex items-center justify-center gap-6 mt-5 text-gray-300 text-lg">
          {socials.instagram && (
            <a
              href={socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-500 transition-colors"
            >
              <FaInstagram />
            </a>
          )}
          {socials.facebook && (
            <a
              href={socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-500 transition-colors"
            >
              <FaFacebook />
            </a>
          )}
          {socials.linkedin && (
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-500 transition-colors"
            >
              <FaLinkedin />
            </a>
          )}
          {socials.github && (
            <a
              href={socials.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-400 transition-colors"
            >
              <FaGithub />
            </a>
          )}
        </div>
      </div>

      {/* Bottom Accent Line (same as DevMemberCard) */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5 
                   bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 
                   opacity-0 group-hover:opacity-100 transition-all duration-500"
      />
    </motion.div>
  );
};
