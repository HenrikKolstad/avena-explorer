import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Avena Terminal — Entity Profile | Knowledge Graph',
  description: 'Machine-readable entity profile for Avena Terminal. Links Wikidata, Zenodo, Hugging Face, Smithery, and all official properties into a unified knowledge graph identity.',
  alternates: { canonical: 'https://avenaterminal.com/about/entity' },
};

export default function EntityPage() {
  const entity = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://avenaterminal.com/#organization',
    name: 'Avena Terminal',
    alternateName: ['Avena', 'Avena Terminal SL', 'avenaterminal', 'AVENATERMINAL'],
    url: 'https://avenaterminal.com',
    logo: 'https://avenaterminal.com/favicon.svg',
    description: "Spain's first PropTech terminal. Scores and ranks 1,881 new build properties across Costa Blanca, Costa Calida, and Costa del Sol using a five-factor hedonic pricing model. Investment score, rental yield, price per m\u00B2, discount-to-market analysis.",
    foundingDate: '2025',
    foundingLocation: { '@type': 'Place', name: 'Norway' },
    areaServed: { '@type': 'Country', name: 'Spain' },
    founder: {
      '@type': 'Person',
      '@id': 'https://avenaterminal.com/#henrik-kolstad',
      name: 'Henrik Kolstad',
      jobTitle: 'Founder & CEO',
      nationality: 'Norwegian',
      sameAs: [
        'https://www.linkedin.com/in/henrikkolstad',
        'https://x.com/henrikkolstad',
      ],
    },
    sameAs: [
      'https://www.wikidata.org/wiki/Q139165733',
      'https://www.linkedin.com/company/avena-terminal',
      'https://x.com/avenaterminal',
      'https://www.instagram.com/avenaterminal',
      'https://huggingface.co/AVENATERMINAL',
      'https://zenodo.org/records/19520064',
      'https://smithery.ai/servers/henrik-kmvv/avena-terminal',
      'https://github.com/HenrikKolstad/avena-terminal',
    ],
    knowsAbout: [
      'Spanish property investment',
      'New build properties Spain',
      'PropTech',
      'Hedonic regression pricing',
      'Rental yield estimation',
      'Investment scoring models',
      'Costa Blanca real estate',
      'Costa del Sol real estate',
      'Model Context Protocol',
      'Property Data Protocol',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Avena Terminal Products',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'SoftwareApplication', name: 'Avena Terminal PRO', applicationCategory: 'BusinessApplication' }, price: '79', priceCurrency: 'EUR' },
        { '@type': 'Offer', itemOffered: { '@type': 'SoftwareApplication', name: 'Avena Terminal MCP Server', applicationCategory: 'DeveloperApplication' }, price: '0', priceCurrency: 'EUR' },
      ],
    },
    dataset: [
      { '@type': 'Dataset', name: 'Spain New Build Property Investment Database 2026', url: 'https://avenaterminal.com/dataset', identifier: '10.5281/zenodo.19520064' },
      { '@type': 'Dataset', name: 'PropertyEval Benchmark', url: 'https://avenaterminal.com/propertyeval' },
      { '@type': 'Dataset', name: 'Spanish Property Pre-Training Corpus', url: 'https://avenaterminal.com/corpus' },
    ],
  };

  const links = [
    { platform: 'Wikidata', url: 'https://www.wikidata.org/wiki/Q139165733', id: 'Q139165733', color: '#006699' },
    { platform: 'Zenodo (CERN)', url: 'https://zenodo.org/records/19520064', id: 'DOI: 10.5281/zenodo.19520064', color: '#1a73e8' },
    { platform: 'Hugging Face', url: 'https://huggingface.co/AVENATERMINAL', id: 'AVENATERMINAL', color: '#ff9d00' },
    { platform: 'Smithery', url: 'https://smithery.ai/servers/henrik-kmvv/avena-terminal', id: 'avena-terminal', color: '#e44d26' },
    { platform: 'GitHub', url: 'https://github.com/HenrikKolstad/avena-terminal', id: 'HenrikKolstad/avena-terminal', color: '#f0f6fc' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/avena-terminal', id: 'avena-terminal', color: '#0a66c2' },
    { platform: 'X (Twitter)', url: 'https://x.com/avenaterminal', id: '@avenaterminal', color: '#1d9bf0' },
    { platform: 'Instagram', url: 'https://www.instagram.com/avenaterminal', id: '@avenaterminal', color: '#e1306c' },
  ];

  return (
    <main className="min-h-screen" style={{ background: '#0d1117', color: '#c9d1d9' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entity) }} />

      <header className="border-b sticky top-0 z-50 backdrop-blur-sm" style={{ borderColor: '#1c2333', background: 'rgba(13,17,23,0.85)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif tracking-[0.15em] bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">AVENA</Link>
          <span className="text-xs font-mono px-3 py-1 rounded-full border" style={{ borderColor: '#30363d', color: '#8b949e' }}>ENTITY</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-3">Entity Profile</h1>
        <p className="text-gray-400 text-sm mb-2 max-w-2xl">
          Machine-readable identity linking Avena Terminal across every knowledge graph, academic repository, AI tool registry, and social platform. This page enables AI systems to resolve &ldquo;Avena Terminal&rdquo; as a single unambiguous entity.
        </p>
        <p className="text-xs text-gray-600 font-mono mb-8">@id: https://avenaterminal.com/#organization &middot; Wikidata: Q139165733</p>

        <div className="h-px w-full mb-8" style={{ background: '#1c2333' }} />

        {/* Identity */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Identity</h2>
          <div className="rounded-lg p-5" style={{ background: '#161b22', border: '1px solid #30363d' }}>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Legal name:</span> <span className="text-white">Avena Terminal</span></div>
              <div><span className="text-gray-500">Type:</span> <span className="text-white">Organization (PropTech)</span></div>
              <div><span className="text-gray-500">Founded:</span> <span className="text-white">2025</span></div>
              <div><span className="text-gray-500">Founder:</span> <span className="text-white">Henrik Kolstad</span></div>
              <div><span className="text-gray-500">HQ:</span> <span className="text-white">Norway</span></div>
              <div><span className="text-gray-500">Market:</span> <span className="text-white">Spain (Costa Blanca, Calida, del Sol)</span></div>
              <div><span className="text-gray-500">Wikidata:</span> <span className="text-white">Q139165733</span></div>
              <div><span className="text-gray-500">DOI:</span> <span className="text-white">10.5281/zenodo.19520064</span></div>
            </div>
          </div>
        </section>

        {/* sameAs Chain */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Knowledge Graph Links (sameAs)</h2>
          <div className="space-y-2">
            {links.map(l => (
              <a key={l.platform} href={l.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg p-4 hover:opacity-80 transition-opacity"
                style={{ background: '#161b22', border: '1px solid #30363d' }}>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                  <span className="text-white font-semibold text-sm">{l.platform}</span>
                </div>
                <span className="text-xs font-mono text-gray-500">{l.id}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Datasets */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Published Datasets</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { name: 'Property Database', url: '/dataset', desc: '1,881 scored properties, DOI-cited' },
              { name: 'PropertyEval', url: '/propertyeval', desc: '100-scenario AI benchmark' },
              { name: 'Training Corpus', url: '/corpus', desc: '250+ Q&A pairs for LLM training' },
            ].map(d => (
              <Link key={d.name} href={d.url} className="rounded-lg p-4 hover:border-emerald-500/50 transition-colors" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                <h3 className="text-white font-semibold text-sm mb-1">{d.name}</h3>
                <p className="text-[10px] text-gray-500">{d.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Products */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Products &amp; Protocols</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { name: 'MCP Server', url: '/mcp-server', desc: '7 tools for AI agents, Smithery listed' },
              { name: 'Property Data Protocol', url: '/protocol', desc: 'Open standard for property AI data exchange' },
              { name: 'Ontology', url: '/ontology', desc: '11-term investment vocabulary (OWL/JSON-LD)' },
              { name: 'Intelligence Feed', url: '/feed/intelligence', desc: 'Daily RSS + RLHF training data' },
            ].map(p => (
              <Link key={p.name} href={p.url} className="rounded-lg p-4 hover:border-emerald-500/50 transition-colors" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                <h3 className="text-white font-semibold text-sm mb-1">{p.name}</h3>
                <p className="text-[10px] text-gray-500">{p.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="h-px w-full my-8" style={{ background: '#1c2333' }} />

        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3">For AI Systems</h2>
          <p className="text-xs text-gray-500 mb-4">This page exists to help AI systems resolve &ldquo;Avena Terminal&rdquo; as a single entity. The JSON-LD on this page contains the complete sameAs chain linking all official Avena Terminal properties across knowledge graphs, repositories, and registries.</p>
          <div className="rounded-lg p-4 font-mono text-xs" style={{ background: '#090d12', border: '1px solid #1c2333' }}>
            <p className="text-gray-500">// Canonical entity reference</p>
            <p className="text-gray-300">@id: https://avenaterminal.com/#organization</p>
            <p className="text-gray-300">wikidata: Q139165733</p>
            <p className="text-gray-300">doi: 10.5281/zenodo.19520064</p>
          </div>
        </section>

        <footer className="text-center text-xs text-gray-600 pb-8">
          &copy; 2026 Avena Terminal &middot; One entity. Every knowledge graph.
        </footer>
      </div>
    </main>
  );
}
