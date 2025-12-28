"use client";
import { alphaContent } from "@/data/alphaCrescendoData";

export const Sponsors = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-black to-oz-dark/20">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12 text-white">Past Sponsors</h2>
        
        {/* Logo Grid */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-70 mb-20 grayscale hover:grayscale-0 transition-all duration-500">
          {alphaContent.sponsors.past.map((sponsor, i) => (
            <div key={i} className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-white transition-colors">
              {sponsor}
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div className="relative bg-gradient-to-r from-oz-emerald to-teal-800 rounded-3xl p-10 md:p-16 overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Become a Sponsor</h3>
            <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
              {alphaContent.sponsors.cta}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-emerald-900 px-8 py-3 rounded-full font-bold hover:bg-emerald-50 transition-colors">
                Download Prospectus
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
          
          {/* Decorative Circle */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-black/10 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
};