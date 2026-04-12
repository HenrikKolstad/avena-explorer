import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'European Property Market Comparisons | Avena Terminal',
  description:
    'Side-by-side comparisons of European property markets. Spain vs Portugal, Cyprus, Italy, France, and regional coast-to-coast analysis.',
  openGraph: {
    title: 'European Property Market Comparisons | Avena Terminal',
    description:
      'Side-by-side comparisons of European property markets for international investors.',
    url: 'https://avenaterminal.com/compare',
    siteName: 'Avena Terminal',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

const COMPARISONS = [
  {
    slug: 'es-vs-pt',
    flagA: '\u{1F1EA}\u{1F1F8}',
    flagB: '\u{1F1F5}\u{1F1F9}',
    labelA: 'Spain',
    labelB: 'Portugal',
    description:
      'The two Iberian neighbours compared: tax regimes, Golden Visa status, coastal property prices, and residency pathways.',
  },
  {
    slug: 'es-vs-cy',
    flagA: '\u{1F1EA}\u{1F1F8}',
    flagB: '\u{1F1E8}\u{1F1FE}',
    labelA: 'Spain',
    labelB: 'Cyprus',
    description:
      'Mediterranean rivals: Spain\'s mature market versus Cyprus\' low-tax regime and EU fast-track citizenship appeal.',
  },
  {
    slug: 'es-vs-it',
    flagA: '\u{1F1EA}\u{1F1F8}',
    flagB: '\u{1F1EE}\u{1F1F9}',
    labelA: 'Spain',
    labelB: 'Italy',
    description:
      'Europe\'s two largest southern property markets compared on price, yield, lifestyle, and bureaucratic complexity.',
  },
  {
    slug: 'es-vs-fr',
    flagA: '\u{1F1EA}\u{1F1F8}',
    flagB: '\u{1F1EB}\u{1F1F7}',
    labelA: 'Spain',
    labelB: 'France',
    description:
      'Costa living versus the C\u00F4te d\'Azur: price-per-square-metre, inheritance tax, rental regulations, and market maturity.',
  },
  {
    slug: 'cb-vs-cds',
    flagA: '\u{1F1EA}\u{1F1F8}',
    flagB: '\u{1F1EA}\u{1F1F8}',
    labelA: 'Costa Blanca',
    labelB: 'Costa del Sol',
    description:
      'Spain\'s two most popular expat coasts head-to-head: new-build pricing, rental yields, flight access, and lifestyle differences.',
  },
  {
    slug: 'cb-vs-algarve',
    flagA: '\u{1F1EA}\u{1F1F8}',
    flagB: '\u{1F1F5}\u{1F1F9}',
    labelA: 'Costa Blanca',
    labelB: 'Algarve',
    description:
      'The cross-border coastal comparison: Spain\'s Costa Blanca versus Portugal\'s Algarve on sun, golf, prices, and investment returns.',
  },
];

export default function CompareLandingPage() {
  return (
    <div className="min-h-screen text-gray-100" style={{ background: '#0d1117' }}>
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
            <Link href="/portugal" className="text-sm text-gray-400 hover:text-white transition-colors">
              Portugal
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
          <span className="text-white">Compare</span>
        </nav>

        {/* Hero */}
        <section className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            European Property Market Comparisons
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Data-driven side-by-side analysis of Europe&apos;s most popular property investment destinations. Taxes, prices, yields, and lifestyle factors — all in one place.
          </p>
        </section>

        {/* Comparison cards */}
        <section className="grid md:grid-cols-2 gap-5 mb-14">
          {COMPARISONS.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="rounded-xl border p-6 hover:border-emerald-500/30 transition-all group block"
              style={{ background: '#0f1419', borderColor: '#1c2333' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{c.flagA}</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">vs</span>
                <span className="text-2xl">{c.flagB}</span>
              </div>
              <h2 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                {c.labelA} vs {c.labelB}
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">{c.description}</p>
              <div className="mt-4 text-xs text-emerald-400 font-medium">
                View comparison &rarr;
              </div>
            </Link>
          ))}
        </section>

        {/* Cross-link */}
        <section className="text-center">
          <p className="text-sm text-gray-500 mb-3">Looking for town-level comparisons within Spain?</p>
          <Link
            href="/towns"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Browse all Spanish towns &rarr;
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-12" style={{ borderColor: '#1c2333' }}>
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <span className="font-serif tracking-[0.15em] text-gray-400">AVENA</span>
          <span>Data-driven property investment intelligence for Europe&apos;s coasts.</span>
          <div className="flex gap-4">
            <Link href="/portugal" className="hover:text-white transition-colors">Portugal</Link>
            <Link href="/towns" className="hover:text-white transition-colors">Towns</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
