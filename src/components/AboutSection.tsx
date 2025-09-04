import React from "react";

export const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-12"
    >
      {/* Heading stays the same */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-200 mb-8 sm:mb-10 md:mb-12 text-center">
        About INSEES
      </h2>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left side image */}
        <div className="relative flex justify-center">
          <div className="w-60 h-60 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
            <img
              src="/image.png" // replace with your image path
              alt="INSEES"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right side text */}
        <div className="space-y-5 text-gray-300 text-base sm:text-lg leading-relaxed">
          <p>
            INSEES is a pioneering initiative committed to driving innovation,
            research, and collaboration in emerging technologies. Our goal is to
            empower students, researchers, and professionals with the right
            resources and opportunities to excel in their respective fields.
          </p>
          <p>
            By fostering a culture of creativity, teamwork, and knowledge
            sharing, INSEES continues to make a meaningful impact across
            multiple domains. We believe in bridging the gap between academia
            and industry, enabling future-ready solutions for global challenges.
          </p>
          <p>
            Together, we aim to inspire, educate, and innovate — shaping the
            future of technology and society.
          </p>
        </div>
      </div>
    </section>
  );
};
