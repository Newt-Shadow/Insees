"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
  navLinks: { name: string; path: string }[];
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({ open, onClose, navLinks }) => {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: open ? 0 : "100%" }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      className="fixed top-0 right-0 h-screen w-72 bg-black/70 backdrop-blur-2xl 
                 border-l border-white/10 shadow-2xl z-50 p-6 flex flex-col"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="self-end text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Links */}
      <motion.ul
        className="mt-12 space-y-6 text-gray-200 text-lg font-medium"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, x: 30 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {navLinks.map((link, i) => (
          <motion.li
            key={i}
            variants={{
              hidden: { opacity: 0, x: 20 },
              visible: { opacity: 1, x: 0 },
            }}
            whileHover={{ x: 8 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={onClose}
            className="cursor-pointer"
          >
            <Link
              href={link.path}
              scroll={true}
              className={`${
                pathname === link.path ? "text-teal-300" : "hover:text-teal-300"
              }`}
            >
              {link.name}
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};
