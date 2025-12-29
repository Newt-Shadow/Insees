"use client";
import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FolderOpen, FileText, ChevronDown, ChevronRight } from "lucide-react";

type FileType = { name: string; url: string };
type Subject = { name: string; driveLink?: string; files: FileType[] };
type Semester = { title: string; subjects: Subject[] };

// Data Chip Component (Accordion)
const SemesterChip = ({ sem, searchQuery }: { sem: Semester; searchQuery: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter logic
  const filteredSubjects = sem.subjects.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sub.files.some(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Auto-open if search matches
  useEffect(() => {
    if (searchQuery && filteredSubjects.length > 0) setIsOpen(true);
  }, [searchQuery, filteredSubjects.length]);

  if (searchQuery && filteredSubjects.length === 0) return null;

  return (
    <div className="mb-4 border border-white/10 rounded-xl overflow-hidden bg-white/5 hover:border-oz-emerald/30 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${isOpen ? 'bg-oz-emerald text-black' : 'bg-white/10 text-white'}`}>
            <FolderOpen size={20} />
          </div>
          <span className="text-lg font-bold font-orbitron text-gray-200">{sem.title}</span>
        </div>
        {isOpen ? <ChevronDown className="text-oz-emerald" /> : <ChevronRight className="text-gray-500" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-black/40"
          >
            <div className="p-4 space-y-3">
              {filteredSubjects.map((sub, idx) => (
                <div key={idx} className="ml-4 pl-4 border-l border-white/10">
                  <h4 className="text-oz-gold font-mono text-sm mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-oz-gold" />
                    {sub.name}
                  </h4>
                  <div className="grid gap-2">
                    {sub.files.map((file, fIdx) => (
                      <a
                        key={fIdx}
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-oz-emerald/20 hover:text-oz-emerald transition group"
                      >
                        <FileText size={16} className="text-gray-500 group-hover:text-oz-emerald" />
                        <span className="text-sm text-gray-300 group-hover:text-white truncate">{file.name}</span>
                      </a>
                    ))}
                    {sub.files.length === 0 && <span className="text-gray-600 text-xs italic ml-8">No files uploaded</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ResourcesPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/resources")
      .then((res) => res.json())
      .then((data) => setSemesters(data.semesters))
      .catch((err) => console.error("Failed to fetch resources:", err));
  }, []);

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto pt-32 px-6 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent">
            KNOWLEDGE HUB
          </h1>
          <p className="text-gray-400">Access the centralized academic database.</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12 group">
          <div className="absolute inset-0 bg-oz-emerald blur-xl opacity-10 group-focus-within:opacity-20 transition" />
          <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 focus-within:border-oz-emerald/50 transition-colors">
            <Search className="text-gray-500 mr-4" />
            <input
              type="text"
              placeholder="Search subjects, notes, or papers..."
              className="bg-transparent w-full focus:outline-none text-white placeholder-gray-600 font-mono"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {semesters.map((sem, idx) => (
            <SemesterChip key={idx} sem={sem} searchQuery={search} />
          ))}
          {semesters.length === 0 && (
             <div className="text-center text-gray-600 py-10 font-mono">
               INITIALIZING DATABASE...
             </div>
          )}
        </div>
      </div>
    </div>
  );
}