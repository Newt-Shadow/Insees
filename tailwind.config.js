module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oz: {
          emerald: "#10b981",
          gold: "#fbbf24",
          ruby: "#ef4444",
          dark: "#022c22",
        }
      },
      fontFamily: {
        // FIX: Connect the CSS variables from layout.tsx
        sans: ["var(--font-poppins)", "ui-sans-serif", "system-ui"],
        orbitron: ["var(--font-orbitron)", "sans-serif"],
      },
      boxShadow: {
        glowEmerald: "0 0 20px 5px rgba(16, 185, 129, 0.4)",
        glowGold: "0 0 20px 5px rgba(251, 191, 36, 0.4)",
        // New stronger glow for headings
        neon: "0 0 10px rgba(16,185,129,0.5), 0 0 20px rgba(16,185,129,0.3)",
      },
      backgroundImage: {
        heroRadial: "radial-gradient(1200px 600px at 50% 40%, rgba(255,255,255,.06), transparent)",
        ozGradient: "radial-gradient(circle at center, #064e3b 0%, #000000 100%)", 
      },
    },
  },
  plugins: [],
};