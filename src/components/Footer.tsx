"use client";
import Link from 'next/link';
import { Mail, Twitter, Instagram, Linkedin, MapPin, Globe, Code,  Terminal, ShieldCheck, Cpu } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-2 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2  -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-oz-emerald to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Brand Column */}
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 font-orbitron">
            INSEES
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Instrumentation & Electronics Engineering Society.<br/>
            Fostering innovation and technical excellence at NIT Silchar since inception.
          </p>
          <div className="flex items-center gap-2 text-oz-emerald text-sm border border-oz-emerald/20 bg-oz-emerald/5 px-3 py-1 rounded-full w-fit">
            <Globe className="w-3 h-3" />
            <span>International Hub</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-6 tracking-wide">EXPLORE</h3>
          <ul className="space-y-3 text-gray-500 text-sm font-medium">
            <li><Link href="/alpha-crescendo" className="hover:text-oz-gold transition-colors duration-300">Alpha Crescendo</Link></li>
            <li><Link href="/gallery" className="hover:text-oz-gold transition-colors duration-300">Gallery</Link></li>
            <li><Link href="/team" className="hover:text-oz-gold transition-colors duration-300">Our Team</Link></li>
            <li><Link href="/sponsors" className="hover:text-oz-gold transition-colors duration-300">Partners</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-bold mb-6 tracking-wide">RESOURCES</h3>
          <ul className="space-y-3 text-gray-500 text-sm font-medium">
            <li><Link href="/resources" className="hover:text-white transition-colors">Student Library</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Sponsorship Deck</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Alumni Network</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-bold mb-6 tracking-wide">CONTACT</h3>
          <div className="space-y-4 text-gray-500 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-oz-emerald shrink-0" />
              <span>NIT Silchar, Assam,<br/>India - 788010</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-oz-emerald shrink-0" />
              <a href="mailto:insees@nits.ac.in" className="hover:text-white transition">insees@nits.ac.in</a>
            </div>
            {/* Social Icons */}
            <div className="flex gap-4 mt-4">
              {[Linkedin, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-oz-emerald hover:text-black transition-all duration-300 border border-white/10 group">
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      {/* --- NEW SYSTEM STATUS BAR (Replaces Floating Button) --- */}
      <div className="border-t mt-2 border-white/10 pt-1 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Copyright */}
          <div className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">
            © {new Date().getFullYear()} INSEES NITS. All Systems Normal.
          </div>

          {/* The Integrated Developer Link */}
          <Link 
            href="/developers" 
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
          
          {/* Version Info */}
          <div className="hidden md:flex items-center gap-4 text-[10px] text-gray-700 font-mono">
             <span className="flex items-center gap-1"><ShieldCheck size={10}/> SECURE</span>
             <span className="flex items-center gap-1"><Cpu size={10}/> v2.4.0</span>
          </div>

        </div>
      </div>
    </footer>
  );
};