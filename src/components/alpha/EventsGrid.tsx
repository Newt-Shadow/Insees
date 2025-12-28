"use client";
import { motion } from "framer-motion";
import { alphaContent } from "@/data/alphaCrescendoData";
import { ArrowUpRight } from "lucide-react";

export const EventsGrid = () => {
  return (
    <section className="py-24 px-4 bg-black/50" id="events">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-oz-emerald via-white to-oz-emerald mb-4">
            The Events
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From the Binary Brick Road to the Emerald City Cup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alphaContent.events.map((event, i) => {
            const Icon = event.icon;
            // Dynamic border colors based on theme
            const borderColor = event.color === 'gold' ? 'group-hover:border-oz-gold' : 
                                event.color === 'ruby' ? 'group-hover:border-red-500' : 
                                'group-hover:border-oz-emerald';
            const iconColor = event.color === 'gold' ? 'text-oz-gold' : 
                              event.color === 'ruby' ? 'text-red-500' : 
                              'text-oz-emerald';

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true, margin: "-50px" }}
                className={`group relative bg-[#050505] rounded-2xl p-8 border border-white/10 ${borderColor} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
              >
                {/* Hover Gradient Background */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-${event.color === 'gold' ? 'yellow-500' : 'emerald-500'} to-transparent rounded-2xl`} />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-lg bg-white/5 ${iconColor}`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-500 border border-white/10 px-2 py-1 rounded">
                      {event.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-white transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                    {event.description}
                  </p>

                  <button className="flex items-center gap-2 text-sm font-semibold text-gray-300 group-hover:text-white transition-colors mt-auto">
                    View Details <ArrowUpRight size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};