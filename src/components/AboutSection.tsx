"use client";
import React from "react";

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-12"
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-200 mb-8 sm:mb-10 md:mb-12 text-center">
        About INSEES
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-7xl">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-neutral-900/70 border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col gap-3 sm:gap-4 hover:border-white/20 transition"
          >
            <h3 className="flex items-center gap-2 text-base sm:text-lg md:text-xl font-semibold">
              <span className="text-xl sm:text-2xl md:text-3xl">📅</span> Lorem {i}
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};