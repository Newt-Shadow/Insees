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
      className="input-stroke mt-8 w-[86vw] max-w-[640px] rounded-full px-2 py-2 md:px-3 md:py-2 flex items-center gap-2 bg-black/20"
    >
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="enter your email address"
        className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 px-4 py-2 focus:outline-none text-[15px] md:text-base"
      />
      <button
        type="submit"
        className="relative isolate rounded-full px-5 md:px-6 py-2 md:py-[10px] font-semibold text-black transition-transform active:scale-[.98]"
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-emerald-400 to-sky-500" />
        {submitted ? "Thanks!" : "Lets Talk"}
      </button>
    </motion.form>
  );
};
