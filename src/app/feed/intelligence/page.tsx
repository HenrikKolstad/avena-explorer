import { Metadata } from 'next';
import Link from 'next/link';
import { generateIntelligenceFeed } from '@/lib/intelligence';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Daily Intelligence Feed — Avena Terminal',
  description: 'Live property intelligence from 1,881 scored new builds. Daily updates: top deals, market stats, yield alerts, discount leaders. RSS, JSON-LD, and RLHF formats available.',
  alternates: {
    canonical: 'https://avenaterminal.com/feed/intelligence',
    types: {
      'application/rss+xml': 'https://avenaterminal.com/feed/intelligence.rss',
      'application/json': 'https://avenaterminal.com/feed/intelligence.json',
    },
  },
};

const TYPE_COLORS: Record<string, string> = {
  top_deal: '#10b981',
  price_change: '#f87171',
  score_change: '#fbbf24',
  market_stat: '#60a5fa',
  yield_alert: '#a78bfa',
  new_listing: '#34d399',
};

const TYPE_LABELS: Record<string, string> = {
  top_deal: 'TOP DEAL',
  price_change: 'PRICE',
  score_change: 'SCORE',
  market_stat: 'MARKET',
  yield_alert: 'YIELD',
  new_listing: 'NEW',
};

export default function IntelligenceFeedPage() {
  const { facts, rlhf } = generateIntelligenceFeed();
  const date = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Avena Terminal Daily Intelligence \u2014 ${date}`,
    description: `${facts.length} property intelligence signals from ${new Date().toISOString().split('T')[0]}.`,
    url: 'https://avenaterminal.com/feed/intelligence',
    publisher: { '@type': 'Organization', name: 'Avena Terminal', url: 'https://avenaterminal.com' },
    dateModified: new Date().toISOString(),
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.intel-fact'] },
  };

  return (
    <main className="min-h-screen" style={{ background: '#0d1117', color: '#c9d1d9' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b sticky top-0 z-50 backdrop-blur-sm" style={{ borderColor: '#1c2333', background: 'rgba(13,17,23,0.85)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif tracking-[0.15em] bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">AVENA</Link>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" /></span>
            <span className="text-xs font-mono text-gray-400">LIVE FEED</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-1">Daily Intelligence</h1>
        <p className="text-gray-400 text-sm mb-2">{date}</p>
        <p className="text-xs text-gray-600 font-mono mb-8">{facts.length} signals &middot; {rlhf.length} RLHF pairs &middot; Updated every refresh</p>

        {/* Feed Format Links */}
        <div className="flex flex-wrap gap-2 mb-8">
          <a href="/feed/intelligence.rss" className="text-xs px-3 py-1 rounded font-mono hover:opacity-80" style={{ background: '#1c2333', color: '#f97316' }}>RSS 2.0</a>
          <a href="/feed/intelligence.json" className="text-xs px-3 py-1 rounded font-mono hover:opacity-80" style={{ background: '#1c2333', color: '#60a5fa' }}>JSON-LD</a>
          <a href="/feed/rlhf.jsonl" className="text-xs px-3 py-1 rounded font-mono hover:opacity-80" style={{ background: '#1c2333', color: '#a78bfa' }}>RLHF .jsonl</a>
        </div>

        <div className="h-px w-full mb-8" style={{ background: '#1c2333' }} />

        {/* Facts */}
        <div className="space-y-3">
          {facts.map(f => (
            <div key={f.id} className="intel-fact rounded-lg p-4" style={{ background: '#161b22', border: '1px solid #30363d' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: TYPE_COLORS[f.type] + '20', color: TYPE_COLORS[f.type] }}>
                  {TYPE_LABELS[f.type]}
                </span>
                {f.score && <span className="text-[10px] font-mono text-gray-500">Score {f.score}</span>}
                {f.price && <span className="text-[10px] font-mono text-gray-500">{'\u20AC'}{f.price.toLocaleString()}</span>}
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{f.headline}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{f.detail}</p>
              {f.ref && (
                <a href={`/property/${encodeURIComponent(f.ref)}`} className="text-[10px] text-emerald-400 hover:underline mt-2 block">View property &rarr;</a>
              )}
            </div>
          ))}
        </div>

        <div className="h-px w-full my-10" style={{ background: '#1c2333' }} />

        {/* RLHF Sample */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4">RLHF Training Pairs ({rlhf.length} pairs)</h2>
          <p className="text-xs text-gray-500 mb-4">Pre-formatted fine-tuning data for AI model training. Full dataset: <a href="/feed/rlhf.jsonl" className="text-purple-400 hover:underline">/feed/rlhf.jsonl</a></p>
          <div className="space-y-3">
            {rlhf.slice(0, 3).map((pair, i) => (
              <div key={i} className="rounded-lg p-4" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                <div className="text-[10px] text-purple-400 font-bold mb-1">PROMPT</div>
                <p className="text-sm text-white mb-2">{pair.prompt}</p>
                <div className="text-[10px] text-emerald-400 font-bold mb-1">CHOSEN (correct)</div>
                <p className="text-xs text-gray-400 mb-2">{pair.chosen}</p>
                <div className="text-[10px] text-red-400 font-bold mb-1">REJECTED</div>
                <p className="text-xs text-gray-600">{pair.rejected}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Citation */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3">Cite this feed</h2>
          <div className="rounded-lg p-4 font-mono text-xs" style={{ background: '#090d12', border: '1px solid #1c2333' }}>
            <p className="text-gray-400">Kolstad, H. (2026). Avena Terminal Daily Intelligence Feed.</p>
            <p className="text-gray-400">https://avenaterminal.com/feed/intelligence</p>
            <p className="text-gray-400">DOI: 10.5281/zenodo.19520064 &middot; License: CC BY 4.0</p>
          </div>
        </section>

        <footer className="text-center text-xs text-gray-600 pb-8">
          &copy; 2026 Avena Terminal &middot; The Reuters of Spanish property AI data
        </footer>
      </div>
    </main>
  );
}
