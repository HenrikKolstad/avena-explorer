import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Press & Media — Avena Terminal',
  description:
    'Press resources, media kit, and data partnerships for Avena Terminal — Spain\'s first real-time PropTech scanner covering 1,881 new build properties.',
  openGraph: {
    title: 'Press & Media — Avena Terminal',
    description:
      'Press resources and media kit for Spain\'s first real-time PropTech scanner.',
    url: 'https://avenaterminal.com/about/press',
    siteName: 'Avena Terminal',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

export default function PressPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://avenaterminal.com' },
      { '@type': 'ListItem', position: 2, name: 'About', item: 'https://avenaterminal.com/about' },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Press',
        item: 'https://avenaterminal.com/about/press',
      },
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
          <Link href="/about" className="hover:text-white">
            About
          </Link>{' '}
          <span className="mx-1">/</span>
          <span className="text-white">Press</span>
        </nav>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">AVENA TERMINAL IN THE PRESS</h1>
        <p className="text-gray-400 text-lg mb-10">
          Spain&apos;s first real-time PropTech scanner
        </p>

        {/* Press Contact */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Press Contact</h2>
          <div
            className="rounded-lg p-6"
            style={{ background: '#161b22', border: '1px solid #1c2333' }}
          >
            <p className="text-gray-300 leading-relaxed">
              For press inquiries, interview requests, and media partnerships:
            </p>
            <p className="text-white font-mono mt-3 text-lg">press@avenaterminal.com</p>
            <p className="text-gray-500 text-sm mt-2">
              We aim to respond within 24 hours on business days.
            </p>
          </div>
        </section>

        {/* Media Kit */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Media Kit</h2>

          {/* Company Overview */}
          <div
            className="rounded-lg p-6 mb-4"
            style={{ background: '#161b22', border: '1px solid #1c2333' }}
          >
            <h3 className="font-semibold text-white mb-3">Company Overview</h3>
            <p className="text-gray-300 leading-relaxed">
              Avena Terminal is a PropTech data platform that scores and ranks new build properties
              across coastal Spain using a proprietary hedonic regression model. The terminal
              provides institutional-grade investment intelligence to individual buyers, investors,
              and researchers through a free, publicly accessible web interface.
            </p>
          </div>

          {/* Key Statistics */}
          <div
            className="rounded-lg p-6 mb-4"
            style={{ background: '#161b22', border: '1px solid #1c2333' }}
          >
            <h3 className="font-semibold text-white mb-4">Key Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { value: '1,881', label: 'Properties Tracked' },
                { value: '100+', label: 'Towns Covered' },
                { value: '4', label: 'Coastal Regions' },
                { value: 'Daily', label: 'Data Updates' },
                { value: '5', label: 'Scoring Dimensions' },
                { value: '0-100', label: 'Composite Score Range' },
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

          {/* Founder Bio */}
          <div
            className="rounded-lg p-6 mb-4"
            style={{ background: '#161b22', border: '1px solid #1c2333' }}
          >
            <h3 className="font-semibold text-white mb-3">Founder</h3>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Henrik Kolstad</strong> &mdash; Norwegian founder and
              developer of Avena Terminal. After identifying deep inefficiencies in the Spanish
              property market, Henrik built the platform&apos;s scoring engine from scratch, combining
              hedonic regression modelling with real-time data feeds to surface undervalued new build
              opportunities across coastal Spain.
            </p>
          </div>

          {/* Data Methodology */}
          <div
            className="rounded-lg p-6"
            style={{ background: '#161b22', border: '1px solid #1c2333' }}
          >
            <h3 className="font-semibold text-white mb-3">Data Methodology</h3>
            <ul className="text-gray-400 text-sm space-y-3 leading-relaxed">
              <li>
                <strong className="text-white">Source:</strong> New build listings ingested daily
                from the RedSP XML feed, covering verified Spanish developers and promoters.
              </li>
              <li>
                <strong className="text-white">Scoring Model:</strong> Hedonic regression across
                five dimensions &mdash; Value (40%), Yield (25%), Location (20%), Quality (10%),
                and Risk (5%).
              </li>
              <li>
                <strong className="text-white">Benchmarks:</strong> Municipality-level market
                prices aggregated from Idealista, INE, and local registrars.
              </li>
              <li>
                <strong className="text-white">Yield Estimates:</strong> Derived from AirDNA and
                Idealista rental comps, accounting for seasonal occupancy and average daily rates.
              </li>
            </ul>
          </div>
        </section>

        {/* Data Partnerships */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Data Partnerships</h2>
          <div
            className="rounded-lg p-6"
            style={{ background: '#161b22', border: '1px solid #1c2333' }}
          >
            <p className="text-gray-300 leading-relaxed mb-3">
              Free data access to journalists and researchers covering Spanish property markets.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              We provide complimentary access to our dataset, scoring methodology documentation,
              and custom data exports for editorial and academic use. Reach out via the press
              contact above to discuss your project.
            </p>
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
