/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A", // Deep Slate (Web primary)
        secondary: "#6366F1", // Indigo
        success: "#10B981", // Emerald
        danger: "#F43F5E", // Rose
        warning: "#F59E0B", // Amber
        surface: "#FFFFFF",
        background: "#F8FAFC", // Slate 50
        tma: {
          bg: "#020617",
          card: "#0F172A",
        },
        text: {
          DEFAULT: "#0F172A",
          secondary: "#64748B",
          light: "#94A3B8",
        }
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
      }
    },
  },
  plugins: [],
}
