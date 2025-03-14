"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // ✅ Load dark mode preference from localStorage
    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);

    // ✅ Apply class to <html>
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // ✅ Update dark mode state when toggled
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");

      // ✅ Apply dark mode class to <html>
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      return newMode;
    });
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* ✅ Show Navbar on all pages except login/signup */}
      {pathname !== "/login" && pathname !== "/signup" && (
        <Navbar darkMode={darkMode} setDarkMode={toggleDarkMode} />
      )}

      {/* ✅ Ensure dark mode applies to all content */}
      <main className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
        {children}
      </main>
    </div>
  );
}
