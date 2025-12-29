import Link from 'next/link';
import { Mail, Twitter, Instagram, Linkedin, MapPin, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-oz-emerald to-transparent opacity-50" />
      
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

        {/* Legal / Intl */}
        <div>
          <h3 className="text-white font-bold mb-6 tracking-wide">RESOURCES</h3>
          <ul className="space-y-3 text-gray-500 text-sm font-medium">
            <li><a href="#" className="hover:text-white transition-colors">Brochure (Global)</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sponsorship Deck</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Alumni Network</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
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

      <div className="mt-20 border-t border-white/5 pt-8 text-center text-gray-600 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} INSEES NIT Silchar. Crafted with <span className="text-red-500">♥</span> & Code.
      </div>
    </footer>
  );
};