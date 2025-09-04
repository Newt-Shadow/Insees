"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Headline: React.FC = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Welcome Batch of 2025–29!";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.h1
      className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <span
        style={{
          whiteSpace: "pre-wrap", // ✅ allows wrapping on small screens
          wordBreak: "break-word",
          position: "relative",
          display: "inline-block",
        }}
      >
        {typedText}

        {/* shimmer overlay */}
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          style={{
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            animation: "shimmer 3s infinite",
          }}
        />

        {/* blinking caret */}
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: "0.5ch",
            height: "1em",
            marginLeft: "0.25em",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.6))",
            borderRadius: "2px",
            animation: "blink 1s step-end infinite",
          }}
        />
      </span>

      {/* CSS keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </motion.h1>
  );
};

export default Headline;
