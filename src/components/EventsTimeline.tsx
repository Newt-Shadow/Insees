"use client";
import React from "react";
import eventsData from "../../public/data/events.json";
import {
  FaRocket,
  FaGraduationCap,
  FaUsers,
  FaRegCalendarAlt,
} from "react-icons/fa";

export const EventsTimeline: React.FC = () => {
  const icons: any = {
    FaRocket: <FaRocket className="text-white text-sm" />,
    FaGraduationCap: <FaGraduationCap className="text-white text-sm" />,
    FaUsers: <FaUsers className="text-white text-sm" />,
    default: <FaRegCalendarAlt className="text-white text-sm" />,
  };

  const glowColors: Record<string, string> = {
    amber: "bg-amber-500 shadow-glowAmber",
    green: "bg-green-600 shadow-glowGreen",
    blue: "bg-blue-600 shadow-glowBlue",
    orange: "bg-orange-500 shadow-glowOrange",
  };

  return (
    <section
      id="events"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 font-sans"
    >
      {/* Radial Gradient BG */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] ] pointer-events-none" />

      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-bold text-gray-300 mb-16 relative z-10">
        Events <span className="text-gray-400 font-medium">Timeline</span>
      </h2>

      {/* Timeline wrapper */}
      <div className="flex flex-col gap-16 w-full max-w-3xl relative z-10">
        {/* Vertical line full height */}
        <div className="absolute left-[22px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/20 to-transparent" />

        {eventsData.map((event, index) => (
          <div key={event.id} className="relative pl-16">
            {/* Glowing Icon */}
            <div
              className={`absolute left-0 top-1 flex items-center justify-center w-10 h-10 rounded-full ${glowColors[event.color] || glowColors.amber}`}
            >
              {icons[event.icon] || icons.default}
            </div>

            {/* Title */}
            <h3
              className={`text-sm mb-2 ${
                event.color === "amber"
                  ? "text-amber-400"
                  : event.color === "green"
                  ? "text-green-400"
                  : event.color === "blue"
                  ? "text-blue-400"
                  : "text-orange-400"
              }`}
            >
              {event.title}
            </h3>

            {/* Description */}
            <p className="text-lg text-gray-200 leading-relaxed">
              <span
                className={`font-semibold ${
                  event.color === "amber"
                    ? "text-amber-300"
                    : event.color === "green"
                    ? "text-green-300"
                    : event.color === "blue"
                    ? "text-blue-300"
                    : "text-orange-300"
                }`}
              >
                {event.highlight}
              </span>{" "}
              {event.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
