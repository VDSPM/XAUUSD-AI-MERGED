import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0A0C0F",
          900: "#0E1114",
          850: "#12151A",
          800: "#161A20",
          700: "#1D2229",
          600: "#262C34",
          500: "#333B45",
        },
        line: {
          DEFAULT: "#232932",
          soft: "#1A1F26",
        },
        ink: {
          primary: "#E9E7E0",
          secondary: "#A7ADB8",
          muted: "#6B7280",
        },
        gold: {
          DEFAULT: "#C9A227",
          bright: "#E4BE4B",
          dim: "#8A6F1F",
        },
        buy: {
          DEFAULT: "#2FBF71",
          bright: "#43D888",
          dim: "#173D28",
        },
        sell: {
          DEFAULT: "#E0554C",
          bright: "#F17169",
          dim: "#3D1E1B",
        },
        wait: {
          DEFAULT: "#D9A441",
          bright: "#EABB5C",
          dim: "#3D2F14",
        },
        info: {
          DEFAULT: "#4E8FE0",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.02) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(201,162,39,0.25), 0 0 24px -4px rgba(201,162,39,0.35)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(180deg, rgba(201,162,39,0.06) 0%, rgba(201,162,39,0) 60%)",
      },
      borderRadius: {
        xl: "10px",
        "2xl": "14px",
      },
    },
  },
  plugins: [],
} satisfies Config;
