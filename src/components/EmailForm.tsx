"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

export const EmailForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2400);
  };

  return (
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
        className="relative isolate rounded-full px-3 py-1 sm:px-4 sm:py-1.5 md:px-5 md:py-2 lg:px-6 lg:py-2.5 font-semibold text-black text-xs sm:text-sm md:text-base lg:text-lg transition-transform active:scale-[.98]"
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-emerald-400 to-sky-500" />
        {submitted ? "Thanks!" : "Let's Talk"}
      </button>
    </motion.form>
  );
};