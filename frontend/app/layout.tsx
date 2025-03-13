"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar"; // Ensure this is the correct path
import { supabase } from "./lib/supabase";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data?.user);
    }
    checkAuth();
  }, []);

  // ✅ Don't show Navbar on login or signup pages
  const hideNavbar = pathname === "/login" || pathname === "/signup";

  return (
    <html lang="en">
      <body className="bg-gray-100">
        {!hideNavbar && isAuthenticated && <Navbar />}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
