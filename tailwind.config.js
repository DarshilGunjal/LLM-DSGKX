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
        background: "#0B0B0C",
        ink: {
          DEFAULT: "#F2EFE9",
          muted: "rgba(242, 239, 233, 0.6)",
          faint: "rgba(242, 239, 233, 0.2)",
          subtle: "rgba(242, 239, 233, 0.08)",
        },
        accent: {
          DEFAULT: "#FF3B00",
          hover: "#E03400",
          faint: "rgba(255, 59, 0, 0.15)",
          border: "rgba(255, 59, 0, 0.4)",
        },
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "Instrument Serif", "Georgia", "serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        none: "0px",
        DEFAULT: "0px",
      },
      boxShadow: {
        none: "none",
        hard: "4px 4px 0px 0px #FF3B00",
        hardInk: "4px 4px 0px 0px #F2EFE9",
      },
    },
  },
  plugins: [],
};
