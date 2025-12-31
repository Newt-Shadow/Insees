"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, LogIn, User } from "lucide-react";
import { createPortal } from "react-dom";
import { usePreloader } from "@/app/context/PreloaderContext";

const NAV_ITEMS = [
  { name: "HOME", href: "/", label: "HOME" },
  { name: "ALPHA CRESCENDO", href: "/alpha-crescendo", label: "ALPHA CRESCENDO" },
  { name: "EVENTS", href: "/events", label: "EVENTS" },
  { name: "TEAM", href: "/team", label: "TEAM" },
  { name: "GALLERY", href: "/gallery", label: "GALLERY" },
  { name: "RESOURCES", href: "/resources", label: "RESOURCES" },
  { name: "CONTACT", href: "#contact", label: "CONTACT" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { triggerBoot } = usePreloader();

  /* Mount guard for portal */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* Glassmorphism scroll effect */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Lock background scroll on mobile */
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? "hidden" : "";
    }
  }, [isOpen]);

  const handleLinkClick = (label: string) => {
    triggerBoot(label);
    setIsOpen(false);
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
          scrolled
            ? "bg-black/80 backdrop-blur-md border-oz-emerald/20 py-4"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={() => triggerBoot("HOME")}
          >
            <div className="relative flex items-center justify-center w-10 h-10 bg-oz-emerald/10 rounded-lg border border-oz-emerald/50 group-hover:bg-oz-emerald group-hover:text-black transition-all duration-300">
              <Zap size={20} className="text-oz-emerald group-hover:text-black" />
            </div>
            <span className="text-xl font-orbitron font-bold text-white tracking-wider group-hover:text-oz-emerald transition-colors hidden sm:block">
              INSEES
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => triggerBoot(item.label)}
                  className="relative text-xs font-mono font-bold tracking-wide text-gray-400 hover:text-white transition-colors py-2"
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

            {/* Divider */}
            <div className="h-6 w-px bg-white/10 mx-2" />

            {/* Login Button (Ghost Style - Less intrusive) */}
            <Link
              href="/login"
              onClick={() => triggerBoot("LOGIN")}
              className="group flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-300 hover:text-white border border-white/10 hover:border-oz-emerald/50 rounded-md transition-all hover:bg-white/5"
            >
              <User size={14} className="group-hover:text-oz-emerald transition-colors" />
              LOGIN
            </Link>

            {/* CTA Button (Primary Action) */}
            <Link
              href="/alpha-crescendo"
              onClick={() => triggerBoot("ALPHA CRESCENDO")}
              className="px-4 py-2 text-xs font-bold text-amber-50 hover:text-black bg-oz-emerald hover:bg-white hover:scale-105 transition-all duration-300 rounded-sm uppercase tracking-widest shadow-[0_0_15px_rgba(80,200,120,0.3)]"
            >
              Fest 2026
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden text-white hover:text-oz-emerald transition-colors"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* ================= MOBILE MENU (PORTAL) ================= */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.4, ease: "circOut" }}
                className="fixed inset-0 z-[999] bg-black border-l border-white/10 flex flex-col"
              >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                  <span className="text-oz-emerald font-mono text-sm">// NAVIGATION</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white border border-white/10"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Links */}
                <div className="flex flex-col items-center justify-center flex-grow gap-6 p-6">
                  {NAV_ITEMS.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                      className="w-full text-center"
                    >
                      <Link
                        href={item.href}
                        onClick={() => handleLinkClick(item.label)}
                        className="block text-2xl font-orbitron font-bold text-white hover:text-oz-emerald transition-colors py-2 active:scale-95"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}

                  <div className="w-12 h-px bg-white/10 my-4" />

                  {/* Mobile Admin Login */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      href="/login"
                      onClick={() => handleLinkClick("LOGIN")}
                      className="flex items-center gap-3 px-8 py-4 text-sm font-bold text-black bg-oz-emerald rounded-full shadow-[0_0_20px_rgba(80,200,120,0.3)] active:scale-95 transition-transform"
                    >
                      <LogIn size={18} />
                      ADMIN ACCESS
                    </Link>
                  </motion.div>
                </div>

                {/* Footer */}
                <div className="p-6 text-center border-t border-white/10 bg-zinc-950">
                  <p className="text-[10px] font-mono text-gray-500 mb-1">
                    SYSTEM STATUS: <span className="text-green-500">ONLINE</span>
                  </p>
                  <p className="text-[10px] text-gray-600">v2026.1.0</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};