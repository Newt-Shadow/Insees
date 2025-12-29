"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, CheckCircle2, AlertCircle } from "lucide-react";

export const EmailForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        const { error } = await res.json();
        setErrorMessage(error || "Transmission failed.");
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setErrorMessage("Network uplink failed.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="w-full py-4 flex flex-col items-center">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="relative group w-full max-w-lg"
      >
        {/* Glowing Background Blur */}
        <div className="absolute -inset-1 bg-gradient-to-r from-oz-emerald via-teal-500 to-cyan-500 rounded-full opacity-20 group-focus-within:opacity-70 blur transition duration-500" />
        
        <div className="relative flex items-center  bg-black/80 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-2xl ring-1 ring-white/5 group-focus-within:ring-oz-emerald/50 transition-all">
          
          <div className="pl-4 pr-2 text-gray-500 group-focus-within:text-oz-emerald transition-colors">
            <Mail size={18} />
          </div>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            type="email"
            placeholder="Initialize contact protocol..."
            className="flex-1 bg-transparent text-white placeholder-gray-600 px-2 py-3 focus:outline-none font-mono text-sm disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="relative overflow-hidden  rounded-full px-6 py-2.5 font-bold text-sm text-zinc-500 transition-all hover:scale-105 active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {/* Animated Button Background */}
            <div className={`absolute inset-0 transition-colors duration-300 ${
               status === "success" ? "bg-green-500" :
               status === "error" ? "bg-red-500" :
               "bg-oz-emerald"
            }`} />
            
            <div className="relative flex items-center gap-2">
              {status === "loading" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : status === "success" ? (
                <>SENT <CheckCircle2 size={16} /></>
              ) : status === "error" ? (
                <>RETRY <AlertCircle size={16} /></>
              ) : (
                <>CONNECT <span className="hidden sm:inline">→</span></>
              )}
            </div>
          </button>
        </div>
      </motion.form>

      {/* --- STATUS TOASTS --- */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono flex items-center gap-2"
          >
            <CheckCircle2 size={14} />
            <span>TRANSMISSION RECEIVED. WELCOME TO THE NETWORK.</span>
          </motion.div>
        )}
        
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2"
          >
            <AlertCircle size={14} />
            <span>ERROR: {errorMessage.toUpperCase()}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};