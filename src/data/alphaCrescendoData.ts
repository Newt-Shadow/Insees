import { 
  Cpu, Users, Zap, Globe, Music, TrendingUp, Camera, Terminal, Radio, Mic, LucideIcon 
} from "lucide-react";

// --- Types ---
export interface EventItem {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  icon: LucideIcon;
  color: "emerald" | "gold" | "ruby" | "silver" | "green" | "sepia" | "blue";
  image: string; // URL for the event image
  prizePool?: string;
  teamSize?: string;
  coordinators?: { name: string; phone: string }[];
  rulebook?: string; // e.g., "https://drive.google.com/..."
}

export interface SponsorItem {
  name: string;
  domain: string; // Used to fetch logo automatically
}

export interface AlphaContent {
  hero: {
    title: string;
    subtitle: string;
    tagline: string;
    dates: string;
  };
  about: {
    insees: string;
    nit: string;
    fest: string;
  };
  whatsNew: {
    title: string;
    description: string;
    points: string[];
  };
  events: EventItem[];
  sponsors: {
    past: SponsorItem[];
    cta: string;
  };
}
  // hero: {
  //   title: "Alpha Crescendo 2026",
  //   subtitle: "The Wizard of Oz",
  //   tagline: "Follow the Binary Brick Road to the Emerald City of Innovation.",
  //   dates: "2026",
  // },

