import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Expense_CATEGORIES, formatCurrency } from '../constants';

export default function ScanReceipt() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState(null);

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setDraft(null);
    setError('');
  }

  async function handleScan() {
    if (!file) return;
    setScanning(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('receipt', file);
      const result = await api.postForm('/receipts/scan', formData);
      setDraft({
        merchant: result.draft.merchant || '',
        amount: result.draft.total ?? 0,
        category: result.draft.category || 'Other',
        date: result.draft.date ? result.draft.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
        items: result.draft.items || [],
        receiptImageUrl: result.receiptImageUrl,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      await api.post('/expenses', {
        ...draft,
        amount: Number(draft.amount),
      });
      navigate('/expenses');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function updateDraft(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Scan a receipt</h1>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />

        {previewUrl && (
          <img src={previewUrl} alt="Receipt preview" className="max-h-64 rounded-md border border-slate-200" />
        )}

        {file && !draft && (
          <button
            onClick={handleScan}
            disabled={scanning}
            className="bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {scanning ? 'Reading receipt…' : 'Scan receipt'}
          </button>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {draft && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-medium">Review extracted data</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Merchant</label>
              <input
                value={draft.merchant}
                onChange={(e) => updateDraft('merchant', e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                value={draft.amount}
                onChange={(e) => updateDraft('amount', e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={draft.category}
                onChange={(e) => updateDraft('category', e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              >
                {Expense_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={draft.date}
                onChange={(e) => updateDraft('date', e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          {draft.items?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Line items</p>
              <ul className="text-sm text-slate-600 space-y-1">
                {draft.items.map((item, i) => (
                  <li key={i} className="flex justify-between border-b border-slate-100 py-1">
                    <span>{item.name}</span>
                    <span>{formatCurrency(item.price)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Confirm & save expense'}
          </button>
        </div>
      )}
    </div>
  );
}
