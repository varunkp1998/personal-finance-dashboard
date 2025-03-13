"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user"); // Replace with actual auth check
    if (!user) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center p-4 bg-black/30 backdrop-blur-md">
        <h1 className="text-xl font-bold">Finance Dashboard</h1>
        <ul className="hidden md:flex space-x-6">
          <li className="hover:text-gray-300 cursor-pointer">Home</li>
          <li className="hover:text-gray-300 cursor-pointer">Features</li>
          <li className="hover:text-gray-300 cursor-pointer">Contact</li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center h-screen text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-bold"
        >
          Welcome to Your Personal Finance Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-4 text-lg md:text-xl"
        >
          Manage your income, expenses, and investments with ease.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-6 px-6 py-3 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:bg-gray-200"
          onClick={() => router.push("/dashboard")}
        >
          Get Started
        </motion.button>
      </div>
    </div>
  );
}
