"use client"; // ✅ Runs only on the client side

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();

      console.log("Session Data:", sessionData);
      
      if (!sessionData?.session) {
        router.replace("/login"); // ✅ Use replace to avoid back button issue
      } else {
        setSession(sessionData.session);
        await fetchTransactions(sessionData.session.access_token);
      }
      setLoading(false);
    }

    checkSession();
  }, []);

  async function fetchTransactions(token: string) {
    const response = await fetch("/api/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    setTransactions(data);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null; // ✅ Prevents dashboard flash before redirect
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {transactions.length === 0 ? (
        <p>No transactions</p>
      ) : (
        <ul>
          {transactions.map((txn) => (
            <li key={txn.id}>{txn.description} - ₹{txn.amount}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
