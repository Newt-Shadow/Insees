"use client";
import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import Resources, { Semester } from "@/components/Resources"; // Import the component
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function ResourcesPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Data from JSON API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/resources");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setSemesters(data.semesters);
      } catch (err) {
        console.error("Failed to fetch resources:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white selection:bg-oz-emerald selection:text-black">
      <Navbar />
      
      <div className="max-w-4xl mx-auto pt-32 px-6 pb-20">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-orbitron font-bold mb-4 bg-gradient-to-b from-white via-gray-200 to-gray-600 bg-clip-text text-transparent"
          >
            KNOWLEDGE HUB
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 font-mono text-sm uppercase tracking-widest"
          >
            {"// Centralized Academic Database"}
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mb-12 group"
        >
          <div className="absolute inset-0 bg-oz-emerald blur-xl opacity-10 group-focus-within:opacity-20 transition duration-500" />
          <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 focus-within:border-oz-emerald/50 transition-colors shadow-lg">
            <Search className="text-gray-500 mr-4 group-focus-within:text-oz-emerald transition-colors" />
            <input
              type="text"
              placeholder="Search subjects (e.g., 'Maths', 'PYQ') or files..."
              className="bg-transparent w-full focus:outline-none text-white placeholder-gray-600 font-mono"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="text-xs text-gray-500 hover:text-white uppercase font-mono ml-2"
              >
                Clear
              </button>
            )}
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {loading ? (
             <div className="text-center text-gray-600 py-10 font-mono flex flex-col items-center gap-4 animate-pulse">
               <div className="w-6 h-6 border-2 border-oz-emerald border-t-transparent rounded-full animate-spin" />
               INITIALIZING DATABASE...
             </div>
          ) : (
             <Resources semesters={semesters} searchQuery={search} />
          )}
        </div>

      </div>
    </div>
  );
}