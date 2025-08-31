"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", path: "/#about" },
    { name: "Events", path: "/#events" },
    { name: "Team Members", path: "/team" },
    { name: "Resources", path: "/resources" }, // ✅ Added Resources
    { name: "Contact", path: "/#contact" },
     { name: "Gallery", path: "/gallery" }, 
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"
        >
          INSEES
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-10 text-gray-200 font-medium">
          {navLinks.map((link, i) => (
            <motion.li
              key={i}
              className="relative cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href={link.path}
                className="hover:text-teal-300 transition-colors"
              >
                {link.name}
              </Link>
              <motion.div
                className="absolute left-0 bottom-0 h-[2px] bg-gradient-to-r from-teal-400 to-blue-400 rounded-full"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-teal-300"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-screen w-72 bg-black/90 backdrop-blur-xl z-50 p-6 flex flex-col"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="self-end text-gray-400 hover:text-white"
            >
              <X className="w-7 h-7" />
            </button>
            <ul className="mt-12 space-y-6 text-gray-200 text-lg font-medium">
              {navLinks.map((link, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  onClick={() => setMenuOpen(false)}
                >
                  <Link href={link.path} className="hover:text-teal-300">
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
