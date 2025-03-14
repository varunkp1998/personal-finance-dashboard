"use client";

import { Dispatch, SetStateAction } from "react";

interface DarkModeToggleProps {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
}

export default function DarkModeToggle({ darkMode, setDarkMode }: DarkModeToggleProps) {
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", darkMode ? "light" : "dark");
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg transition duration-300"
    >
      {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
