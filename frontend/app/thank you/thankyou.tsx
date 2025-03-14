"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ThankYou() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login after 5 seconds
    const timeout = setTimeout(() => {
      router.push("/login");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4">🎉 Thank You for Signing Up! 🎉</h1>
      <p className="text-lg mb-6">Your account has been created successfully.</p>
      <button
        onClick={() => router.push("/login")}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Go to Login
      </button>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Redirecting to login in 5 seconds...
      </p>
    </div>
  );
}
