import Link from "next/link";
import SummaryCard from "../components/SummaryCard";
import Chart from "../components/Chart";
import TransactionList from "../components/TransactionList";
import InvestmentList from "../components/InvestmentList";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold text-blue-600">Finance Dashboard</h1>
        <ul className="flex space-x-6 text-gray-700">
          <li>
            <Link href="/dashboard" className="hover:text-blue-500 font-medium">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/transactions" className="hover:text-blue-500 font-medium">
              Transactions
            </Link>
          </li>
          <li>
            <Link href="/investments" className="hover:text-blue-500 font-medium">
              Investments
            </Link>
          </li>
          <li>
            <Link href="/logout" className="hover:text-red-500 font-medium">
              Logout
            </Link>
          </li>
        </ul>
      </nav>

      {/* Dashboard Content */}
      <section className="p-6 max-w-6xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard title="Total Income" amount={5000} color="green" />
          <SummaryCard title="Total Expenses" amount={2000} color="red" />
          <SummaryCard title="Net Worth" amount={3000} color="blue" />
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Financial Overview</h2>
          <Chart />
        </div>

        {/* Transactions & Investments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Transactions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">Recent Transactions</h2>
            <TransactionList />
          </div>

          {/* Investments */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">Investment Portfolio</h2>
            <InvestmentList />
          </div>
        </div>
      </section>
    </div>
  );
}
