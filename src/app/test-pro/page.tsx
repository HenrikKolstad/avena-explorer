'use client';

import { useState } from 'react';

export default function TestProPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!email.includes('@') || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, testMode: true }),
      });
      const { url, error } = await res.json();
      if (url) window.location.href = url;
      else alert(error || 'Something went wrong');
    } catch {
      alert('Connection error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d1117' }}>
      <div className="text-center max-w-sm mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-2">PRO Test Checkout</h1>
        <p className="text-gray-500 text-sm mb-6">Test subscription at &euro;1/month</p>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCheckout()}
          className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none mb-3"
          style={{ background: '#090d12', border: '1px solid #1c2333' }}
        />
        <button
          onClick={handleCheckout}
          disabled={loading || !email.includes('@')}
          className="w-full py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-30"
          style={{ background: '#10B981', color: '#0d1117' }}
        >
          {loading ? 'Redirecting...' : 'Buy PRO for \u20AC1 \u2192'}
        </button>
        <p className="text-[10px] text-gray-700 mt-3">Hidden test page. Not linked anywhere.</p>
      </div>
    </div>
  );
}
