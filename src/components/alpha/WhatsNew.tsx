"use client";
import { motion } from "framer-motion";
import { alphaContent } from "@/data/alphaCrescendoData";
import { Sparkles } from "lucide-react";

export const WhatsNew = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-oz-gold/10 rounded-full blur-[100px]" />
      
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-2xl border border-oz-gold/20 rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-oz-gold to-transparent" />
          
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-oz-gold/20 text-oz-gold mb-6">
                <Sparkles size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">New This Year</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{alphaContent.whatsNew.title}</h2>
              <p className="text-gray-400">{alphaContent.whatsNew.description}</p>
            </div>

            <div className="md:w-2/3 grid gap-6">
              {alphaContent.whatsNew.points.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-black/20 border border-white/5 hover:border-oz-gold/30 transition-colors"
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-oz-gold flex-shrink-0" />
                  <p className="text-gray-200 text-lg leading-relaxed">{point}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};