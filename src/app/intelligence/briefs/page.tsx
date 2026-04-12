import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Investment Briefs — AI-Generated Property Analysis | Avena Terminal',
  description: 'Autonomous AI-generated investment briefs for high-severity property anomalies. Goldman Sachs-style analysis published daily by the Avena Intelligence Agent.',
  alternates: { canonical: 'https://avenaterminal.com/intelligence/briefs' },
};

const SEVERITY_COLORS: Record<string, string> = { high: '#f87171', medium: '#fbbf24', low: '#60a5fa' };

export default async function BriefsPage() {
  let briefs: { slug: string; headline: string; severity: string; property_name: string; town: string; region: string; price: number; score: number; content: string; published_at: string }[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('intelligence_briefs')
      .select('slug, headline, severity, property_name, town, region, price, score, content, published_at')
      .order('published_at', { ascending: false })
      .limit(50);
    if (data) briefs = data;
  }

  return (
    <main className="min-h-screen" style={{ background: '#0d1117', color: '#c9d1d9' }}>
      <header className="border-b sticky top-0 z-50 backdrop-blur-sm" style={{ borderColor: '#1c2333', background: 'rgba(13,17,23,0.85)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif tracking-[0.15em] bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">AVENA</Link>
          <span className="text-xs font-mono px-3 py-1 rounded-full border" style={{ borderColor: '#30363d', color: '#8b949e' }}>THE JOURNALIST</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-3">Investment Briefs</h1>
        <p className="text-gray-400 text-sm mb-2">
          AI-generated investment analysis for high-severity property anomalies. Written autonomously by the Avena Intelligence Agent.
        </p>
        <p className="text-xs text-gray-600 font-mono mb-8">{briefs.length} briefs published &middot; Generated daily at 08:00 UTC</p>

        <div className="h-px w-full mb-8" style={{ background: '#1c2333' }} />

        {briefs.length > 0 ? (
          <div className="space-y-4">
            {briefs.map(brief => (
              <article key={brief.slug} className="rounded-lg p-6" style={{ background: '#161b22', border: `1px solid ${SEVERITY_COLORS[brief.severity] || '#30363d'}30` }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded" style={{ background: (SEVERITY_COLORS[brief.severity] || '#60a5fa') + '20', color: SEVERITY_COLORS[brief.severity] || '#60a5fa' }}>{brief.severity}</span>
                  <span className="text-[10px] font-mono text-gray-600">{new Date(brief.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <h2 className="text-white font-bold text-lg mb-2">{brief.headline}</h2>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span>{brief.property_name}</span>
                  <span>&middot;</span>
                  <span>{brief.town}, {brief.region}</span>
                  <span>&middot;</span>
                  <span>&euro;{brief.price?.toLocaleString()}</span>
                  <span>&middot;</span>
                  <span className="text-emerald-400">Score {brief.score}</span>
                </div>
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{brief.content}</div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg p-10 text-center" style={{ background: '#161b22', border: '1px dashed #30363d' }}>
            <p className="text-gray-400 mb-2">No briefs published yet</p>
            <p className="text-xs text-gray-600">The Journalist Agent generates briefs daily from high-severity alpha signals. First brief publishes after the next anomaly detection run.</p>
          </div>
        )}

        <div className="h-px w-full my-10" style={{ background: '#1c2333' }} />

        <footer className="text-center text-xs text-gray-600 pb-8">
          &copy; 2026 Avena Terminal &middot; The Journalist &middot; Autonomous investment analysis
        </footer>
      </div>
    </main>
  );
}
