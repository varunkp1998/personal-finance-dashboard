import React from "react";
import { Metadata } from "next";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "Personal Finance Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
      <main className="container mx-auto">{children}</main>
      </body>
    </html>
  );
}
