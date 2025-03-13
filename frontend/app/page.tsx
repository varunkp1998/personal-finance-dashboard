"use client"; // ✅ Ensures this component runs only on the client

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
      const { data: sessionData } = await supabase.auth.getSession();

      console.log("Session Data:", sessionData);
      if (!sessionData?.session) {
        router.push("/login"); // ✅ Redirect if not logged in
      } else {
        setSession(sessionData.session);
        fetchTransactions(sessionData.session.access_token);
      }
    }

    checkSession();
  }, []);

  async function fetchTransactions(token: string) {
    setLoading(true);
    const response = await fetch("/api/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    setTransactions(data);
    setLoading(false);
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? <p>Loading...</p> : transactions.length === 0 ? <p>No transactions</p> : (
        <ul>
          {transactions.map((txn) => (
            <li key={txn.id}>{txn.description} - ₹{txn.amount}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
