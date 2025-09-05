import React from "react";

export const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-12"
    >
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-200 mb-12 text-center">
        About INSEES
      </h2>

      <div className="w-full max-w-6xl">
        {/* Float-style layout */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Image on left */}
          <div className="flex-shrink-0 w-full max-w-xs mx-auto lg:mx-0">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
              <img
                src="/image.png" // replace with actual image
                alt="INSEES"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Text on right */}
          <div className="flex-1 space-y-5 text-gray-300 text-base sm:text-lg leading-relaxed">
            <p>
              The{" "}
              <span className="font-semibold text-amber-300">
                Instrumentation and Engineering Society (INSEES)
              </span>{" "}
              is the official technical and cultural society of the{" "}
              <span className="font-semibold text-green-300">
                Department of Electronics and Instrumentation Engineering,
                National Institute of Technology Silchar
              </span>
              .
            </p>
            <p>
              Established with the vision of nurturing innovation and
              interdisciplinary learning, INSEES serves as a platform for students
              to explore, collaborate, and excel in the fields of{" "}
              <span className="text-blue-300 font-medium">
                electronics, instrumentation, automation, and emerging technologies
              </span>
              .
            </p>
            <p>
              The society organizes a wide range of activities — from{" "}
              <span className="text-orange-300 font-medium">
                workshops, hackathons, and technical fests
              </span>{" "}
              to{" "}
              <span className="text-orange-300 font-medium">
                cultural events, sports, and community outreach
              </span>
              . These initiatives not only strengthen technical proficiency but
              also encourage leadership, teamwork, and holistic development among
              students.
            </p>
            <p>
              With its flagship event{" "}
              <span className="text-amber-300 font-semibold">Alpha Crescendo</span>
              , along with annual{" "}
              <span className="text-green-300 font-semibold">Freshers</span> and{" "}
              <span className="text-blue-300 font-semibold">Farewell</span>{" "}
              celebrations, INSEES has become a vibrant hub of creativity and
              innovation within NIT Silchar.
            </p>
            <p>
              At its core, INSEES believes in{" "}
              <span className="font-semibold text-amber-300">learning by doing</span>{" "}
              — bridging the gap between academia and industry while preparing its
              members to address real-world challenges with skill, confidence, and
              vision.
            </p>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="w-full mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Inspire",
              desc: "Encouraging curiosity, creativity, and a passion for lifelong learning.",
            },
            {
              title: "Innovate",
              desc: "Driving forward-thinking solutions in electronics, instrumentation, and beyond.",
            },
            {
              title: "Lead",
              desc: "Building leadership, teamwork, and confidence for real-world impact.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-amber-300 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
