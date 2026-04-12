'use client';

import { useState } from 'react';
import Link from 'next/link';

const EXAMPLE_PROMPTS = [
  '3-bed villa Costa Blanca under \u20AC350k score above 65',
  'Beach apartment under \u20AC200k with rental yield 5%+',
  'Off-plan townhouse Orihuela Costa under \u20AC250k',
];

interface ParsedCriteria {
  maxPrice?: number;
  minPrice?: number;
  minBeds?: number;
  maxBeds?: number;
  region?: string;
  type?: string;
  maxBeach?: number;
  minScore?: number;
  minYield?: number;
  status?: string;
  keywords?: string[];
}

export default function AlertsPage() {
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [parsed, setParsed] = useState<ParsedCriteria | null>(null);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email.trim() || !description.trim()) {
      setError('Please enter both your email and a deal description.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    setParsed(null);

    try {
      const res = await fetch('/api/alerts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), description: description.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setParsed(data.criteria_parsed);
      setSuccess(true);
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-100" style={{ background: '#0d1117' }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-50 backdrop-blur-sm" style={{ borderColor: '#30363d', background: 'rgba(13,17,23,0.85)' }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif tracking-[0.15em] bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            AVENA
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            Back to Terminal
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-emerald-400 border border-emerald-500/20 mb-6" style={{ background: 'rgba(16,185,129,0.05)' }}>
            AI-Powered Alerts
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Set Your Deal Alert<br />in Plain English
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Describe your ideal property. We&apos;ll email you the moment it appears.
          </p>
        </div>

        {/* Example Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => setDescription(prompt)}
              className="px-3 py-1.5 rounded-full text-xs border transition-all hover:border-emerald-500/40 hover:text-white text-gray-400"
              style={{ background: '#161b22', borderColor: '#30363d' }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Form */}
        {!success ? (
          <div className="rounded-xl border p-6 md:p-8 space-y-5" style={{ background: '#161b22', borderColor: '#30363d' }}>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-colors"
                style={{ background: '#0d1117', border: '1px solid #30363d' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#10B981'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#30363d'; }}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                Describe Your Ideal Deal
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="e.g. 3-bed villa in Costa Blanca under &#8364;350k with a score above 65 and close to the beach"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-colors resize-none"
                style={{ background: '#0d1117', border: '1px solid #30363d' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#10B981'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#30363d'; }}
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              onClick={submit}
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
              style={{ background: loading ? '#065f46' : '#10B981', color: '#0d1117' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Parsing your alert with AI...
                </span>
              ) : (
                'Activate Alert'
              )}
            </button>
          </div>
        ) : (
          /* Success State */
          <div className="rounded-xl border p-6 md:p-8 text-center" style={{ background: '#161b22', borderColor: '#30363d' }}>
            <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
              <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Alert Active</h2>
            <p className="text-gray-400 text-sm mb-6">
              We&apos;ll email <span className="text-emerald-400">{email}</span> when a matching property appears.
            </p>

            {parsed && (
              <div className="rounded-lg border p-4 text-left mb-6" style={{ background: '#0d1117', borderColor: '#30363d' }}>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Parsed Criteria</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {parsed.region && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Region</span>
                      <span className="text-white">{parsed.region}</span>
                    </div>
                  )}
                  {parsed.type && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type</span>
                      <span className="text-white">{parsed.type}</span>
                    </div>
                  )}
                  {parsed.maxPrice && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max Price</span>
                      <span className="text-emerald-400">{'\u20AC'}{parsed.maxPrice.toLocaleString()}</span>
                    </div>
                  )}
                  {parsed.minPrice && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min Price</span>
                      <span className="text-emerald-400">{'\u20AC'}{parsed.minPrice.toLocaleString()}</span>
                    </div>
                  )}
                  {parsed.minBeds && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min Beds</span>
                      <span className="text-white">{parsed.minBeds}</span>
                    </div>
                  )}
                  {parsed.maxBeds && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max Beds</span>
                      <span className="text-white">{parsed.maxBeds}</span>
                    </div>
                  )}
                  {parsed.minScore && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min Score</span>
                      <span className="text-emerald-400">{parsed.minScore}</span>
                    </div>
                  )}
                  {parsed.minYield && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min Yield</span>
                      <span className="text-emerald-400">{parsed.minYield}%</span>
                    </div>
                  )}
                  {parsed.status && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className="text-white">{parsed.status}</span>
                    </div>
                  )}
                  {parsed.keywords && parsed.keywords.length > 0 && (
                    <div className="col-span-2 flex justify-between">
                      <span className="text-gray-500">Keywords</span>
                      <span className="text-white">{parsed.keywords.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => { setSuccess(false); setDescription(''); setEmail(''); setParsed(null); }}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Create another alert
            </button>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-20 mb-10">
          <h2 className="text-center text-lg font-semibold text-white mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: '01',
                title: 'Describe',
                text: 'Write what you want in plain English. Budget, location, type, yield requirements — anything.',
              },
              {
                step: '02',
                title: 'AI Parses',
                text: 'Claude extracts structured criteria from your description: price range, region, property type, and more.',
              },
              {
                step: '03',
                title: 'Get Notified',
                text: 'When a new property matches your criteria, you get an email with the deal details instantly.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border p-5"
                style={{ background: '#161b22', borderColor: '#30363d' }}
              >
                <span className="text-emerald-400 text-xs font-mono font-bold">{item.step}</span>
                <h3 className="text-white font-semibold mt-2 mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] text-gray-600 mt-10">
          Alerts are matched against 1,881+ new build properties across Costa Blanca, Costa C&aacute;lida and Costa del Sol.
        </p>
      </main>
    </div>
  );
}
