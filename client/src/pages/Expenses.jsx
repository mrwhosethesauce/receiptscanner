import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { formatCurrency, Expense_CATEGORIES } from '../constants';

function toDateInputValue(date) {
  return new Date(date).toISOString().slice(0, 10);
}

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(null);
  const [saving, setSaving] = useState(false);

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

  function startEdit(expense) {
    setEditingId(expense._id);
    setEditDraft({
      merchant: expense.merchant,
      amount: expense.amount,
      category: expense.category,
      date: toDateInputValue(expense.date),
    });
    setError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(null);
  }

  function updateEditDraft(field, value) {
    setEditDraft((d) => ({ ...d, [field]: value }));
  }

  async function saveEdit(id) {
    setSaving(true);
    setError('');
    try {
      const updated = await api.put(`/expenses/${id}`, {
        ...editDraft,
        amount: Number(editDraft.amount),
      });
      setExpenses((prev) => prev.map((e) => (e._id === id ? updated : e)));
      setEditingId(null);
      setEditDraft(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
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
              {expenses.map((e) => {
                const isEditing = editingId === e._id;
                return (
                  <tr key={e._id} className="border-t border-slate-100">
                    {isEditing ? (
                      <>
                        <td className="px-4 py-2">
                          <input
                            type="date"
                            value={editDraft.date}
                            onChange={(ev) => updateEditDraft('date', ev.target.value)}
                            className="border border-slate-300 rounded-md px-2 py-1 text-sm w-full"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            value={editDraft.merchant}
                            onChange={(ev) => updateEditDraft('merchant', ev.target.value)}
                            className="border border-slate-300 rounded-md px-2 py-1 text-sm w-full"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={editDraft.category}
                            onChange={(ev) => updateEditDraft('category', ev.target.value)}
                            className="border border-slate-300 rounded-md px-2 py-1 text-sm w-full"
                          >
                            {Expense_CATEGORIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <input
                            type="number"
                            step="0.01"
                            value={editDraft.amount}
                            onChange={(ev) => updateEditDraft('amount', ev.target.value)}
                            className="border border-slate-300 rounded-md px-2 py-1 text-sm w-full text-right"
                          />
                        </td>
                        <td className="px-4 py-2">
                          {e.receiptImageUrl && (
                            <a href={e.receiptImageUrl} target="_blank" rel="noreferrer" className="text-indigo-600 underline">
                              view
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right whitespace-nowrap">
                          <button
                            onClick={() => saveEdit(e._id)}
                            disabled={saving}
                            className="text-emerald-600 hover:underline mr-3 disabled:opacity-50"
                          >
                            {saving ? 'Saving…' : 'Save'}
                          </button>
                          <button onClick={cancelEdit} className="text-slate-500 hover:underline">
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
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
                        <td className="px-4 py-2 text-right whitespace-nowrap">
                          <button onClick={() => startEdit(e)} className="text-indigo-600 hover:underline mr-3">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(e._id)} className="text-red-600 hover:underline">
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
