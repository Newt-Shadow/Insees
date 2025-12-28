"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // Import createPortal
import { motion, AnimatePresence } from "framer-motion";
import { alphaContent } from "@/data/alphaCrescendoData";
import { ArrowUpRight, X, Trophy, Users, Phone, FileText } from "lucide-react";
import Image from "next/image";

// Magic Particle Component
const MagicDust = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-oz-gold rounded-full"
        initial={{ opacity: 0, y: "100%", x: Math.random() * 100 + "%" }}
        animate={{ 
          opacity: [0, 1, 0], 
          y: "0%", 
          x: (Math.random() - 0.5) * 50 + "%" 
        }}
        transition={{ 
          duration: 2 + Math.random() * 3, 
          repeat: Infinity, 
          delay: Math.random() * 2 
        }}
      />
    ))}
  </div>
);

export const EventsGrid = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Ensure portal only runs on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to safely get the event
  const getSelectedEvent = () => alphaContent.events.find(e => e.id === selectedId);

  return (
    <section className="py-24 px-4 bg-black/80 relative" id="events">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-oz-emerald via-white to-oz-emerald mb-4 font-orbitron tracking-wider">
            THE EVENTS
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-poppins">
            From the Binary Brick Road to the Emerald City Cup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {alphaContent.events.map((event) => (
            <motion.div
              layoutId={`card-${event.id}`}
              key={event.id}
              onClick={() => setSelectedId(event.id)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative bg-[#080808] hover:scale-105  rounded-3xl p-6 border border-white/10 hover:border-oz-emerald/50 transition-all duration-500 cursor-pointer overflow-hidden hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
            >
              {/* Magic Dust on Card */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <MagicDust />
              </div>

              <div className="flex justify-between  items-start mb-8 relative z-10">
                <div className="p-3 bg-white/5 rounded-2xl text-oz-emerald group-hover:scale-110 transition-transform duration-300">
                  <event.icon size={28} />
                </div>
                <span className="px-3 py-1 rounded-full border border-white/10 text-[10px] uppercase tracking-widest text-gray-400">
                  {event.category}
                </span>
              </div>

              <motion.h3 
                layoutId={`title-${event.id}`}
                className="text-2xl font-bold text-white mb-2 font-orbitron group-hover:text-oz-gold transition-colors"
              >
                {event.title}
              </motion.h3>
              
              <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                {event.shortDesc}
              </p>

              <div className="flex items-center gap-2 text-sm font-bold text-oz-emerald">
                View Details <ArrowUpRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* PORTAL IMPLEMENTATION: Renders modal outside the section to avoid overlap */}
        {mounted && createPortal(
          <AnimatePresence>
            {selectedId && getSelectedEvent() && (
              // Z-INDEX UPDATE: z-[9999] ensures it covers everything, including navbar
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedId(null)}
                  className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                />

                {/* Modal */}
                <motion.div
                  layoutId={`card-${selectedId}`}
                  className="w-full max-w-4xl bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-emerald-500/30 relative z-10 flex flex-col md:flex-row max-h-[90vh] shadow-[0_0_100px_rgba(16,185,129,0.2)]"
                >
                  {/* Close Button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 hover:rotate-90 transition-all duration-300 border border-white/10"
                  >
                    <X size={24} />
                  </button>

                  {(() => {
                      const event = getSelectedEvent()!;
                      return (
                          <>
                          {/* Left: Image */}
                          <div className="w-full md:w-2/5 h-64 md:h-auto relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 md:hidden" />
                              <Image 
                                  src={event.image} 
                                  alt={event.title}
                                  fill
                                  className="object-cover"
                              />
                          </div>

                          {/* Right: Content */}
                          <div className="w-full md:w-3/5 p-8 md:p-10 overflow-y-auto custom-scrollbar">
                               <motion.h3 
                                  layoutId={`title-${event.id}`}
                                  className="text-3xl md:text-4xl font-bold text-white mb-2 font-orbitron"
                               >
                                  {event.title}
                               </motion.h3>
                               
                               <div className="flex items-center gap-3 mb-6">
                                  <span className="text-oz-gold text-sm font-mono uppercase tracking-widest bg-oz-gold/10 px-2 py-1 rounded">
                                      {event.category}
                                  </span>
                               </div>

                               <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                  {event.fullDesc}
                               </p>

                               {/* --- CONDITIONAL FIELDS: Won't break if data is missing --- */}
                               {(event.prizePool || event.teamSize) && (
                                 <div className="grid grid-cols-2 gap-4 mb-8">
                                    {event.prizePool && (
                                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                          <div className="flex items-center gap-2 text-emerald-500 mb-1">
                                              <Trophy size={18} /> <span className="text-xs font-bold uppercase">Prize Pool</span>
                                          </div>
                                          <div className="text-xl font-bold text-white">{event.prizePool}</div>
                                      </div>
                                    )}
                                    
                                    {event.teamSize && (
                                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                          <div className="flex items-center gap-2 text-emerald-500 mb-1">
                                              <Users size={18} /> <span className="text-xs font-bold uppercase">Team Size</span>
                                          </div>
                                          <div className="text-xl font-bold text-white">{event.teamSize}</div>
                                      </div>
                                    )}
                                 </div>
                               )}

                               {/* Coordinators Section - Strictly checks if array exists and has items */}
                               {event.coordinators && event.coordinators.length > 0 && (
                                 <div className="mb-8">
                                     <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Coordinators</h4>
                                     <div className="space-y-2">
                                         {event.coordinators.map((coord, i) => (
                                             <div key={i} className="flex items-center gap-3 text-gray-300">
                                                 <Phone size={16} className="text-oz-gold" />
                                                 <span>{coord.name}</span>
                                                 <span className="text-gray-600">|</span>
                                                 <span className="font-mono text-sm">{coord.phone}</span>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                               )}

                               <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                  {/* BUTTON FIX: Used 'bg-oz-emerald' for theme consistency and 'text-black' for contrast */}
                                  <button className="flex-1 py-4 bg-oz-emerald text-white font-bold rounded-xl hover:bg-emerald-400 hover:text-black transition-colors shadow-lg shadow-emerald-900/20">
                                      Register Now
                                  </button>
                                  
                                  {/* Rulebook Button - Only renders if rulebook link exists */}
                                  {event.rulebook && (
                                      <button className="flex-1 py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                                          <FileText size={18} /> Rulebook
                                      </button>
                                  )}
                               </div>
                          </div>
                          </>
                      );
                  })()}
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body // This places the modal at the very end of the DOM
        )}
      </div>
    </section>
  );
};