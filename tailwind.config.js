/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'oz-emerald': '#50C878', // Emerald Green
        'oz-gold': '#FFD700',    // Yellow Brick Gold
        'oz-dark': '#020402',    // Deep Forest Black
      },
      fontFamily: {
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
      animation: {
        'scroll': 'scroll 40s linear infinite',
        'glitch': 'glitch 1s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'heroRadial': 'radial-gradient(circle at center, #111 0%, #000 100%)',
      }
    },
  },
  plugins: [],
};