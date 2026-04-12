import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Portugal Property Intelligence — Coming Q3 2026 | Avena Terminal',
  description:
    'Portugal property market data, NHR tax regime analysis, Golden Visa updates, and regional price intelligence for Algarve, Lisbon Coast, and Silver Coast. Coming Q3 2026.',
  openGraph: {
    title: 'Portugal Property Intelligence — Coming Q3 2026 | Avena Terminal',
    description:
      'Portugal property market data, NHR tax regime analysis, and regional price intelligence. Coming Q3 2026.',
    url: 'https://avenaterminal.com/portugal',
    siteName: 'Avena Terminal',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const STATS = [
  { label: 'NHR Tax on Pensions', value: '0%', sub: 'Non-Habitual Resident regime' },
  { label: 'Golden Visa Threshold', value: '€500k', sub: 'Investment fund route' },
  { label: 'Avg Price Gap vs Spain', value: '€3,200/m\u00B2', sub: 'Lisbon metro average' },
  { label: 'Annual Tourism', value: '30M', sub: 'Visitors per year' },
];

const REGIONS = [
  {
    name: 'Algarve',
    slug: 'algarve',
    description:
      'The southernmost coast of Portugal, renowned for golden cliffs, world-class golf, and strong rental yields driven by 300 days of sunshine.',
    avgPrice: '€3,800/m\u00B2',
    nationalities: 'British, French, Dutch',
  },
  {
    name: 'Lisbon Coast',
    slug: 'lisbon-coast',
    description:
      'From Cascais to Comporta, the Lisbon Coast blends metropolitan convenience with Atlantic surf culture. Strong capital appreciation and growing digital nomad demand.',
    avgPrice: '€4,500/m\u00B2',
    nationalities: 'American, Brazilian, German',
  },
  {
    name: 'Silver Coast',
    slug: 'silver-coast',
    description:
      'The affordable alternative stretching from Peniche to Nazar\u00E9. Emerging surf towns, medieval villages, and prices 40% below Lisbon — attracting value-focused buyers.',
    avgPrice: '€2,200/m\u00B2',
    nationalities: 'British, Scandinavian, Belgian',
  },
];

const COMPARISON_ROWS: { metric: string; spain: string; portugal: string }[] = [
  { metric: 'Avg Price/m\u00B2 (Coast)', spain: '€2,800', portugal: '€3,200' },
  { metric: 'Golden Visa Minimum', spain: 'Closed to real estate', portugal: '€500k (funds)' },
  { metric: 'Non-Resident Tax Rate', spain: '24% (19% EU)', portugal: '25% (NHR: 0\u201310%)' },
  { metric: 'Rental Yield (Gross)', spain: '5.2\u20137.8%', portugal: '4.5\u20136.5%' },
  { metric: 'Capital Gains Tax', spain: '19\u201326%', portugal: '28% (NHR exempt possible)' },
  { metric: 'Annual Property Tax', spain: '0.4\u20131.1% (IBI)', portugal: '0.3\u20130.45% (IMI)' },
  { metric: 'Stamp Duty', spain: '6\u201310% (varies by region)', portugal: '6\u20138% (IMT)' },
  { metric: 'Tourism Arrivals (2025)', spain: '90M+', portugal: '30M+' },
  { metric: 'Digital Nomad Visa', spain: 'Available (2023)', portugal: 'Available (2022)' },
  { metric: 'English Proficiency', spain: 'Moderate', portugal: 'High' },
  { metric: 'New-Build Supply', spain: 'Growing rapidly', portugal: 'Limited, rising' },
  { metric: 'EU Residency Path', spain: '10 years', portugal: '5 years (citizenship)' },
];

/* ------------------------------------------------------------------ */
/*  Email capture form (client island)                                 */
/* ------------------------------------------------------------------ */

function EmailForm() {
  return (
    <form
      action="/api/email-capture"
      method="POST"
      className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
    >
      <input type="hidden" name="source" value="portugal" />
      <input
        type="email"
        name="email"
        required
        placeholder="your@email.com"
        className="flex-1 rounded-lg border px-4 py-3 text-sm bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
        style={{ borderColor: '#1c2333' }}
      />
      <button
        type="submit"
        className="rounded-lg px-6 py-3 text-sm font-semibold text-black bg-emerald-400 hover:bg-emerald-300 transition-colors whitespace-nowrap"
      >
        Get Early Access
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PortugalPage() {
  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Portugal Property Market Intelligence',
    description:
      'Regional property price data, tax regime analysis, and investment metrics for the Portuguese residential market.',
    url: 'https://avenaterminal.com/portugal',
    creator: {
      '@type': 'Organization',
      name: 'Avena Terminal',
      url: 'https://avenaterminal.com',
    },
    temporalCoverage: '2024/2026',
    spatialCoverage: {
      '@type': 'Place',
      name: 'Portugal',
    },
    license: 'https://avenaterminal.com/about/data-sources',
  };

  return (
    <div className="min-h-screen text-gray-100" style={{ background: '#0d1117' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />

      {/* Header */}
      <header
        className="border-b sticky top-0 z-50 backdrop-blur-sm"
        style={{ borderColor: '#1c2333', background: 'rgba(13,17,23,0.85)' }}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold font-serif tracking-[0.15em] bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent"
          >
            AVENA
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/compare" className="text-sm text-gray-400 hover:text-white transition-colors">
              Compare
            </Link>
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              Back to Terminal
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-1">/</span>
          <span className="text-white">Portugal</span>
        </nav>

        {/* Hero */}
        <section className="text-center mb-14">
          <div className="text-4xl mb-4">&#127477;&#127481;</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Portugal Property Intelligence
          </h1>
          <p className="text-lg text-emerald-400 font-semibold mb-2">Coming Q3 2026</p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Institutional-grade market data for Portugal&apos;s hottest coastal regions. NHR tax analysis, Golden Visa tracking, and new-build price intelligence — the same depth we deliver for Spain.
          </p>
        </section>

        {/* Stat cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border p-5 text-center"
              style={{ background: '#0f1419', borderColor: '#1c2333' }}
            >
              <div className="text-2xl font-bold text-emerald-400 mb-1">{s.value}</div>
              <div className="text-sm font-medium text-white mb-1">{s.label}</div>
              <div className="text-[11px] text-gray-500">{s.sub}</div>
            </div>
          ))}
        </section>

        {/* Region preview cards */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-white mb-6">Regions We&apos;re Tracking</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {REGIONS.map((r) => (
              <div
                key={r.slug}
                className="rounded-xl border p-6 flex flex-col"
                style={{ background: '#0f1419', borderColor: '#1c2333' }}
              >
                <h3 className="text-lg font-bold text-white mb-2">{r.name}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-1">
                  {r.description}
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Avg Price</span>
                    <span className="text-white font-semibold">{r.avgPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Key Nationalities</span>
                    <span className="text-white">{r.nationalities}</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10">
                    Coming Q3 2026
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Email capture */}
        <section
          className="rounded-xl border p-8 text-center mb-14"
          style={{ background: '#0f1419', borderColor: '#1c2333' }}
        >
          <h2 className="text-xl font-bold text-white mb-2">Get Early Access</h2>
          <p className="text-gray-400 text-sm mb-5">
            Be first to know when Portugal data goes live. No spam — one launch notification.
          </p>
          <EmailForm />
        </section>

        {/* Spain vs Portugal comparison table */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-white mb-2">Spain vs Portugal — At a Glance</h2>
          <p className="text-sm text-gray-400 mb-6">
            How the two Iberian markets compare for international property buyers in 2026.
          </p>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#1c2333' }}>
            <div
              className="grid grid-cols-3 text-xs uppercase tracking-wider text-gray-500 px-4 py-3"
              style={{ background: '#0f1419' }}
            >
              <div>Metric</div>
              <div className="text-center">&#127466;&#127480; Spain</div>
              <div className="text-center">&#127477;&#127481; Portugal</div>
            </div>
            {COMPARISON_ROWS.map((row, i) => (
              <div
                key={row.metric}
                className="grid grid-cols-3 px-4 py-3 border-t text-sm"
                style={{ borderColor: '#1c2333', background: i % 2 === 0 ? '#0d1117' : '#0f1419' }}
              >
                <div className="text-gray-400 font-medium">{row.metric}</div>
                <div className="text-center text-white">{row.spain}</div>
                <div className="text-center text-white">{row.portugal}</div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-600 mt-3 text-right">
            Sources: INE (Spain), INE (Portugal), Banco de Portugal, DBRS, Avena Terminal research. Data as of Q1 2026.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center mb-10">
          <Link
            href="/compare/es-vs-pt"
            className="inline-block rounded-lg px-6 py-3 text-sm font-semibold text-black bg-emerald-400 hover:bg-emerald-300 transition-colors"
          >
            Deep Dive: Spain vs Portugal Comparison
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-12" style={{ borderColor: '#1c2333' }}>
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <span className="font-serif tracking-[0.15em] text-gray-400">AVENA</span>
          <span>Data-driven property investment intelligence for Europe&apos;s coasts.</span>
          <div className="flex gap-4">
            <Link href="/compare" className="hover:text-white transition-colors">Compare</Link>
            <Link href="/towns" className="hover:text-white transition-colors">Towns</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
