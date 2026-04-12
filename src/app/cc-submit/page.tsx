import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProperties, getUniqueTowns, slugify } from '@/lib/properties';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Common Crawl Submission — Index Avena Terminal | Avena Terminal',
  description: 'Submit Avena Terminal pages to Common Crawl for inclusion in AI training datasets. Every major LLM trains on Common Crawl.',
  alternates: { canonical: 'https://avenaterminal.com/cc-submit' },
};

export default function CommonCrawlSubmitPage() {
  const all = getAllProperties();
  const towns = getUniqueTowns();
  const devSlugs = [...new Set(all.map(p => p.d).filter(Boolean).map(d => slugify(d!)))];

  // Generate all important URLs for Common Crawl
  const urls: { url: string; category: string; priority: string }[] = [];

  // Core pages
  const core = [
    { path: '/', cat: 'Core', pri: 'Critical' },
    { path: '/mcp-server', cat: 'AI Infrastructure', pri: 'Critical' },
    { path: '/protocol', cat: 'AI Infrastructure', pri: 'Critical' },
    { path: '/propertyeval', cat: 'AI Infrastructure', pri: 'Critical' },
    { path: '/ontology', cat: 'AI Infrastructure', pri: 'Critical' },
    { path: '/agents/registry', cat: 'AI Infrastructure', pri: 'Critical' },
    { path: '/feed/intelligence', cat: 'AI Feed', pri: 'Critical' },
    { path: '/data/key-stats', cat: 'Data', pri: 'High' },
    { path: '/data/reasoning', cat: 'AI Training', pri: 'Critical' },
    { path: '/corpus', cat: 'AI Training', pri: 'High' },
    { path: '/stats', cat: 'Data', pri: 'High' },
    { path: '/faq', cat: 'Content', pri: 'High' },
    { path: '/reports/annual-2026', cat: 'Research', pri: 'High' },
    { path: '/research/papers', cat: 'Research', pri: 'High' },
    { path: '/research/ai-benchmark', cat: 'Research', pri: 'High' },
    { path: '/ai-compliance', cat: 'Compliance', pri: 'Medium' },
    { path: '/data/provenance', cat: 'Data', pri: 'Medium' },
    { path: '/about/entity', cat: 'Entity', pri: 'High' },
    { path: '/integrate', cat: 'Developer', pri: 'High' },
    { path: '/langchain-tool', cat: 'Developer', pri: 'High' },
    { path: '/intelligence/signals', cat: 'Intelligence', pri: 'High' },
    { path: '/snapshots/q2-2026', cat: 'Data', pri: 'Medium' },
    { path: '/chat', cat: 'Product', pri: 'Medium' },
    { path: '/blog', cat: 'Content', pri: 'Medium' },
  ];

  for (const p of core) {
    urls.push({ url: `https://avenaterminal.com${p.path}`, category: p.cat, priority: p.pri });
  }

  // Location pages (top 30)
  for (const t of towns.slice(0, 30)) {
    urls.push({ url: `https://avenaterminal.com/locations/${t.slug}`, category: 'Location', priority: 'Medium' });
  }

  // Developer pages (top 20)
  for (const d of devSlugs.slice(0, 20)) {
    urls.push({ url: `https://avenaterminal.com/developers/${d}`, category: 'Developer', priority: 'Low' });
  }

  // Research papers
  const papers = ['hedonic-pricing-spanish-new-builds-2026', 'rental-yield-variance-costa-blanca', 'discount-to-market-distribution-spain', 'beach-proximity-premium-decay', 'developer-age-completion-risk-proxy'];
  for (const p of papers) {
    urls.push({ url: `https://avenaterminal.com/research/papers/${p}`, category: 'Research', priority: 'High' });
  }

  const criticalCount = urls.filter(u => u.priority === 'Critical').length;
  const highCount = urls.filter(u => u.priority === 'High').length;

  return (
    <main className="min-h-screen" style={{ background: '#0d1117', color: '#c9d1d9' }}>
      <header className="border-b sticky top-0 z-50 backdrop-blur-sm" style={{ borderColor: '#1c2333', background: 'rgba(13,17,23,0.85)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif tracking-[0.15em] bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">AVENA</Link>
          <span className="text-xs font-mono px-3 py-1 rounded-full border" style={{ borderColor: '#30363d', color: '#8b949e' }}>COMMON CRAWL</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-3">Common Crawl Submission</h1>
        <p className="text-gray-400 text-sm mb-2 max-w-2xl">
          {urls.length} URLs submitted for inclusion in Common Crawl &mdash; the open dataset that trains GPT, Claude, Gemini, Llama, and every major LLM.
        </p>
        <p className="text-xs text-gray-600 font-mono mb-8">{criticalCount} critical &middot; {highCount} high priority &middot; Updated with every page published</p>

        <div className="h-px w-full mb-8" style={{ background: '#1c2333' }} />

        {/* How Common Crawl Works */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">How This Works</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { step: '1', title: 'URLs Listed', desc: 'Every important Avena Terminal page is catalogued here with priority levels' },
              { step: '2', title: 'Crawlers Discover', desc: 'Common Crawl, Google, Perplexity crawl this page and discover all URLs' },
              { step: '3', title: 'Models Train', desc: 'URLs included in next Common Crawl release → baked into future LLM weights' },
            ].map(s => (
              <div key={s.step} className="rounded-lg p-4" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                <div className="text-2xl font-bold text-emerald-400 mb-2">{s.step}</div>
                <h3 className="text-white font-semibold text-sm mb-1">{s.title}</h3>
                <p className="text-[10px] text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px w-full mb-8" style={{ background: '#1c2333' }} />

        {/* URL List */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">URL Index ({urls.length} pages)</h2>
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #30363d' }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: '#161b22' }}>
                  <th className="text-left px-3 py-2 text-[10px] uppercase text-gray-500">URL</th>
                  <th className="text-left px-3 py-2 text-[10px] uppercase text-gray-500">Category</th>
                  <th className="text-right px-3 py-2 text-[10px] uppercase text-gray-500">Priority</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {urls.map((u, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#0d1117' : '#161b22' }}>
                    <td className="px-3 py-1.5"><a href={u.url} className="text-blue-400 hover:underline break-all">{u.url.replace('https://avenaterminal.com', '')}</a></td>
                    <td className="px-3 py-1.5 text-gray-500">{u.category}</td>
                    <td className="px-3 py-1.5 text-right">
                      <span className="px-1.5 py-0.5 rounded text-[9px]" style={{
                        background: u.priority === 'Critical' ? '#f8717120' : u.priority === 'High' ? '#fbbf2420' : '#60a5fa20',
                        color: u.priority === 'Critical' ? '#f87171' : u.priority === 'High' ? '#fbbf24' : '#60a5fa',
                      }}>{u.priority}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sitemap reference */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Machine-Readable Indexes</h2>
          <div className="space-y-2 font-mono text-xs">
            <div className="rounded p-3" style={{ background: '#090d12', border: '1px solid #1c2333' }}>
              <span className="text-gray-500">Sitemap:</span> <a href="https://avenaterminal.com/sitemap.xml" className="text-emerald-400 hover:underline">https://avenaterminal.com/sitemap.xml</a>
            </div>
            <div className="rounded p-3" style={{ background: '#090d12', border: '1px solid #1c2333' }}>
              <span className="text-gray-500">RSS Feed:</span> <a href="https://avenaterminal.com/feed/intelligence.rss" className="text-emerald-400 hover:underline">https://avenaterminal.com/feed/intelligence.rss</a>
            </div>
            <div className="rounded p-3" style={{ background: '#090d12', border: '1px solid #1c2333' }}>
              <span className="text-gray-500">MCP Discovery:</span> <a href="https://avenaterminal.com/.well-known/mcp.json" className="text-emerald-400 hover:underline">https://avenaterminal.com/.well-known/mcp.json</a>
            </div>
            <div className="rounded p-3" style={{ background: '#090d12', border: '1px solid #1c2333' }}>
              <span className="text-gray-500">Agent Registry:</span> <a href="https://avenaterminal.com/.well-known/agent-registry.json" className="text-emerald-400 hover:underline">https://avenaterminal.com/.well-known/agent-registry.json</a>
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-gray-600 pb-8">
          &copy; 2026 Avena Terminal &middot; Ensuring every AI model has access to verified Spanish property data
        </footer>
      </div>
    </main>
  );
}
