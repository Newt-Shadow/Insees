"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { usePreloader } from "@/app/context/PreloaderContext";
import { useRouter } from "next/navigation";
import { Menu, X, Zap, LogIn, User, Github, Twitter, Instagram, ChevronRight, Facebook } from "lucide-react";
import type { Variants } from "framer-motion";




const NAV_ITEMS = [
  { name: "HOME", href: "/", label: "HOME" },
  { name: "ALPHA CRESCENDO", href: "/alpha-crescendo", label: "ALPHA CRESCENDO" },
  { name: "EVENTS", href: "/events", label: "EVENTS" },
  { name: "TEAM", href: "/team", label: "TEAM" },
  { name: "GALLERY", href: "/gallery", label: "GALLERY" },
  { name: "RESOURCES", href: "/resources", label: "RESOURCES" },
  // { name: "CONTACT", href: null, label: "CONTACT" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring", // ← literal, not string
      stiffness: 300,
      damping: 24,
    },
  },
};



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
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${scrolled
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
      {/* ================= SUPERCHARGED MOBILE MENU ================= */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm"
              >
                {/* Drawer Content */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-y-0 right-0 w-full sm:w-[400px] bg-oz-dark/95 border-l border-white/10 flex flex-col shadow-2xl overflow-hidden"
                >
                  {/* Background FX */}
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="noise-overlay opacity-30"></div>
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-oz-emerald/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-repeat"></div>
                  </div>

                  {/* Header */}
                  <div className="relative z-10 flex justify-between items-center p-6 border-b border-white/5">
                    <div className="flex flex-col">
                      <span className="text-oz-emerald font-mono text-xs tracking-widest">
                        {"// SYSTEM_NAV"}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        INSEES_INTERFACE_V2
                      </span>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/30 hover:rotate-90 transition-all duration-300 text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <div className="relative z-10 flex-1 overflow-y-auto py-8 px-6 no-scrollbar">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="flex flex-col gap-6"
                    >
                      {NAV_ITEMS.map((item, i) => (
                        <motion.div key={item.name} variants={itemVariants}>
                          <Link
                            href={item.href}
                            onClick={() => handleLinkClick(item.label)}
                            className="group flex items-center gap-4 py-2"
                          >
                            <span className="text-xs font-mono text-gray-600 group-hover:text-oz-emerald transition-colors">
                              0{i + 1}
                            </span>
                            <span className="text-3xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:to-oz-emerald group-hover:pl-2 transition-all duration-300 uppercase tracking-tighter">
                              {item.name}
                            </span>
                            <ChevronRight className="w-5 h-5 text-oz-emerald opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                          </Link>
                          <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent mt-2 group-hover:from-oz-emerald/30 transition-colors duration-500" />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Extra Links Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-12 flex flex-col gap-4"
                    >
                      <p className="text-[10px] text-gray-500 font-mono mb-2 uppercase tracking-widest">Administrator</p>
                      <Link
                        href="/login"
                        onClick={() => handleLinkClick("LOGIN")}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:border-oz-emerald/30 hover:bg-white/10 transition-all group"
                      >
                        <span className="flex items-center gap-3 text-sm font-bold text-gray-300 group-hover:text-white">
                          <LogIn size={16} /> ADMIN ACCESS
                        </span>
                        <div className="w-2 h-2 rounded-full bg-red-500 group-hover:bg-oz-emerald shadow-[0_0_8px_currentColor] transition-colors" />
                      </Link>
                    </motion.div>
                  </div>

                  {/* Footer CTA */}
                  <div className="relative z-10 p-6 border-t border-white/10 bg-black/40 backdrop-blur-md">
                    <Link
                      href="/alpha-crescendo"
                      onClick={() => handleLinkClick("ALPHA CRESCENDO")}
                      className="flex items-center justify-center w-full gap-2 py-4 bg-oz-emerald text-black font-orbitron font-bold text-sm tracking-widest uppercase rounded hover:bg-white transition-colors shadow-[0_0_20px_rgba(80,200,120,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                    >
                      <Zap size={18} fill="currentColor" />
                      Alpha Crescendo 2026
                    </Link>

                    <div className="flex justify-between items-center mt-6">
                      <div className="flex gap-4">
                        {/* Instagram */}
                        <a
                          href="https://www.instagram.com/insees_nits"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="INSEES Instagram"
                          className="text-gray-500 hover:text-pink-400 transition-colors"
                        >
                          <Instagram size={18} />
                        </a>

                        {/* Facebook */}
                        <a
                          href="https://www.facebook.com/inseessociety/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="INSEES Facebook"
                          className="text-gray-500 hover:text-blue-400 transition-colors"
                        >
                          <Facebook size={18} />
                        </a>

                        {/* GitHub (optional – keep or remove) */}
                        <a
                          href="#"
                          aria-label="INSEES GitHub"
                          className="text-gray-500 hover:text-white transition-colors"
                        >
                          <Github size={18} />
                        </a>
                      </div>

                      <p className="text-[10px] text-gray-600 font-mono">
                        © 2026 INSEES
                      </p>
                    </div>
                  </div>
                  <div className="p-6 text-center border-t border-white/10 bg-zinc-950">
                    <p className="text-[10px] font-mono text-gray-500 mb-1">
                      {"SYSTEM STATUS:"} <span className="text-green-500">ONLINE</span>
                    </p>
                    <p className="text-[10px] text-gray-600">v2026.1.0</p>
                  </div>

                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}




    </>
  );
};