// ❌ remove "use client"
import React from "react";

export const ContactSection = () => {
  return (
    <section
      id="contact"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-gray-200 mb-4">
        Contact Us
      </h2>
      <div className="h-[3px] w-[300px] bg-gradient-to-r from-emerald-400 to-sky-500 rounded-full mb-12" />

      <form className="flex flex-col gap-6 w-full max-w-xl">
        <div>
          <label className="block text-lg font-medium mb-2">Email</label>
          <input
            type="email"
            placeholder="enter your email address"
            className="w-full rounded-full px-5 py-3 bg-transparent border border-emerald-400/50 text-white placeholder-gray-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Message</label>
          <textarea
            placeholder="Your Message"
            className="w-full rounded-2xl px-5 py-3 bg-transparent border border-emerald-400/50 text-white placeholder-gray-500 focus:outline-none h-32"
          />
        </div>
        <button
          type="submit"
          className="self-start rounded-full px-8 py-3 font-semibold bg-gradient-to-r from-emerald-400 to-sky-500 text-black hover:opacity-90"
        >
          Lets Talk
        </button>
      </form>
    </section>
  );
};
