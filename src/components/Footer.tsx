"use client";
import Link from 'next/link';
import { Mail, Twitter, Instagram, Linkedin, MapPin, Globe, Terminal, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';
import { usePreloader } from '@/app/context/PreloaderContext';

export const Footer = () => {

   const { triggerBoot } = usePreloader();

  return (
    <footer className="bg-black border-t border-white/10 pt-20 font-sans relative overflow-hidden z-40">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-oz-emerald to-transparent opacity-50" />

      {/* Upper Footer Content */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10 pb-12">
        {/* Brand Column */}
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 font-orbitron">
            INSEES
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Instrumentation & Electronics Engineering Society.<br/>
            NIT Silchar, Assam, India.
          </p>
          <div className="flex items-center gap-2 text-oz-emerald text-sm border border-oz-emerald/20 bg-oz-emerald/5 px-3 py-1 rounded-full w-fit">
            <Globe className="w-3 h-3" />
            <span>International Hub</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-white font-bold mb-6 tracking-wide text-sm text-oz-emerald font-orbitron">EXPLORE</h3>
          <ul className="space-y-3 text-gray-500 text-sm font-medium font-mono">
            <li>
              <Link href="/alpha-crescendo" onClick={() => triggerBoot("ALPHA CRESCENDO")} className="hover:text-white transition flex items-center gap-2 group">
                Alpha Crescendo <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
            <li>
              <Link href="/events" onClick={() => triggerBoot("EVENTS")} className="hover:text-white transition flex items-center gap-2 group">
                Events <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
            <li><Link href="/team"   onClick={() => triggerBoot("TEAM")} className="hover:text-white transition flex items-center gap-2 group">Our Team <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
            <li><Link href="/gallery"  onClick={() => triggerBoot("GALLERY")} className="hover:text-white transition flex items-center gap-2 group">Gallery <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
            <li>
              {/* Directs to the ID on the Alpha Page */}
              <Link href="/alpha-crescendo#sponsors"  onClick={() => triggerBoot("SPONSORS")} className="hover:text-white transition flex items-center gap-2 group">
                Partners & Sponsors <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Resources & Deck */}
        <div>
           <h3 className="text-white font-bold mb-6 tracking-wide text-sm text-oz-emerald font-orbitron">RESOURCES</h3>
           <ul className="space-y-3 text-gray-500 text-sm font-medium font-mono">
            <li><Link href="/resources" className="hover:text-white transition flex items-center gap-2 group">Student Library <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
       
            <li><Link href="/team" className="hover:text-white transition flex items-center gap-2 group">Alumni Network <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /> </Link></li>
           </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-white font-bold mb-6 tracking-wide text-sm text-oz-emerald font-orbitron">CONNECT</h3>
          <div className="flex gap-4">
             <a href="https://www.linkedin.com/company/insees-nits/" target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-[#0077b5] hover:text-white transition-all group border border-white/10">
               <Linkedin size={18} />
             </a>
             <a href="https://www.instagram.com/insees_nits_/" target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-pink-600 hover:text-white transition-all group border border-white/10">
               <Instagram size={18} />
             </a>
             <a href="mailto:inseessociety.nits@gmail.com" className="p-2 bg-white/5 rounded-full hover:bg-oz-emerald hover:text-black transition-all group border border-white/10">
               <Mail size={18} />
             </a>
          </div>
          <div className="mt-6">
             <Link href="/#contact" className="text-xs text-gray-500 hover:text-oz-emerald transition-colors flex items-center gap-2">
               <MapPin size={14} /> NIT Silchar, 788010
             </Link>
          </div>
        </div>
      </div>

      {/* --- SYSTEM STATUS BAR --- */}
      <div className="border-t border-white/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">
            © {new Date().getFullYear()} INSEES NITS.
          </div>

          {/* Integrated Developer Link */}
          <Link 
            href="/developers" 
            onClick={() => triggerBoot("DEVELOPERS")}
            className="group flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-oz-emerald/50 hover:bg-oz-emerald/10 transition-all"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-oz-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-oz-emerald"></span>
            </div>
            <span className="text-xs font-mono text-gray-400 group-hover:text-oz-emerald transition-colors">
              <span className="hidden sm:inline">SYSTEM ARCHITECTS: </span> 
              <span className="font-bold text-gray-300 group-hover:text-white">MEET THE DEVS</span>
            </span>
            <Terminal size={12} className="text-gray-500 group-hover:text-oz-emerald" />
          </Link>
          
          <div className="hidden md:flex items-center gap-4 text-[10px] text-gray-700 font-mono">
             <span className="flex items-center gap-1"><ShieldCheck size={10}/> SECURE</span>
             <span className="flex items-center gap-1"><Cpu size={10}/> v2.4.0</span>
          </div>

        </div>
      </div>
    </footer>
  );
};