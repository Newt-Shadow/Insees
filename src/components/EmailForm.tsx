"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const EmailForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSuccess(true);
        setError(null);
        setEmail("");
        setSubmitted(true);
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
    <>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="input-stroke mt-8 w-full sm:w-[95vw] md:w-[90vw] lg:w-[80vw] xl:w-[70vw] max-w-[640px] rounded-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 flex items-center gap-1 sm:gap-2 bg-black/20"
      >
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="enter your email address"
          className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 focus:outline-none text-xs sm:text-sm md:text-base lg:text-lg"
        />
        <button
          type="submit"
          className="relative isolate rounded-full px-3 py-1 sm:px-4 sm:py-1.5 md:px-5 md:py-2 lg:px-6 lg:py-2.5 font-semibold text-black text-xs sm:text-sm md:text-base lg:text-lg transition-transform active:scale-[.98] cursor-pointer"
        >
          <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-emerald-400 to-sky-500" />
          {submitted ? "Thanks!" : "Let's Talk"}
        </button>
      </motion.form>

      {/* ✅ Success Toast */}
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
            <span className="font-medium">Yoohoo !</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ❌ Failure Toast */}
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
    </>
  );
};
