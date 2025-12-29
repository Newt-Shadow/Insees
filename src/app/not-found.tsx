"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Glitch Background */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
      
      <div className="z-10 text-center space-y-6 px-4">
        <h1 className="text-9xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 animate-pulse">
          404
        </h1>
        <div className="h-px w-32 bg-red-500 mx-auto" />
        <h2 className="text-2xl font-mono text-red-400">SYSTEM FAILURE // PATH NOT FOUND</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          The requested coordinate lies outside the known network map. 
          Return to base immediately.
        </p>
        
        <Link 
          href="/" 
          className="inline-block mt-8 px-8 py-3 bg-white/5 border border-red-500/30 text-red-400 font-mono hover:bg-red-500 hover:text-black transition-all rounded-sm"
        >
          &lt; RETURN HOME /&gt;
        </Link>
      </div>
    </div>
  );
}