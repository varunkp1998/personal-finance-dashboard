import HeroSection from "./components/HeroSection";

export default function Home() {
  return (
    <section className="mt-16">
      <HeroSection />
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-700 text-center">
          Welcome to Your Personal Finance Dashboard
        </h2>
        <p className="text-gray-500 text-center mt-2">
          Manage your income, expenses, and investments with ease.
        </p>
      </div>
    </section>
  );
}
