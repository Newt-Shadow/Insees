"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingIcon } from "../components/FloatingIcon";
import { EmailForm } from "../components/EmailForm";
import { ScrollHint } from "../components/ScrollHint";
import { ContactSection } from "../components/ContactSection";
import { EventsTimeline } from "../components/EventsTimeline";
import { AboutSection } from "../components/AboutSection";
import { Navbar } from "../components/navbar";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  // --- Inline Tailwind extension ---
  const glowColors = {
    blue: "shadow-[0_0_20px_6px_rgba(59,130,246,0.6)]",
    green: "shadow-[0_0_20px_6px_rgba(34,197,94,0.6)]",
    amber: "shadow-[0_0_20px_6px_rgba(245,158,11,0.6)]",
    orange: "shadow-[0_0_20px_6px_rgba(249,115,22,0.6)]",
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-screen w-64 bg-black/90 backdrop-blur-md z-50 p-6 flex flex-col"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="self-end text-gray-300 hover:text-white"
            >
              <X className="w-7 h-7" />
            </button>
            <ul className="mt-12 space-y-6 text-gray-200 text-lg">
              <li
                onClick={() => setMenuOpen(false)}
                className="hover:text-teal-300 cursor-pointer"
              >
                About
              </li>
              <li
                onClick={() => setMenuOpen(false)}
                className="hover:text-teal-300 cursor-pointer"
              >
                Events
              </li>
              <li
                onClick={() => setMenuOpen(false)}
                className="hover:text-teal-300 cursor-pointer"
              >
                Contact
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col items-center justify-center text-white font-[Poppins,sans-serif] overflow-hidden">
        {/* Background Radial */}
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_40%,rgba(255,255,255,.06),transparent)]" />

        {/* Floating Electronics Icons */}
        <FloatingIcon
          className={`absolute rounded-xl p-[3px] top-[28%] left-[12%] ${glowColors.amber}`}
          color="amber"
          src="/resistor.svg"
          float={24}
          delay={0.4}
        />
        <FloatingIcon
          className={`absolute top-[17%] rounded-xl p-[3px]  left-1/2 -translate-x-1/2 ${glowColors.blue}`}
          color="blue"
          src="/capacitor.svg"
          float={22}
          delay={0.8}
        />
        <FloatingIcon
          className={`absolute rounded-xl p-[3px]  bottom-[20%] left-[18%] ${glowColors.green}`}
          color="green"
          src="/led.svg"
          float={20}
          delay={1.2}
        />
        <FloatingIcon
          className={`absolute rounded-xl p-[3px]  top-[24%] right-[12%] ${glowColors.orange}`}
          color="orange"
          src="/ic.svg"
          float={26}
          delay={1.6}
        />

        {/* Center Title + Form */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-wide bg-gradient-to-t from-gray-300 to-white text-transparent bg-clip-text">
            INSEES
          </h1>
          <p className="mt-6 text-base md:text-lg text-gray-300 max-w-2xl">
            Instrumentation and Electronics Engineering Society. <br />
            National Institute of Technology, Silchar.
          </p>

          {/* Email Form */}
          <EmailForm />
        </div>

        {/* Scroll Hint */}
        <ScrollHint />
      </main>

      {/* Sections */}
      <AboutSection />
      <EventsTimeline />
      <ContactSection />
    </>
  );
}
