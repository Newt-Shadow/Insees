"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";

const NAV_ITEMS = [
  { name: "HOME", href: "/" },
  { name: "ALPHA CRESCENDO", href: "/alpha-crescendo" },
  { name: "TEAM", href: "/team" },
  { name: "GALLERY", href: "/gallery" },
  { name: "RESOURCES", href: "/resources" },
  { name: "CONTACT", href: "#contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
        scrolled
          ? "bg-black/80 backdrop-blur-md border-oz-emerald/20 py-4"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 bg-oz-emerald/10 rounded-lg border border-oz-emerald/50 group-hover:bg-oz-emerald group-hover:text-black transition-all duration-300">
            <Zap size={20} className="text-oz-emerald group-hover:text-black" />
          </div>
          <span className="text-xl font-orbitron font-bold text-white tracking-wider group-hover:text-oz-emerald transition-colors">
            INSEES
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-sm font-mono font-medium tracking-wide text-gray-400 hover:text-white transition-colors py-2"
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-glow"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-oz-emerald shadow-[0_0_10px_#50C878]"
                  />
                )}
              </Link>
            );
          })}
          
          {/* CTA Button */}
          <Link 
            href="/alpha-crescendo"
            className="px-3 py-2 text-xs font-bold text-blue-100 bg-oz-emerald hover:bg-white transition-colors rounded-sm uppercase tracking-widest"
          >
            Fest 2026
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden text-white hover:text-oz-emerald transition-colors"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed inset-0 z-[101] bg-black border-l border-white/10 flex flex-col"
          >
            <div className="flex justify-end p-6">
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X size={32} />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center flex-grow gap-8">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-orbitron font-bold text-white hover:text-oz-emerald transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="p-8 text-center text-xs font-mono text-gray-600 border-t border-white/10">
              {"// SYSTEM READY"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};