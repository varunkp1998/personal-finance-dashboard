"use client"; // Required for useState in Next.js App Router
import { useState } from "react";

type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
};

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, description: "Salary", amount: 3000, type: "income" },
    { id: 2, description: "Groceries", amount: -150, type: "expense" },
  ]);

  // ✅ Use setTransactions to add a new transaction
  const addTransaction = () => {
    setTransactions((prev) => [
      ...prev,
      { id: prev.length + 1, description: "Bonus", amount: 500, type: "income" },
    ]);
  };

  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold text-gray-700">Transactions</h1>
      <button onClick={addTransaction} className="bg-blue-500 text-white p-2 rounded">
        Add Transaction
      </button>
      <ul className="mt-4 space-y-3">
        {transactions.map((tx) => (
          <li key={tx.id} className="p-4 border rounded-lg shadow flex justify-between">
            <span>{tx.description}</span>
            <span className={tx.type === "income" ? "text-green-600" : "text-red-600"}>
              ${tx.amount}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
