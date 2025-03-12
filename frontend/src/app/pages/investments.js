import { useState, useEffect } from 'react';
import { getInvestments, addInvestment, deleteInvestment, updateInvestmentPrices } from '../lib/investments';
import { supabase } from '../lib/supabase';

export default function Investments() {
  const [investments, setInvestments] = useState([]);
  const [form, setForm] = useState({ type: 'Stock', name: '', quantity: '', purchase_price: '', purchase_date: '' });
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.user) return;
      setUser(session.user);

      const { data } = await getInvestments(session.user.id);
      setInvestments(data || []);

      await updateInvestmentPrices(data || []);
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    await addInvestment({ ...form, user_id: user.id });
    const { data } = await getInvestments(user.id);
    setInvestments(data || []);
    setForm({ type: 'Stock', name: '', quantity: '', purchase_price: '', purchase_date: '' });
  };

  const handleDelete = async (id) => {
    await deleteInvestment(id);
    setInvestments(investments.filter((i) => i.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Investment Tracking</h2>

      {/* Investment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="Stock">Stock</option>
          <option value="Mutual Fund">Mutual Fund</option>
          <option value="Real Estate">Real Estate</option>
          <option value="Other">Other</option>
        </select>

        <input type="text" placeholder="Name (Stock Symbol / Fund Code)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
        <input type="number" placeholder="Purchase Price" value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: e.target.value })} required />
        <input type="date" value={form.purchase_date} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })} required />

        <button type="submit" className="p-2 bg-blue-500 text-white">Add Investment</button>
      </form>

      {/* Investment List */}
      <ul className="mt-6">
        {investments.map((i) => (
          <li key={i.id} className="flex justify-between p-2 border">
            <span>{i.type} - {i.name} - {i.quantity} units @ ₹{i.purchase_price} (Current: ₹{i.current_price || 'Fetching...'})</span>
            <button onClick={() => handleDelete(i.id)} className="p-1 bg-red-500 text-white">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
