"use client"; // ✅ Fix: Mark this as a client component

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";

export default function Layout({ children }) {
  const pathname = usePathname();
  const showNavbar = pathname !== "/login" 
  const showNavbar1= pathname !== "/signup" 

  return (
    <div className="min-h-screen">
      {showNavbar &&showNavbar1&& <Navbar />}
      <main>{children}</main>
    </div>
  );
}
