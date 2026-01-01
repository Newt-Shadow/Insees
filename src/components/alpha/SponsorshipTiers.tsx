"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

const TIERS = [
  {
    name: "Tier 5",
    price: "10K",
    features: [true, true, false, false, false, false, false, false]
  },
  {
    name: "Tier 4",
    price: "15K",
    features: [true, true, false, true, false, false, false, false]
  },
  {
    name: "Tier 3",
    price: "20K",
    features: [true, true, true, true, true, false, false, false]
  },
  {
    name: "Tier 2",
    price: "30K",
    features: [true, true, true, true, true, true, false, false]
  },
  {
    name: "Tier 1",
    price: "40K",
    features: [true, true, true, true, true, true, true, true]
  }
];

const FEATURE_NAMES = [
  "Branding Logo on Posters",
  "Social Media & Website Mention",
  "Stickers Distribution",
  "Logo on Merchandise",
  "Certificate Branding",
  "Speaker Session Shoutout",
  "Title Sponsor Status",
  "Logo on Event T-Shirts"
];

export const SponsorshipTiers = () => {
  const [selectedTier, setSelectedTier] = useState(4); // Default to Tier 1 (index 4)

  return (
    <section className="py-24 px-4 bg-zinc-950" id="sponsors">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">
            PARTNERSHIP <span className="text-oz-gold">MATRIX</span>
          </h2>
          <p className="text-gray-400">Select a tier to view exclusive benefits and ROI.</p>
        </div>

        {/* Desktop View: Interactive Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Tier Selector */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {TIERS.map((tier, idx) => (
              <button
                key={tier.name}
                onClick={() => setSelectedTier(idx)}
                className={`p-6 rounded-xl border text-left transition-all duration-300 group ${
                  selectedTier === idx 
                    ? "bg-oz-emerald/10 border-oz-emerald text-white shadow-[0_0_20px_rgba(80,200,120,0.2)]" 
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold font-orbitron">{tier.name}</span>
                  <span className={`text-xl font-bold ${selectedTier === idx ? 'text-oz-gold' : 'text-gray-500'}`}>
                    INR {tier.price}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Details Card */}
          <div className="lg:col-span-8 bg-black border border-white/10 rounded-2xl p-8 lg:p-12 relative overflow-hidden">
             {/* Background Glow */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-oz-emerald/10 blur-[100px] rounded-full pointer-events-none" />

             <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTier}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-baseline gap-4 mb-8 border-b border-white/10 pb-8">
                    <h3 className="text-3xl font-bold text-white">{TIERS[selectedTier].name} Package</h3>
                    <span className="text-2xl text-oz-gold font-mono">INR {TIERS[selectedTier].price}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    {TIERS[selectedTier].features.map((hasFeature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          hasFeature ? "bg-oz-emerald/20 text-oz-emerald" : "bg-red-500/10 text-red-500/50"
                        }`}>
                          {hasFeature ? <Check size={14} /> : <X size={14} />}
                        </div>
                        <span className={hasFeature ? "text-gray-200" : "text-gray-600 line-through"}>
                          {FEATURE_NAMES[i]}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button className="mt-12 w-full hover:cursor-pointer py-4 bg-oz-emerald text-amber-100 font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(80,200,120,0.4)]">
                    DOWNLOAD PROSPECTUS
                  </button>
                </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};