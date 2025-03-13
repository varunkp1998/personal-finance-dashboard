"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/dashboard");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error, data } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      localStorage.setItem("user", JSON.stringify(data));
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ✅ Image Section */}
      <div className="hidden md:flex items-center justify-center w-1/2 bg-blue-500">
        <img src="/loginImage.svg" alt="Login Illustration" className="w-3/4" />
      </div>

      {/* ✅ Form Section */}
      <div className="flex flex-col justify-center w-full md:w-1/2 p-8 md:p-16">
        <h2 className="text-3xl font-bold text-center text-gray-700">Login</h2>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

        <form className="mt-6 space-y-5" onSubmit={handleLogin}>
          {/* ✅ Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-600 font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* ✅ Password Field */}
          <div>
            <label htmlFor="password" className="block text-gray-600 font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* ✅ Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            Sign In
          </button>
        </form>

        {/* ✅ Signup Link */}
        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-green-500 font-medium hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
