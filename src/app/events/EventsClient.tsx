"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  X,
  ArrowUpRight,
  Zap,
  Clock,
  CheckCircle2,
  Search,
  Cpu,
  Signal,
  Radio,
  Lock,
} from "lucide-react";

// --- TYPES ---
export type EventStatus = "upcoming" | "live" | "completed";

export interface Event {
  id: string; // ✅ Fixed: Prisma uses String (CUID), not number
  title: string;
  description: string;
  fullDescription: string | null; // Prisma can return null
  category: string;
  date: string | null;
  year: string | null;
  status: string; // We map this to EventStatus
  image: string | null;
  location: string | null;
  sponsor: string | null;
  registrationLink: string | null;
  registrationOpen: string | null;
}

const categories = ["Flagship", "Technical", "Cultural"];
const years = ["2026", "2025", "Archives"];

// --- STATUS BADGE ---
const StatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status as EventStatus; // Type assertion
  
  const config: Record<EventStatus, { color: string; bg: string; border: string; icon: React.ReactNode; label: string }> = {
    upcoming: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: <Clock size={12} />, label: "INCOMING" },
    live: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: <Radio size={12} className="animate-pulse" />, label: "LIVE" },
    completed: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: <CheckCircle2 size={12} />, label: "COMPLETED" },
  };
  const style = config[normalizedStatus] || config.upcoming;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-sm border ${style.bg} ${style.border} ${style.color} text-[10px] font-mono font-bold tracking-widest uppercase shadow-[0_0_10px_inset] shadow-current/20`}>
      {style.icon}
      {style.label}
    </div>
  );
};

// --- EVENT CARD ---
const EventCard = ({ event, onClick }: { event: Event; onClick: () => void }) => {
  const now = new Date();
  const regOpen = event.registrationOpen ? new Date(event.registrationOpen) : null;
  const isRegistrationActive = event.registrationLink && event.status !== 'completed' && (
    event.status === 'live' || (regOpen && now >= regOpen)
  );

  return (
    <motion.div
      layoutId={`card-${event.id}`}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group relative h-[420px] cursor-pointer"
    >
      <div className="absolute inset-0 border border-white/10 rounded-xl bg-zinc-900/50 overflow-hidden transition-all duration-300 group-hover:border-oz-emerald/50 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]">
        <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start bg-gradient-to-b from-black/90 to-transparent gap-2">
          <div className="flex gap-2 flex-wrap">
            <StatusBadge status={event.status} />
            {isRegistrationActive && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-sm border border-emerald-400 bg-emerald-400/15 text-emerald-400 text-[10px] font-mono font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(52,211,153,0.6)] animate-pulse">
                <Zap size={12} className="text-emerald-400" />
                REG OPEN
              </div>
            )}
          </div>
          <span className="text-[10px] font-mono text-gray-400 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 flex items-center gap-1 shrink-0">
            <Signal size={10} className={event.status === 'live' ? 'text-red-500' : 'text-gray-600'} />
            {event.category}
          </span>
        </div>
        <div className="h-3/5 w-full relative">
          <div className="absolute inset-0 z-10" />
          {event.image && (
             <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black via-black/90 to-transparent pt-12">
          <h3 className="text-xl font-bold text-white font-orbitron mb-2 group-hover:text-oz-emerald transition-colors truncate">{event.title}</h3>
          <p className="text-sm text-gray-400 line-clamp-2 mb-4">{event.description}</p>
          <div className="flex items-center justify-between text-xs font-mono text-gray-500 border-t border-white/10 pt-4">
            <span className="flex items-center gap-1 text-oz-emerald/80"><Calendar size={12} /> {event.date ? new Date(event.date).toLocaleDateString() : "TBA"}</span>
            <span className="group-hover:translate-x-1 transition-transform text-white flex items-center gap-1 font-bold">ACCESS DATA <ArrowUpRight size={12} /></span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- EVENT MODAL ---
const EventModal = ({ event, onClose }: { event: Event; onClose: () => void }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
  if (!event || !mounted) return null;

  const now = new Date();
  const regOpen = event.registrationOpen ? new Date(event.registrationOpen) : null;
  const isRegistrationActive = event.registrationLink && event.status !== 'completed' && (
    event.status === 'live' || (regOpen && now >= regOpen)
  );

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4 py-12 md:py-20 text-center sm:p-6">
        <div className="fixed inset-0 transition-opacity" onClick={onClose} aria-hidden="true" />
        <motion.div
          layoutId={`card-${event.id}`}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-oz-emerald/20 z-[10000]"
        >
          <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full hover:bg-white/10 transition-colors border border-white/10 group">
            <X size={20} className="text-white group-hover:rotate-90 transition-transform" />
          </button>

          <div className="w-full md:w-5/12 h-48 md:h-auto relative bg-zinc-900 shrink-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            {event.image && (
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            )}
            {event.sponsor && (
              <div className="absolute bottom-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-white/10">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Powered By</p>
                <p className="text-sm font-bold text-white">{event.sponsor}</p>
              </div>
            )}
          </div>

          <div className="w-full md:w-7/12 p-6 md:p-10 flex flex-col bg-zinc-950/95 backdrop-blur-3xl overflow-y-auto custom-scrollbar">
            <div className="mb-6 flex items-center justify-between pr-8">
              <StatusBadge status={event.status} />
              <span className="text-xs font-mono text-gray-500 border border-white/10 px-2 py-1 rounded hidden sm:inline-block">ID: {event.id.slice(0, 8)}</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold font-orbitron text-white mb-2">{event.title}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 font-mono mb-8 py-4 border-y border-white/5">
              <span className="flex items-center gap-2"><Calendar size={16} className="text-oz-emerald" /> {event.date ? new Date(event.date).toLocaleDateString() : "TBA"}</span>
              <span className="flex items-center gap-2"><MapPin size={16} className="text-oz-emerald" /> {event.location || "On Campus"}</span>
            </div>
            <div className="flex-grow">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Mission Brief</h4>
              <p className="text-gray-300 leading-relaxed mb-8 text-sm md:text-base whitespace-pre-line text-left">
                {event.fullDescription || event.description}
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 shrink-0">
              {isRegistrationActive ? (
                <a href={event.registrationLink || "#"} target="_blank" rel="noreferrer" className="w-full py-4 bg-oz-emerald text-amber-50 hover:text-black font-bold font-orbitron uppercase tracking-wider hover:bg-white transition-all rounded-sm flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] cursor-pointer">
                  <Zap size={18} className="group-hover:fill-black" />
                  INITIALIZE REGISTRATION
                </a>
              ) : event.status === 'completed' ? (
                <div className="w-full py-4 bg-zinc-900/50 text-gray-500 font-mono text-xs uppercase tracking-wider border border-white/10 rounded-sm flex items-center justify-center gap-2"><CheckCircle2 size={14} /> Event Concluded</div>
              ) : (
                <div className="w-full py-4 bg-zinc-900/50 text-gray-500 font-mono text-xs uppercase tracking-wider border border-white/10 rounded-sm flex items-center justify-center gap-2"><Lock size={14} /> Registration Locked</div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>,
    document.body
  );
};

// --- CLIENT COMPONENT MAIN ---
export default function EventsClient({ initialEvents }: { initialEvents: Event[] }) {
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filteredBase = initialEvents.filter((event) => {
    const matchesYear = selectedYear === "All" || event.year === selectedYear;
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
    return matchesYear && matchesCategory && matchesSearch;
  });

  const liveEvents = filteredBase.filter(e => e.status === 'live');
  const upcomingEvents = filteredBase.filter(e => e.status === 'upcoming');
  const completedEvents = filteredBase.filter(e => e.status === 'completed');

  useEffect(() => {
    if (selectedEvent) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = 'unset'; }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedEvent]);

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2 text-oz-emerald font-mono text-xs uppercase tracking-[0.3em]">
            <Cpu size={14} /> System Modules
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-orbitron text-white">EVENTS <span className="text-gray-800">LOG</span></h1>
        </div>
        <div className="mt-6 md:mt-0 w-full md:w-80">
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-sm px-4 py-3 focus-within:border-oz-emerald/50 transition-colors">
            <Search className="text-gray-500 mr-3" size={18} />
            <input type="text" placeholder="Search database..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent w-full focus:outline-none text-white placeholder-gray-600 font-mono text-sm" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-16">
        <div className="flex gap-2">
          {['All', ...years.filter(y => y !== 'Archives')].map((year) => (
            <button key={year} onClick={() => setSelectedYear(year)} className={`px-4 py-2 rounded-sm font-mono text-xs uppercase tracking-wider border transition-all ${selectedYear === year ? "bg-white text-black border-white hover:cursor-pointer font-bold" : "text-gray-500 hover:cursor-pointer border-white/10 hover:border-white/50"}`}>{year}</button>
          ))}
        </div>
        <div className="w-[1px] bg-white/10 h-8 hidden md:block" />
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button onClick={() => setSelectedCategory("All")} className={`px-4 py-2  rounded-full text-xs font-bold border transition-all whitespace-nowrap ${selectedCategory === "All" ? "bg-oz-emerald text-amber-50 border-oz-emerald hover:cursor-pointer"  : "border-white/10 text-gray-400 hover:cursor-pointer hover:border-white"}`}>ALL</button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${selectedCategory === cat ? "bg-zinc-800 text-white border-white hover:cursor-pointer" : "border-white/10 text-gray-400 hover:cursor-pointer hover:border-white"}`}>{cat}</button>
          ))}
        </div>
      </div>

      {/* 1. Live Events */}
      {liveEvents.length > 0 && (
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h2 className="text-2xl font-bold font-orbitron tracking-wide text-white">LIVE TRANSMISSIONS</h2>
            <div className="h-[1px] bg-gradient-to-r from-red-500/50 to-transparent flex-grow ml-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {liveEvents.map((event) => (
                <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 2. Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <Clock size={16} className="text-blue-400" />
            <h2 className="text-2xl font-bold font-orbitron tracking-wide text-white">INCOMING SIGNALS</h2>
            <div className="h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent flex-grow ml-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 3. Completed Events */}
      {completedEvents.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Signal size={16} className="text-gray-500" />
            <h2 className="text-2xl font-bold font-orbitron tracking-wide text-gray-400">ARCHIVE LOG</h2>
            <div className="h-[1px] bg-white/10 flex-grow ml-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-80 hover:opacity-100 transition-opacity">
            {completedEvents.map((event) => (
              <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredBase.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-2xl bg-white/5">
          <Cpu size={48} className="text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-white">No Events Found</h3>
          <p className="text-gray-500 mb-6">No signals detected for the current parameters.</p>
          <button onClick={() => { setSelectedYear("All"); setSelectedCategory("All"); setSearch(""); }} className="text-oz-emerald hover:underline font-mono text-sm">RESET SYSTEM</button>
        </div>
      )}

      <AnimatePresence>
        {selectedEvent && (
          <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}