// --- Data ---
export const alphaContent: AlphaContent = {
  hero: {
    title: "Alpha Crescendo 2026",
    subtitle: "",
    tagline: "",
    dates: "2026",
  },
  about: {
    insees: "INSEES (Instrumentation and Electronics Engineering Society) is the official student body of the EIE department at NIT Silchar. We aim to strengthen technical expertise and leadership through workshops and competitions.",
    nit: "NIT Silchar is one of India's premier engineering institutions, ranked 7th among NITs (NIRF 2024).",
    fest: "Alpha Crescendo is more than a technical fest—it is a vibrant celebration of creativity, passion, and competition. It blends technical core events like Coding and ML with cultural vibes like Open Mic."
  },
  whatsNew: {
    title: "What's New",
    description: "This year promises to be a game-changer.",
    points: [
      "Enhanced technical tracks emphasizing emerging technologies.",
      "Stock Market Simulation introducing real-time financial decision making.",
      "Expanded cultural events like Open Mic and Vivaad."
    ]
  },
  events: [
    {
      id: "binary-brick-road",
      title: "The Binary Brick Road",
      category: "Treasure Hunt",
      shortDesc:"A flagship treasure hunt set in the land of 1s and 0s. Teams navigate hidden paths and solve layered challenges.",
      fullDesc: "Every clue is a signal, every riddle a line of logic. Teams navigate hidden paths, uncover encrypted messages, and solve layered challenges. Only those who think fast will reach the final discovery.",
      icon: Globe,
      color: "emerald",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      prizePool: "₹15,000",
      teamSize: "3-5 Members",
      coordinators: [{ name: "Alex T.", phone: "+91 98765 43210" }],
    },
    {
      id: "logic-pull",
      title: "The Logic Pull",
      category: "Tug of War",
      shortDesc: "Set in the land of 1s and 0s, this tests balance and teamwork. It is not just physical power, but staying steady under pressure.",
      fullDesc: "Set in the land of 1s and 0s, this isn't just about physical power. It's about staying steady, thinking clearly, and pulling as one unit under immense pressure.",
      icon: Users,
      color: "gold",
      image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&q=80&w=800",
      prizePool: "₹15,000",
      teamSize: "3-5 Members",
      coordinators: [{ name: "Alex T.", phone: "+91 98765 43210" }]
    },
    {
      id: "game-of-oz",
      title: "Game of Oz",
      category: "Hackathon",
      shortDesc: "Test your Brain for algorithms, Heart for design, and Courage for real-world solutions.",
      fullDesc: "Test your Brain for algorithms, Heart for design, and Courage for real-world solutions. A multifaceted challenge designed to push your collaborative spirit.",
      icon: Cpu,
      color: "emerald",
      image: "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800",
      prizePool: "₹15,000",
      teamSize: "3-5 Members",
      coordinators: [{ name: "Alex T.", phone: "+91 98765 43210" }]
    },
    {
      id: "lions-oz-bate",
      title: "Lion's Oz-Bate",
      category: "Debate",
      shortDesc: "A high-intensity debate arena. Participants must think critically and stand firm under scrutiny as perspectives collide.",
      fullDesc: "Participants must think critically, articulate clearly, and stand firm under scrutiny as perspectives collide in structured, thought-provoking rounds.",
      icon: Mic,
      color: "ruby",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b955?auto=format&fit=crop&q=80&w=800",
      prizePool: "₹15,000",
      teamSize: "3-5 Members",
      coordinators: [{ name: "Alex T.", phone: "+91 98765 43210" }]
    },
    {
      id: "emerald-city-cup",
      title: "Emerald City Cup",
      category: "Esports (FIFA)",
      shortDesc: "Brings the thrill of football to the digital arena. Fast-paced matches where strategy and reflexes define every move.",
      fullDesc: "Fast-paced matches where strategy and reflexes define every move. Competition intensifies until only the most composed players remain.",
      icon: Zap,
      color: "emerald",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
      prizePool: "₹15,000",
      teamSize: "3-5 Members",
      coordinators: [{ name: "Alex T.", phone: "+91 98765 43210" }]
    },
    {
      id: "tin-mans-ticker",
      title: "Tin Man's Ticker",
      category: "Quiz",
      shortDesc: "A rapid-fire quiz experience. Questions demand clarity under pressure, rewarding those who trust their instincts.",
      fullDesc: "Designed to keep minds alert. Questions demand clarity under pressure, rewarding those who stay composed and trust their instincts.",
      icon: Radio,
      color: "silver",
      image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800",
      prizePool: "₹15,000",
      teamSize: "3-5 Members",
      coordinators: [{ name: "Alex T.", phone: "+91 98765 43210" }]
    },
    {
      id: "oz-veiling",
      title: "The Oz-Veiling",
      category: "Open Mic",
      shortDesc: "Poetry, music, and storytelling take center stage. An atmosphere that celebrates individuality and artistic courage.",
      fullDesc: "Poetry, music, and storytelling come together. An atmosphere that celebrates individuality, artistic courage, and authentic self-expression.",
      icon: Music,
      color: "gold",
      image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=800",
      prizePool: "₹15,000",
      teamSize: "3-5 Members",
      coordinators: [{ name: "Alex T.", phone: "+91 98765 43210" }]
    },
    {
      id: "binary-bulls",
      title: "Binary Bulls vs Zero Bears",
      category: "Stock Market",
      shortDesc: "A live stock market simulation where instincts clash with intelligence. Master uncertainty in a volatile marketplace.",
      fullDesc: "A live stock market simulation driven by shifting data and calculated risks. Master uncertainty in a volatile marketplace to dominate.",
      icon: TrendingUp,
      color: "green",
      image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=800",
      prizePool: "₹15,000",
      teamSize: "3-5 Members",
      coordinators: [{ name: "Alex T.", phone: "+91 98765 43210" }]
    },
    {
      id: "sepia",
      title: "Sepia",
      category: "Photography",
      shortDesc: "Capture moments that speak beyond words. Explore themes reflecting emotion, innovation, and campus life.",
      fullDesc: "Explore themes reflecting emotion, innovation, and campus life through your lens. A platform for visual storytellers.",
      icon: Camera,
      color: "sepia",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
      prizePool: "₹15,000",
      teamSize: "3-5 Members",
      coordinators: [{ name: "Alex T.", phone: "+91 98765 43210" }]
    },
    {
      id: "neural-code",
      title: "Neural Code",
      category: "Coding Contest",
      shortDesc: "Algorithmic problems testing efficiency and logic. An opportunity to demonstrate command over programming concepts.",
      fullDesc: "Algorithmic and logical problems that test efficiency and accuracy. Show your command over programming concepts under time constraints.",
      icon: Terminal,
      color: "blue",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
      prizePool: "₹15,000",
      teamSize: "3-5 Members",
      coordinators: [{ name: "Alex T.", phone: "+91 98765 43210" }]
    },
    {
      id: "wizards-algorithm",
      title: "The Wizard's Algorithm",
      category: "Arduino Challenge",
      shortDesc: "Design circuits and write embedded code. Transform innovative ideas into functional hardware solutions.",
      fullDesc: "Transform innovative ideas into functional hardware. Design circuits, write embedded code, and debug real-world constraints.",
      icon: Cpu,
      color: "emerald",
      image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80&w=800",
      prizePool: "₹15,000",
      teamSize: "3-5 Members",
      coordinators: [{ name: "Alex T.", phone: "+91 98765 43210" }]
    }
  ],
  sponsors: {
    past: [
      { name: "Intel", domain: "intel.com" },
      { name: "MathWorks", domain: "mathworks.com" },
      { name: "Unstop", domain: "unstop.com" },
      { name: "Coding Ninjas", domain: "codingninjas.com" },
      { name: "StockGro", domain: "stockgro.club" }, // Note: check specific domain if needed
      { name: "HexNBit", domain: "hexnbit.com" }
    ],
    cta: "Expand your brand's reach to diverse audiences across the nation and internationally."
  }
};