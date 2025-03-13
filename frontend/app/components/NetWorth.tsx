"use client";
import { useState } from "react";

export default function NetWorth() {
  const [assets] = useState([{ name: "Bank Balance", value: 10000 }, { name: "Investments", value: 15000 }]);
  const [liabilities] = useState([{ name: "Loans", value: 5000 }, { name: "Credit Card Debt", value: 2000 }]);

  const totalAssets = assets.reduce((acc, asset) => acc + asset.value, 0);
  const totalLiabilities = liabilities.reduce((acc, liability) => acc + liability.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div>
      <h3 className="text-lg font-semibold">Assets</h3>
      <ul className="mb-4">
        {assets.map((a) => (
          <li key={a.name} className="flex justify-between p-2 bg-green-100 rounded mt-1">
            <span>{a.name}</span> <span>₹{a.value}</span>
          </li>
        ))}
      </ul>
      <h3 className="text-lg font-semibold">Liabilities</h3>
      <ul>
        {liabilities.map((l) => (
          <li key={l.name} className="flex justify-between p-2 bg-red-100 rounded mt-1">
            <span>{l.name}</span> <span>₹{l.value}</span>
          </li>
        ))}
      </ul>
      <h3 className="text-xl font-bold mt-4">Net Worth: ₹{netWorth}</h3>
    </div>
  );
}
