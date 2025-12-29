"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { YellowBrickRoad } from "@/components/alpha/YellowBrickRoad";
import { GlitchEventCard } from "@/components/alpha/GlitchEventCard";
import { SponsorshipTiers } from "@/components/alpha/SponsorshipTiers";
import { SponsorsMarquee } from "@/components/SponsorsMarquee";

// --- NEW COUNTDOWN COMPONENT ---
const Countdown = () => {
  const calculateTimeLeft = () => {
    // Set date to Alpha Crescendo (e.g., Nov 15, 2026)
    const difference = +new Date("2026-11-15") - +new Date();
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <div className="flex gap-4 md:gap-8 justify-center mt-12">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center group">
          <div className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center bg-black/50 border border-white/10 rounded-xl backdrop-blur-md overflow-hidden group-hover:border-oz-emerald/50 transition-colors">
            <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-oz-emerald to-transparent opacity-50 animate-scan" />
            <span className="text-2xl md:text-4xl font-bold font-orbitron text-white">
              {String(value).padStart(2, '0')}
            </span>
          </div>
          <p className="text-[10px] md:text-xs font-mono uppercase text-gray-500 mt-2 tracking-widest">{unit}</p>
        </div>
      ))}
    </div>
  );
};


export default function AlphaCrescendoPage() {
  return (
    <div className="bg-black min-h-screen text-white selection:bg-oz-emerald selection:text-black font-sans overflow-x-hidden">
      <Navbar />
      <YellowBrickRoad />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
        {/* Cinematic Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a2e24_0%,#000000_80%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        {/* Floating Particles (CSS Animation) */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-oz-gold rounded-full animate-ping" />
           <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-oz-emerald rounded-full animate-ping delay-700" />
        </div>

        <div className="z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-white/5 border border-white/10 text-oz-emerald text-xs font-mono mb-8 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            LIVE TRANSMISSION FROM THE EMERALD CITY
          </motion.div>
          
          <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter mb-4 text-white font-orbitron relative">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">ALPHA</span>
            <span className="block text-oz-emerald drop-shadow-[0_0_30px_rgba(80,200,120,0.5)]">CRESCENDO</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            The largest Techno-Cultural congregation in the Northeast. <br/>
            <span className="text-white font-bold">Innovation • Culture • Legacy</span>
          </p>

          {/* Countdown Timer */}
          <Countdown />

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-12">
            <button className="px-8 py-4 bg-oz-emerald text-black font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(80,200,120,0.4)]">
              REGISTER NOW
            </button>
            <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-all flex items-center gap-2 justify-center">
              <span>DOWNLOAD BROCHURE</span>
              <span className="text-oz-gold">↓</span>
            </button>
          </div>
        </div>
      </section>

      

    </div>
  );
}