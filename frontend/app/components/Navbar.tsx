"use client"; // ✅ Ensure it's a Client Component

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">Finance Dashboard</h1>
        <div className="space-x-4">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/transactions" className="hover:underline">Transactions</Link>
          <Link href="/logout" className="hover:underline">Logout</Link>
        </div>
      </div>
    </nav>
  );
}
