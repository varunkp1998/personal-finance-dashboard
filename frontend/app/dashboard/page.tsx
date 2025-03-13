"use client"; // ✅ Ensure this file runs on the client side

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import SummaryCard from "../components/SummaryCard";
import Chart from "../components/Chart";
import PieChart from "../components/PieChart";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // ✅ Store user state
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netWorth, setNetWorth] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/login"); // ✅ Redirect before loading anything
        return;
      }

      setUser(data.user);
      setLoading(false);
    };

    checkAuth();

    // ✅ Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push("/login"); // ✅ Redirect if user logs out
      } else {
        setUser(session.user);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]); // ✅ Fetch transactions only after user is set

  const fetchTransactions = async () => {
    if (!user) return;

    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error.message);
      return;
    }

    setTransactions(transactions);
    calculateSummary(transactions);
  };

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

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-xl font-bold text-gray-700">Loading...</div>;
  }

  return (
    <section className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SummaryCard title="Total Income" amount={totalIncome} color="green" />
        <SummaryCard title="Total Expenses" amount={totalExpenses} color="red" />
        <SummaryCard title="Net Worth" amount={netWorth} color="blue" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-100 text-gray-700">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{new Date(txn.date).toLocaleDateString()}</td>
                    <td className="p-3">{txn.description}</td>
                    <td className="p-3">{txn.category}</td>
                    <td className={`p-3 font-semibold ${txn.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      ₹{txn.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700">Income vs Expenses</h2>
          <div className="h-[300px] w-full flex justify-center items-center">
            <Chart transactions={transactions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700">Expense Breakdown</h2>
          <div className="h-[300px] w-full flex justify-center items-center">
            <PieChart transactions={transactions} />
          </div>
        </div>
      </div>
    </section>
  );
}
