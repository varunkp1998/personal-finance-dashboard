import HeroSection from "./components/HeroSection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-600">
          Welcome to Your Personal Finance Dashboard
        </h1>
        <p className="mt-4 text-gray-700 text-center text-lg md:text-xl">
          Manage your income, expenses, and investments with ease.
        </p>
        <div className="flex justify-center mt-6">
          <a href="/dashboard" className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition">
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}
