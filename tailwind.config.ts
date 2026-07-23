import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface1: "var(--surface-1)",
        surface2: "var(--surface-2)",
        border: "var(--border)",
        foreground: "var(--foreground)",
        muted: "var(--foreground-muted)",
        brand: {
          DEFAULT: "var(--brand-primary)",
          cyan: "var(--brand-cyan)",
          pink: "var(--brand-pink)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)",
      },
      borderRadius: {
        sm: "12px",
        md: "20px",
        lg: "28px",
        bubble: "18px",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "320ms",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "70%": { transform: "scale(1.4)", opacity: "0" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
        "bubble-in": {
          "0%": { transform: "translateY(6px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "match-burst": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "dot-pulse": {
          "0%, 80%, 100%": { opacity: "0.2" },
          "40%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(20px, -30px) scale(1.08)" },
        },
        breathe: {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(124,92,255,0.35)",
          },
          "50%": {
            transform: "scale(1.08)",
            boxShadow: "0 0 34px 8px rgba(124,92,255,0.28)",
          },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.4s ease-in-out infinite",
        "bubble-in": "bubble-in 200ms cubic-bezier(0.16,1,0.3,1)",
        "match-burst": "match-burst 280ms cubic-bezier(0.16,1,0.3,1)",
        "dot-pulse": "dot-pulse 1.2s ease-in-out infinite",
        float: "float 8s ease-in-out infinite",
        breathe: "breathe 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
