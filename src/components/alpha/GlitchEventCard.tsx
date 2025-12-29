"use client";
import { motion } from "framer-motion";

interface EventCardProps {
  title: string;
  category: string;
  description: string;
  index: number;
}

export const GlitchEventCard = ({ title, category, description, index }: EventCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative h-full"
    >
      {/* Animated Border Gradient */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-oz-emerald via-teal-500 to-oz-gold opacity-20 group-hover:opacity-100 transition-opacity duration-500 blur-sm rounded-2xl" />
      
      {/* Card Content */}
      <div className="relative h-full bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 overflow-hidden flex flex-col">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        {/* Hover Glitch Effect Overlay */}
        <div className="absolute inset-0 bg-oz-emerald/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-mono text-oz-gold border border-oz-gold/30 px-2 py-1 rounded bg-oz-gold/5 uppercase tracking-widest">
              {category}
            </span>
            <span className="text-gray-600 font-mono text-xs">0{index + 1}</span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-3 font-orbitron group-hover:text-oz-emerald transition-colors">
            {title}
          </h3>
          
          <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
            {description}
          </p>

          <button className="w-full py-3 rounded-lg border border-white/20 text-white font-medium text-sm group-hover:bg-oz-emerald group-hover:text-black group-hover:border-transparent transition-all duration-300 shadow-lg">
            EXPLORE MODULE &rarr;
          </button>
        </div>
      </div>
    </motion.div>
  );
};