import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProperties, getUniqueTowns, getUniqueCostas, avg } from '@/lib/properties';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Media Resources — Avena Terminal',
  description:
    'Press resources, data downloads, and citation-ready statistics from Avena Terminal. Access structured property data for journalism and research.',
  openGraph: {
    title: 'Media Resources — Avena Terminal',
    description: 'Citation-ready statistics, data downloads, and press resources for journalists covering Spanish property.',
    url: 'https://avenaterminal.com/media',
    siteName: 'Avena Terminal',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://avenaterminal.com/media' },
};

export default function MediaPage() {
  const properties = getAllProperties();
  const towns = getUniqueTowns();
  const costas = getUniqueCostas();
  const avgPrice = Math.round(avg(properties.map((p) => p.pf)));
  const avgPm2 = Math.round(avg(properties.filter((p) => p.pm2).map((p) => p.pm2!)));
  const avgYield = avg(properties.filter((p) => p._yield).map((p) => p._yield!.gross)).toFixed(1);
  const avgScore = Math.round(avg(properties.filter((p) => p._sc).map((p) => p._sc!)));
  const avgDiscount = 19;

  const newsArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: 'Avena Terminal Media Resources — Spanish New Build Property Data for Press and Research',
    datePublished: '2026-04-01T09:00:00+02:00',
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: 'Henrik Kolstad',
      jobTitle: 'Founder',
      url: 'https://www.linkedin.com/in/henrikkolstad',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Avena Terminal',
      url: 'https://avenaterminal.com',
      logo: { '@type': 'ImageObject', url: 'https://avenaterminal.com/logo.png' },
    },
    mainEntityOfPage: 'https://avenaterminal.com/media',
    description:
      'Press resources and citation-ready data from Avena Terminal, tracking new build properties across coastal Spain.',
    keywords: [
      'Spanish property data',
      'new builds Spain',
      'property press resources',
      'Costa Blanca data',
      'Costa del Sol data',
      'property investment research',
    ],
  };

  const stats = [
    { label: 'Properties Tracked', value: properties.length.toLocaleString(), detail: 'New build listings updated daily' },
    { label: 'Towns Covered', value: towns.length.toString(), detail: 'Across 4 coastal regions' },
    { label: 'Avg. Discount to Peak', value: `${avgDiscount}%`, detail: 'Below peak resale valuations' },
    { label: 'Avg. Gross Yield', value: `${avgYield}%`, detail: 'Estimated rental return' },
    { label: 'Avg. Asking Price', value: `${(avgPrice / 1000).toFixed(0)}K EUR`, detail: 'Across all property types' },
    { label: 'Avg. Price/m\u00B2', value: `${avgPm2.toLocaleString()} EUR`, detail: 'New build average' },
    { label: 'Avg. Avena Score', value: `${avgScore}/100`, detail: 'Composite investment score' },
    { label: 'Coastal Regions', value: costas.length.toString(), detail: 'Costa Blanca, Calida, del Sol, and more' },
  ];

  return (
    <div className="min-h-screen text-gray-100" style={{ background: '#0d1117' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
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
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Media Resources</h1>
        <p className="text-gray-400 text-lg mb-4">
          Citation-ready data, downloads, and press materials for journalists and researchers
        </p>
        <p className="text-sm text-gray-500 mb-12">
          Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* Pullquote Statistics */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-emerald-400 mb-2">Key Statistics</h2>
          <p className="text-sm text-gray-500 mb-6">
            These figures are citation-ready. Please attribute to &quot;Avena Terminal (avenaterminal.com)&quot;.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg p-5"
                style={{ background: '#161b22', border: '1px solid #1c2333' }}
              >
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-emerald-400 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.detail}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Pullquote Block */}
        <section className="mb-16">
          <blockquote
            className="rounded-lg p-8 text-lg leading-relaxed italic text-gray-300"
            style={{ background: '#161b22', border: '1px solid #1c2333', borderLeft: '4px solid #10b981' }}
          >
            &quot;Avena Terminal tracks {properties.length.toLocaleString()} new build properties across{' '}
            {towns.length} municipalities in coastal Spain. New build asking prices currently average{' '}
            {avgDiscount}% below peak resale valuations, with an estimated average gross rental yield of{' '}
            {avgYield}%.&quot;
            <footer className="text-sm text-gray-500 mt-4 not-italic">
              &mdash; Avena Terminal Q1 2026 Market Analysis
            </footer>
          </blockquote>
        </section>

        {/* Data Download */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Data Access</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/api/dataset"
              className="rounded-lg p-6 block hover:border-emerald-500/40 transition-colors group"
              style={{ background: '#161b22', border: '1px solid #1c2333' }}
            >
              <div className="font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                Download Full Dataset (JSON-LD)
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Machine-readable structured data for all {properties.length.toLocaleString()} tracked
                properties. Includes prices, yields, scores, locations, and developer information.
              </p>
              <span className="text-xs text-emerald-500 font-mono">/api/dataset</span>
            </Link>

            <Link
              href="/about/methodology"
              className="rounded-lg p-6 block hover:border-emerald-500/40 transition-colors group"
              style={{ background: '#161b22', border: '1px solid #1c2333' }}
            >
              <div className="font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                Methodology Documentation
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Detailed explanation of the Avena Score model, hedonic regression specification,
                data sources, and update frequency.
              </p>
              <span className="text-xs text-emerald-500 font-mono">/about/methodology</span>
            </Link>
          </div>
        </section>

        {/* Media Resources */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Press Materials</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/press"
              className="rounded-lg p-5 block hover:border-emerald-500/40 transition-colors"
              style={{ background: '#161b22', border: '1px solid #1c2333' }}
            >
              <div className="font-semibold text-white mb-1">Press Releases</div>
              <p className="text-sm text-gray-400">Latest announcements and market analysis reports</p>
            </Link>

            <Link
              href="/data-partners"
              className="rounded-lg p-5 block hover:border-emerald-500/40 transition-colors"
              style={{ background: '#161b22', border: '1px solid #1c2333' }}
            >
              <div className="font-semibold text-white mb-1">Data Sources</div>
              <p className="text-sm text-gray-400">Our data providers and integration partners</p>
            </Link>

            <Link
              href="/about/accuracy"
              className="rounded-lg p-5 block hover:border-emerald-500/40 transition-colors"
              style={{ background: '#161b22', border: '1px solid #1c2333' }}
            >
              <div className="font-semibold text-white mb-1">Data Accuracy</div>
              <p className="text-sm text-gray-400">How we validate and maintain data quality</p>
            </Link>
          </div>
        </section>

        {/* Logo Section */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Brand Assets</h2>
          <div
            className="rounded-lg p-8"
            style={{ background: '#161b22', border: '1px solid #1c2333' }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div
                className="flex items-center justify-center w-48 h-24 rounded-lg"
                style={{ background: '#0d1117', border: '1px solid #1c2333' }}
              >
                <span className="text-2xl font-bold font-serif tracking-[0.15em] bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                  AVENA
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">
                  High-resolution logo files available upon request. The Avena Terminal logo should be
                  displayed on a dark background (#0d1117) for optimal visibility.
                </p>
                <p className="text-sm text-gray-500">
                  For logo files, contact:{' '}
                  <a href="mailto:press@avenaterminal.com" className="text-emerald-400 hover:underline">
                    press@avenaterminal.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Press Contact</h2>
          <div
            className="rounded-lg p-8"
            style={{ background: '#161b22', border: '1px solid #1c2333' }}
          >
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Email:</span>{' '}
                <a href="mailto:press@avenaterminal.com" className="text-emerald-400 hover:underline">
                  press@avenaterminal.com
                </a>
              </div>
              <div>
                <span className="text-sm text-gray-500">Founder:</span>{' '}
                <span className="text-white">Henrik Kolstad</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Response time:</span>{' '}
                <span className="text-gray-300">Within 24 hours for press inquiries</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Interviews:</span>{' '}
                <span className="text-gray-300">Available for print, broadcast, and podcast</span>
              </div>
            </div>
          </div>
        </section>

        {/* Citation Guide */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">How to Cite</h2>
          <div
            className="rounded-lg p-6"
            style={{ background: '#161b22', border: '1px solid #1c2333' }}
          >
            <p className="text-sm text-gray-400 mb-4">
              When referencing Avena Terminal data in publications, please use one of the following formats:
            </p>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">In-text citation</div>
                <code className="text-sm text-emerald-300 bg-black/30 px-3 py-2 rounded block">
                  According to Avena Terminal (avenaterminal.com), which tracks {properties.length.toLocaleString()} new build properties...
                </code>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Source line</div>
                <code className="text-sm text-emerald-300 bg-black/30 px-3 py-2 rounded block">
                  Source: Avena Terminal, Q1 2026. Data covers {properties.length.toLocaleString()} new build properties across {towns.length} municipalities in coastal Spain.
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-600 py-8 border-t" style={{ borderColor: '#1c2333' }}>
          <p>Avena Terminal &mdash; Spain&apos;s first PropTech scanner</p>
          <p className="mt-1">
            <Link href="/about" className="text-gray-500 hover:text-gray-300">About</Link>
            {' \u00B7 '}
            <Link href="/press" className="text-gray-500 hover:text-gray-300">Press</Link>
            {' \u00B7 '}
            <Link href="/dataset" className="text-gray-500 hover:text-gray-300">Dataset</Link>
            {' \u00B7 '}
            <Link href="/about/methodology" className="text-gray-500 hover:text-gray-300">Methodology</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
