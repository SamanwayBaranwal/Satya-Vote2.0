/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Satya Vote design system
        ink: {
          DEFAULT: "#0c1a2b", // deep navy headers
          900: "#0a1422",
          800: "#0c1a2b",
          700: "#13263d",
        },
        saffron: "#FF9933",
        leaf: {
          DEFAULT: "#16a34a", // primary emerald green
          50: "#ecfdf3",
          100: "#d1fadf",
          500: "#16a34a",
          600: "#13883e",
          700: "#0f6e32",
        },
        lotus: {
          DEFAULT: "#ec4899",
          500: "#ec4899",
          600: "#db2777",
        },
        cream: "#f7f6f2",
        canvas: "#f4f5f7",
      },
      fontFamily: {
        sans: ['"Space Grotesk"', "system-ui", "sans-serif"],
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        pixel: ['"Press Start 2P"', "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(12,26,43,0.06), 0 8px 24px rgba(12,26,43,0.06)",
        lift: "0 10px 30px rgba(12,26,43,0.10)",
      },
      keyframes: {
        "bubble-in": {
          "0%": { opacity: "0", transform: "translateY(6px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(22,163,74,0.5)" },
          "70%": { boxShadow: "0 0 0 10px rgba(22,163,74,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(22,163,74,0)" },
        },
      },
      animation: {
        "bubble-in": "bubble-in 0.3s ease-out",
        float: "float 4s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2s infinite",
      },
    },
  },
  plugins: [],
};