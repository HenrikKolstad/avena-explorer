import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Research Notes — Weekly Correlation Analysis | Avena Terminal',
  description: 'Automated weekly correlation analysis across 1,881 new build properties. Beach distance vs yield, developer experience vs score, price vs discount. Published by The Scientist agent.',
  alternates: { canonical: 'https://avenaterminal.com/intelligence/research' },
};

export default async function ResearchNotesPage() {
  let notes: { slug: string; week_num: number; date: string; findings: string; total_correlations: number; sample_size: number; published_at: string }[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('science_notes')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(20);
    if (data) notes = data;
  }

  return (
    <main className="min-h-screen" style={{ background: '#0d1117', color: '#c9d1d9' }}>
      <header className="border-b sticky top-0 z-50 backdrop-blur-sm" style={{ borderColor: '#1c2333', background: 'rgba(13,17,23,0.85)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif tracking-[0.15em] bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">AVENA</Link>
          <span className="text-xs font-mono px-3 py-1 rounded-full border" style={{ borderColor: '#30363d', color: '#8b949e' }}>THE SCIENTIST</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-3">Research Notes</h1>
        <p className="text-gray-400 text-sm mb-2">
          Weekly correlation analysis across the entire Spanish new build dataset. Pearson correlations computed automatically by The Scientist agent.
        </p>
        <p className="text-xs text-gray-600 font-mono mb-8">{notes.length} weekly reports &middot; Published every Friday</p>

        <div className="h-px w-full mb-8" style={{ background: '#1c2333' }} />

        {notes.length > 0 ? (
          <div className="space-y-6">
            {notes.map(note => {
              const findings = JSON.parse(note.findings) as { title: string; correlation: number; sample_size: number; insight: string; variables: string[] }[];
              return (
                <div key={note.slug} className="rounded-lg p-6" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-bold">Week {note.week_num} &mdash; {note.date}</h2>
                    <span className="text-[10px] font-mono text-gray-600">{note.total_correlations} correlations &middot; n={note.sample_size}</span>
                  </div>
                  <div className="space-y-3">
                    {findings.map((f, i) => (
                      <div key={i} className="rounded p-3" style={{ background: '#0d1117' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white font-semibold">{f.title}</span>
                          <span className="font-mono text-xs" style={{ color: Math.abs(f.correlation) > 0.3 ? '#10b981' : Math.abs(f.correlation) > 0.1 ? '#fbbf24' : '#6b7280' }}>
                            r = {f.correlation > 0 ? '+' : ''}{f.correlation}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{f.insight}</p>
                        <span className="text-[9px] text-gray-600 font-mono">n={f.sample_size} &middot; {f.variables.join(' \u00D7 ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg p-10 text-center" style={{ background: '#161b22', border: '1px dashed #30363d' }}>
            <p className="text-gray-400 mb-2">No research notes yet</p>
            <p className="text-xs text-gray-600">The Scientist publishes weekly correlation analyses every Friday. First report generates after the next scheduled run.</p>
          </div>
        )}

        <footer className="mt-10 text-center text-xs text-gray-600 pb-8">
          &copy; 2026 Avena Terminal &middot; The Scientist &middot; Automated correlation analysis
        </footer>
      </div>
    </main>
  );
}
