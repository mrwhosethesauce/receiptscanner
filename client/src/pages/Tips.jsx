import { useState } from 'react';
import { api } from '../api/client';

export default function Tips() {
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const result = await api.get('/tips');
      setTips(result.tips);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Financial tips</h1>
        <p className="text-slate-500 mt-1">Claude analyzes your spending and suggests ways to save.</p>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Analyzing your spending…' : 'Generate tips'}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {tips && (
        <ul className="space-y-3">
          {tips.map((tip, i) => (
            <li key={i} className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700">
              {tip}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
