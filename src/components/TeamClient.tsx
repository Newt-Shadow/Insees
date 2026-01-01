"use client";

import { useState, useRef, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Github, Linkedin, Instagram, Facebook, Search, Terminal as TerminalIcon, Shield } from "lucide-react";
import Image from "next/image";
import { SiGooglescholar } from "react-icons/si";

// --- TYPES ---
export interface Member {
  name: string;
  por: string;
  img?: string;
  socials: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
    scholar?: string;
  };
}

export interface TeamData {
  [year: string]: {
    core?: Member[];
    executive?: Member[];
  };
}

// --- FACULTY DATA (STATIC) ---
// Since the Faculty In-Charge is the same for all years, we define him here.
const FACULTY_ADVISOR: Member = {
  name: "Dr. Lalu Seban", // Update this if the current FIC is different
  por: "Faculty In-Charge",
  img: "/lalu_seban.jpeg", // Make sure to upload an image here
  socials: {
    linkedin: "https://www.linkedin.com/school/nitsilchar/", // Update with actual link
    scholar: "https://scholar.google.co.in/citations?user=Mb8rUm0AAAAJ&hl=en"
    // Add others if available

  }
};

const HOD_EIE: Member = {
  name: "Dr. Munmun Khanra",
  por: "HOD (EIE)",
  img: "/munmun.jpeg",
  socials: {
    linkedin: "https://www.linkedin.com/in/munmun-khanra-a9092243/?originalSubdomain=in",
    scholar: "https://scholar.google.com/citations?user=5tKH7h0AAAAJ&hl=en",
  },
};

// --- OPTIMIZED 3D TILT WRAPPER ---
const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const rectRef = useRef<DOMRect | null>(null);
  const hoveringRef = useRef(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    rectRef.current = e.currentTarget.getBoundingClientRect();
    hoveringRef.current = true;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hoveringRef.current || !rectRef.current) return;

      const { width, height, left, top } = rectRef.current;
      const px = e.clientX - left;
      const py = e.clientY - top;

      x.set(px / width - 0.5);
      y.set(py / height - 0.5);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    hoveringRef.current = false;
    rectRef.current = null;
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full perspective-1000 z-10"
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full h-full will-change-transform"
      >
        <div style={{ transform: "translateZ(20px)" }} className="h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const AvatarImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className="object-cover transition-transform duration-500"
      priority
    />
  );
};


