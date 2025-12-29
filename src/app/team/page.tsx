"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Github, Linkedin, Instagram, Search, Terminal as TerminalIcon, Shield, Zap } from "lucide-react";
import Image from "next/image";

// --- TYPES ---
interface Member {
  name: string;
  por: string;
  img: string;
  socials: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
  };
}

interface TeamData {
  [year: string]: {
    core: Member[];
    executive: Member[];
  };
}

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




// --- HOLO CARD COMPONENT ---
const HoloCard = ({ member, rank }: { member: Member, rank: "CORE" | "EXEC" }) => {
  const idRef = useRef(
  Math.random().toString(36).substr(2, 6).toUpperCase()
);
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
      <div className={`absolute -inset-0.5 opacity-30 group-hover:opacity-100 blur transition duration-500 rounded-xl bg-gradient-to-b ${rank === "CORE" ? "from-oz-emerald via-teal-400 to-cyan-500" : "from-oz-gold via-orange-400 to-yellow-200"}`} />
      
      <div className="relative h-full bg-black/90  border border-white/10 p-6 rounded-xl flex flex-col items-center overflow-hidden shadow-2xl backface-hidden">
        
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 group-hover:opacity-20 transition-opacity" />
        
        {/* Scanning Line Effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-oz-emerald/50 shadow-[0_0_15px_rgba(80,200,120,0.8)] animate-scan opacity-0 group-hover:opacity-100 pointer-events-none" />

        {/* Rank Badge */}
        <div className={`absolute top-4 right-4 text-[10px] font-mono border px-2 py-0.5 rounded backdrop-blur-md z-20 ${
          rank === "CORE" 
            ? "border-oz-emerald/50 text-oz-emerald bg-oz-emerald/10" 
            : "border-oz-gold/50 text-oz-gold bg-oz-gold/10"
        }`}>
          {rank === "CORE" ? "LVL_1 // ADMIN" : "LVL_2 // EXEC"}
        </div>

        {/* Image Container with Ring */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mb-4 sm:mb-6 mt-10 sm:mt-6 lg:mt-4 shrink-0">


          <div className="absolute inset-0 rounded-full border border-white/10" />
          {/* Rotating Rings */}
          <div className={`absolute inset-[-4px] border-2 border-dashed rounded-full animate-spin-slow ${rank === "CORE" ? "border-oz-emerald/40" : "border-oz-gold/40"}`} />
          <div className="absolute inset-[-6px] sm:inset-[-10px] lg:inset-[-12px] border border-white/5 rounded-full animate-reverse-spin opacity-50" />

          
          <div className="w-full h-full rounded-full overflow-hidden relative z-10 bg-zinc-900">
             <Image 
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
          <p className={`font-mono text-xs uppercase tracking-[0.2em] mb-6 ${rank === "CORE" ? "text-oz-emerald" : "text-oz-gold"}`}>
            {member.por}
          </p>
          
          {/* Social Nodes */}
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
            {member.socials.github && (
               <a href={member.socials.github} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white hover:text-black transition-all duration-300 hover:scale-110">
                 <Github size={18} />
               </a>
            )}
          </div>
        </div>
        
        {/* Decorative Data Footer */}
        <div className="w-full flex justify-between items-center mt-6 pt-4 border-t border-white/5 text-[9px] text-gray-600 font-mono">
           <span>ID: {idRef.current}</span>

           <span>STATUS: <span className="text-green-500 animate-pulse">ONLINE</span></span>
        </div>
      </div>
    </TiltCard>
  </motion.div>
);
}

// --- SKELETON LOADER ---
const TeamSkeleton = () => (
  <div className="w-full min-h-[320px] sm:min-h-[360px] lg:min-h-[400px] rounded-xl border border-white/10 bg-zinc-900/50 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
    <div className="p-6 flex flex-col items-center h-full">
      <div className="w-40 h-40 rounded-full bg-white/5 mb-6 animate-pulse" />
      <div className="w-3/4 h-8 bg-white/5 rounded mb-4 animate-pulse" />
      <div className="w-1/2 h-4 bg-white/5 rounded animate-pulse" />
    </div>
  </div>
);

export default function TeamPage() {
  const [teamData, setTeamData] = useState<TeamData>({});
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/team")
      .then((res) => res.json())
      .then((data: TeamData) => {
        setTeamData(data);
        const years = Object.keys(data).sort();
        if (years.length > 0) setSelectedYear(years[years.length - 1]);
        // Reduced artificial delay for snappier load
        setTimeout(() => setIsLoading(false), 500);
      })
      .catch(err => {
         console.error("Failed to fetch team data", err);
         setIsLoading(false);
      });
  }, []);

  // Filter Logic
  const filterMembers = (members: Member[]) => {
    if (!searchQuery) return members;
    return members.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.por.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (!selectedYear && !isLoading) return null;

  const currentData = teamData[selectedYear] || { core: [], executive: [] };
  const filteredCore = filterMembers(currentData.core || []);
  const filteredExec = filterMembers(currentData.executive || []);

  return (
    <div className="bg-black min-h-screen text-white selection:bg-oz-emerald selection:text-black overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#111_0%,#000_100%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        
        {/* Floating Particles */}
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
      <div className="sticky top-20 z-40 bg-black/80  border-y border-white/10 py-4 mb-12 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-oz-emerald font-mono text-xs">SYSTEM ONLINE</span>
             <div className="h-4 w-px bg-white/20 mx-2" />
             <span className="text-gray-500 font-mono text-xs">{selectedYear ? `SESSION ${selectedYear}` : 'INITIALIZING...'}</span>
          </div>

          {/* Search & Filter */}
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
                  {Object.keys(teamData).sort().reverse().map((year) => (
                    <option key={year} value={year}>SESSION {year}</option>
                  ))}
                </select>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-32 space-y-24">
        
        {/* CORE SECTION */}
        <section>
          <div className="flex items-end gap-4 mb-12 border-b border-white/10 pb-4">
            <h2 className="text-4xl font-bold font-orbitron text-white">CORE <span className="text-oz-emerald">UNIT</span></h2>
            <span className="font-mono text-xs text-gray-500 mb-2">{"// LEVEL 1 CLEARANCE"}</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <TeamSkeleton key={i} />)
              ) : filteredCore.length > 0 ? (
                filteredCore.map((m, i) => (
                  <HoloCard key={`${selectedYear}-core-${i}`} member={m} rank="CORE" />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500 font-mono">No core members found.</div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* EXECUTIVE SECTION */}
        <section>
          <div className="flex items-end gap-4 mb-12 border-b border-white/10 pb-4">
            <h2 className="text-4xl font-bold font-orbitron text-white">EXECUTIVE <span className="text-oz-gold">UNIT</span></h2>
            <span className="font-mono text-xs text-gray-500 mb-2">{"// LEVEL 2 CLEARANCE"}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <TeamSkeleton key={i} />)
              ) : filteredExec.length > 0 ? (
                filteredExec.map((m, i) => (
                  <HoloCard key={`${selectedYear}-exec-${i}`} member={m} rank="EXEC" />
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