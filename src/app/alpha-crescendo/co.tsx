"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { YellowBrickRoad } from "@/components/alpha/YellowBrickRoad";
import { ArrowDown, Download } from "lucide-react";

// --- COMPONENT: Countdown Timer ---
const Countdown = () => {
  const calculateTimeLeft = () => {
    // TARGET DATE: January 27, 2025
    const difference = +new Date("2026-01-27") - +new Date();
    
    if (difference < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

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
    <div className="flex gap-3 md:gap-6 justify-center mt-12 flex-wrap relative z-20">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center group">
          <div className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center bg-zinc-900/80 border border-white/10 rounded-xl backdrop-blur-md overflow-hidden group-hover:border-oz-emerald/50 transition-all duration-500 shadow-2xl">
            {/* Scanline Animation */}
            <div className="absolute top-0 w-full h-[2px] bg-oz-emerald/50 shadow-[0_0_10px_#50C878] animate-scan opacity-50" />
            
            <span className="text-2xl md:text-4xl font-bold font-orbitron text-white group-hover:text-oz-emerald transition-colors">
              {String(value).padStart(2, '0')}
            </span>
          </div>
          <p className="text-[10px] md:text-xs font-mono uppercase text-gray-500 mt-3 tracking-widest">{unit}</p>
        </div>
      ))}
    </div>
  );
};

export default function AlphaCrescendoPage() {
  return (
    <div className="bg-black min-h-screen text-white selection:bg-oz-emerald selection:text-black font-sans overflow-x-hidden flex flex-col">
      <Navbar />
      <YellowBrickRoad />

      {/* --- HERO SECTION --- */}
      {/* ADDED pb-40 to prevent overlap with the bottom connector */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-40">
        
        {/* Cinematic Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a2e24_0%,#000000_90%)] opacity-80" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-oz-gold rounded-full animate-ping" />
           <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-oz-emerald rounded-full animate-ping delay-700" />
        </div>

        {/* Main Content */}
        <div className="z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-white/5 border border-white/10 text-oz-emerald text-xs font-mono mb-8 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]" />
            LIVE TRANSMISSION FROM THE EMERALD CITY
          </motion.div>
          
          <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter mb-4 text-white font-orbitron relative z-20">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">ALPHA</span>
            <span className="block text-oz-emerald drop-shadow-[0_0_35px_rgba(80,200,120,0.4)]">CRESCENDO</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            The largest Techno-Cultural congregation in the Northeast. <br/>
            <span className="text-white font-bold">Innovation • Culture • Legacy</span>
          </p>

          <Countdown />

          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-12 relative z-20">
            <button className="px-8 py-4 bg-oz-emerald text-white hover:text-black font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(80,200,120,0.4)] hover:bg-white">
              REGISTER NOW
            </button>
            
            {/* Download Button (Fixed) */}
            <a 
              href="/ALPHA CRESCENDO (1).pdf" 
              download="Alpha_Crescendo_Brochure.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-all flex items-center gap-2 justify-center group cursor-pointer"
            >
              <span>DOWNLOAD BROCHURE</span>
              <Download size={18} className="group-hover:translate-y-1 transition-transform text-oz-gold" />
            </a>
          </div>
        </div>
        
        {/* --- FOOTER BLEND CONNECTOR --- */}
        <div className="absolute bottom-0 left-0 right-0 h-48 w-full z-10 pointer-events-none">
           {/* 1. Gradient: Fades from transparent to Solid Black */}
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
           
           {/* 2. Vertical Data Line */}
           <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-oz-emerald/50 to-oz-emerald/20 -translate-x-1/2" />
           
           {/* 3. The "Terminal Node" */}
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-black border border-oz-emerald rounded-full shadow-[0_0_20px_#50C878] z-20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-oz-emerald rounded-full animate-pulse" />
           </div>
           
           {/* 4. Decorative Text (Now nicely spaced) */}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-oz-emerald/30 tracking-[0.5em] uppercase">
              End_Transmission
           </div>
        </div>
      </section>
    </div>
  );
}