// --- HOLO CARD COMPONENT ---
const HoloCard = ({ member, rank }: { member: Member, rank: "CORE" | "EXEC" | "FACULTY" }) => {
  const pseudoId = member.name.substring(0, 3).toUpperCase() + Math.floor(member.name.length * 123).toString().substring(0, 3);

  // Define styles based on rank
  const styles = {
    FACULTY: {
      gradient: "from-white via-slate-200 to-gray-400",
      border: "border-white/50",
      text: "text-white",
      bg: "bg-white/10",
      label: "LVL_0 // OVERSEER",
      scanColor: "bg-white/50",
      spinColor: "border-white/40"
    },
    CORE: {
      gradient: "from-oz-emerald via-teal-400 to-cyan-500",
      border: "border-oz-emerald/50",
      text: "text-oz-emerald",
      bg: "bg-oz-emerald/10",
      label: "LVL_1 // ADMIN",
      scanColor: "bg-oz-emerald/50",
      spinColor: "border-oz-emerald/40"
    },
    EXEC: {
      gradient: "from-oz-gold via-orange-400 to-yellow-200",
      border: "border-oz-gold/50",
      text: "text-oz-gold",
      bg: "bg-oz-gold/10",
      label: "LVL_2 // EXEC",
      scanColor: "bg-oz-gold/50",
      spinColor: "border-oz-gold/40"
    }
  };

  const style = styles[rank];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group relative w-full h-full min-h-[320px] sm:min-h-[360px] lg:min-h-[400px]"
    >
      <TiltCard>
        {/* Holographic Border Glow */}
        <div className={`absolute -inset-0.5 opacity-30 group-hover:opacity-100 blur transition duration-500 rounded-xl bg-gradient-to-b ${style.gradient}`} />

        <div className="relative h-full bg-black/90  border border-white/10 p-6 rounded-xl flex flex-col items-center overflow-hidden shadow-2xl backface-hidden">

          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className={`absolute top-0 left-0 w-full h-1 shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-scan opacity-0 group-hover:opacity-100 pointer-events-none ${style.scanColor}`} />

          {/* Rank Badge */}
          <div className={`absolute top-4 right-4 text-[10px] font-mono border px-2 py-0.5 rounded backdrop-blur-md z-20 ${style.border} ${style.text} ${style.bg}`}>
            {style.label}
          </div>

          {/* Image Container */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mb-4 sm:mb-6 mt-10 sm:mt-6 lg:mt-4 shrink-0">
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className={`absolute inset-[-4px] border-2 border-dashed rounded-full animate-spin-slow ${style.spinColor}`} />
            <div className="absolute inset-[-6px] sm:inset-[-10px] lg:inset-[-12px] border border-white/5 rounded-full animate-reverse-spin opacity-50" />

            <div className="w-full h-full rounded-full overflow-hidden relative z-10 bg-zinc-900">
              <Image
                key={member.img}
                src={member.img || "/members/avatar-placeholder.png"}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-all duration-500 grayscale-0 group-hover:grayscale-0 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center z-10 w-full flex-grow flex flex-col">
            <h3 className="text-xl sm:text-2xl font-bold font-orbitron text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
              {member.name}
            </h3>
            <div className="h-px w-12 bg-white/20 mx-auto my-3 group-hover:w-24 transition-all duration-300" />
            <p className={`font-mono text-xs uppercase tracking-[0.2em] mb-6 ${style.text}`}>
              {member.por}
            </p>

            <div className="flex gap-4 justify-center mt-auto relative z-20">
              {member.socials.linkedin && (
                <a href={member.socials.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#0077b5] hover:text-white transition-all duration-300 hover:scale-110 group/icon">
                  <Linkedin size={18} />
                </a>
              )}
              {member.socials.instagram && (
                <a href={member.socials.instagram} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-pink-600 hover:text-white transition-all duration-300 hover:scale-110">
                  <Instagram size={18} />
                </a>
              )}
              {member.socials.facebook && (
                <a href={member.socials.facebook} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#1877F2] hover:text-white transition-all duration-300 hover:scale-110">
                  <Facebook size={18} />
                </a>
              )}
              {member.socials.github && (
                <a href={member.socials.github} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white hover:text-black transition-all duration-300 hover:scale-110">
                  <Github size={18} />
                </a>
              )}
              {rank === "FACULTY" && member.socials.scholar && (
                <a
                  href={member.socials.scholar}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white/5 hover:bg-[#4285F4] hover:text-white transition-all duration-300 hover:scale-110"
                  title="Google Scholar"
                >
                  <SiGooglescholar size={18} />
                </a>
              )}
            </div>
          </div>

          <div className="w-full flex justify-between items-center mt-6 pt-4 border-t border-white/5 text-[9px] text-gray-600 font-mono">
            <span>ID: {pseudoId}</span>
            <span>STATUS: <span className="text-green-500 animate-pulse">ONLINE</span></span>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};

// --- MAIN CLIENT COMPONENT ---
export default function TeamClient({ initialData, initialYear }: { initialData: TeamData, initialYear: string }) {
  const [selectedYear, setSelectedYear] = useState<string>(initialYear);
  const [searchQuery, setSearchQuery] = useState("");

  const availableYears = Object.keys(initialData).sort().reverse();

  // Filter Logic
  const filterMembers = (members: Member[]) => {
    if (!searchQuery) return members;
    return members.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.por.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const currentData = initialData[selectedYear] || { core: [], executive: [] };
  const filteredCore = filterMembers(currentData.core || []);
  const filteredExec = filterMembers(currentData.executive || []);

  return (
    <div className="bg-black min-h-screen text-white selection:bg-oz-emerald selection:text-black overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#111_0%,#000_100%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 [mask-image:linear-gradient(to_bottom,white,transparent)]" />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-oz-emerald rounded-full animate-ping" />
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-oz-gold rounded-full animate-ping delay-500" />
        </div>

        <div className="z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 border border-oz-emerald/30 bg-oz-emerald/5 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md"
          >
            <Shield size={14} className="text-oz-emerald" />
            <span className="text-xs font-mono text-oz-emerald tracking-widest">SECURE DATABASE ACCESS</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-black font-orbitron tracking-tighter mb-4 text-white"
          >
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-oz-emerald to-teal-400">NETWORK</span>
          </motion.h1>
          <p className="text-gray-400 font-mono text-sm md:text-base max-w-xl mx-auto">
            Authorized Personnel Only. The architects behind the innovation.
          </p>
        </div>
      </section>

      {/* Control Deck */}
      <div className="sticky top-20 z-40 bg-black/80 border-y border-white/10 py-4 mb-12 shadow-2xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-oz-emerald font-mono text-xs">SYSTEM ONLINE</span>
            <div className="h-4 w-px bg-white/20 mx-2" />
            <span className="text-gray-500 font-mono text-xs">{selectedYear ? `SESSION ${selectedYear}` : 'INITIALIZING...'}</span>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative group flex-1 md:w-64">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500 group-focus-within:text-oz-emerald transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search node..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm font-mono text-white focus:outline-none focus:border-oz-emerald/50 focus:ring-1 focus:ring-oz-emerald/50 transition-all placeholder-gray-600"
              />
            </div>

            {/* Year Select */}
            <div className="relative">
              <TerminalIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oz-gold" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-zinc-900/50 border border-oz-gold/30 text-oz-gold rounded-lg py-2 pl-10 pr-8 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-oz-gold cursor-pointer hover:bg-zinc-900 transition-colors appearance-none"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>SESSION {year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-32 space-y-24">

        {/* 1. FACULTY IN-CHARGE SECTION (New) */}
        <section>
          <div className="flex items-end gap-4 mb-12 border-b border-white/10 pb-4">
            <h2 className="text-4xl font-bold font-orbitron text-white">FACULTY <span className="text-gray-400">IN-CHARGE</span></h2>
            <span className="font-mono text-xs text-gray-500 mb-2">{"// LEVEL 0 CLEARANCE"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center">
           
              <HoloCard member={HOD_EIE} rank="FACULTY" />
              <HoloCard member={FACULTY_ADVISOR} rank="FACULTY" />
          
          </div>
        </section>

        {/* 2. CORE SECTION */}
        <section>
          <div className="flex items-end gap-4 mb-12 border-b border-white/10 pb-4">
            <h2 className="text-4xl font-bold font-orbitron text-white">CORE <span className="text-oz-emerald">UNIT</span></h2>
            <span className="font-mono text-xs text-gray-500 mb-2">{"// LEVEL 1 CLEARANCE"}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCore.length > 0 ? (
                filteredCore.map((m, i) => (
                  <HoloCard key={`${selectedYear}-core-${i}-${m.name}`} member={m} rank="CORE" />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500 font-mono">No core members found.</div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* 3. EXECUTIVE SECTION */}
        <section>
          <div className="flex items-end gap-4 mb-12 border-b border-white/10 pb-4">
            <h2 className="text-4xl font-bold font-orbitron text-white">EXECUTIVE <span className="text-oz-gold">UNIT</span></h2>
            <span className="font-mono text-xs text-gray-500 mb-2">{"// LEVEL 2 CLEARANCE"}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredExec.length > 0 ? (
                filteredExec.map((m, i) => (
                  <HoloCard key={`${selectedYear}-exec-${i}-${m.name}`} member={m} rank="EXEC" />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500 font-mono">No executive members found.</div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </main>
    </div>
  );
}