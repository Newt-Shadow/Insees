"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { FaRocket, FaGraduationCap, FaUsers, FaRegCalendarAlt, FaMicrochip } from "react-icons/fa";

// ✅ ADDED "export" HERE
export interface EventType {
  id: number;
  title: string;
  description: string;
  highlight: string;
  color: "amber" | "green" | "blue" | "orange";
  icon: "FaRocket" | "FaGraduationCap" | "FaUsers" | "default";
}

interface EventsTimelineProps {
  events: EventType[];
}

const EventNode = ({ event, index }: { event: EventType; index: number }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, type: "spring" }}
      className={`
        relative flex w-full mb-20
        flex-col md:flex-row
        md:items-center md:justify-between
        ${isEven ? "md:flex-row-reverse" : "md:flex-row"}
      `}
    >
      {/* Spacer (desktop only) */}
      <div className="hidden md:block w-5/12" />

      {/* Central / Mobile Node */}
      <div
        className="
          relative md:absolute
          md:left-1/2 md:-translate-x-1/2
          z-20
          mb-6 md:mb-0
          flex justify-center md:block
        "
      >
        <div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 bg-black flex items-center justify-center
            shadow-[0_0_20px_currentColor] transition-transform duration-500 hover:scale-125
            ${event.color === "amber"
              ? "border-amber-400 text-amber-400"
              : event.color === "green"
                ? "border-oz-emerald text-oz-emerald"
                : "border-blue-400 text-blue-400"
            }
          `}
        >
          {event.icon === "FaRocket" && <FaRocket />}
          {event.icon === "FaUsers" && <FaUsers />}
          {event.icon === "FaGraduationCap" && <FaGraduationCap />}
          {event.icon === "default" && <FaMicrochip />}
        </div>
      </div>

      {/* Data Card */}
      <div className="w-full md:w-5/12 group">
        <div className="relative p-5 md:p-6 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-oz-emerald/50 transition-colors duration-300">
          {/* Scanline */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-oz-emerald to-transparent opacity-0 group-hover:opacity-100 animate-scan pointer-events-none" />

          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-[10px] md:text-xs font-mono px-2 py-0.5 rounded border ${event.color === "amber"
                ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                : event.color === "green"
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : "border-blue-500/30 bg-blue-500/10 text-blue-400"
                }`}
            >
              {"// SEQ_"}
              {event.id < 10 ? `0${event.id}` : event.id}
            </span>
            <h3 className="text-lg md:text-xl font-bold font-orbitron text-white">
              {event.title}
            </h3>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            <span className="text-white font-bold">{event.highlight}</span>{" "}
            {event.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};


export const EventsTimeline: React.FC<EventsTimelineProps> = ({ events }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  if (!events || events.length === 0) return null;

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden bg-black">
      {/* Header */}
      <div className="text-center mb-24 relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">
          CHRONO <span className="text-oz-emerald">CIRCUIT</span>
        </h2>
        <p className="text-gray-500 font-mono mt-2">Historical Event Log & Future Trajectories</p>
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        {/* The Center Line (Background) */}
        <div
          className="
            absolute
            left-6 md:left-1/2
            top-0 bottom-0
            w-1
            bg-white/5
            md:-translate-x-1/2
            rounded-full
          "
        />

        {/* The Glowing Line (Foreground - Animated) */}
        <motion.div
          style={{ scaleY, originY: 0 }}
          className="
            absolute
            left-6 md:left-1/2
            top-0 bottom-0
            w-1
            bg-gradient-to-b from-oz-gold via-oz-emerald to-blue-500
            md:-translate-x-1/2
            rounded-full
            shadow-[0_0_15px_rgba(80,200,120,0.5)]
            z-10
          "
        />

        {/* Events */}
        <div className="relative z-20">
          {events.map((event, index) => (
            <EventNode key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
