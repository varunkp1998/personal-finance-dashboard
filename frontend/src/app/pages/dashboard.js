import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query"; // React Query for state management

// Fetch Transactions
const fetchTransactions = async (user_id) => {
  const { data } = await supabase.from("transactions").select("*").eq("user_id", user_id);
  return data;
};

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.user) setUser(session.user);
    };
    getUser();
  }, []);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: () => fetchTransactions(user.id),
    enabled: !!user, // Fetch only if user is logged in
  });

  const sampleData = transactions || [
    { month: "Jan", income: 2000, expenses: 1500 },
    { month: "Feb", income: 2500, expenses: 1800 },
    { month: "Mar", income: 2300, expenses: 1600 },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      
      {/* Income vs Expenses Chart */}
      <Card className="mt-4">
        <CardContent>
          <h3 className="font-semibold">Income vs Expenses (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sampleData}>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#0088FE" />
              <Line type="monotone" dataKey="expenses" stroke="#FF8042" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Expense Breakdown Chart */}
      <Card className="mt-4">
        <CardContent>
          <h3 className="font-semibold">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={sampleData} dataKey="expenses" nameKey="month" cx="50%" cy="50%" outerRadius={100}>
                {sampleData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Logout Button */}
      {user && <Button onClick={() => supabase.auth.signOut()}>Logout</Button>}
    </div>
  );
}
