import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProperties, getUniqueTowns, getUniqueCostas, avg } from '@/lib/properties';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Price History — Historical New Build Price Tracking | Avena Terminal',
  description: 'Historical price tracking for 1,881 new build properties across Spain. Daily snapshots, price trends, score evolution. The only historical price database for Spanish new builds.',
  alternates: { canonical: 'https://avenaterminal.com/intelligence/history' },
};

export default async function HistoryPage() {
  const all = getAllProperties();
  const towns = getUniqueTowns();
  const costas = getUniqueCostas();

  // Get market snapshots from Supabase
  let snapshots: { snapshot_date: string; total_properties: number; avg_price: number; avg_score: number; avg_yield: number; above_70: number }[] = [];
  if (supabase) {
    const { data } = await supabase
      .from('market_snapshots')
      .select('*')
      .order('snapshot_date', { ascending: false })
      .limit(90);
    if (data) snapshots = data;
  }

  // Current stats
  const avgPrice = Math.round(avg(all.map(p => p.pf)));
  const avgScore = Math.round(avg(all.filter(p => p._sc).map(p => p._sc!)));
  const avgYield = avg(all.filter(p => p._yield?.gross).map(p => p._yield!.gross)).toFixed(1);

  // Top movers (biggest discount properties — likely recent price changes)
  const movers = all
    .filter(p => p.pm2 && p.mm2 && p.mm2 > 0)
    .map(p => ({ ...p, disc: ((p.mm2! - p.pm2!) / p.mm2!) * 100 }))
    .sort((a, b) => b.disc - a.disc)
    .slice(0, 10);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Spanish New Build Price History',
    description: `Historical price tracking for ${all.length} new build properties. Daily snapshots archived since inception.`,
    url: 'https://avenaterminal.com/intelligence/history',
    creator: { '@type': 'Organization', name: 'Avena Terminal', url: 'https://avenaterminal.com' },
    temporalCoverage: '2026/..',
    identifier: '10.5281/zenodo.19520064',
  };

  return (
    <main className="min-h-screen" style={{ background: '#0d1117', color: '#c9d1d9' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b sticky top-0 z-50 backdrop-blur-sm" style={{ borderColor: '#1c2333', background: 'rgba(13,17,23,0.85)' }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif tracking-[0.15em] bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">AVENA</Link>
          <span className="text-xs font-mono px-3 py-1 rounded-full border" style={{ borderColor: '#30363d', color: '#8b949e' }}>THE HISTORIAN</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-3">Price History</h1>
        <p className="text-gray-400 text-sm mb-2">
          The only historical price database for Spanish new build properties. Daily snapshots of {all.length.toLocaleString()} properties archived automatically.
        </p>
        <p className="text-xs text-gray-600 font-mono mb-8">{snapshots.length} daily snapshots archived &middot; API: /api/history?ref=PROPERTY_REF</p>

        <div className="h-px w-full mb-8" style={{ background: '#1c2333' }} />

        {/* Current Market State */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Current Market State</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Properties', value: all.length.toLocaleString() },
              { label: 'Avg Price', value: `\u20AC${avgPrice.toLocaleString()}` },
              { label: 'Avg Score', value: `${avgScore}/100` },
              { label: 'Avg Yield', value: `${avgYield}%` },
            ].map(s => (
              <div key={s.label} className="rounded-lg p-3 text-center" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                <div className="text-xl font-bold text-white">{s.value}</div>
                <div className="text-[9px] text-gray-500 uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Historical Snapshots */}
        {snapshots.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Market Snapshots ({snapshots.length} days)</h2>
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #30363d' }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#161b22' }}>
                    <th className="text-left px-3 py-2 text-[10px] uppercase text-gray-500">Date</th>
                    <th className="text-right px-3 py-2 text-[10px] uppercase text-gray-500">Properties</th>
                    <th className="text-right px-3 py-2 text-[10px] uppercase text-gray-500">Avg Price</th>
                    <th className="text-right px-3 py-2 text-[10px] uppercase text-gray-500">Avg Score</th>
                    <th className="text-right px-3 py-2 text-[10px] uppercase text-gray-500">Avg Yield</th>
                    <th className="text-right px-3 py-2 text-[10px] uppercase text-gray-500">Score 70+</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {snapshots.slice(0, 30).map((s, i) => (
                    <tr key={s.snapshot_date} style={{ background: i % 2 === 0 ? '#0d1117' : '#161b22' }}>
                      <td className="px-3 py-1.5 text-gray-300">{s.snapshot_date}</td>
                      <td className="px-3 py-1.5 text-right text-gray-300">{s.total_properties}</td>
                      <td className="px-3 py-1.5 text-right text-gray-300">&euro;{s.avg_price?.toLocaleString()}</td>
                      <td className="px-3 py-1.5 text-right text-emerald-400">{s.avg_score}</td>
                      <td className="px-3 py-1.5 text-right text-gray-300">{s.avg_yield}%</td>
                      <td className="px-3 py-1.5 text-right text-gray-300">{s.above_70}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Top Movers */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Biggest Discounts (Potential Price Movers)</h2>
          <div className="space-y-2">
            {movers.map((p, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg p-3" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                <div>
                  <span className="text-white text-sm font-semibold">{p.p || `${p.t} in ${p.l}`}</span>
                  <span className="text-xs text-gray-500 ml-2">{p.l} &middot; {p.t}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-gray-400">&euro;{p.pf.toLocaleString()}</span>
                  <span className="text-red-400 font-bold">-{Math.round(p.disc)}%</span>
                  <span className="text-emerald-400">{p._sc}/100</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px w-full mb-8" style={{ background: '#1c2333' }} />

        {/* API */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">History API</h2>
          <div className="space-y-2 font-mono text-xs">
            <div className="rounded p-3" style={{ background: '#090d12', border: '1px solid #1c2333' }}>
              <span className="text-emerald-400">GET</span> <span className="text-gray-300">/api/history</span> <span className="text-gray-600">&larr; Market-level history</span>
            </div>
            <div className="rounded p-3" style={{ background: '#090d12', border: '1px solid #1c2333' }}>
              <span className="text-emerald-400">GET</span> <span className="text-gray-300">/api/history?ref=AP1-CB-12345</span> <span className="text-gray-600">&larr; Property-level price history</span>
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-gray-600 pb-8">
          &copy; 2026 Avena Terminal &middot; The Historian &middot; Every price. Every score. Every day. Archived forever.
        </footer>
      </div>
    </main>
  );
}
