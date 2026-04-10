import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProperties, getUniqueTowns, slugify, avg } from '@/lib/properties';
import { Property } from '@/lib/types';

export const revalidate = 86400;

export async function generateStaticParams() {
  return getUniqueTowns().slice(0, 30).map((t) => ({ town: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ town: string }> }): Promise<Metadata> {
  const { town: townSlug } = await params;
  const all = getAllProperties();
  const props = all.filter(p => slugify(p.l) === townSlug);
  const townName = props.length > 0 ? props[0].l : townSlug.replace(/-/g, ' ');
  const title = `${townName} Property Price History | Avena Terminal`;
  const description = `Track property prices in ${townName}, Spain. Current average prices, price per m2, and market data from Avena Terminal.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://avenaterminal.com/price-history/${townSlug}`,
      siteName: 'Avena Terminal',
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
  };
}

export default async function PriceHistoryPage({ params }: { params: Promise<{ town: string }> }) {
  const { town: townSlug } = await params;
  const all = getAllProperties();
  const props = all.filter(p => slugify(p.l) === townSlug);

  if (!props.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white" style={{ background: '#0d1117' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Town Not Found</h1>
          <Link href="/towns" className="text-emerald-400">Browse all towns</Link>
        </div>
      </div>
    );
  }

  const townName = props[0].l;
  const avgPrice = Math.round(avg(props.map(p => p.pf)));
  const avgPm2 = Math.round(avg(props.filter(p => p.pm2).map(p => p.pm2!)));
  const avgScore = Math.round(avg(props.filter(p => p._sc).map(p => p._sc!)));
  const avgYield = avg(props.filter(p => p._yield).map(p => p._yield!.gross)).toFixed(1);
  const minPrice = Math.min(...props.map(p => p.pf));
  const maxPrice = Math.max(...props.map(p => p.pf));
  const trackingDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // Price per m2 stats
  const pm2Props = props.filter(p => p.pm2);
  const minPm2 = pm2Props.length ? Math.min(...pm2Props.map(p => p.pm2!)) : 0;
  const maxPm2 = pm2Props.length ? Math.max(...pm2Props.map(p => p.pm2!)) : 0;

  // Market price per m2
  const avgMm2 = Math.round(avg(props.filter(p => p.mm2).map(p => p.mm2)));

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
          <Link href="/towns" className="hover:text-white">Towns</Link> <span className="mx-1">/</span>
          <span className="text-white">{townName} Price History</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{townName} Property Price History</h1>
        <p className="text-gray-400 text-sm mb-8">Current market snapshot based on {props.length} new build listings</p>

        {/* Current Snapshot Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Avg Price', value: `\u20AC${avgPrice.toLocaleString()}` },
            { label: 'Avg Price/m\u00B2', value: avgPm2 ? `\u20AC${avgPm2.toLocaleString()}` : 'N/A' },
            { label: 'Avg Score', value: `${avgScore}/100` },
            { label: 'Avg Gross Yield', value: `${avgYield}%` },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 text-center border" style={{ background: '#0f1419', borderColor: '#1c2333' }}>
              <div className="text-white font-bold text-lg">{s.value}</div>
              <div className="text-gray-500 text-[10px] uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Current Data Point */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Current Market Data</h2>
          <div className="rounded-lg border p-6" style={{ background: '#0f1419', borderColor: '#1c2333' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-3">Price Overview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Average listing price</span>
                    <span className="text-white font-mono">&euro;{avgPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Price range</span>
                    <span className="text-white font-mono">&euro;{minPrice.toLocaleString()} &ndash; &euro;{maxPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Average price/m&sup2;</span>
                    <span className="text-white font-mono">{avgPm2 ? `\u20AC${avgPm2.toLocaleString()}` : 'N/A'}</span>
                  </div>
                  {pm2Props.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Price/m&sup2; range</span>
                      <span className="text-white font-mono">&euro;{minPm2.toLocaleString()} &ndash; &euro;{maxPm2.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-3">Market Context</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Market avg price/m&sup2;</span>
                    <span className="text-white font-mono">{avgMm2 ? `\u20AC${avgMm2.toLocaleString()}` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Listed properties</span>
                    <span className="text-white font-mono">{props.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Investment score</span>
                    <span className={`font-mono font-bold ${avgScore >= 60 ? 'text-emerald-400' : avgScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{avgScore}/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Gross rental yield</span>
                    <span className="text-white font-mono">{avgYield}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tracking Notice */}
        <div className="rounded-lg border p-4 mb-8 text-sm text-gray-400" style={{ background: '#0f1419', borderColor: '#1c2333' }}>
          <p>Price tracking started {trackingDate}. Historical data updates weekly.</p>
          <p className="text-xs text-gray-500 mt-1">Data represents current new build listing prices in {townName}. As more snapshots are collected, price trend charts will be generated automatically.</p>
        </div>

        {/* Link to town page */}
        <div className="text-center">
          <Link href={`/towns/${townSlug}`} className="inline-flex items-center gap-2 text-emerald-400 hover:underline text-sm">
            View all {townName} properties &rarr;
          </Link>
        </div>

        <p className="text-[9px] text-gray-600 text-right mt-4">Data last updated: {trackingDate}</p>
      </main>

      <footer className="border-t py-6 text-center text-gray-600 text-xs" style={{ borderColor: '#1c2333' }}>
        &copy; 2026 Avena Terminal &middot; <a href="https://avenaterminal.com" className="text-gray-500 hover:text-gray-300">avenaterminal.com</a>
      </footer>
    </div>
  );
}
