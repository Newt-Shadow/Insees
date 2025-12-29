import Image from "next/image";

// Using placeholder images or the names from your PDF
const SPONSORS = [
  { name: "Unstop", logo: "/sponsors/unstop.com.png" },
  { name: "Intel", logo: "/sponsors/intel.com.png" },
  { name: "Mathworks", logo: "/sponsors/mathworks.com.png" },
  { name: "StockGro", logo: "/sponsors/stockgro.club.png" },
  { name: "Coding Ninjas", logo: "/sponsors/codingninjas.com.png" },
  // Duplicate array for seamless loop
  { name: "Unstop", logo: "/sponsors/unstop.com.png" },
  { name: "Intel", logo: "/sponsors/intel.com.png" },
  { name: "Mathworks", logo: "/sponsors/mathworks.com.png" },
  { name: "StockGro", logo: "/sponsors/stockgro.club.png" },
];

export const SponsorsMarquee = () => {
  return (
    <section className="py-20 bg-black border-y border-white/5 overflow-hidden">
      <div className="text-center mb-10">
        <p className="text-oz-emerald font-mono tracking-widest text-sm uppercase">Previous Partners</p>
      </div>
      
      <div className="relative w-full max-w-[100vw] overflow-hidden">
        {/* Gradients to fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />

        <div className="flex animate-scroll w-[200%]">
          {SPONSORS.map((sponsor, idx) => (
            <div key={idx} className="flex-1 min-w-[200px] flex justify-center items-center px-8 grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100">
               {/* NOTE: Ensure these images exist in /public/sponsors/ 
                  If not, you can replace <Image> with a text placeholder for now
               */}
               <div className="h-12 relative w-32">
                 <Image 
                   src={sponsor.logo} 
                   alt={sponsor.name} 
                   fill 
                   className="object-contain" 
                 />
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};