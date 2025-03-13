"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import Chart from "../components/Chart";
import PieChart from "../components/PieChart";
import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netWorth, setNetWorth] = useState(0);

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
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-bold text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <section className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Dashboard</h1>

      {/* ✅ Summary Cards with Material-UI */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: "#e3fcef", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="green" fontWeight="bold">
                Total Income
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                ₹{totalIncome.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: "#ffe6e6", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="red" fontWeight="bold">
                Total Expenses
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                ₹{totalExpenses.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: "#e6f2ff", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="blue" fontWeight="bold">
                Net Worth
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                ₹{netWorth.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ✅ Transactions Table */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
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
                    <td
                      className={`p-3 font-semibold ${
                        txn.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ₹{txn.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ Charts Section */}
      {transactions.length > 0 && (
        <Grid container spacing={3} className="mt-6">
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: 3 }}>
              <Typography variant="h6" className="text-gray-700 text-center">
                Income vs Expenses
              </Typography>
              <div className="h-[300px] flex justify-center items-center">
                <Chart transactions={transactions} />
              </div>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: 3 }}>
              <Typography variant="h6" className="text-gray-700 text-center">
                Expense Breakdown
              </Typography>
              <div className="h-[300px] flex justify-center items-center">
                <PieChart transactions={transactions} />
              </div>
            </Card>
          </Grid>
        </Grid>
      )}
    </section>
  );
}
