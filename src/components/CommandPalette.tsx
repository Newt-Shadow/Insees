"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, Zap, Users, Code, Calendar, FileText, ExternalLink } from "lucide-react";

type Action = {
  id: string;
  label: string;
  icon: React.ElementType;
  action: () => void;
  tag?: string;
};

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const actions: Action[] = [
    { id: "home", label: "Home", icon: Command, action: () => router.push("/") },
    { id: "alpha", label: "Alpha Crescendo 2026", icon: Zap, action: () => router.push("/alpha-crescendo"), tag: "FEST" },
    { id: "team", label: "Our Team", icon: Users, action: () => router.push("/team") },
    { id: "gallery", label: "Gallery", icon: FileText, action: () => router.push("/gallery") },
    { id: "resources", label: "Student Resources", icon: Calendar, action: () => router.push("/resources") },
    { id: "devs", label: "System Architects", icon: Code, action: () => router.push("/developers"), tag: "SUDO" },
  ];

  const filtered = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  // --- KEYBOARD SHORTCUT LISTENER ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+K or Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); // <--- THIS STOPS CHROME FROM FOCUSING URL BAR
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      }
      // Close on Escape
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (action: Action) => {
    action.action();
    setIsOpen(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[15vh] px-4 font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10"
          >
            {/* Search Bar */}
            <div className="flex items-center px-4 py-4 border-b border-white/10 bg-white/5">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Where would you like to go?"
                className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
              />
              <div className="flex gap-2">
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-400 border border-white/5 hidden sm:block">ESC</span>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
              {filtered.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleSelect(action)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-oz-emerald/10 hover:border hover:border-oz-emerald/20 border border-transparent transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-oz-emerald group-hover:bg-oz-emerald/20 transition-colors">
                      <action.icon size={18} />
                    </div>
                    <span className="text-gray-300 group-hover:text-white font-medium">{action.label}</span>
                  </div>
                  
                  {action.tag && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-500 border border-white/10 group-hover:border-oz-emerald/30 group-hover:text-oz-emerald">
                      {action.tag}
                    </span>
                  )}
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="py-8 text-center text-gray-500">No results found.</div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-[#050505] px-4 py-2 border-t border-white/5 text-[10px] text-gray-600 flex justify-between">
               <span>INSEES NAVIGATOR</span>
               <span>v2.5</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}