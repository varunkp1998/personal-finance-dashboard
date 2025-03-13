"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SummaryCard from "../components/SummaryCard";
import Chart from "../components/Chart";
import PieChart from "../components/PieChart";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netWorth, setNetWorth] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        router.replace("/login");
        return;
      }

      setUser(data.user);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error.message);
      return;
    }

    setTransactions(data);
    filterTransactions(data);
    calculateSummary(data);
  };

  const filterTransactions = (data) => {
    let filteredData = data;

    if (searchQuery) {
      filteredData = filteredData.filter((txn) =>
        txn.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filteredData = filteredData.filter((txn) => txn.type.toLowerCase() === categoryFilter);
    }

    setFilteredTransactions(filteredData);
  };

  useEffect(() => {
    filterTransactions(transactions);
  }, [searchQuery, categoryFilter]);

  const calculateSummary = (data) => {
    let income = 0,
      expenses = 0;

    data.forEach((transaction) => {
      if (transaction.type.toLowerCase() === "income") {
        income += transaction.amount;
      } else if (transaction.type.toLowerCase() === "expense") {
        expenses += transaction.amount;
      }
    });

    setTotalIncome(income);
    setTotalExpenses(expenses);
    setNetWorth(income - expenses);
  };

  const indexOfLastTxn = currentPage * transactionsPerPage;
  const indexOfFirstTxn = indexOfLastTxn - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTxn, indexOfLastTxn);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-xl font-bold text-gray-700">Loading...</div>;
  }

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
      <Navbar />

      <div className="p-6">
        <h1 className="text-4xl font-bold text-center mb-6">Dashboard</h1>

        {/* Search & Filters */}
        <div className="mb-4 flex flex-col md:flex-row justify-between gap-4">
          <input
            type="text"
            placeholder="Search transactions..."
            className="p-2 border rounded w-full md:w-1/3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="p-2 border rounded w-full md:w-1/4"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SummaryCard title="Total Income" amount={totalIncome} color="green" />
          <SummaryCard title="Total Expenses" amount={totalExpenses} color="red" />
          <SummaryCard title="Net Worth" amount={netWorth} color="blue" />
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
          {currentTransactions.length === 0 ? (
            <p className="text-gray-500 text-center">No transactions found.</p>
          ) : (
            <table className="w-full border-collapse text-sm">
              {/* Table Header */}
              <thead className="bg-blue-100 dark:bg-gray-600 text-gray-700 dark:text-white">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Amount (₹)</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {currentTransactions.map((txn) => (
                  <tr key={txn.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="p-3">{new Date(txn.date).toLocaleDateString()}</td>
                    <td className="p-3">{txn.description}</td>
                    <td className="p-3">{txn.category}</td>
                    <td className="p-3 font-semibold">₹{txn.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
