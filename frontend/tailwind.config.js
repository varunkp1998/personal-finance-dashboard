/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ Ensure dark mode is class-based
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
