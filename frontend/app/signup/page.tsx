"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import Image from "next/image";
import signupImage from "@/public/signup-illustration.svg"; // Add an image to public folder

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error, data } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Image Section */}
      <div className="hidden md:flex items-center justify-center w-1/2 bg-green-500">
        <Image src={signupImage} alt="Signup Illustration" className="w-3/4" />
      </div>

      {/* Form Section */}
      <div className="flex flex-col justify-center w-full md:w-1/2 p-8 md:p-16">
        <h2 className="text-3xl font-bold text-center text-gray-700">Sign Up</h2>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        <form className="mt-6 space-y-4" onSubmit={handleSignUp}>
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
          <button className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition">
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
