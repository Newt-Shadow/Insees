"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

export const AboutSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      id="about"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 py-24 bg-black overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-oz-emerald/5 blur-[120px] pointer-events-none" />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center mb-20"
      >
        <span className="text-oz-emerald font-mono text-sm tracking-widest uppercase mb-4 block">
          {"// Who We Are"}
        </span>
        <h2 className="text-4xl md:text-6xl font-extrabold text-white font-orbitron">
          About{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-oz-emerald">
            INSEES
          </span>
        </h2>
        <div className="w-24 h-1 bg-oz-emerald mx-auto mt-6 rounded-full" />
      </motion.div>

      <div className="w-full max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-5/12"
          >
            <motion.div
              animate={{ height: isExpanded ? 520 : 420 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl"
            >
              <Image
                src="/image.png"
                alt="INSEES"
                fill
                className="object-cover"
                priority
              />

              {/* Image Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                <p className="text-white font-orbitron font-bold text-xl">
                  Legacy of Innovation
                </p>
                <p className="text-oz-emerald text-sm font-mono">
                  EST. 2007
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="w-full lg:w-7/12 space-y-6"
          >
            <p className="sr-only">
              INSEES is the official Instrumentation and Electronics Engineering Society of
              NIT Silchar.
            </p>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light border-l-2 border-oz-emerald/50 pl-6">
              The{" "}
              <span className="font-semibold text-oz-emerald">
                Instrumentation and Engineering Society (INSEES)
              </span>{" "}
              is the official technical and cultural society of the{" "}
              <span className="font-semibold text-teal-400">
                Department of Electronics and Instrumentation Engineering,
                National Institute of Technology Silchar
              </span>
              .
            </p>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.45 }}
                  className="space-y-6 text-gray-400 text-base leading-relaxed pl-6 overflow-hidden"
                >
                  <p>
                    Established with the vision of nurturing innovation and
                    interdisciplinary learning, INSEES serves as a platform for
                    students to explore, collaborate, and excel in the fields of{" "}
                    <span className="text-blue-400 font-medium">
                      electronics, instrumentation, automation, and emerging
                      technologies
                    </span>
                    .
                  </p>

                  <p>
                    The society organizes workshops, hackathons, technical fests,
                    cultural events, sports, and community outreach — fostering
                    leadership, teamwork, and holistic development.
                  </p>

                  <p>
                    With its flagship event{" "}
                    <span className="text-oz-emerald font-semibold">
                      Alpha Crescendo
                    </span>
                    , along with annual Freshers and Farewell celebrations,
                    INSEES has become a vibrant hub of creativity within NIT
                    Silchar.
                  </p>

                  <p>
                    At its core, INSEES believes in{" "}
                    <span className="font-semibold text-oz-emerald">
                      learning by doing
                    </span>{" "}
                    — bridging the gap between academia and industry.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* TOGGLE */}
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-mono text-sm hover:bg-oz-emerald hover:text-black transition-all ml-6"
            >
              {isExpanded ? "READ LESS" : "READ FULL MANIFESTO"}
              {isExpanded ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          </motion.div>
        </div>

        {/* MISSION */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <MissionCard
            number="01"
            title="INSPIRE"
            desc="Encouraging curiosity, creativity, and lifelong learning."
          />
          <MissionCard
            number="02"
            title="INNOVATE"
            desc="Driving solutions in electronics and instrumentation."
          />
          <MissionCard
            number="03"
            title="LEAD"
            desc="Building leadership and real-world confidence."
          />
        </div>
      </div>
    </section>
  );
};

const MissionCard = ({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-zinc-900/50 border border-white/10 p-8 rounded-2xl transition-all"
  >
    <div className="text-6xl font-black text-white/10 font-orbitron mb-4">
      {number}
    </div>
    <h3 className="text-2xl font-bold text-white mb-3 font-orbitron">
      {title}
    </h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);
