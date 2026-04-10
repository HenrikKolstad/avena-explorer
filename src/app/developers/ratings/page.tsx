import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProperties, slugify, avg } from '@/lib/properties';
import { Property } from '@/lib/types';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Developer Ratings \u2014 Avena Terminal',
  description: 'Rank all Spain new build developers by average investment score. Compare property count, avg price, avg yield, and overall ratings from Avena Terminal.',
  openGraph: {
    title: 'Developer Ratings \u2014 Avena Terminal',
    description: 'Rank all Spain new build developers by average investment score.',
    url: 'https://avenaterminal.com/developers/ratings',
    siteName: 'Avena Terminal',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

export default function DeveloperRatingsPage() {
  const all = getAllProperties();

  // Group by developer
  const devMap = new Map<string, Property[]>();
  for (const p of all) {
    const dev = p.d || 'Unknown';
    if (!devMap.has(dev)) devMap.set(dev, []);
    devMap.get(dev)!.push(p);
  }

  const devStats = [...devMap.entries()]
    .map(([name, props]) => ({
      name,
      slug: slugify(name),
      count: props.length,
      avgScore: Math.round(avg(props.filter(p => p._sc).map(p => p._sc!))),
      avgPrice: Math.round(avg(props.map(p => p.pf))),
      avgYield: Number(avg(props.filter(p => p._yield).map(p => p._yield!.gross)).toFixed(1)),
    }))
    .sort((a, b) => b.avgScore - a.avgScore);

  return (
    <div className="min-h-screen text-gray-100" style={{ background: '#0d1117' }}>
      <header className="border-b sticky top-0 z-50 backdrop-blur-sm" style={{ borderColor: '#1c2333', background: 'rgba(13,17,23,0.85)' }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif tracking-[0.15em] bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">AVENA</Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Back to Terminal</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-white">Home</Link> <span className="mx-1">/</span>
          <span className="text-white">Developer Ratings</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Developer Ratings</h1>
        <p className="text-gray-400 text-sm mb-8">{devStats.length} developers ranked by average property investment score</p>

        {/* Top Rated Section */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            Top Rated
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {devStats.slice(0, 3).map((dev, i) => (
              <Link
                key={dev.slug}
                href={`/developer/${encodeURIComponent(dev.slug)}`}
                className="rounded-xl border p-5 hover:border-emerald-500/30 transition-all block"
                style={{ background: '#0f1419', borderColor: '#1c2333' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-emerald-500 text-black' : i === 1 ? 'bg-emerald-600/30 text-emerald-400' : 'bg-emerald-700/20 text-emerald-500'}`}>{i + 1}</span>
                  <div className="min-w-0">
                    <div className="text-white font-medium text-sm truncate">{dev.name}</div>
                    <div className="text-gray-500 text-xs">{dev.count} properties</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-emerald-400 font-bold text-lg">{dev.avgScore}</div>
                    <div className="text-gray-500 text-[9px] uppercase tracking-wider">Score</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">&euro;{(dev.avgPrice / 1000).toFixed(0)}k</div>
                    <div className="text-gray-500 text-[9px] uppercase tracking-wider">Avg Price</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{dev.avgYield}%</div>
                    <div className="text-gray-500 text-[9px] uppercase tracking-wider">Yield</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Full Data Table */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">All Developers</h2>
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: '#1c2333' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#0f1419' }}>
                  {['Rank', 'Developer', 'Properties', 'Avg Score', 'Avg Price', 'Avg Yield'].map(col => (
                    <th key={col} className="px-4 py-3 text-left text-xs uppercase tracking-wider font-medium text-emerald-400">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {devStats.map((dev, i) => (
                  <tr key={dev.slug} style={{ background: i % 2 === 0 ? '#0d1117' : '#0f1419', borderBottom: '1px solid #1c2333' }}>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Link href={`/developer/${encodeURIComponent(dev.slug)}`} className="text-emerald-400 hover:underline font-medium">{dev.name}</Link>
                    </td>
                    <td className="px-4 py-3 text-gray-300 font-mono">{dev.count}</td>
                    <td className="px-4 py-3">
                      <span className={`font-mono font-bold ${dev.avgScore >= 60 ? 'text-emerald-400' : dev.avgScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{dev.avgScore}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 font-mono">&euro;{dev.avgPrice.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-300 font-mono">{dev.avgYield}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-[9px] text-gray-600 text-right mt-4">Data last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </main>

      <footer className="border-t py-6 text-center text-gray-600 text-xs" style={{ borderColor: '#1c2333' }}>
        &copy; 2026 Avena Terminal &middot; <a href="https://avenaterminal.com" className="text-gray-500 hover:text-gray-300">avenaterminal.com</a>
      </footer>
    </div>
  );
}
