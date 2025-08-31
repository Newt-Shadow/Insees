"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

export const EmailForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isExtraSmall = useMediaQuery({ maxWidth: 375 }); // For very small devices like iPhone SE (320-375px)
  const isSmall = useMediaQuery({ minWidth: 376, maxWidth: 639 }); // Small phones like iPhone 10-16, Samsung A/M
  const isMedium = useMediaQuery({ minWidth: 640, maxWidth: 767 }); // Larger phones, foldables folded, small tablets
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // iPads, foldables unfolded, small laptops
  const isLarge = useMediaQuery({ minWidth: 1024 }); // Desktops, laptops, large screens

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2400);
  };

  // Base classes
  let formClass = "input-stroke mt-8 rounded-full flex items-center gap-2 bg-black/20";
  let inputClass = "flex-1 bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none";
  let buttonClass = "relative isolate rounded-full font-semibold text-black transition-transform active:scale-[.98]";
  let buttonContent = submitted ? "Thanks!" : "Lets Talk";

  // Adjust widths, paddings, and text sizes based on screen size without altering proportions
  if (isExtraSmall) {
    formClass += " w-full max-w-[320px] px-1 py-1";
    inputClass += " px-2 py-1 text-[13px]";
    buttonClass += " px-3 py-1 text-[13px]";
  } else if (isSmall) {
    formClass += " w-[90vw] max-w-[375px] px-2 py-2";
    inputClass += " px-3 py-2 text-[14px]";
    buttonClass += " px-4 py-2 text-[14px]";
  } else if (isMedium) {
    formClass += " w-[88vw] max-w-[480px] px-2 py-2";
    inputClass += " px-4 py-2 text-[15px]";
    buttonClass += " px-5 py-2 text-[15px]";
  } else if (isTablet) {
    formClass += " w-[86vw] max-w-[640px] px-3 py-2";
    inputClass += " px-4 py-2 text-base";
    buttonClass += " px-6 py-[10px] text-base";
  } else if (isLarge) {
    formClass += " w-[80vw] max-w-[700px] px-4 py-2";
    inputClass += " px-5 py-2 text-lg";
    buttonClass += " px-7 py-2 text-lg";
  } else {
    // Default fallback (similar to original)
    formClass += " w-[86vw] max-w-[640px] px-2 py-2 md:px-3 md:py-2";
    inputClass += " px-4 py-2 text-[15px] md:text-base";
    buttonClass += " px-5 md:px-6 py-2 md:py-[10px]";
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className={formClass}
    >
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="enter your email address"
        className={inputClass}
      />
      <button type="submit" className={buttonClass}>
        <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-emerald-400 to-sky-500" />
        {buttonContent}
      </button>
    </motion.form>
  );
};