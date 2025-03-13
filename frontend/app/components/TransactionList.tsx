"use client";
import { useState } from "react";

export default function TransactionList() {
  const [transactions] = useState([
    { id: 1, type: "Income", category: "Salary", amount: 5000, date: "2025-03-01" },
    { id: 2, type: "Expense", category: "Rent", amount: 1000, date: "2025-03-02" },
    { id: 3, type: "Expense", category: "Food", amount: 300, date: "2025-03-05" },
    { id: 4, type: "Expense", category: "Utilities", amount: 200, date: "2025-03-07" },
  ]);

  return (
    <div>
      <ul className="space-y-3">
        {transactions.map((txn) => (
          <li key={txn.id} className="flex justify-between p-3 bg-gray-50 rounded shadow">
            <span className={txn.type === "Income" ? "text-green-600" : "text-red-600"}>{txn.category}</span>
            <span>{txn.date}</span>
            <span className="font-semibold">{txn.type === "Income" ? `+₹${txn.amount}` : `-₹${txn.amount}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
