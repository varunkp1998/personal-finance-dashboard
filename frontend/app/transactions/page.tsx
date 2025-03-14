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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Transaction {
  id?: number;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: string; // ✅ Added field for Income/Expense
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [uploading, setUploading] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // ✅ Dark mode support

  const [newTransaction, setNewTransaction] = useState<Transaction>({
    date: "",
    amount: 0,
    category: "",
    description: "",
    type: "income",
  });

  useEffect(() => {
    async function fetchTransactions() {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error.message);
      } else {
        setTransactions(data ?? []);
      }
    }
    fetchTransactions();
  }, []);

  // ✅ Handle CSV Upload
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
          type: row.type || "expense",
        }));

        const { data, error } = await supabase
          .from("transactions")
          .insert(parsedData)
          .select("*");

        if (error) console.error("Error inserting transactions:", error.message);
        else setTransactions([...transactions, ...(data ?? [])]);

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

    const { data, error } = await supabase
      .from("transactions")
      .insert([newTransaction])
      .select("*");

    if (error) console.error("Error adding transaction:", error.message);
    else setTransactions([...(data || []), ...transactions]);

    setNewTransaction({ date: "", amount: 0, category: "", description: "", type: "income" });
  };

  // ✅ Handle Transaction Deletion
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) {
      console.error("Error deleting transaction:", error.message);
      return;
    }
    setTransactions(transactions.filter((txn) => txn.id !== id));
  };

  return (
    <div className={`min-h-screen pt-16 p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
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
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                >
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
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

      {/* ✅ Transactions Grid with MUI Cards */}
      <Grid container spacing={3}>
        {transactions.map((txn) => (
          <Grid item xs={12} sm={6} md={4} key={txn.id}>
            <Card sx={{ p: 2, bgcolor: txn.type === "income" ? "#e3fcef" : "#ffe6e6" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {txn.category}
                </Typography>
                <Typography>
                  <b>Date:</b> {new Date(txn.date).toLocaleDateString()}
                </Typography>
                <Typography>
                  <b>Amount:</b> ₹{txn.amount.toLocaleString()}
                </Typography>
                <Typography>
                  <b>Type:</b> {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                </Typography>
                {txn.description && <Typography><b>Description:</b> {txn.description}</Typography>}
                <IconButton color="error" onClick={() => handleDelete(txn.id as number)} sx={{ mt: 1 }}>
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
