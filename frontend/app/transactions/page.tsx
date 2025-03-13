"use client";
import { useEffect, useState } from "react";
import { supabase } from "./../lib/supabase";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Transaction {
  id: number;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    let { data, error } = await supabase.from("transactions").select("*");
    if (error) console.error("Error fetching transactions:", error);
    else setTransactions(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category || !amount || !date) return alert("All fields are required!");

    const newTransaction = { type, category, amount: Number(amount), date };

    if (editingId) {
      // Update existing transaction
      const { error } = await supabase
        .from("transactions")
        .update(newTransaction)
        .eq("id", editingId);
      if (error) console.error("Error updating transaction:", error);
    } else {
      // Insert new transaction
      const { error } = await supabase.from("transactions").insert([newTransaction]);
      if (error) console.error("Error adding transaction:", error);
    }

    fetchTransactions();
    resetForm();
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) console.error("Error deleting transaction:", error);
    fetchTransactions();
  }

  function handleEdit(transaction: Transaction) {
    setEditingId(transaction.id);
    setType(transaction.type);
    setCategory(transaction.category);
    setAmount(transaction.amount);
    setDate(transaction.date);
  }

  function resetForm() {
    setEditingId(null);
    setType("income");
    setCategory("");
    setAmount("");
    setDate("");
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-700">Transactions</h1>

      {/* Form to Add/Edit Transactions */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-4">
        <div className="grid grid-cols-2 gap-4">
          <select className="p-2 border rounded" value={type} onChange={(e) => setType(e.target.value as "income" | "expense")}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type="text"
            placeholder="Category"
            className="p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Amount"
            className="p-2 border rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
            required
          />

          <input
            type="date"
            className="p-2 border rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button className="mt-4 w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
          {editingId ? "Update Transaction" : "Add Transaction"}
        </button>
      </form>

      {/* Transactions List */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">Type</th>
              <th className="p-3">Category</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-3">{t.type}</td>
                <td className="p-3">{t.category}</td>
                <td className={`p-3 ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>₹{t.amount}</td>
                <td className="p-3">{t.date}</td>
                <td className="p-3 flex gap-3">
                  <button className="text-blue-500" onClick={() => handleEdit(t)}>
                    <FaEdit />
                  </button>
                  <button className="text-red-500" onClick={() => handleDelete(t.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
