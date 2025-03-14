"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Papa from "papaparse"; // ✅ Install via `npm install papaparse`
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";

interface Transaction {
  id?: number;
  date: string;
  amount: number;
  category: string;
  description: string;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    date: "",
    amount: 0,
    category: "",
    description: "",
  });

  // ✅ Fetch transactions on load
  useEffect(() => {
    async function fetchTransactions() {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });
  
      if (error) {
        console.error("Error fetching transactions:", error.message);
      } else {
        setTransactions(data ?? []); // ✅ Ensure `transactions` is always an array
      }
    }
    fetchTransactions();
  }, []);
  // ✅ Handle CSV File Upload & Import
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        const parsedData: Transaction[] = result.data.map((row: any) => ({
          date: row.date,
          amount: parseFloat(row.amount),
          category: row.category,
          description: row.description,
        }));

        // ✅ Insert into Supabase
        const { data, error } = await supabase
  .from("transactions")
  .insert(parsedData)
  .select("*"); // ✅ Ensures `data` is not null

if (error) {
  console.error("Error inserting transactions:", error.message);
} else {
  setTransactions([...transactions, ...(data ?? [])]); // ✅ Prevents null from being spread
}

        setUploading(false);
      },
    });
  };

  // ✅ Handle Manual Transaction Submission
  const handleManualSubmit = async () => {
    if (!newTransaction.date || !newTransaction.amount || !newTransaction.category) {
      alert("Please fill all fields.");
      return;
    }

    const { data, error } = await supabase.from("transactions").insert([newTransaction]);
    if (error) console.error("Error adding transaction:", error.message);
    else setTransactions([...(data || []), ...transactions]);

    setNewTransaction({ date: "", amount: 0, category: "", description: "" });
  };

  return (
    <div className="min-h-screen pt-16 p-6">
      <Typography variant="h4" gutterBottom>
        Transactions
      </Typography>

      {/* ✅ Upload File */}
      <Paper elevation={3} className="p-4 mb-4">
        <Typography variant="h6" gutterBottom>
          Upload Transactions (CSV)
        </Typography>
        <input type="file" accept=".csv" onChange={handleFileUpload} disabled={uploading} />
        {uploading && <Typography color="textSecondary">Uploading...</Typography>}
      </Paper>

      {/* ✅ Manual Entry Form inside MUI Card */}
      <Card elevation={3} className="mb-4">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add Transaction
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description (Optional)"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleManualSubmit} fullWidth>
                Add Transaction
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ✅ Transactions Table */}
      <Paper elevation={3} className="p-4">
        <Typography variant="h6" gutterBottom>
          Recent Transactions
        </Typography>
        <table className="w-full border-collapse mt-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={index} className="border">
                <td className="p-2">{txn.date}</td>
                <td className="p-2">{txn.amount}</td>
                <td className="p-2">{txn.category}</td>
                <td className="p-2">{txn.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>
    </div>
  );
}
