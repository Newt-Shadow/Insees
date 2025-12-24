module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        glowBlue:
          "0 0 0 1px rgba(59,130,246,.3), 0 0 40px 6px rgba(59,130,246,.25)",
        glowGreen:
          "0 0 0 1px rgba(34,197,94,.3), 0 0 38px 6px rgba(34,197,94,.25)",
        glowAmber:
          "0 0 0 1px rgba(245,158,11,.3), 0 0 38px 8px rgba(245,158,11,.3)",
        glowOrange:
          "0 0 0 1px rgba(249,115,22,.3), 0 0 40px 8px rgba(249,115,22,.3)",
      },
      backgroundImage: {
        heroRadial:
          "radial-gradient(1200px 600px at 50% 40%, rgba(255,255,255,.06), transparent)",
      },
    },
  },
  plugins: [],
};
