"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, FileText, ChevronDown, ChevronRight, Youtube, ExternalLink, HardDrive } from "lucide-react";

// --- Types based on your JSON ---
export type FileType = { 
  name: string; 
  url: string; 
};

export type Subject = { 
  name: string; 
  driveLink?: string | null; // Handle null or string
  files: FileType[]; 
};

export type Semester = { 
  title: string; 
  subjects: Subject[]; 
};

interface ResourcesProps {
  semesters: Semester[];
  searchQuery: string;
}

// --- Individual Semester Chip Component ---
const SemesterItem = ({ sem, searchQuery }: { sem: Semester; searchQuery: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter logic: Check if subject name OR any file name matches the query
  const filteredSubjects = sem.subjects.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sub.files.some(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Auto-open if search matches anything inside
  useEffect(() => {
    if (searchQuery && filteredSubjects.length > 0) {
      setIsOpen(true);
    } else if (!searchQuery) {
      setIsOpen(false);
    }
  }, [searchQuery, filteredSubjects.length]);

  // If searching and no matches in this semester, hide it completely
  if (searchQuery && filteredSubjects.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 border border-white/10 rounded-xl overflow-hidden bg-white/5 hover:border-oz-emerald/30 transition-colors"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition group"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-oz-emerald text-black' : 'bg-white/10 text-white group-hover:bg-oz-emerald/20'}`}>
            <FolderOpen size={20} />
          </div>
          <span className="text-lg font-bold font-orbitron text-gray-200 group-hover:text-white transition-colors">
            {sem.title}
          </span>
        </div>
        {isOpen ? <ChevronDown className="text-oz-emerald" /> : <ChevronRight className="text-gray-500 group-hover:text-white" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-black/40 border-t border-white/5"
          >
            <div className="p-6 space-y-8">
              {filteredSubjects.map((sub, idx) => (
                <div key={idx} className="ml-2 md:ml-4 pl-4 border-l-2 border-white/10 hover:border-oz-emerald/50 transition-colors">
                  
                  {/* Subject Header Row */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h4 className="text-oz-gold font-mono text-sm uppercase tracking-wider flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-oz-gold" />
                      {sub.name}
                    </h4>
                    
                    {/* Direct Drive Link Button (Only if driveLink exists) */}
                    {sub.driveLink && (
                      <a 
                        href={sub.driveLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/60 transition-all text-xs font-mono"
                      >
                        <HardDrive size={12} />
                        <span className="hidden sm:inline">ACCESS DRIVE</span>
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>

                  {/* Files Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                    {sub.files.map((file, fIdx) => {
                      // Icon Logic
                      const isYouTube = file.url.includes("youtube.com") || file.url.includes("youtu.be");
                      const isPDF = file.url.endsWith(".pdf");
                      const Icon = isYouTube ? Youtube : (isPDF ? FileText : ExternalLink);

                      return (
                        <a
                          key={fIdx}
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-white/5 hover:bg-oz-emerald/10 hover:border-oz-emerald/30 transition group relative overflow-hidden"
                        >
                          <Icon size={18} className={isYouTube ? "text-red-400" : "text-gray-400 group-hover:text-oz-emerald"} />
                          <span className="text-sm text-gray-300 group-hover:text-white truncate font-medium flex-1">
                            {file.name}
                          </span>
                        </a>
                      );
                    })}
                    
                    {/* Empty State for Subject */}
                    {sub.files.length === 0 && !sub.driveLink && (
                      <span className="text-gray-600 text-xs italic ml-2">No files currently uploaded.</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Main Exported Component ---
export default function Resources({ semesters, searchQuery }: ResourcesProps) {
  if (semesters.length === 0) return null;

  return (
    <div className="w-full">
      {semesters.map((sem, idx) => (
        <SemesterItem key={idx} sem={sem} searchQuery={searchQuery} />
      ))}

      {/* No Results Handler */}
      {searchQuery && semesters.every(sem => 
         !sem.subjects.some(sub => 
           sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           sub.files.some(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
         )
       ) && (
         <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
           <p className="text-gray-500">No resources found for "{searchQuery}"</p>
         </div>
       )}
    </div>
  );
}