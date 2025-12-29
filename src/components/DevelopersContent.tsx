"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Terminal,
  X,
  Minus,
  Square,
  Layers,
  Globe,
  Smartphone,
  Brain,
  Cpu,
} from "lucide-react";
import Image from "next/image";

/* ================== CATEGORIES ================== */
const categories = [
  {
    title: "UI / UX",
    Icon: Layers,
    color: "text-pink-400",
    desc: "Designing intuitive and visually appealing user experiences.",
  },
  {
    title: "Web Development",
    Icon: Globe,
    color: "text-blue-400",
    desc: "Building scalable, modern, and responsive websites.",
  },
  {
    title: "App Development",
    Icon: Smartphone,
    color: "text-green-400",
    desc: "Crafting cross-platform and native mobile applications.",
  },
  {
    title: "Machine Learning",
    Icon: Brain,
    color: "text-yellow-400",
    desc: "Implementing AI-powered solutions for real-world problems.",
  },
  {
    title: "IoT",
    Icon: Cpu,
    color: "text-orange-400",
    desc: "Connecting hardware and software for smart systems.",
  },
];

/* ================== DEVELOPERS ================== */
const seniorDevs = [
  {
    id: 1,
    name: "Anmol",
    role: "Web Development",
    img: "/members/Anmol.jpeg",
    github: "#",
    linkedin: "https://www.linkedin.com/in/anmol77/",
  },
  {
    id: 2,
    name: "Devanuj",
    role: "IoT",
    img: "/members/devanuj.jpg",
    github: "#",
    linkedin: "https://linkedin.com/in/devanuj",
  },
];

const juniorDevs = [
  {
    id: 3,
    name: "Swapnil",
    role: "Web Development",
    img: "/members/Swapnil.jpeg",
    github: "#",
    linkedin: "https://www.linkedin.com/in/swapnil-deka-467975332/",
  },
  {
    id: 4,
    name: "Hafizur",
    role: "App Development",
    img: "/members/yeah.jpg",
    github: "#",
    linkedin: "https://www.linkedin.com/in/hafijurnits",
  },
  {
    id: 5,
    name: "Darpan",
    role: "UI / UX",
    img: "/members/darpan.jpg",
    github: "#",
    linkedin: "https://www.linkedin.com/mwlite/profile/me",
  },
  {
    id: 6,
    name: "Kavish",
    role: "Cloud",
    img: "/members/kavish.jpeg",
    github: "#",
    linkedin: "https://www.linkedin.com/in/kavish-sharma-724168314",
  },
  {
    id: 7,
    name: "Param",
    role: "Web",
    img: "/members/param.jpeg",
    github: "#",
    linkedin: "https://www.linkedin.com/in/param-nagar-786586244",
  },
  {
    id: 8,
    name: "Dhrubojyoti",
    role: "Cloud",
    img: "/members/Dhrubo.jpeg",
    github: "#",
    linkedin: "https://www.linkedin.com/in/dhrubajyoti-sarma-355488334",
  },
];

export default function DevelopersContent() {
  const [activeTab, setActiveTab] = useState("developers.tsx");

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-gray-300 font-mono pt-24 pb-10 px-4 flex justify-center">
      <div className="w-full max-w-6xl bg-[#252526] rounded-lg shadow-2xl overflow-hidden border border-[#333]">
        
        {/* VS Code Toolbar */}
        <div className="bg-[#333] px-4 py-2 flex justify-between items-center text-xs">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-gray-400">
            INSEES_WEBSITE — Visual Studio Code
          </span>
          <div className="flex gap-4 text-gray-400">
            <Minus size={14} />
            <Square size={14} />
            <X size={14} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#252526] border-b border-[#1e1e1e]">
          {["developers.tsx", "styles.css", "readme.md"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm flex items-center gap-2 border-r border-[#1e1e1e] ${
                activeTab === tab
                  ? "bg-[#1e1e1e] text-white"
                  : "text-gray-500 hover:bg-[#2d2d2d]"
              }`}
            >
              <span
                className={
                  tab.endsWith("tsx")
                    ? "text-blue-400"
                    : tab.endsWith("css")
                    ? "text-blue-300"
                    : "text-yellow-400"
                }
              >
                #
              </span>
              {tab}
            </button>
          ))}
        </div>

        {/* Code Area */}
        <div className="p-8 bg-[#1e1e1e] overflow-x-auto">
          {activeTab === "developers.tsx" ? (
            <div className="space-y-10">

              {/* Fake Code Header */}
              <div className="text-sm">
                <span className="text-pink-400">import</span>{" "}
                <span className="text-blue-300">Team</span>{" "}
                <span className="text-pink-400">from</span>{" "}
                <span className="text-orange-300">"@/insees/tech"</span>;
                <br />
                <span className="text-pink-400">const</span>{" "}
                <span className="text-yellow-300">CurrentYear</span> ={" "}
                <span className="text-green-300">2025</span>;
              </div>

              {/* Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {categories.map(({ title, Icon, color, desc }) => (
                  <div
                    key={title}
                    className="bg-[#2d2d2d] border border-[#333] rounded p-4 hover:border-blue-500/40 transition"
                  >
                    <Icon className={`${color} mb-2`} size={22} />
                    <h4 className="text-sm font-semibold text-gray-200">
                      {title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Senior Developers */}
              <div className="text-gray-500 text-sm">// Senior Developers</div>
              <DevGrid devs={seniorDevs} />

              {/* Junior Developers */}
              <div className="text-gray-500 text-sm">// Junior Developers</div>
              <DevGrid devs={juniorDevs} />

              <div className="text-gray-500 text-sm">// End of Module</div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-600">
              <Terminal size={48} className="mb-4 opacity-50" />
              <p>// {activeTab} is read-only in this view.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================== DEV GRID COMPONENT ================== */
function DevGrid({ devs }: { devs: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {devs.map((dev, i) => (
        <motion.div
          key={dev.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="relative bg-[#2d2d2d] p-6 rounded border border-[#333] hover:border-blue-500/50 transition-colors"
        >
          {/* Line Numbers */}
          <div className="absolute left-3 top-3 bottom-3 w-6 border-r border-[#444] text-[#555] text-xs flex flex-col items-center gap-1 select-none">
            {Array.from({ length: 8 }).map((_, n) => (
              <span key={n}>{n + 1}</span>
            ))}
          </div>

          <div className="pl-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500/30">
                <Image
                  src={dev.img}
                  alt={dev.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-blue-400 font-bold">
                  const {dev.name}
                </h3>
                <p className="text-green-400 text-xs">
                  = "{dev.role}";
                </p>
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-400">
              <p>
                <span className="text-pink-400">return</span> (
              </p>
              <div className="pl-4 flex gap-3">
                <a
                  href={dev.github}
                  className="text-gray-500 hover:text-white transition"
                >
                  <Github size={18} />
                </a>
                <a
                  href={dev.linkedin}
                  className="text-gray-500 hover:text-blue-400 transition"
                >
                  <Linkedin size={18} />
                </a>
              </div>
              <p>);</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
