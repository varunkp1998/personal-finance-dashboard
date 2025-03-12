import { useState, useEffect } from 'react';
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from '../lib/transactions';
import { supabase } from '../lib/supabase';
import Papa from 'papaparse';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ type: 'Income', category: '', amount: '', date: '', is_recurring: false });
  const [editingId, setEditingId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.user) return;
      setUser(session.user);

      const { data } = await getTransactions(session.user.id);
      setTransactions(data || []);
    }
    fetchData();
  }, []);
  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const transactions = results.data.map((row) => ({
          type: row.type,
          category: row.category,
          amount: parseFloat(row.amount),
          date: row.date,
          is_recurring: row.is_recurring === 'true',
          user_id: user.id
        }));
  
        for (const transaction of transactions) {
          await addTransaction(transaction);
        }
  
        const { data } = await getTransactions(user.id);
        setTransactions(data || []);
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (editingId) {
      await updateTransaction(editingId, form);
      setEditingId(null);
    } else {
      await addTransaction({ ...form, user_id: user.id });
    }

    const { data } = await getTransactions(user.id);
    setTransactions(data || []);
    setForm({ type: 'Income', category: '', amount: '', date: '', is_recurring: false });
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Transactions</h2>

      {/* Transaction Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <input type="file" accept=".csv" onChange={handleCSVUpload} className="mt-4 p-2 border" />;

        <label>
          Recurring?
          <input type="checkbox" checked={form.is_recurring} onChange={(e) => setForm({ ...form, is_recurring: e.target.checked })} />
        </label>

        <button type="submit" className="p-2 bg-blue-500 text-white">{editingId ? 'Update' : 'Add'} Transaction</button>
      </form>

      {/* Transactions List */}
      <ul className="mt-6">
        {transactions.map((t) => (
          <li key={t.id} className="flex justify-between p-2 border">
            <span>{t.type} - {t.category} - ₹{t.amount} ({new Date(t.date).toLocaleDateString()})</span>
            <button onClick={() => setForm(t) || setEditingId(t.id)} className="p-1 bg-yellow-400">Edit</button>
            <button onClick={() => handleDelete(t.id)} className="p-1 bg-red-500 text-white">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
