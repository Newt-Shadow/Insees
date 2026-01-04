"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { usePreloader } from "@/app/context/PreloaderContext";

export default function PreLoader() {
  const { hasLoaded, setHasLoaded, targetLabel } = usePreloader();
  const [currentLine, setCurrentLine] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  // --- Dynamic Boot Sequence Generator ---
  const bootSequence = useMemo(() => {
    const base = ["INITIALIZING KERNEL...", "LOADING MODULES: [OZ_CORE, GLITCH_UI]"];

    // Determine context (either from click trigger or current URL on refresh)
    let context = targetLabel;

    // If default "SYSTEM" (initial load), try to guess based on URL
    if (context === "SYSTEM") {
      if (pathname.includes("team")) context = "TEAM";
      else if (pathname.includes("alpha")) context = "ALPHA CRESCENDO";
      else if (pathname.includes("events")) context = "EVENTS";
      else if (pathname.includes("gallery")) context = "GALLERY";
      else if (pathname.includes("resources")) context = "RESOURCES";
      else if (pathname.includes("contact")) context = "CONTACT";
      else if (pathname === "/") context = "HOME";
    }

    switch (context) {
      case "HOME":
        return [...base, "ESTABLISHING UPLINK TO NIT SILCHAR...", "RENDERING MAIN HUB...", "WELCOME USER."];
      case "ALPHA CRESCENDO":
        return [...base, "CONNECTING TO EMERALD CITY...", "LOADING FESTIVAL ASSETS...", "OPENING THE GATES..."];
      case "TEAM":
        return [...base, "DECRYPTING PERSONNEL DATABASE...", "FETCHING AGENT PROFILES...", "ACCESS GRANTED."];
      case "EVENTS":
        return [...base, "LOADING TIMELINE...", "SYNCING SCHEDULES...", "EVENTS CALIBRATED."];
      case "GALLERY":
        return [...base, "RETRIEVING VISUAL ARCHIVES...", "PROCESSING IMAGE DATA...", "DISPLAYING LOGS."];
      case "RESOURCES":
        return [...base, "ACCESSING KNOWLEDGE BANK...", "DOWNLOADING SCHEMATICS...", "LIBRARY OPEN."];
      case "CONTACT":
        return [...base, "ESTABLISHING UPLINK...", "ENCRYPTING CHANNEL...", "COMMS LINK READY..."];
      case "LOGIN":
        return [...base, "AUTHENTICATION PROTOCOL...", "SECURE GATEWAY...", "ACCESS STANDBY.",];
      default:
        return [...base, "ESTABLISHING SECURE CONNECTION...", "SYSTEM READY."];
    }
  }, [targetLabel, pathname]);

  // --- Animation Logic ---
  useEffect(() => {
    if (!hasLoaded) {
      setIsVisible(true);
      setCurrentLine(0);
    } else {
      setIsVisible(false);
    }
  }, [hasLoaded]);

  useEffect(() => {
    if (!isVisible) return;

    if (currentLine < bootSequence.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentLine((prev) => prev + 1);
      }, 400 + Math.random() * 300);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setHasLoaded(true);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, isVisible, bootSequence, setHasLoaded]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[9999] bg-black text-oz-emerald font-mono flex flex-col items-center justify-center p-8 cursor-none"
      >
        <div className="w-full max-w-md space-y-2">
          {bootSequence.slice(0, currentLine + 1).map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm md:text-base border-l-2 border-oz-emerald pl-4"
            >
              <span className="text-gray-500 mr-2">{`>`}</span>
              {line}
            </motion.div>
          ))}
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-3 h-5 bg-oz-emerald mt-2 ml-6"
          />
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-10 left-10 right-10 max-w-xl mx-auto">
          <div className="h-1 bg-gray-800 w-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
              className="h-full bg-oz-emerald shadow-[0_0_10px_#50C878]"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
            <span>MODULE: {targetLabel === "SYSTEM" ? "CORE" : targetLabel}</span>
            <span>STATUS: LOADING...</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}