import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "flip-in": {
          "0%": { transform: "rotateY(90deg)", opacity: "0" },
          "100%": { transform: "rotateY(0deg)", opacity: "1" },
        },
        "result-pop": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "55%": { transform: "scale(1.18)", opacity: "1" },
          "75%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "result-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "15%": { transform: "translateX(-8px) rotate(-4deg)" },
          "30%": { transform: "translateX(7px) rotate(4deg)" },
          "45%": { transform: "translateX(-6px) rotate(-3deg)" },
          "60%": { transform: "translateX(5px) rotate(2deg)" },
          "75%": { transform: "translateX(-3px)" },
          "90%": { transform: "translateX(2px)" },
        },
        "ring-pop": {
          "0%": { transform: "scale(0.6)", opacity: "0.7" },
          "100%": { transform: "scale(1.7)", opacity: "0" },
        },
        "confetti-fall": {
          "0%": { transform: "translateY(-6px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(90px) rotate(360deg)", opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out",
        "pop": "pop 0.25s ease-out",
        "flip-in": "flip-in 0.3s ease-out",
        "result-pop": "result-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "result-shake": "result-shake 0.6s ease-in-out both",
        "ring-pop": "ring-pop 1s ease-out infinite",
        "confetti-fall": "confetti-fall 1.1s ease-in both",
      },
    },
  },
  plugins: [],
};
export default config;
