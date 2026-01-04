"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { WhatsNew } from "@/components/alpha/WhatsNew";
import { EventsGrid } from "@/components/alpha/EventsGrid";
import { Sponsors } from "@/components/alpha/Sponsors";
import { alphaContent } from "@/data/alphaCrescendoData";
import { SponsorsMarquee } from "@/components/SponsorsMarquee";
import { SponsorshipTiers } from "@/components/alpha/SponsorshipTiers";
import { YellowBrickRoad } from "@/components/alpha/YellowBrickRoad";
import { useEffect, useState } from "react";
import { InstrumindFlipCard } from "@/components/InstrumindFlip";
import Countdown from "./count";

// const PHASES = [
//   "AWAKENING",
//   "IGNITION",
//   "SURGE",
//   "ASCENSION",
//   "CRESCENDO",
// ];

// const Countdown = () => {
//   const TARGET = new Date("2026-01-27T00:00:00Z").getTime();
//   const ARC = 1000 * 60 * 60 * 24 * 42; // narrative arc
//   const START = TARGET - ARC;

//   const [tick, setTick] = useState(0);

//   useEffect(() => {
//     const i = setInterval(() => setTick(t => t + 1), 1200);
//     return () => clearInterval(i);
//   }, []);

//   const now = Date.now();
//   const raw = Math.min(1, Math.max(0, (now - START) / ARC));
//   const progress = Math.pow(raw, 0.7); // smooth, non-linear

//   const phase = PHASES[Math.min(PHASES.length - 1, Math.floor(progress * PHASES.length))];

//   // Abstract signal (cannot be reverse engineered)
//   const signal = Math.floor(60 + progress * 39 + Math.sin(tick) * 3);

//   return (
//     <div className="mt-16 flex flex-col items-center text-center relative z-20">

//       {/* PHASE */}
//       <motion.h3
//         key={phase}
//         initial={{ opacity: 0, y: 8 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="text-3xl md:text-4xl font-orbitron tracking-[0.4em] text-oz-emerald"
//       >
//         {phase}
//       </motion.h3>

//       {/* SUBTEXT */}
//       <p className="mt-4 text-sm md:text-base text-gray-400 font-mono tracking-widest">
//         SIGNAL STRENGTH INCREASING
//       </p>

//       {/* SIGNAL */}
//       <div className="mt-10 flex items-baseline gap-3">
//         <span className="text-6xl md:text-8xl font-extrabold tracking-tight text-white">
//           {signal}
//         </span>
//         <span className="text-lg md:text-xl font-mono text-gray-500">
//           %
//         </span>
//       </div>

//       {/* PROGRESS LINE */}
//       <div className="mt-10 w-64 md:w-80 h-[2px] bg-white/10 overflow-hidden rounded-full">
//         <motion.div
//           initial={{ width: 0 }}
//           animate={{ width: `${signal}%` }}
//           transition={{ duration: 0.8 }}
//           className="h-full bg-gradient-to-r from-oz-emerald via-green-300 to-oz-emerald"
//         />
//       </div>

//       {/* FOOTER TEXT */}
//       <p className="mt-6 text-[10px] uppercase tracking-[0.5em] text-gray-600">
//         Exact timing classified
//       </p>
//     </div>
//   );
// };


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
            <div className="text-sm text-gray-500">Interactions</div>
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
  const scrollToEvents = () => {
    const eventsSection = document.getElementById('events');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="bg-black min-h-screen text-white selection:bg-oz-emerald selection:text-black font-sans">
      <YellowBrickRoad />
      <Navbar />

      {/* HERO */}
      <section className="relative  h-screen flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-oz-dark via-black to-black">
        <div className="absolute inset-0 opacity-20 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <div className="z-10 mt-14 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6  inline-block"
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
            Alpha  <br />
            {/* <span className="text-transparent bg-clip-text bg-gradient-to-r from-oz-emerald via-green-300 to-oz-emerald ]">
           
            </span> <br /> */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-oz-emerald via-green-300 to-oz-emerald ]">
              {"Crescendo"}
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

          <Countdown />


          {/* <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex mt-8  flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={scrollToEvents}
              className="px-8 py-4 bg-oz-emerald hover:cursor-pointer text-amber-50 font-bold rounded-full hover:bg-oz-emerald/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              Register for Events
            </button>
            <button className="px-8  py-4 bg-transparent border hover:cursor-pointer border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all">
              Download Brochure
            </button>
          </motion.div> */}
        </div>
      </section>

      {/* COMPONENTS */}
      <AboutSection />
      {/* <WhatsNew /> */}
      {/* <EventsGrid /> */}

      {/* Magazine Teaser */}
      {/* ================= INSTRUMIND MAGAZINE ================= */}
      <section className="relative py-28 px-4 bg-black border-y border-white/5 overflow-hidden">
        {/* Ambient glow */}
        

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

          {/* TEXT SIDE */}
          <div>
            <span className="text-oz-gold font-mono text-sm tracking-widest">
              03. OFFICIAL PUBLICATION
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-white leading-tight">
              The <span className=" bg-clip-text bg-gradient-to-r from-oz-emerald to-green-300">
                Instrumind
              </span>
            </h2>

            <p className="mt-6 text-gray-400 text-lg leading-relaxed max-w-xl">
              The annual magazine of INSEES — a curated archive of ideas, innovations,
              and technical excellence that defines the spirit of Alpha Crescendo.
            </p>

            <div className="mt-10 flex items-center gap-6">
              <button
                onClick={() =>
                  window.open("https://online.fliphtml5.com/svrwe/aupi/", "_blank")
                }
                className="px-8 py-4 bg-oz-emerald text-white hover:cursor-pointer font-bold rounded-full
                     hover:scale-105 transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)]"
              >
                Read 1st Edition
              </button>

              <span className="text-xs font-mono text-gray-500 tracking-widest">
                FLIPBOOK • DIGITAL
              </span>
            </div>
          </div>

          {/* COVER SIDE */}
          <InstrumindFlipCard />

        </div>
      </section>


      <Sponsors />





      {/* Footer
      <footer className="py-12 text-center text-gray-600 border-t border-white/5 bg-black">
        <p>© 2026 INSEES. Alpha Crescendo.</p>
      </footer> */}
    </div>
  );
}
