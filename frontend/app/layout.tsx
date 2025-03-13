"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";

export default function Layout({ children }) {
  const pathname = usePathname();

  return (
    <>
      {/* Ensure Navbar is not duplicated */}
      {pathname !== "/login" && pathname !== "/signup" && <Navbar />}
      <main>{children}</main>
    </>
  );
}
