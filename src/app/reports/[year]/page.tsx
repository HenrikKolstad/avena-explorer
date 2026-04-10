import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProperties, getUniqueTowns, slugify, avg } from '@/lib/properties';
import { Property } from '@/lib/types';

export const revalidate = 86400;

export async function generateStaticParams() {
  return ['2025', '2026'].map((year) => ({ year }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const title = `Spain New Build Annual Report ${year} | Avena Terminal`;
  const description = `Comprehensive ${year} annual report on Spain's new build property market. Regional breakdowns, price analysis, rental yields, and investment scores from Avena Terminal.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://avenaterminal.com/reports/${year}`,
      siteName: 'Avena Terminal',
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
  };
}

export default async function AnnualReportPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const all = getAllProperties();
  const towns = getUniqueTowns();

  // Regional breakdown
  const regionMap = new Map<string, Property[]>();
  for (const p of all) {
    const region = p.r || 'Unknown';
    if (!regionMap.has(region)) regionMap.set(region, []);
    regionMap.get(region)!.push(p);
  }

  const regionStats = [...regionMap.entries()]
    .map(([region, props]) => ({
      region,
      count: props.length,
      avgPrice: Math.round(avg(props.map(p => p.pf))),
      avgYield: Number(avg(props.filter(p => p._yield).map(p => p._yield!.gross)).toFixed(1)),
      avgScore: Math.round(avg(props.filter(p => p._sc).map(p => p._sc!))),
    }))
    .sort((a, b) => b.count - a.count);

  // Top 10 towns by score
  const top10Towns = [...towns]
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 10);

  // Property type distribution
  const typeMap = new Map<string, number>();
  for (const p of all) {
    const t = p.t || 'Unknown';
    typeMap.set(t, (typeMap.get(t) ?? 0) + 1);
  }
  const typeStats = [...typeMap.entries()]
    .map(([type, count]) => ({ type, count, pct: ((count / all.length) * 100).toFixed(1) }))
    .sort((a, b) => b.count - a.count);

  // Price range analysis
  const priceRanges = [
    { label: 'Under \u20AC150k', min: 0, max: 150000 },
    { label: '\u20AC150k\u2013\u20AC250k', min: 150000, max: 250000 },
    { label: '\u20AC250k\u2013\u20AC400k', min: 250000, max: 400000 },
    { label: '\u20AC400k\u2013\u20AC600k', min: 400000, max: 600000 },
    { label: '\u20AC600k\u2013\u20AC1M', min: 600000, max: 1000000 },
    { label: 'Over \u20AC1M', min: 1000000, max: Infinity },
  ];
  const priceRangeStats = priceRanges.map(r => {
    const props = all.filter(p => p.pf >= r.min && p.pf < r.max);
    return {
      label: r.label,
      count: props.length,
      pct: ((props.length / all.length) * 100).toFixed(1),
      avgScore: props.length ? Math.round(avg(props.filter(p => p._sc).map(p => p._sc!))) : 0,
      avgYield: props.length ? Number(avg(props.filter(p => p._yield).map(p => p._yield!.gross)).toFixed(1)) : 0,
    };
  });

  const totalAvgPrice = Math.round(avg(all.map(p => p.pf)));
  const totalAvgScore = Math.round(avg(all.filter(p => p._sc).map(p => p._sc!)));
  const totalAvgYield = avg(all.filter(p => p._yield).map(p => p._yield!.gross)).toFixed(1);

  return (
    <div className="min-h-screen text-gray-100" style={{ background: '#0d1117' }}>
      <header className="border-b sticky top-0 z-50 backdrop-blur-sm" style={{ borderColor: '#1c2333', background: 'rgba(13,17,23,0.85)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif tracking-[0.15em] bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">AVENA</Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Back to Terminal</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-white">Home</Link> <span className="mx-1">/</span>
          <span className="text-white">Annual Report {year}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Spain New Build Annual Report {year}</h1>
        <p className="text-gray-400 text-sm mb-8">Institutional-grade market intelligence from Avena Terminal</p>

        {/* Executive Summary */}
        <section className="mb-10 border-l-2 pl-6" style={{ borderColor: '#10B981' }}>
          <h2 className="text-lg font-bold text-white mb-3">Executive Summary</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-2">
            The Avena Terminal dataset currently tracks <strong className="text-white">{all.length.toLocaleString()}</strong> new build properties across <strong className="text-white">{regionStats.length}</strong> regions
            and <strong className="text-white">{towns.length}</strong> towns in Spain. The average listing price
            is <strong className="text-white">&euro;{totalAvgPrice.toLocaleString()}</strong> with a mean investment
            score of <strong className="text-white">{totalAvgScore}/100</strong> and an average gross rental
            yield of <strong className="text-white">{totalAvgYield}%</strong>.
          </p>
          <p className="text-gray-400 text-xs">Data snapshot for the {year} reporting period. Updated daily via live feed.</p>
        </section>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Properties', value: all.length.toLocaleString() },
            { label: 'Avg Score', value: `${totalAvgScore}/100` },
            { label: 'Avg Price', value: `\u20AC${totalAvgPrice.toLocaleString()}` },
            { label: 'Avg Gross Yield', value: `${totalAvgYield}%` },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 text-center border" style={{ background: '#0f1419', borderColor: '#1c2333' }}>
              <div className="text-white font-bold text-lg">{s.value}</div>
              <div className="text-gray-500 text-[10px] uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Regional Breakdown */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">Regional Breakdown</h2>
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: '#1c2333' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#0f1419' }}>
                  {['Region', 'Count', 'Avg Price', 'Avg Yield', 'Avg Score'].map(col => (
                    <th key={col} className="px-4 py-3 text-left text-xs uppercase tracking-wider font-medium text-emerald-400">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {regionStats.map((r, i) => (
                  <tr key={r.region} style={{ background: i % 2 === 0 ? '#0d1117' : '#0f1419', borderBottom: '1px solid #1c2333' }}>
                    <td className="px-4 py-3 text-gray-200 font-medium">{r.region}</td>
                    <td className="px-4 py-3 text-gray-300 font-mono">{r.count}</td>
                    <td className="px-4 py-3 text-gray-300 font-mono">&euro;{r.avgPrice.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-300 font-mono">{r.avgYield}%</td>
                    <td className="px-4 py-3">
                      <span className={`font-mono font-bold ${r.avgScore >= 60 ? 'text-emerald-400' : r.avgScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{r.avgScore}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Top 10 Towns by Score */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">Top 10 Towns by Investment Score</h2>
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: '#1c2333' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#0f1419' }}>
                  {['Rank', 'Town', 'Properties', 'Avg Score', 'Avg Price', 'Avg Yield'].map(col => (
                    <th key={col} className="px-4 py-3 text-left text-xs uppercase tracking-wider font-medium text-emerald-400">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {top10Towns.map((t, i) => (
                  <tr key={t.slug} style={{ background: i % 2 === 0 ? '#0d1117' : '#0f1419', borderBottom: '1px solid #1c2333' }}>
                    <td className="px-4 py-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-emerald-500 text-black' : 'bg-[#1c2333] text-white'}`}>{i + 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/towns/${t.slug}`} className="text-emerald-400 hover:underline">{t.town}</Link>
                    </td>
                    <td className="px-4 py-3 text-gray-300 font-mono">{t.count}</td>
                    <td className="px-4 py-3 font-mono font-bold text-white">{t.avgScore}</td>
                    <td className="px-4 py-3 text-gray-300 font-mono">&euro;{t.avgPrice.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-300 font-mono">{t.avgYield}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Property Type Distribution */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">Property Type Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {typeStats.map(t => (
              <div key={t.type} className="flex items-center gap-4 rounded-lg border p-4" style={{ background: '#0f1419', borderColor: '#1c2333' }}>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm">{t.type}</div>
                  <div className="text-gray-500 text-xs">{t.count} properties ({t.pct}%)</div>
                </div>
                <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: '#1c2333' }}>
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(parseFloat(t.pct), 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Price Range Analysis */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">Price Range Analysis</h2>
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: '#1c2333' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#0f1419' }}>
                  {['Price Range', 'Count', '% of Total', 'Avg Score', 'Avg Yield'].map(col => (
                    <th key={col} className="px-4 py-3 text-left text-xs uppercase tracking-wider font-medium text-emerald-400">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {priceRangeStats.map((r, i) => (
                  <tr key={r.label} style={{ background: i % 2 === 0 ? '#0d1117' : '#0f1419', borderBottom: '1px solid #1c2333' }}>
                    <td className="px-4 py-3 text-gray-200 font-medium">{r.label}</td>
                    <td className="px-4 py-3 text-gray-300 font-mono">{r.count}</td>
                    <td className="px-4 py-3 text-gray-300 font-mono">{r.pct}%</td>
                    <td className="px-4 py-3">
                      <span className={`font-mono font-bold ${r.avgScore >= 60 ? 'text-emerald-400' : r.avgScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{r.avgScore}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 font-mono">{r.avgYield}%</td>
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
