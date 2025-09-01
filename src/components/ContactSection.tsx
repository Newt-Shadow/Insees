"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const ContactSection = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      if (res.ok) {
        setSuccess(true);
        setError(null);
        setEmail("");
        setMessage("");
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const { error } = await res.json();
        setError(error || "Something went wrong.");
        setSuccess(false);
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setSuccess(false);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-gray-200 mb-4">
        Contact Us
      </h2>
      <div className="h-[3px] w-[300px] bg-gradient-to-r from-emerald-400 to-sky-500 rounded-full mb-12" />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-xl"
      >
        <div>
          <label className="block text-lg font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter your email address"
            className="w-full rounded-full px-5 py-3 bg-black/30 backdrop-blur-md border border-emerald-400/50 text-white placeholder-gray-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your Message"
            className="w-full rounded-2xl px-5 py-3 bg-black/30 backdrop-blur-md border border-emerald-400/50 text-white placeholder-gray-500 focus:outline-none h-32"
          />
        </div>
        <button
          type="submit"
          className="relative isolate rounded-full px-8 py-3 font-semibold text-black text-lg transition-transform active:scale-[.98] cursor-pointer"
        >
          <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-emerald-400 to-sky-500" />
          Let’s Talk
        </button>
      </form>

      {/* 🎉 Success Toast */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-8 right-8 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-emerald-400/50 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-2"
          >
            <span className="text-2xl">🎉</span>
            <span className="font-medium">Your message has been sent!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚠️ Failure Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-8 right-8 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-red-500/50 text-red-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-2"
          >
            <span className="text-2xl">⚠️</span>
            <span className="font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
