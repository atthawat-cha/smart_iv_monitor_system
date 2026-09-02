import type { Config } from "tailwindcss";

// Design tokens per "018 UXUI/UX-UI Design.md": dark theme, desktop nurse-station
// target (1600x960), accent purple, Space Grotesk (display) + Plus Jakarta Sans (body).
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#07080d",
        accent: "#7c6cff",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
