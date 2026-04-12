import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProperties, slugify, avg } from '@/lib/properties';
import { Property } from '@/lib/types';

export const revalidate = 86400;

/* ------------------------------------------------------------------ */
/*  Static params                                                      */
/* ------------------------------------------------------------------ */
export async function generateStaticParams() {
  const all = getAllProperties();
  const devSlugs = [...new Set(all.map(p => p.d).filter(Boolean).map(d => slugify(d!)))];
  return devSlugs.filter(s => s !== 'ratings').map(slug => ({ slug }));
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const all = getAllProperties();
  const devName = all.find(p => p.d && slugify(p.d) === slug)?.d ?? slug;
  const count = all.filter(p => p.d && slugify(p.d) === slug).length;

  return {
    title: `${devName} — Developer Profile | Avena Terminal`,
    description: `${devName} has ${count} active new build listings tracked by Avena Terminal. View scores, yields, and geographic coverage.`,
    openGraph: {
      title: `${devName} — Developer Profile | Avena Terminal`,
      description: `${devName} has ${count} active new build listings tracked by Avena Terminal.`,
      url: `https://avenaterminal.com/developers/${slug}`,
      siteName: 'Avena Terminal',
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function fmt(n: number) {
  return n.toLocaleString('en-GB');
}

function scoreColor(sc: number) {
  if (sc >= 80) return 'text-emerald-400';
  if (sc >= 70) return 'text-green-400';
  if (sc >= 60) return 'text-yellow-400';
  return 'text-gray-400';
}

function scoreBg(sc: number) {
  if (sc >= 80) return 'bg-emerald-500/10 border-emerald-500/30';
  if (sc >= 70) return 'bg-green-500/10 border-green-500/30';
  if (sc >= 60) return 'bg-yellow-500/10 border-yellow-500/30';
  return 'bg-gray-500/10 border-gray-500/30';
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default async function DeveloperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const all = getAllProperties();
  const devMap = new Map<string, Property[]>();
  for (const p of all) {
    if (!p.d) continue;
    const key = slugify(p.d);
    if (!devMap.has(key)) devMap.set(key, []);
    devMap.get(key)!.push(p);
  }

  const props = devMap.get(slug) ?? [];
  if (!props.length) {
    return (
      <div className="min-h-screen text-gray-100 flex items-center justify-center" style={{ background: '#0d1117' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Developer not found</h1>
          <Link href="/developers/ratings" className="text-emerald-400 hover:underline text-sm">Browse all developers</Link>
        </div>
      </div>
    );
  }

  const devName = props[0].d;
  const yearsActive = props[0].dy;

  /* Metrics */
  const scores = props.filter(p => p._sc).map(p => p._sc!);
  const yields = props.filter(p => p._yield).map(p => p._yield!.gross);
  const prices = props.map(p => p.pf);
  const avgScore = Math.round(avg(scores));
  const avgPrice = Math.round(avg(prices));
  const avgYield = Number(avg(yields).toFixed(1));
  const towns = [...new Set(props.map(p => p.l).filter(Boolean))];
  const costas = [...new Set(props.map(p => p.costa).filter(Boolean))];

  /* Price range by type */
  const typeMap = new Map<string, number[]>();
  for (const p of props) {
    if (!typeMap.has(p.t)) typeMap.set(p.t, []);
    typeMap.get(p.t)!.push(p.pf);
  }
  const priceByType = [...typeMap.entries()]
    .map(([type, prs]) => ({ type, avg: Math.round(avg(prs)), min: Math.min(...prs), max: Math.max(...prs), count: prs.length }))
    .sort((a, b) => b.count - a.count);

  /* Status breakdown */
  const statusMap = new Map<string, number>();
  for (const p of props) {
    const st = p.s || 'Unknown';
    statusMap.set(st, (statusMap.get(st) ?? 0) + 1);
  }
  const statuses = [...statusMap.entries()].sort((a, b) => b[1] - a[1]);

  /* Energy rating distribution */
  const energyMap = new Map<string, number>();
  for (const p of props) {
    const e = p.energy || 'N/A';
    energyMap.set(e, (energyMap.get(e) ?? 0) + 1);
  }
  const energyDist = [...energyMap.entries()].sort((a, b) => b[1] - a[1]);

  /* Pool availability */
  const withPool = props.filter(p => p.pool && p.pool !== 'no').length;
  const poolPct = props.length > 0 ? Math.round((withPool / props.length) * 100) : 0;

  /* JSON-LD */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: devName,
    description: `${devName} has ${props.length} active new build listings tracked by Avena Terminal.`,
    url: `https://avenaterminal.com/developers/${slug}`,
  };

  return (
    <div className="min-h-screen text-gray-100" style={{ background: '#0d1117' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="border-b sticky top-0 z-50 backdrop-blur-sm" style={{ borderColor: '#1c2333', background: 'rgba(13,17,23,0.85)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif tracking-[0.15em] bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">AVENA</Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Back to Terminal</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-1">/</span>
          <Link href="/developers/ratings" className="hover:text-white">Developers</Link>
          <span className="mx-1">/</span>
          <span className="text-white">{devName}</span>
        </nav>

        {/* Developer header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{devName}</h1>
          {yearsActive > 0 && (
            <p className="text-gray-400 text-sm">{yearsActive} years active in Spanish new build development</p>
          )}
        </div>

        {/* Key metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            { label: 'Listings', value: String(props.length) },
            { label: 'Avg Price', value: `\u20AC${(avgPrice / 1000).toFixed(0)}k` },
            { label: 'Avg Score', value: String(avgScore) },
            { label: 'Avg Yield', value: `${avgYield}%` },
            { label: 'Active Towns', value: String(towns.length) },
          ].map(m => (
            <div key={m.label} className="rounded-lg border p-4 text-center" style={{ background: '#161b22', borderColor: '#30363d' }}>
              <div className="text-white font-bold text-lg font-mono">{m.value}</div>
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Score card + Quality indicators side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Score card */}
          <div className={`rounded-lg border p-6 flex flex-col items-center justify-center ${scoreBg(avgScore)}`}>
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Average Investment Score</div>
            <div className={`text-5xl font-bold font-mono ${scoreColor(avgScore)}`}>{avgScore}</div>
            <div className="text-gray-500 text-xs mt-2">out of 100 &middot; based on {scores.length} rated properties</div>
          </div>

          {/* Quality indicators */}
          <div className="rounded-lg border p-6" style={{ background: '#161b22', borderColor: '#30363d' }}>
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              Quality Indicators
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-gray-400 text-xs mb-1">Pool Availability</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${poolPct}%` }} />
                  </div>
                  <span className="text-white font-mono text-sm">{poolPct}%</span>
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-2">Energy Rating Distribution</div>
                <div className="flex flex-wrap gap-2">
                  {energyDist.map(([rating, count]) => (
                    <span key={rating} className="px-2 py-1 rounded text-xs font-mono border" style={{ background: '#0d1117', borderColor: '#30363d' }}>
                      <span className="text-emerald-400">{rating}</span>
                      <span className="text-gray-500 ml-1">({count})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic coverage + Completion status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Geographic coverage */}
          <div className="rounded-lg border p-6" style={{ background: '#161b22', borderColor: '#30363d' }}>
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              Geographic Coverage
            </h2>
            {costas.length > 0 && (
              <div className="mb-3">
                <div className="text-gray-400 text-xs mb-2">Costas</div>
                <div className="flex flex-wrap gap-2">
                  {costas.map(c => (
                    <Link key={c} href={`/costa/${slugify(c!)}`} className="px-2 py-1 rounded text-xs border hover:border-emerald-500/30 transition-colors" style={{ background: '#0d1117', borderColor: '#30363d' }}>
                      <span className="text-emerald-400">{c}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="text-gray-400 text-xs mb-2">Towns ({towns.length})</div>
              <div className="flex flex-wrap gap-2">
                {towns.map(t => (
                  <Link key={t} href={`/town/${slugify(t)}`} className="px-2 py-1 rounded text-xs border hover:border-emerald-500/30 transition-colors" style={{ background: '#0d1117', borderColor: '#30363d' }}>
                    <span className="text-gray-300">{t}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Completion status */}
          <div className="rounded-lg border p-6" style={{ background: '#161b22', borderColor: '#30363d' }}>
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              Completion Status Breakdown
            </h2>
            <div className="space-y-3">
              {statuses.map(([status, count]) => {
                const pct = Math.round((count / props.length) * 100);
                return (
                  <div key={status}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">{status}</span>
                      <span className="text-gray-500 font-mono">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500/60" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Price range analysis */}
        <div className="rounded-lg border p-6 mb-8" style={{ background: '#161b22', borderColor: '#30363d' }}>
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            Price Range Analysis
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#0d1117' }}>
                  {['Type', 'Count', 'Min', 'Avg', 'Max'].map(col => (
                    <th key={col} className="px-4 py-2 text-left text-xs uppercase tracking-wider font-medium text-emerald-400">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {priceByType.map((row, i) => (
                  <tr key={row.type} style={{ background: i % 2 === 0 ? '#161b22' : '#0f1419' }}>
                    <td className="px-4 py-2 text-gray-300">{row.type}</td>
                    <td className="px-4 py-2 text-gray-400 font-mono">{row.count}</td>
                    <td className="px-4 py-2 text-gray-300 font-mono">&euro;{fmt(row.min)}</td>
                    <td className="px-4 py-2 text-white font-mono font-medium">&euro;{fmt(row.avg)}</td>
                    <td className="px-4 py-2 text-gray-300 font-mono">&euro;{fmt(row.max)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active listings table */}
        <div className="rounded-lg border mb-8" style={{ borderColor: '#30363d' }}>
          <div className="px-6 py-4 border-b flex items-center gap-2" style={{ background: '#161b22', borderColor: '#30363d' }}>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <h2 className="text-sm font-bold text-white">Active Listings ({props.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#0d1117' }}>
                  {['Project', 'Town', 'Type', 'Price', 'Score', 'Yield', 'Status', 'Beds'].map(col => (
                    <th key={col} className="px-4 py-3 text-left text-xs uppercase tracking-wider font-medium text-emerald-400 whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {props.sort((a, b) => (b._sc ?? 0) - (a._sc ?? 0)).map((p, i) => (
                  <tr key={p.ref ?? `${p.p}-${i}`} className="hover:bg-white/[0.02] transition-colors" style={{ background: i % 2 === 0 ? '#161b22' : '#0f1419', borderBottom: '1px solid #1c2333' }}>
                    <td className="px-4 py-3 text-white font-medium max-w-[200px] truncate">{p.p}</td>
                    <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{p.l}</td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{p.t}</td>
                    <td className="px-4 py-3 text-gray-300 font-mono whitespace-nowrap">&euro;{fmt(p.pf)}</td>
                    <td className="px-4 py-3">
                      {p._sc ? (
                        <span className={`font-mono font-bold ${scoreColor(p._sc)}`}>{p._sc}</span>
                      ) : (
                        <span className="text-gray-600">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-300 font-mono whitespace-nowrap">
                      {p._yield ? `${p._yield.gross.toFixed(1)}%` : '--'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        p.s === 'Key Ready' ? 'bg-emerald-500/10 text-emerald-400' :
                        p.s === 'Off Plan' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>{p.s}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-center">{p.bd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-[9px] text-gray-600 text-right mt-4">Data last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-gray-600 text-xs" style={{ borderColor: '#1c2333' }}>
        &copy; 2026 Avena Terminal &middot; <a href="https://avenaterminal.com" className="text-gray-500 hover:text-gray-300">avenaterminal.com</a>
      </footer>
    </div>
  );
}
