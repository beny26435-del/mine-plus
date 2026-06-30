import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#F2D335",
        graphite: "#121212",
        navy: "#0B1220",
        steel: "#5B6573",
        silver: "#D9DEE5",
        soft: "#F7F9FC"
      },
      boxShadow: {
        glow: "0 0 40px rgba(242, 211, 53, 0.18)",
        panel: "0 18px 45px rgba(11, 18, 32, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
