"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
    // { name: "Alpha Crescendo", path: "/alpha-crescendo" },
    { name: "Team Members", path: "/team" },
    // { name: "Resources", path: "/resources" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
        >
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"
          >
            INSEES
          </Link>
        </motion.div>

        {/* Desktop Menu */}
        <ul className="hidden min-[841px]:flex gap-10 text-gray-200 font-medium">
          {navLinks.map((link, i) => {
            const isActive =
              pathname === link.path || pathname.startsWith(link.path);
            return (
              <motion.li
                key={i}
                className="relative cursor-pointer"
                whileHover={{ scale: 1.07 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Link
                  href={link.path}
                  scroll={true}
                  className={`transition-colors ${
                    isActive ? "text-teal-300" : "hover:text-teal-300"
                  }`}
                >
                  {link.name}
                </Link>
                <motion.div
                  className="absolute left-0 -bottom-1 h-[2px] bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  animate={{ width: isActive ? "100%" : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.li>
            );
          })}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="hidden max-[840px]:block text-teal-300 hover:scale-110 transition-transform"
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
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-screen w-72 bg-black/70 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 p-6 flex flex-col"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="self-end text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-7 h-7" />
            </button>

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
                  variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                  whileHover={{ x: 8 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  onClick={() => setMenuOpen(false)}
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
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
