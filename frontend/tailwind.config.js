/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // ✅ Ensures dark mode works by adding the 'dark' class to <html>
  theme: {
    extend: {},
  },
  plugins: [],
};
