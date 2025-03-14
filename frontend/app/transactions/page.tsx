"use client";
import { useEffect, useState } from "react";
import { getTransactions, addTransaction, deleteTransaction } from "../lib/transactions";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");

  useEffect(() => {
    async function fetchData() {
      const data = await getTransactions();
      if (Array.isArray(data)) setTransactions(data);
      else console.error("Error fetching transactions:", data);
    }
    fetchData();
  }, []);

  const handleAddTransaction = async () => {
    if (!description || !amount || !category) {
      alert("All fields are required!");
      return;
    }

    await addTransaction(description, parseFloat(amount), type, category);
    setDescription("");
    setAmount("");
    setCategory("");

    const updatedTransactions = await getTransactions();
    if (Array.isArray(updatedTransactions)) setTransactions(updatedTransactions);
  };

  const handleDelete = async (id: number) => {
    await deleteTransaction(id);
    const updatedTransactions = await getTransactions();
    if (Array.isArray(updatedTransactions)) setTransactions(updatedTransactions);
  };

  return (

    <div className="p-6 mt-25 pt-16">  {/* ✅ Add margin-top to push content down */}
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6 pt-16">Transactions</h2>

      {/* Transaction Form */}
      <Paper className="p-6 mb-6 shadow-md">
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField fullWidth label="Amount (₹)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={2} className="flex justify-center items-center">
            <Button variant="contained" color="primary" onClick={handleAddTransaction} fullWidth>
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Transactions Table */}
      <TableContainer component={Paper} className="shadow-md">
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Type</b></TableCell>
              <TableCell><b>Amount (₹)</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No transactions found.</TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                  <TableCell>{tx.description}</TableCell>
                  <TableCell>{tx.category}</TableCell>
                  <TableCell>{tx.type === "income" ? "Income" : "Expense"}</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: tx.type === "income" ? "green" : "red" }}>
                    ₹{tx.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button size="small" color="error" onClick={() => handleDelete(tx.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
