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
    const user = localStorage.getItem("user"); // Replace with actual Supabase auth check
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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-700 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
            Sign In
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          <span>Don't have an account? </span>
          <a href="/signup" className="text-green-500 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
