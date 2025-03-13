"use client";
import { useEffect, useState } from "react";
import { getTransactions, addTransaction, deleteTransaction } from "../lib/transactions";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");
  const [category, setCategory] = useState("");

  useEffect(() => {
    async function fetchData() {
      const data = await getTransactions();
      
      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        console.error("Error fetching transactions:", data);
      }
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
  
    // Fetch updated transactions and ensure it's an array
    const updatedTransactions = await getTransactions();
  
    if (Array.isArray(updatedTransactions)) {
      setTransactions(updatedTransactions);
    } else {
      console.error("Error fetching transactions after adding:", updatedTransactions);
    }
  };
  

  const handleDelete = async (id: number) => {
    await deleteTransaction(id);
    
    const updatedTransactions = await getTransactions();
    
    if (Array.isArray(updatedTransactions)) {
      setTransactions(updatedTransactions); // Only update if it's an array
    } else {
      console.error("Error fetching transactions after delete:", updatedTransactions);
    }
  };
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Transactions</h2>
      
      {/* Transaction Form */}
      <div className="flex gap-4 mt-4">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded"
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Category (Food, Rent, etc.)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={handleAddTransaction} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      {/* Transactions List */}
      <ul className="mt-6">
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          transactions.map((tx) => (
            <li key={tx.id} className="flex justify-between items-center bg-gray-100 p-3 my-2 rounded">
              <span>{tx.description} - ₹{tx.amount} ({tx.type}) - {tx.category}</span>
              <button onClick={() => handleDelete(tx.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
