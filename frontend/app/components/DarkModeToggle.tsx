"use client";

import { useEffect } from "react";
import { Dispatch, SetStateAction } from "react";

interface DarkModeToggleProps {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
}

export default function DarkModeToggle({ darkMode, setDarkMode }: DarkModeToggleProps) {
  // Apply dark mode class to <body> on mount and when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark"); // ✅ Ensure <body> gets dark mode
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark"); // ✅ Remove dark mode from <body>
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark"); // ✅ Apply dark mode to <body>
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark"); // ✅ Remove from <body>
    }
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
