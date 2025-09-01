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

// Example developers
const devs = [
  { name: "Alice Doe", expertise: "UI / UX", img: "/devs/alice.jpg" },
  { name: "Bob Smith", expertise: "Web Development", img: "/devs/bob.jpg" },
  { name: "Clara Lee", expertise: "App Development", img: "/devs/clara.jpg" },
  { name: "David Zhang", expertise: "Machine Learning", img: "/devs/david.jpg" },
  { name: "Eva Patel", expertise: "IoT", img: "/devs/eva.jpg" },
];

// 🦖 Offline Dino Game Component
function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [jumping, setJumping] = useState(false);
  const [dinoY, setDinoY] = useState(150);
  const [obstacleX, setObstacleX] = useState(400);
  const gravity = 3;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let jumpVelocity = 0;
    let animation: number;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dino
      ctx.fillStyle = "lime";
      ctx.fillRect(50, dinoY, 40, 40);

      // Obstacle
      ctx.fillStyle = "red";
      ctx.fillRect(obstacleX, 170, 30, 30);

      // Jump mechanics
      if (jumping) {
        jumpVelocity = -12;
        setJumping(false);
      }
      setDinoY((prev) => Math.min(150, prev + jumpVelocity + gravity));
      jumpVelocity += gravity;

      // Move obstacle
      setObstacleX((prev) => (prev <= -30 ? 400 : prev - 6));

      animation = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animation);
  }, [jumping]);

  // Controls: keyboard + mobile tap
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.code === "Space") setJumping(true);
    };
    const tapHandler = () => setJumping(true);

    window.addEventListener("keydown", keyHandler);
    window.addEventListener("touchstart", tapHandler);

    return () => {
      window.removeEventListener("keydown", keyHandler);
      window.removeEventListener("touchstart", tapHandler);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={250}
      className="bg-gray-900 border border-white/20 rounded-lg"
    />
  );
}

export default function DevelopersPage() {
  const [easterEgg, setEasterEgg] = useState(false);
  const [selectedGame, setSelectedGame] = useState<null | "dino" | "mario">(null);
  const [iframeError, setIframeError] = useState(false);

  // Easter Egg trigger (type "dev" only on desktop > 1024px)
  useEffect(() => {
    if (window.innerWidth <= 1024) return; // disable on mobile/tablet

    let buffer = "";
    const handler = (e: KeyboardEvent) => {
      if (/^[a-zA-Z]$/.test(e.key)) {
        buffer += e.key.toLowerCase();
        if (buffer.endsWith("dev")) {
          setEasterEgg(true);
          buffer = "";
        }
        if (buffer.length > 10) buffer = buffer.slice(-3);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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

        {/* Easter Egg Popup */}
        <AnimatePresence>
          {easterEgg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center shadow-2xl w-[95%] h-[85%] flex flex-col">
                <h2 className="text-2xl font-bold mb-6">🎮 Choose Your Game</h2>

                {/* Game Selector */}
                {!selectedGame ? (
                  <div className="flex flex-col gap-6 items-center justify-center flex-1">
                    <button
                      onClick={() => setSelectedGame("dino")}
                      className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-400 to-teal-500 text-black font-semibold hover:scale-105 transition"
                    >
                      🦖 Play Dino Game
                    </button>
                    <button
                      onClick={() => setSelectedGame("mario")}
                      className="px-8 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-red-500 text-black font-semibold hover:scale-105 transition"
                    >
                      🍄 Play Mario Game
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 w-full flex items-center justify-center">
                    {!iframeError ? (
                      <iframe
                        src={
                          selectedGame === "dino"
                            ? "https://chromedino.com/"
                            : "https://supermario-game.com/"
                        }
                        className="w-full h-full rounded-xl border border-white/20 shadow-2xl"
                        onError={() => setIframeError(true)}
                      />
                    ) : (
                      <DinoGame />
                    )}
                  </div>
                )}

                {/* Controls */}
                <div className="mt-4 flex justify-center gap-4">
                  {selectedGame && (
                    <button
                      onClick={() => {
                        setSelectedGame(null);
                        setIframeError(false);
                      }}
                      className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-black font-semibold"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEasterEgg(false);
                      setSelectedGame(null);
                      setIframeError(false);
                    }}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-400 to-red-500 text-black font-semibold"
                  >
                    Exit
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Easter Egg Button (only for <= 1024px) */}
        <motion.div
          className="fixed bottom-6 right-6 lg:hidden bg-gradient-to-r from-purple-600 to-blue-500 text-white px-5 py-3 rounded-full shadow-lg cursor-pointer font-bold text-sm md:text-base z-50"
          whileHover={{ scale: 1.1, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -6, 0],
            boxShadow: [
              "0 0 20px rgba(168,85,247,0.6)",
              "0 0 40px rgba(59,130,246,0.6)",
              "0 0 20px rgba(168,85,247,0.6)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          onClick={() => setEasterEgg(true)}
        >
          🎮 Play Games
        </motion.div>
      </main>

      {/* Developers Members Section */}
      <section className="bg-black text-white px-6 md:px-12 py-20">
        <h2 className="text-4xl font-extrabold mb-12 text-center">
          Our <span className="text-purple-400">Developers</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-10">
          {devs.map((dev, i) => (
            <DevMemberCard key={i} name={dev.name} expertise={dev.expertise} img={dev.img} />
          ))}
        </div>
      </section>
    </>
  );
}
