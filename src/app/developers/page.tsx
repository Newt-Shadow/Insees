"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { useEffect, useRef, useState } from "react";
import { Cpu, Smartphone, Globe, Brain, Layers } from "lucide-react";
import { DevMemberCard } from "@/components/DevMemberCard"; // your custom card

// Categories
const categories = [
  { title: "UI / UX", icon: <Layers className="w-10 h-10 text-pink-400" />, desc: "Designing intuitive and visually appealing user experiences." },
  { title: "Web Development", icon: <Globe className="w-10 h-10 text-blue-400" />, desc: "Building scalable, modern, and responsive websites." },
  { title: "App Development", icon: <Smartphone className="w-10 h-10 text-green-400" />, desc: "Crafting cross-platform and native mobile applications." },
  { title: "Machine Learning", icon: <Brain className="w-10 h-10 text-yellow-400" />, desc: "Implementing AI-powered solutions for real-world problems." },
  { title: "IoT", icon: <Cpu className="w-10 h-10 text-orange-400" />, desc: "Connecting hardware and software for smart systems." },
];

const seniorDevs = [
  {
    name: "Anmol",
    expertise: "Web Development",
    img: "/members/Anmol.jpeg",
    socials: {
      linkedin: "https://www.linkedin.com/in/anmol77/",
      facebook: "https://facebook.com/anmol",
      instagram: "https://www.instagram.com/anmol_n77/",
    },
  },
  {
    name: "Devanuj",
    expertise: "IoT",
    img: "/members/devanuj.jpg",
    socials: {
      linkedin: "https://linkedin.com/in/devanuj",
      facebook: "https://facebook.com/devanuj",
      instagram: "https://www.instagram.com/_dvx__rijal_/",
    },
  }
];

const juniorDevs = [
  {
    name: "Swapnil",
    expertise: "Web Development",
    img: "/members/Swapnil.jpeg",
    socials: {
      linkedin: "https://www.linkedin.com/in/swapnil-deka-467975332/",
      instagram: "https://www.instagram.com/s.w.a.p.n.i.l.d.e.k.a/",
      facebook: "https://www.facebook.com/profile.php?id=61566987403561",
    },
  },
  {
    name: "Hafizur",
    expertise: "App development",
    img: "/members/yeah.jpg",
    socials: {
      linkedin: "https://www.linkedin.com/in/hafijurnits?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      instagram: "https://www.instagram.com/yeah_hafijur/",
      facebook: "https://www.facebook.com/yeah.hafijur?mibextid=ZbWKwL",
    },
  },

  {
    name: "Darpan ",
    expertise: "UI/UX",
    img: "/members/darpan.jpg",
    socials: {
      linkedin: "https://www.linkedin.com/mwlite/profile/me?trk=p_mwlite_feed-secondary_nav",
      instagram: "https://www.instagram.com/darpanjyotigoswami_nits_eie/",
      facebook: "https://www.facebook.com/profile.php?id=61564938990523",
    },
  },

  {
    name: "Kavish",
    expertise: "Cloud",
    img: "/members/Kavish.jpeg",
    socials: {
      linkedin: "https://www.linkedin.com/in/kavish-sharma-724168314",
      instagram: "https://www.instagram.com/kav1sh.s_/",
      facebook: "https://www.facebook.com/share/1AthPfrExv/?mibextid=wwXIfr",
    },
  },
  
      {
    name: "Param",
    expertise: "Web",
    img: "/members/Dhrubo.jpeg",
    socials: {
     linkedin: "https://www.linkedin.com/in/param-nagar-786586244?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      instagram: "https://www.instagram.com/_paramaroraa_?igsh=MWE4dDN5ZW16ZXphcQ%3D%3D&utm_source=qr",
      facebook: "https://www.facebook.com/share/19z8G4CysD/?mibextid=wwXIfr",
    },
  },

      {
    name: "Dhrubojyoti",
    expertise: "Cloud",
    img: "/members/param.jpeg",
    socials: {
     linkedin: "https://www.linkedin.com/in/dhrubajyoti-sarma-355488334?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      instagram: "https://www.instagram.com/_dhruba_0713?igsh=MTU1cDM5MHh0ODJoaA==",
      facebook: "-https://www.facebook.com/himangshu.sarma.92123",
    },
  }
];

// ✅ Move variants here (top-level, not inside useEffect)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DevelopersPage() {



  return (
    <>
      <Navbar />
      <main className="relative min-h-screen bg-black text-white font-[Poppins,sans-serif] overflow-hidden">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center h-[70vh] text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text drop-shadow-xl"
          >
            Meet Our Developers ✨
          </motion.h1>
          <p className="mt-6 text-gray-400 max-w-2xl text-lg">
            Innovators behind UI/UX, Web, Mobile, ML, and IoT solutions at INSEES.
          </p>
        </section>

        {/* Category Cards */}
        <section className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 md:px-12 pb-20 place-items-center">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="relative group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-lg hover:shadow-purple-500/20 cursor-pointer"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-black/40 border border-white/10">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold">{cat.title}</h3>
                <p className="text-gray-400 text-center text-sm">{cat.desc}</p>
              </div>
            </motion.div>
          ))}
        </section>

      </main>

      {/* Developers Members Section */}
      {/* Senior Developers */}
      <section className="bg-black text-white px-6 md:px-12 py-20">
        <h2 className="text-4xl font-extrabold mb-12 text-center">
          Senior <span className="text-purple-400">Developers</span>
        </h2>
        <motion.div
          className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {seniorDevs.map((dev, i) => (
            <motion.div key={i} variants={itemVariants}>
              <DevMemberCard {...dev} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Junior Developers */}
      <section className="bg-black text-white px-6 md:px-12 py-20">
        <h2 className="text-4xl font-extrabold mb-12 text-center">
          Junior <span className="text-purple-400">Developers</span>
        </h2>
        <motion.div
          className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {juniorDevs.map((dev, i) => (
            <motion.div key={i} variants={itemVariants}>
              <DevMemberCard {...dev} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
}
