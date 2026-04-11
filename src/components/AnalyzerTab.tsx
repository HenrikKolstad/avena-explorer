'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Search, ArrowUpRight, Check, Lock } from 'lucide-react';

export default function AnalyzerTab({ isPaid, onUpgrade }: { isPaid: boolean; onUpgrade: () => void }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const [scoreAnim, setScoreAnim] = useState(0);
  const [manualMode, setManualMode] = useState(false);
  const [manual, setManual] = useState({ price: '', location: '', type: 'Apartment', m2: '', beds: '', baths: '' });

  // Track free usage
  const [usedFree, setUsedFree] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const count = parseInt(localStorage.getItem('avena_analyzer_count') || '0');
      if (count >= 1 && !isPaid) setUsedFree(true);
    }
  }, [isPaid]);

  const analyze = async () => {
    if (!url.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError('');
    setScoreAnim(0);

    // Animated loading text
    const texts = ['Fetching listing data...', 'Running hedonic regression...', 'Comparing to 1,881 properties...', 'Generating Avena score...'];
    let i = 0;
    setLoadingText(texts[0]);
    const interval = setInterval(() => { i = (i + 1) % texts.length; setLoadingText(texts[i]); }, 1500);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      clearInterval(interval);

      if (data.success) {
        setResult(data);
        // Animate score counting up
        const target = data.analysis.avenaScore;
        let current = 0;
        const scoreInterval = setInterval(() => {
          current += 2;
          if (current >= target) { current = target; clearInterval(scoreInterval); }
          setScoreAnim(current);
        }, 20);
        // Track usage
        if (typeof window !== 'undefined') {
          const count = parseInt(localStorage.getItem('avena_analyzer_count') || '0');
          localStorage.setItem('avena_analyzer_count', String(count + 1));
          if (count + 1 >= 1 && !isPaid) setUsedFree(true);
        }
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch {
      clearInterval(interval);
      setError('Connection error. Try again.');
    }
    setLoading(false);
  };

  const analyzeManual = async () => {
    if (!manual.price || !manual.location || loading) return;
    setLoading(true);
    setResult(null);
    setError('');
    setScoreAnim(0);
    const texts = ['Running hedonic regression...', 'Comparing to 1,881 properties...', 'Generating Avena score...'];
    let i = 0;
    setLoadingText(texts[0]);
    const interval = setInterval(() => { i = (i + 1) % texts.length; setLoadingText(texts[i]); }, 1200);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manual: { price: parseInt(manual.price.replace(/\D/g, '')), location: manual.location, type: manual.type, m2: parseInt(manual.m2) || 0, beds: parseInt(manual.beds) || 0, baths: parseInt(manual.baths) || 0 } }),
      });
      const data = await res.json();
      clearInterval(interval);
      if (data.success) {
        setResult(data);
        const target = data.analysis.avenaScore;
        let current = 0;
        const scoreInterval = setInterval(() => { current += 2; if (current >= target) { current = target; clearInterval(scoreInterval); } setScoreAnim(current); }, 20);
        if (typeof window !== 'undefined') {
          const count = parseInt(localStorage.getItem('avena_analyzer_count') || '0');
          localStorage.setItem('avena_analyzer_count', String(count + 1));
          if (count + 1 >= 1 && !isPaid) setUsedFree(true);
        }
      } else { setError(data.error || 'Analysis failed'); }
    } catch { clearInterval(interval); setError('Connection error. Try again.'); }
    setLoading(false);
  };

  const scoreColor = (s: number) => s >= 70 ? '#10B981' : s >= 55 ? '#F59E0B' : '#EF4444';
  const tierColor = (t: string) => t === 'STRONG BUY' ? '#10B981' : t === 'BUY' ? '#34D399' : t === 'CONSIDER' ? '#F59E0B' : '#EF4444';

  return (
    <div className="relative">
      <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] mb-4" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>
            <Search size={12} /> PROPERTY ANALYZER
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Analyze Any Spanish Listing</h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">Paste a property URL from any portal. Avena scores it against 1,881 comparable properties using hedonic regression pricing.</p>
        </div>

        {/* Input */}
        <div className="rounded-xl p-6 mb-6" style={{ background: '#0f1419', border: '1px solid #1c2333' }}>
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && analyze()}
              placeholder="https://kyero.com/property/... or any Spanish listing URL"
              className="flex-1 px-4 py-3 rounded-lg text-sm text-white placeholder-gray-500 outline-none transition-all"
              style={{ background: '#0d1117', border: '1px solid #1c2333' }}
              onFocus={e => { e.target.style.borderColor = '#10B981'; e.target.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = '#1c2333'; e.target.style.boxShadow = 'none'; }}
            />
            <button
              onClick={analyze}
              disabled={loading || !url.trim()}
              className="px-6 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#0d1117' }}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {['Idealista', 'Kyero', 'ThinkSpain', 'Rightmove'].map(s => (
              <span key={s} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.08)', color: '#6EE7B7', border: '1px solid rgba(16,185,129,0.15)' }}>{s}</span>
            ))}
            <span className="text-[10px] text-gray-600 ml-1">+ most listing portals</span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl p-12 text-center mb-6" style={{ background: '#0f1419', border: '1px solid #1c2333' }}>
            <div className="inline-block w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor: '#10B981', borderTopColor: 'transparent' }} />
            <p className="text-sm text-gray-300 animate-pulse">{loadingText}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl p-6 mb-6 text-center" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertTriangle size={20} className="mx-auto mb-2" style={{ color: '#EF4444' }} />
            <p className="text-sm mb-3" style={{ color: '#FCA5A5' }}>{error}</p>
            {!manualMode && (
              <button onClick={() => { setManualMode(true); setError(''); }} className="text-xs font-semibold px-4 py-2 rounded-lg border transition-all hover:opacity-90" style={{ borderColor: '#10B981', color: '#10B981' }}>
                Enter details manually instead
              </button>
            )}
          </div>
        )}

        {/* Manual input mode */}
        {manualMode && !result && !loading && (
          <div className="rounded-xl p-6 mb-6" style={{ background: '#0f1419', border: '1px solid #1c2333' }}>
            <h3 className="text-sm font-bold text-white mb-4">Enter Property Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Price (€)</label>
                <input type="text" placeholder="250000" value={manual.price} onChange={e => setManual({ ...manual, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: '#0d1117', border: '1px solid #1c2333' }} />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Location / Town</label>
                <input type="text" placeholder="Torrevieja" value={manual.location} onChange={e => setManual({ ...manual, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: '#0d1117', border: '1px solid #1c2333' }} />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Type</label>
                <select value={manual.type} onChange={e => setManual({ ...manual, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: '#0d1117', border: '1px solid #1c2333' }}>
                  <option>Apartment</option><option>Villa</option><option>Townhouse</option><option>Penthouse</option><option>Bungalow</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Built m²</label>
                <input type="text" placeholder="85" value={manual.m2} onChange={e => setManual({ ...manual, m2: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: '#0d1117', border: '1px solid #1c2333' }} />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Bedrooms</label>
                <input type="text" placeholder="2" value={manual.beds} onChange={e => setManual({ ...manual, beds: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: '#0d1117', border: '1px solid #1c2333' }} />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Bathrooms</label>
                <input type="text" placeholder="2" value={manual.baths} onChange={e => setManual({ ...manual, baths: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: '#0d1117', border: '1px solid #1c2333' }} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={analyzeManual} disabled={!manual.price || !manual.location}
                className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-30" style={{ background: '#10B981', color: '#0d1117' }}>
                Analyze
              </button>
              <button onClick={() => setManualMode(false)} className="px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">
                Back to URL
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Listing Info */}
            <div className="rounded-xl p-6" style={{ background: '#0f1419', border: '1px solid #1c2333' }}>
              <h3 className="text-xs font-bold tracking-[0.15em] text-gray-500 mb-4">LISTING DETAILS</h3>
              <h2 className="text-lg font-bold text-white mb-3 leading-snug">{result.listing.title || 'Property Listing'}</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Price</span><span className="text-white font-bold">{'\u20AC'}{result.listing.price.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="text-gray-300">{result.listing.location}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="text-gray-300">{result.listing.type}</span></div>
                {result.listing.m2 > 0 && <div className="flex justify-between"><span className="text-gray-500">Built Area</span><span className="text-gray-300">{result.listing.m2} m{'\u00B2'}</span></div>}
                {result.listing.beds > 0 && <div className="flex justify-between"><span className="text-gray-500">Bedrooms</span><span className="text-gray-300">{result.listing.beds}</span></div>}
                {result.listing.baths > 0 && <div className="flex justify-between"><span className="text-gray-500">Bathrooms</span><span className="text-gray-300">{result.listing.baths}</span></div>}
                {result.analysis.pricePerM2 > 0 && <div className="flex justify-between"><span className="text-gray-500">Price/m{'\u00B2'}</span><span className="text-gray-300">{'\u20AC'}{result.analysis.pricePerM2.toLocaleString()}</span></div>}
              </div>
              {result.listing.description && (
                <p className="text-xs text-gray-500 mt-4 leading-relaxed">{result.listing.description}</p>
              )}
              <a href={result.listing.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs mt-4 hover:underline" style={{ color: '#10B981' }}>
                View original listing <ArrowUpRight size={10} />
              </a>
            </div>

            {/* Right: Analysis */}
            <div className="space-y-4">
              {/* Score Circle */}
              <div className="rounded-xl p-6 text-center" style={{ background: '#0f1419', border: '1px solid #1c2333' }}>
                <div className="relative inline-flex items-center justify-center w-28 h-28 mb-3">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#1c2333" strokeWidth="6" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor(scoreAnim)} strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={`${(scoreAnim / 100) * 264} 264`} className="transition-all duration-300" />
                  </svg>
                  <span className="text-3xl font-bold" style={{ color: scoreColor(scoreAnim) }}>{scoreAnim}</span>
                </div>
                <div className="text-xs font-bold tracking-[0.15em] text-gray-500 mb-2">AVENA SCORE</div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: `${tierColor(result.analysis.dealTier)}15`, color: tierColor(result.analysis.dealTier), border: `1px solid ${tierColor(result.analysis.dealTier)}30` }}>
                  {result.analysis.dealTier}
                </span>
              </div>

              {/* Stats */}
              <div className="rounded-xl p-5" style={{ background: '#0f1419', border: '1px solid #1c2333' }}>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500 text-xs block">Gross Yield</span><span className="text-white font-bold">{result.analysis.estimatedGrossYield}%</span></div>
                  <div><span className="text-gray-500 text-xs block">Deal Tier</span><span className="text-white font-bold">{result.analysis.dealTier}</span></div>
                  <div><span className="text-gray-500 text-xs block">vs. Market</span><span className="text-white font-bold text-xs">{result.analysis.marketComparison}</span></div>
                  <div><span className="text-gray-500 text-xs block">Area Listings</span><span className="text-white font-bold">{result.analysis.townProperties}</span></div>
                </div>
              </div>

              {/* Verdict */}
              <div className="rounded-xl p-5" style={{ background: '#0f1419', border: '1px solid #1c2333' }}>
                <p className="text-sm text-gray-300 leading-relaxed">{result.analysis.verdict}</p>
              </div>

              {/* Strengths & Risks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl p-4" style={{ background: '#0f1419', border: '1px solid #1c2333' }}>
                  <h4 className="text-[10px] font-bold tracking-[0.15em] mb-2" style={{ color: '#10B981' }}>STRENGTHS</h4>
                  {result.analysis.strengths.map((s: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-400 mb-1.5">
                      <Check size={10} className="mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-4" style={{ background: '#0f1419', border: '1px solid #1c2333' }}>
                  <h4 className="text-[10px] font-bold tracking-[0.15em] mb-2" style={{ color: '#F59E0B' }}>RISKS</h4>
                  {result.analysis.risks.map((r: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-400 mb-1.5">
                      <AlertTriangle size={10} className="mt-0.5 flex-shrink-0" style={{ color: '#F59E0B' }} />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        {result && (
          <p className="text-[10px] text-gray-600 text-center mt-6 max-w-2xl mx-auto leading-relaxed">
            {result.analysis.disclaimer}
          </p>
        )}
      </div>

      {/* Paywall overlay */}
      {usedFree && !isPaid && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center" style={{ background: 'rgba(13,17,23,0.92)', backdropFilter: 'blur(6px)' }}>
          <Lock size={32} className="mb-4" style={{ color: '#10B981' }} />
          <h3 className="text-xl font-bold text-white mb-2">Free Analysis Used</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-sm text-center">You have used your free property analysis. Upgrade to PRO for unlimited analyses.</p>
          <button onClick={onUpgrade} className="px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:scale-[1.02] transition-all" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#0d1117' }}>
            Upgrade to PRO
          </button>
          <p className="text-[11px] text-gray-600 mt-3">Cancel anytime</p>
        </div>
      )}
    </div>
  );
}

