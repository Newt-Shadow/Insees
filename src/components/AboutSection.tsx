"use client";
import React from "react";

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-gray-200 mb-12">
        About INSEES
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-neutral-900/70 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-white/20 transition"
          >
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <span className="text-2xl">📅</span> Lorem {i}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
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
