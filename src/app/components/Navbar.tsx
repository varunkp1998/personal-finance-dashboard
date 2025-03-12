"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // Redirect to login after logout
  };
  

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600 shadow-md p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Finance Dashboard</h1>
        <ul className="flex space-x-6 text-white">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/dashboard">Dashboard</Link></li>
          <li><Link href="/transactions">Transactions</Link></li>
          <li><Link href="/profile">Profile</Link></li>
          <li>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
