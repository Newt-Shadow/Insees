"use client";

import {
  FaRocket,
  FaGraduationCap,
  FaUsers,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";

interface EventType {
  id: number;
  title: string;
  description: string;
  highlight: string;
  color: "amber" | "green" | "blue" | "orange";
  icon: "FaRocket" | "FaGraduationCap" | "FaUsers" | "default";
}

export const EventsTimeline: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const icons: Record<string, React.ReactNode> = {
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

  if (loading) {
    return (
      <section
        id="events"
        className="w-full min-h-screen flex items-center justify-center text-gray-400"
      >
        Loading events...
      </section>
    );
  }

  return (
    <section
      id="events"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 font-sans"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-gray-300 mb-16 relative z-10">
        Events <span className="text-gray-400 font-medium">Timeline</span>
      </h2>

      <div className="flex flex-col gap-16 w-full max-w-3xl relative z-10">
        <div className="absolute left-[22px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/20 to-transparent" />

        {events.map((event) => (
          <div key={event.id} className="relative pl-16">
            {/* Icon with glow */}
            <div
              className={`absolute left-0 top-1 flex items-center justify-center w-10 h-10 rounded-full ${
                glowColors[event.color] || glowColors.amber
              }`}
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

            {/* Highlight + Description */}
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
