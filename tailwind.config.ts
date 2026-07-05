import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        parchment: "#f7f3ea",
        ember: "#e35d33",
        mana: "#2671d9",
        meadow: "#19a06f",
        coin: "#d89a18"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(38, 113, 217, 0.18)",
        lift: "0 18px 48px rgba(17, 24, 39, 0.12)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulsePath: {
          "0%, 100%": { opacity: "0.36" },
          "50%": { opacity: "0.82" }
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulsePath: "pulsePath 3.6s ease-in-out infinite",
        slideUp: "slideUp 0.7s ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
