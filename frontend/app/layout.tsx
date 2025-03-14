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

    // ✅ Apply dark mode class to <html>
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    // ✅ Sync dark mode setting in localStorage whenever it changes
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* ✅ Navbar receives props */}
      {pathname !== "/login" && pathname !== "/signup" && (
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      )}

      {/* ✅ Ensure dark mode applies to the whole page */}
      <main className={`min-h-screen transition-all duration-300 ease-in-out ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
        {children}
      </main>
    </div>
  );
}
