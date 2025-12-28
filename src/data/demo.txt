import { 
  Cpu, Users, Zap, Globe, Music, TrendingUp, Camera, Terminal, Radio, Mic, LucideIcon 
} from "lucide-react";

// --- Types Interface ---
export interface EventItem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: LucideIcon;
  color: "emerald" | "gold" | "ruby" | "silver" | "green" | "sepia" | "blue";
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
    past: string[];
    cta: string;
  };
}

// --- Data Object ---
export const alphaContent: AlphaContent = {
  hero: {
    title: "Alpha Crescendo 2026",
    subtitle: "The Wizard of Tech",
    tagline: "Follow the Binary Brick Road to the Emerald City of Innovation.",
    dates: "2026",
  },
  about: {
    insees: "INSEES (Instrumentation and Electronics Engineering Society) is the official student body of the EIE department at NIT Silchar. We aim to strengthen technical expertise and leadership through workshops and competitions.",
    nit: "NIT Silchar is one of India's premier engineering institutions, ranked 7th among NITs (NIRF 2024) and 601+ globally.",
    fest: "Alpha Crescendo is more than a technical fest—it is a vibrant celebration of creativity, passion, and competition. It blends technical core events like Coding and ML with cultural vibes like Open Mic."
  },
  whatsNew: {
    title: "What's New",
    description: "This year promises to be a game-changer.",
    points: [
      "Enhanced technical tracks emphasizing emerging technologies and real-world problem solving.",
      "Stock Market Simulation introducing real-time financial decision making.",
      "Expanded cultural events like Open Mic and Vivaad for creativity beyond academics."
    ]
  },
  events: [
    {
      id: "binary-brick-road",
      title: "The Binary Brick Road",
      category: "Treasure Hunt",
      description: "A flagship treasure hunt set in the land of 1s and 0s. Teams navigate hidden paths and solve layered challenges.",
      icon: Globe,
      color: "emerald"
    },
    {
      id: "logic-pull",
      title: "The Logic Pull",
      category: "Tug of War",
      description: "Set in the land of 1s and 0s, this tests balance and teamwork. It is not just physical power, but staying steady under pressure.",
      icon: Users,
      color: "gold"
    },
    {
      id: "game-of-oz",
      title: "Game of Oz",
      category: "Hackathon",
      description: "Test your Brain for algorithms, Heart for design, and Courage for real-world solutions.",
      icon: Cpu,
      color: "emerald"
    },
    {
      id: "lions-oz-bate",
      title: "Lion's Oz-Bate",
      category: "Debate",
      description: "A high-intensity debate arena. Participants must think critically and stand firm under scrutiny as perspectives collide.",
      icon: Mic,
      color: "ruby"
    },
    {
      id: "emerald-city-cup",
      title: "Emerald City Cup",
      category: "Esports (FIFA)",
      description: "Brings the thrill of football to the digital arena. Fast-paced matches where strategy and reflexes define every move.",
      icon: Zap,
      color: "emerald"
    },
    {
      id: "tin-mans-ticker",
      title: "Tin Man's Ticker",
      category: "Quiz",
      description: "A rapid-fire quiz experience. Questions demand clarity under pressure, rewarding those who trust their instincts.",
      icon: Radio,
      color: "silver"
    },
    {
      id: "oz-veiling",
      title: "The Oz-Veiling",
      category: "Open Mic",
      description: "Poetry, music, and storytelling take center stage. An atmosphere that celebrates individuality and artistic courage.",
      icon: Music,
      color: "gold"
    },
    {
      id: "binary-bulls",
      title: "Binary Bulls vs Zero Bears",
      category: "Stock Market",
      description: "A live stock market simulation where instincts clash with intelligence. Master uncertainty in a volatile marketplace.",
      icon: TrendingUp,
      color: "green"
    },
    {
      id: "sepia",
      title: "Sepia",
      category: "Photography",
      description: "Capture moments that speak beyond words. Explore themes reflecting emotion, innovation, and campus life.",
      icon: Camera,
      color: "sepia"
    },
    {
      id: "neural-code",
      title: "The Scarecrow's Neural Code",
      category: "Coding Contest",
      description: "Algorithmic problems testing efficiency and logic. An opportunity to demonstrate command over programming concepts.",
      icon: Terminal,
      color: "blue"
    },
    {
      id: "wizards-algorithm",
      title: "The Wizard's Algorithm",
      category: "Arduino Challenge",
      description: "Design circuits and write embedded code. Transform innovative ideas into functional hardware solutions.",
      icon: Cpu,
      color: "emerald"
    }
  ],
  sponsors: {
    past: [
      "Intel", "MathWorks", "Unstop", "Coding Ninjas", "StockGro", "HexNBit"
    ],
    cta: "Expand your brand's reach to diverse audiences across the nation and internationally."
  }
};