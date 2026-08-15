import { useState } from 'react';
import { api } from '../api/client';

const GENERAL_TIPS = [
  'Follow the 50/30/20 rule: 50% of income on needs, 30% on wants, 20% on savings.',
  'Review your recurring subscriptions every few months and cancel what you no longer use.',
  'Track every expense, no matter how small — small purchases add up faster than expected.',
  'Set a specific savings goal and automate a transfer to it right after each payday.',
  'Compare prices before big purchases and wait 24 hours before non-essential buys to avoid impulse spending.',
];

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
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Financial tips</h1>
        <p className="text-slate-500 mt-1">General guidance, plus a personalized breakdown of your own spending.</p>
      </div>

      <div>
        <h2 className="font-medium text-slate-800 mb-3">General tips</h2>
        <ul className="space-y-3">
          {GENERAL_TIPS.map((tip, i) => (
            <li key={i} className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700">
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-medium text-slate-800 mb-3">Personalized for you</h2>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing your spending…' : 'Generate tips'}
        </button>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

        {tips && (
          <ul className="space-y-3 mt-4">
            {tips.map((tip, i) => (
              <li key={i} className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700">
                {tip}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
