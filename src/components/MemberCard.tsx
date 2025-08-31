"use client";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

interface MemberProps {
  name: string;
  por: string;
  img: string;
  socials: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}

export const MemberCard = ({ name, por, img, socials }: MemberProps) => {
  const hasImg = img && img.trim() !== "";

  return (
    <div className="bg-[#0a0a0a] rounded-2xl overflow-hidden w-60 md:w-64 text-center border border-white/10">
      {/* Image / Placeholder */}
      <div className="w-full h-40 bg-gray-600 flex items-center justify-center">
        {hasImg ? (
          <img src={img} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-400 animate-pulse" />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-semibold">
          <span className="text-white">{name.split(" ")[0]}</span>{" "}
          <span className="text-gray-400">
            {name.split(" ")[1] || ""}
          </span>
        </h3>
        <p className="text-gray-400 text-sm mt-1">{por}</p>

        {/* Socials */}
        <div className="flex items-center justify-center gap-5 mt-4 text-gray-300 text-lg">
          {socials.instagram && (
            <a href={socials.instagram} target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
          )}
          {socials.facebook && (
            <a href={socials.facebook} target="_blank" rel="noreferrer">
              <FaFacebook />
            </a>
          )}
          {socials.linkedin && (
            <a href={socials.linkedin} target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
