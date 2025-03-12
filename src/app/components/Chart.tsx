"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", income: 3000, expenses: 1500 },
  { month: "Feb", income: 3500, expenses: 2000 },
  { month: "Mar", income: 4000, expenses: 2500 },
];

export default function Chart() {
  return (
    <div className="bg-white p-4 shadow-lg rounded-lg mt-6">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Income vs. Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="income" stroke="green" />
          <Line type="monotone" dataKey="expenses" stroke="red" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
