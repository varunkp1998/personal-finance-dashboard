"use client"; // ✅ Ensure this file runs on the client side

import { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import Chart from "../components/Chart";
import PieChart from "../components/PieChart";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netWorth, setNetWorth] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const { data: userData, error: userError } = await supabase.auth.getUser();
  
      console.log("Supabase User Data:", userData);
      console.error("Supabase User Error:", userError);
  
      if (!userData?.user) {
        console.error("User not logged in.");
        return;
      }
  
      const response = await fetch("/api/transactions");
      const data = await response.json();
  
      console.log("API Response:", data); // ✅ Debug response from API
  
      if (!Array.isArray(data)) {
        console.error("Error fetching transactions:", data?.error || "Unknown error");
        return;
      }
  
      setTransactions(data);
      calculateSummary(data);
    }
  
    fetchData();
  }, []);
  
  // ✅ Calculate financial summary
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

  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold text-gray-700">Dashboard</h1>

      {/* ✅ Financial Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <SummaryCard title="Total Income" amount={totalIncome} color="green" />
        <SummaryCard title="Total Expenses" amount={totalExpenses} color="red" />
        <SummaryCard title="Net Worth" amount={netWorth} color="blue" />
      </div>

      {/* ✅ Transactions Table */}
      <div className="bg-white p-4 mt-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b">
                  <td className="p-2">{new Date(txn.date).toLocaleDateString()}</td>
                  <td className="p-2">{txn.description}</td>
                  <td className="p-2">{txn.category}</td>
                  <td className={`p-2 font-semibold ${txn.type === "income" ? "text-green-500" : "text-red-500"}`}>
                    ₹{txn.amount.toLocaleString()} {/* ✅ Show formatted amount */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Charts Section (Side by Side, Smaller Size) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Income vs Expenses</h2>
          <div className="h-[300px] w-full flex justify-center items-center">
            <Chart transactions={transactions} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Expense Breakdown</h2>
          <div className="h-[300px] w-full flex justify-center items-center">
            <PieChart transactions={transactions} />
          </div>
        </div>
      </div>
    </section>
  );
}
