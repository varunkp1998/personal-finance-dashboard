"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar"; // ✅ Ensure correct import

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
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    // ✅ Sync dark mode setting in localStorage whenever it changes
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* ✅ Ensure Navbar gets props */}
      {pathname !== "/login" && pathname !== "/signup" && (
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      )}
      <main className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
        {children}
      </main>
    </div>
  );
}
