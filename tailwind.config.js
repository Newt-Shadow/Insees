module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}", // Ensure 'src' is included if your structure uses it
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oz: {
          emerald: "#10b981", // Neon Green for Emerald City
          gold: "#fbbf24",    // Yellow Brick Road
          ruby: "#ef4444",    // Ruby Slippers (Accents)
          dark: "#022c22",    // Deep Green Background
        }
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        // ... keep your existing shadows
        glowEmerald: "0 0 20px 5px rgba(16, 185, 129, 0.4)",
        glowGold: "0 0 20px 5px rgba(251, 191, 36, 0.4)",
      },
      backgroundImage: {
        heroRadial: "radial-gradient(1200px 600px at 50% 40%, rgba(255,255,255,.06), transparent)",
        // New Gradient for the Fest Page
        ozGradient: "radial-gradient(circle at center, #064e3b 0%, #000000 100%)", 
      },
    },
  },
  plugins: [],
};