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
  Card,
  CardContent,
} from "@mui/material";
import Papa from "papaparse"; // ✅ Install via `npm install papaparse`

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

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

  // ✅ Handle CSV Upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        const parsedData = result.data.map((row: any) => ({
          description: row.description,
          amount: parseFloat(row.amount),
          type: row.type || "expense",
          category: row.category,
        }));

        // Insert into database
        await Promise.all(parsedData.map((txn) => addTransaction(txn.description, txn.amount, txn.type, txn.category)));

        // Refresh transactions
        const updatedTransactions = await getTransactions();
        if (Array.isArray(updatedTransactions)) setTransactions(updatedTransactions);
        setUploading(false);
      },
    });
  };

  // ✅ Pagination Logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  return (
    <div className="p-6 mt-25 pt-16">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6 pt-16">Transactions</h2>

      {/* ✅ Form inside MUI Card */}
      <Card className="mb-6 shadow-md">
        <CardContent>
          <Grid container spacing={2} alignItems="center">
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

            {/* ✅ Upload CSV Button */}
            <Grid item xs={12} md={12} className="flex justify-center items-center mt-2">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="csv-upload"
              />
              <label htmlFor="csv-upload">
                <Button variant="contained" component="span" color="secondary" disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload CSV"}
                </Button>
              </label>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ✅ Transactions Table */}
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
            {currentTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No transactions found.</TableCell>
              </TableRow>
            ) : (
              currentTransactions.map((tx) => (
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

      {/* ✅ Pagination Controls */}
      <Grid container justifyContent="center" alignItems="center" className="mt-4">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="mr-2"
        >
          Previous
        </Button>
        <span className="mx-4 text-lg font-bold">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Grid>
    </div>
  );
}
