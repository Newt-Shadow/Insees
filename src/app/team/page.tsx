"use client";
import { useEffect, useState } from "react";
import { MemberCard } from "../../components/MemberCard";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";

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

        const years = Object.keys(data).sort();
        if (years.length > 0) {
          setSelectedYear(years[years.length - 1]);
        }
      })
      .catch((err) => console.error("Failed to fetch team:", err));
  }, []);

  if (!selectedYear || !teamData[selectedYear]) return null;

  const { core, executive } = teamData[selectedYear];

  // Animation variants
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

  return (
    <>
      <Navbar />
      <div className="bg-black min-h-screen text-white">
        {/* Hero Banner */}
        <div className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center">
          <img
            src="/image.png"
            alt="team"
            className="absolute inset-0 w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative bg-black/50 rounded-xl px-6 md:px-12 py-6 text-center max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
              Team Members
            </h1>
            <p className="mt-4 text-gray-200 text-sm md:text-base">
              Instrumentation and Electronics Engineering Society <br />
              National Institute of Technology, Silchar
            </p>
          </div>
        </div>

        {/* Core Members */}
        <section className="py-12 px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col items-center sm:flex-row sm:justify-center gap-4 mb-10">
            {/* Year Dropdown */}
            <div className="flex flex-col md:flex-row sm:items-center sm:justify-between gap-4 mb-10">
              {/* Core Members Heading */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center sm:text-left">
                <span className="text-white">Core </span>
                <span className="text-gray-400">Members</span>
              </h2>

              {/* Year Dropdown */}
              <div className="md:absolute md:right-12">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-black/50 border border-white/20 text-white rounded-xl px-4 py-2 text-sm sm:text-base shadow-md backdrop-blur-md"
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


           
          </div>

          {/* Cards with staggered animation */}
          <motion.div
            className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {core.map((m, i) => (
              <motion.div key={i} variants={itemVariants}>
                <MemberCard {...m} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Executive Members */}
        <section className="py-12 px-4 sm:px-6 lg:px-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-10">
            <span className="text-white">Executive </span>
            <span className="text-gray-400">Members</span>
          </h2>
          <motion.div
            className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {executive.map((m, i) => (
              <motion.div key={i} variants={itemVariants}>
                <MemberCard {...m} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </>
  );
}
