"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import React from "react";


type DrawerProps = { open: boolean; onClose: () => void; };


export const MenuDrawer: React.FC<DrawerProps> = ({ open, onClose }) => {
return (
<AnimatePresence>
{open && (
<motion.aside
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
className="fixed inset-0 z-40"
>
{/* Backdrop */}
<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />


{/* Panel */}
<motion.div
initial={{ x: 320 }}
animate={{ x: 0 }}
exit={{ x: 320 }}
transition={{ type: "spring", stiffness: 260, damping: 26 }}
className="absolute right-0 top-0 h-full w-[84vw] max-w-[420px] bg-neutral-900/80 border-l border-white/10 backdrop-blur-xl p-6 flex flex-col gap-6"
>
<div className="flex items-center justify-between">
<h3 className="text-xl font-semibold tracking-wide">INSEES</h3>
<button onClick={onClose} className="p-2 rounded-md hover:bg-white/5">
<X />
</button>
</div>
<nav className="mt-4 grid gap-3 text-lg">
<a className="hover:text-white/90 text-white/70" href="#about">About</a>
<a className="hover:text-white/90 text-white/70" href="#events">Events</a>
<a className="hover:text-white/90 text-white/70" href="#teams">Team</a>
<a className="hover:text-white/90 text-white/70" href="#contact">Contact</a>
</nav>
<div className="mt-auto text-sm text-white/60">
© {new Date().getFullYear()} INSEES, NIT Silchar
</div>
</motion.div>
</motion.aside>
)}
</AnimatePresence>
);
};