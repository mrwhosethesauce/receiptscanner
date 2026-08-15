import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { formatCurrency } from '../constants';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    api.get('/expenses')
      .then(setExpenses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  async function handleDelete(id) {
    if (!confirm('Delete this expense?')) return;
    try {
      await api.del(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="text-slate-500">Loading…</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Expenses</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {expenses.length === 0 ? (
        <p className="text-slate-500">No expenses yet.</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Merchant</th>
                <th className="px-4 py-2 font-medium">Category</th>
                <th className="px-4 py-2 font-medium text-right">Amount</th>
                <th className="px-4 py-2 font-medium">Receipt</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e._id} className="border-t border-slate-100">
                  <td className="px-4 py-2">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{e.merchant}</td>
                  <td className="px-4 py-2">
                    <span className="inline-block bg-indigo-50 text-indigo-700 rounded-full px-2 py-0.5 text-xs">
                      {e.category}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">{formatCurrency(e.amount)}</td>
                  <td className="px-4 py-2">
                    {e.receiptImageUrl && (
                      <a href={e.receiptImageUrl} target="_blank" rel="noreferrer" className="text-indigo-600 underline">
                        view
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => handleDelete(e._id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
