"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage for dark mode preference
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <nav className="bg-blue-500 dark:bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Finance Dashboard</h1>
      <div className="flex items-center gap-4">
        <button onClick={toggleDarkMode} className="p-2 bg-gray-700 dark:bg-gray-300 rounded">
          {darkMode ? "🌙" : "☀️"}
        </button>
        <button onClick={() => router.push("/login")} className="p-2 bg-red-500 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}
