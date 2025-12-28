"use client";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { WhatsNew } from "@/components/alpha/WhatsNew";
import { EventsGrid } from "@/components/alpha/EventsGrid";
import { Sponsors } from "@/components/alpha/Sponsors";
import { alphaContent } from "@/data/alphaCrescendoData";

// Simple About Component for Layout
const AboutSection = () => (
  <section className="py-24 px-4 bg-black" id="about-fest">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
      <div>
        <h3 className="text-oz-emerald font-mono mb-2">01. ABOUT US</h3>
        <h2 className="text-3xl font-bold text-white mb-6">INSEES & NIT Silchar</h2>
        <div className="space-y-6 text-gray-400 leading-relaxed">
          <p>{alphaContent.about.nit}</p>
          <p>{alphaContent.about.insees}</p>
        </div>
      </div>
      <div>
        <h3 className="text-oz-gold font-mono mb-2">02. THE FEST</h3>
        <h2 className="text-3xl font-bold text-white mb-6">Alpha Crescendo</h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          {alphaContent.about.fest}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
             <div className="text-2xl font-bold text-white">40K+</div>
             <div className="text-sm text-gray-500">Footfall</div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
             <div className="text-2xl font-bold text-white">10+</div>
             <div className="text-sm text-gray-500">Major Events</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default function AlphaCrescendoPage() {
  return (
    <div className="bg-black min-h-screen text-white selection:bg-oz-emerald selection:text-black font-sans">
      <Navbar />

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-oz-dark via-black to-black">
        <div className="absolute inset-0 opacity-20 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-block"
          >
            <span className="px-4 py-2 rounded-full border border-oz-emerald/30 bg-oz-emerald/10 text-oz-emerald text-sm font-mono tracking-widest">
              {alphaContent.hero.dates} EDITION
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-9xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600"
          >
            THE WIZARD <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-oz-emerald via-green-300 to-oz-emerald drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              OF TECH
            </span>
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto"
          >
            {alphaContent.hero.tagline}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-4 bg-oz-emerald text-black font-bold rounded-full hover:bg-oz-emerald/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              Register for Events
            </button>
            <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all">
              Download Brochure
            </button>
          </motion.div>
        </div>
      </section>

      {/* COMPONENTS */}
      <AboutSection />
      <WhatsNew />
      <EventsGrid />
      
      {/* Magazine Teaser */}
      <section className="py-20 px-4 border-y border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
             <h2 className="text-4xl font-bold mb-4">The Instrumind</h2>
             <p className="text-gray-400 text-lg mb-6">
               The annual magazine of INSEES. [cite_start]A platform that celebrates innovation and technical excellence. [cite: 164]
             </p>
             <button className="text-oz-gold font-bold underline hover:text-white transition-colors">
               Read the 1st Edition
             </button>
          </div>
          <div className="flex-1 h-64 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center border border-white/10">
             <span className="text-gray-500 font-mono">Magazine Cover Placeholder</span>
          </div>
        </div>
      </section>

      <Sponsors />

      {/* Footer */}
      <footer className="py-12 text-center text-gray-600 border-t border-white/5 bg-black">
        <p>© 2026 INSEES. Alpha Crescendo.</p>
      </footer>
    </div>
  );
}