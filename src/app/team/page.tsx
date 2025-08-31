"use client";
import { useEffect, useState } from "react";
import { MemberCard } from "../../components/MemberCard";
import { Navbar } from "@/components/navbar";

interface Member {
  name: string;
  por: string;
  img: string;
  socials: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}

interface TeamData {
  [year: string]: {
    core: Member[];
    executive: Member[];
  };
}

export default function TeamPage() {
  const [teamData, setTeamData] = useState<TeamData>({});
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data: TeamData) => {
        setTeamData(data);

        // Default to the latest year
        const years = Object.keys(data).sort(); // ensure order
        if (years.length > 0) {
          setSelectedYear(years[years.length - 1]);
        }
      })
      .catch((err) => console.error("Failed to fetch team:", err));
  }, []);

  if (!selectedYear || !teamData[selectedYear]) return null;

  const { core, executive } = teamData[selectedYear];

  return (
    <>
      <Navbar />
      <div className="bg-black min-h-screen text-white">
        {/* Hero Banner */}
        <div className="relative w-full h-[60vh] flex items-center justify-center">
          <img
            src="/image.png"
            alt="team"
            className="absolute inset-0 w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative bg-black/50 rounded-xl px-8 py-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold">Team Members</h1>
            <p className="mt-4 text-gray-200 text-sm md:text-base">
              Instrumentation and Electronics Engineering Society <br />
              National Institute of Technology, Silchar
            </p>
          </div>
        </div>

        {/* Year Selector + Core Members */}
        <section className="py-12 px-6">
          <div className="flex flex-col md:flex-row justify-center items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center md:text-left">
              <span className="text-white">Core </span>
              <span className="text-gray-400">Members</span>
            </h2>

            {/* Year Dropdown */}
            <div className="absolute right-10">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-black border border-white/20 text-white rounded-lg px-4 py-2"
              >
                {Object.keys(teamData)
                  .sort()
                  .map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 place-items-center">
            {core.map((m, i) => (
              <MemberCard key={i} {...m} />
            ))}
          </div>
        </section>

        {/* Executive Members */}
        <section className="py-12 px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
            <span className="text-white">Executive </span>
            <span className="text-gray-400">Members</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 place-items-center">
            {executive.map((m, i) => (
              <MemberCard key={i} {...m} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
