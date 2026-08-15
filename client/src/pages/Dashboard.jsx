import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { api } from '../api/client';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#ec4899', '#84cc16', '#64748b'];

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/expenses')
      .then(setExpenses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

  const byCategory = useMemo(() => {
    const map = {};
    for (const e of expenses) map[e.category] = (map[e.category] || 0) + e.amount;
    return Object.entries(map).map(([category, total]) => ({ category, total }));
  }, [expenses]);

  const byMonth = useMemo(() => {
    const map = {};
    for (const e of expenses) {
      const month = new Date(e.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      map[month] = (map[month] || 0) + e.amount;
    }
    return Object.entries(map)
      .map(([month, total]) => ({ month, total }))
      .reverse();
  }, [expenses]);

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Total spent: <span className="font-semibold text-slate-900">${totalSpent.toFixed(2)}</span> across {expenses.length} expenses
        </p>
      </div>

      {expenses.length === 0 ? (
        <p className="text-slate-500">No expenses yet — scan a receipt to get started.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="font-medium mb-4">Spending by category</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={byCategory} dataKey="total" nameKey="category" outerRadius={90} label>
                  {byCategory.map((entry, i) => (
                    <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="font-medium mb-4">Spending by month</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byMonth}>
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
