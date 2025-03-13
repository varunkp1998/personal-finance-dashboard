import Navbar from "./components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Navbar /> {/* ✅ Add the Navbar here */}
        <main className="max-w-screen-lg mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
