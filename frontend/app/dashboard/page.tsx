"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import Chart from "../components/Chart";
import PieChart from "../components/PieChart";
import Navbar from "../components/Navbar";
import { 
  Card, CardContent, Typography, Grid, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, 
  IconButton 
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
    calculateSummary(data);
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

  const handleUpdate = (id) => {
    console.log("Update transaction:", id);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) {
      console.error("Error deleting transaction:", error.message);
      return;
    }
    setTransactions(transactions.filter((txn) => txn.id !== id));
  };

  // ✅ Prevent dashboard from rendering before authentication check
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-bold text-gray-700">
        Checking authentication...
      </div>
    );
  }

  return (
    <>
      <section className="p-6 bg-gray-100 min-h-screen mt-25"> 

        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Dashboard</h1>

        {/* Summary Cards */}
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

        {/* Transactions Table */}
        <Card sx={{ mt: 6, p: 3, boxShadow: 3 }}>
          <Typography variant="h5" className="text-gray-700 mb-4">
            Recent Transactions
          </Typography>
          {transactions.length === 0 ? (
            <Typography className="text-gray-500 text-center">No transactions found.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                    <TableCell><b>Date</b></TableCell>
                    <TableCell><b>Description</b></TableCell>
                    <TableCell><b>Category</b></TableCell>
                    <TableCell><b>Amount (₹)</b></TableCell>
                    <TableCell align="center"><b>Actions</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                      <TableCell>{txn.description}</TableCell>
                      <TableCell>{txn.category}</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: txn.type === "income" ? "green" : "red" }}>
                        ₹{txn.amount.toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleUpdate(txn.id)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(txn.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>

        {/* Charts Section */}
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
    </>
  );
}
