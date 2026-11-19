import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          tint: "var(--primary-tint)",
        },
        accent: "var(--accent)",
        ok: "var(--ok)",
        warn: {
          DEFAULT: "var(--warn)",
          bg: "var(--warn-bg)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          bg: "var(--danger-bg)",
        },
      },
      borderRadius: {
        card: "16px",
      },
      minHeight: {
        touch: "56px",
      },
      minWidth: {
        touch: "56px",
      },
      fontSize: {
        "scale-14": ["14px", { lineHeight: "1.5" }],
        "scale-16": ["16px", { lineHeight: "1.5" }],
        "scale-18": ["18px", { lineHeight: "1.5" }],
        "scale-20": ["20px", { lineHeight: "1.5" }],
        "scale-24": ["24px", { lineHeight: "1.5" }],
        "scale-32": ["32px", { lineHeight: "1.5" }],
      },
    },
  },
  plugins: [],
};

export default config;
