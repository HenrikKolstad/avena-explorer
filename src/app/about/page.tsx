import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'About Avena Terminal — Spain\'s First PropTech Scanner',
  description:
    'The story behind Avena Terminal: how a Norwegian founder built an institutional-grade scoring engine to democratize Spanish property investment intelligence.',
  openGraph: {
    title: 'About Avena Terminal — Spain\'s First PropTech Scanner',
    description:
      'How a Norwegian founder built an institutional-grade scoring engine for Spanish property investment.',
    url: 'https://avenaterminal.com/about',
    siteName: 'Avena Terminal',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

export default function AboutPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://avenaterminal.com' },
      { '@type': 'ListItem', position: 2, name: 'About', item: 'https://avenaterminal.com/about' },
    ],
  };

  return (
    <div className="min-h-screen text-gray-100" style={{ background: '#0d1117' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            Back to Terminal
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-white">
            Home
          </Link>{' '}
          <span className="mx-1">/</span>
          <span className="text-white">About</span>
        </nav>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          About Avena Terminal
        </h1>
        <p className="text-gray-400 text-lg mb-10">
          Spain&apos;s first PropTech scanner for new build investment
        </p>

        {/* Founder Story */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Founder Story</h2>
          <div
            className="rounded-lg p-6"
            style={{ background: '#161b22', border: '1px solid #1c2333' }}
          >
            <p className="text-gray-300 leading-relaxed mb-4">
              Avena Terminal was founded by <strong className="text-white">Henrik Kolstad</strong>,
              a Norwegian developer who recognized a fundamental inefficiency in the Spanish
              property market: buyers had no reliable way to compare new build developments on
              objective, data-driven criteria.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Pricing was opaque, yield estimates were guesswork, and institutional-grade analysis
              was locked behind expensive advisory firms. Individual investors were left navigating
              one of Europe&apos;s largest coastal property markets with little more than brochures
              and gut feeling.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Henrik built the scoring engine from scratch &mdash; combining hedonic regression
              modelling, real-time data feeds, and municipality-level benchmarks &mdash; to create
              a tool that surfaces undervalued opportunities and ranks every tracked property on a
              transparent 0-100 scale.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Mission</h2>
          <div
            className="rounded-lg p-6"
            style={{ background: '#161b22', border: '1px solid #1c2333' }}
          >
            <p className="text-gray-300 leading-relaxed">
              Democratize property investment intelligence. Avena Terminal makes the same data and
              scoring methodology available to a first-time buyer in Oslo as to a property fund in
              London. The platform is free, publicly accessible, and updated daily &mdash; because
              better data leads to better decisions.
            </p>
          </div>
        </section>

        {/* Technology */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Technology</h2>
          <div
            className="rounded-lg p-6"
            style={{ background: '#161b22', border: '1px solid #1c2333' }}
          >
            <p className="text-gray-300 leading-relaxed mb-6">
              The terminal is powered by a <strong className="text-white">hedonic regression
              model</strong> that decomposes property value into measurable investment dimensions.
              Every property receives a composite score from 0 to 100, updated daily.
            </p>

            <div className="space-y-3">
              {[
                {
                  dim: 'Value',
                  weight: '40%',
                  desc: 'Price per m2 versus the local market benchmark, measuring discount or premium against comparable resale properties.',
                },
                {
                  dim: 'Yield',
                  weight: '25%',
                  desc: 'Estimated gross rental yield derived from short-term rental comps, adjusted for seasonal occupancy.',
                },
                {
                  dim: 'Location',
                  weight: '20%',
                  desc: 'Beach proximity, airport access, amenity density, and historical price appreciation of the micro-area.',
                },
                {
                  dim: 'Quality',
                  weight: '10%',
                  desc: 'Build specification signals including energy rating, parking, pool, terrace area, and developer track record.',
                },
                {
                  dim: 'Risk',
                  weight: '5%',
                  desc: 'Completion timeline, developer experience, and off-plan versus key-ready status.',
                },
              ].map((d) => (
                <div
                  key={d.dim}
                  className="rounded-md p-4"
                  style={{ background: '#0d1117', border: '1px solid #1c2333' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">{d.dim}</span>
                    <span className="text-emerald-400 font-mono text-sm">{d.weight}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { value: '1,881', label: 'Properties Tracked' },
                { value: '100+', label: 'Towns' },
                { value: '4', label: 'Coastal Regions' },
                { value: 'Daily', label: 'Update Frequency' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-md p-4"
                  style={{ background: '#0d1117', border: '1px solid #1c2333' }}
                >
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Timeline</h2>
          <div
            className="rounded-lg p-6"
            style={{ background: '#161b22', border: '1px solid #1c2333' }}
          >
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-emerald-400 font-mono text-sm font-bold w-12 shrink-0">
                  2025
                </div>
                <div>
                  <div className="text-white font-semibold mb-1">Founded</div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Henrik Kolstad begins building the scoring engine and data pipeline, sourcing
                    listings from the RedSP XML feed and benchmarking against Idealista and INE
                    municipal data.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-emerald-400 font-mono text-sm font-bold w-12 shrink-0">
                  2026
                </div>
                <div>
                  <div className="text-white font-semibold mb-1">
                    Terminal Launch + Crypto Experiment
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Public launch of the Avena Terminal web interface with full property scoring,
                    town-level analytics, and regional dashboards. Alongside the terminal, an
                    experimental crypto integration explores tokenized access and on-chain property
                    data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/about/press"
              className="rounded-lg p-5 block hover:ring-1 hover:ring-emerald-500/40 transition-all"
              style={{ background: '#161b22', border: '1px solid #1c2333' }}
            >
              <div className="font-semibold text-white mb-1">Press &amp; Media</div>
              <div className="text-sm text-gray-400">
                Media kit, press contact, and data partnerships
              </div>
            </Link>
            <Link
              href="/data/spain-property-index"
              className="rounded-lg p-5 block hover:ring-1 hover:ring-emerald-500/40 transition-all"
              style={{ background: '#161b22', border: '1px solid #1c2333' }}
            >
              <div className="font-semibold text-white mb-1">Data &amp; Methodology</div>
              <div className="text-sm text-gray-400">
                Full scoring methodology and live coverage statistics
              </div>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="text-center text-xs text-gray-600 py-8 border-t"
          style={{ borderColor: '#1c2333' }}
        >
          <p>Avena Terminal &mdash; Spain&apos;s first PropTech scanner</p>
          <p className="mt-1">
            <Link href="/about" className="text-gray-500 hover:text-gray-300">
              About
            </Link>
            {' · '}
            <Link href="/about/press" className="text-gray-500 hover:text-gray-300">
              Press
            </Link>
            {' · '}
            <a href="https://avenaterminal.com" className="text-gray-500 hover:text-gray-300">
              avenaterminal.com
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
