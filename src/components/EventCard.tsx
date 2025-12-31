"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Calendar, MapPin, ArrowUpRight, Clock, Zap, CheckCircle2, Radio, Signal 
} from "lucide-react";

// Shared Types
export type EventStatus = "upcoming" | "live" | "completed";

export interface EventProps {
  id: string | number;
  title: string;
  description: string;
  category: string;
  date: string | Date;
  year: string;
  status: EventStatus;
  image: string;
  location: string;
  // ✅ ADDED THESE OPTIONAL FIELDS TO FIX THE ERROR
  fullDescription?: string;
  sponsor?: string;
  registrationLink?: string;
  registrationEnabled?: boolean;
  registrationOpen?: string;
}

const StatusBadge = ({ status }: { status: EventStatus }) => {
  const config = {
    upcoming: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: <Clock size={12} />, label: "INCOMING" },
    live: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: <Radio size={12} className="animate-pulse" />, label: "LIVE" },
    completed: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: <CheckCircle2 size={12} />, label: "COMPLETED" },
  };
  const style = config[status] || config.upcoming;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-sm border ${style.bg} ${style.border} ${style.color} text-[10px] font-mono font-bold tracking-widest uppercase shadow-[0_0_10px_inset] shadow-current/20`}>
      {style.icon}
      {style.label}
    </div>
  );
};

export const EventCard = ({ event, onClick }: { event: EventProps; onClick?: () => void }) => (
  <motion.div
    layoutId={`card-${event.id}`}
    onClick={onClick}
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="group relative h-[420px] cursor-pointer w-full"
  >
    <div className="absolute inset-0 border border-white/10 rounded-xl bg-zinc-900/50 overflow-hidden transition-all duration-300 group-hover:border-oz-emerald/50 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]">
      
      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start bg-gradient-to-b from-black/90 to-transparent">
          <StatusBadge status={event.status} />
          <span className="text-[10px] font-mono text-gray-400 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 flex items-center gap-1">
            <Signal size={10} className={event.status === 'live' ? 'text-red-500' : 'text-gray-600'} />
            {event.category}
          </span>
      </div>

      {/* Image */}
      <div className="h-3/5 w-full relative bg-zinc-800">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10" />
          {event.image ? (
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-700 font-mono text-xs">NO VISUAL</div>
          )}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black via-black/90 to-transparent pt-12">
          <h3 className="text-xl font-bold text-white font-orbitron mb-2 group-hover:text-oz-emerald transition-colors truncate">
            {event.title || "UNTITLED EVENT"}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 mb-4">
            {event.description || "No description provided."}
          </p>
          
          <div className="flex items-center justify-between text-xs font-mono text-gray-500 border-t border-white/10 pt-4">
            <span className="flex items-center gap-1 text-oz-emerald/80">
              <Calendar size={12}/> 
              {event.date ? new Date(event.date).toLocaleDateString() : "TBA"}
            </span>
            <span className="group-hover:translate-x-1 transition-transform text-white flex items-center gap-1 font-bold">
              ACCESS DATA <ArrowUpRight size={12}/>
            </span>
          </div>
      </div>
    </div>
  </motion.div>
);