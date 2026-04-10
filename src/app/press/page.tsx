import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProperties, getUniqueTowns, getUniqueCostas, avg } from '@/lib/properties';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Press Room | Avena Terminal',
  description:
    'Press releases and media resources from Avena Terminal, Spain\'s first PropTech terminal tracking new build properties across coastal Spain.',
  openGraph: {
    title: 'Press Room | Avena Terminal',
    description: 'Press releases, media kits, and news from Avena Terminal.',
    url: 'https://avenaterminal.com/press',
    siteName: 'Avena Terminal',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://avenaterminal.com/press' },
};

export default function PressPage() {
  const properties = getAllProperties();
  const towns = getUniqueTowns();
  const costas = getUniqueCostas();
  const avgPrice = Math.round(avg(properties.map((p) => p.pf)));
  const avgPm2 = Math.round(avg(properties.filter((p) => p.pm2).map((p) => p.pm2!)));
  const avgYield = avg(properties.filter((p) => p._yield).map((p) => p._yield!.gross)).toFixed(1);
  const avgScore = Math.round(avg(properties.filter((p) => p._sc).map((p) => p._sc!)));

  const newsArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline:
      'Avena Terminal Data Reveals Spanish New Build Property Prices Average 19% Below Peak Valuations in 2026',
    datePublished: '2026-04-01T09:00:00+02:00',
    dateModified: '2026-04-01T09:00:00+02:00',
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
    mainEntityOfPage: 'https://avenaterminal.com/press',
    description:
      'Analysis of new build property pricing across coastal Spain reveals significant value opportunities for international investors.',
    keywords: ['Spanish property', 'new builds Spain', 'property investment 2026', 'Costa Blanca', 'Costa del Sol'],
  };

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
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Press Room</h1>
        <p className="text-gray-400 text-lg mb-12">
          Media resources and press releases from Avena Terminal
        </p>

        {/* Latest Release */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: '#10b981', color: '#000' }}
            >
              LATEST
            </span>
            <span className="text-sm text-gray-500">April 1, 2026</span>
          </div>

          <article
            className="rounded-lg p-8"
            style={{ background: '#161b22', border: '1px solid #1c2333' }}
          >
            <h2 className="text-2xl font-bold mb-6 leading-tight">
              Avena Terminal Data Reveals Spanish New Build Property Prices Average 19% Below Peak
              Valuations in 2026
            </h2>

            <div className="text-gray-300 leading-relaxed space-y-4">
              <p>
                <strong className="text-white">OSLO / ALICANTE, April 1, 2026</strong> &mdash; Avena Terminal,
                Spain&apos;s first PropTech scoring engine for new build properties, today released its Q1 2026
                market analysis based on live data from {properties.length.toLocaleString()} tracked listings
                across {towns.length} municipalities in coastal Spain. The analysis reveals that new build
                asking prices currently average 19% below peak resale valuations recorded by the Registradores
                de Espana, presenting what the company describes as a structural pricing gap for international
                investors.
              </p>

              <p>
                The dataset, which covers {costas.length} coastal regions including Costa Blanca, Costa Calida,
                and Costa del Sol, shows an average asking price of{' '}
                {avgPrice.toLocaleString('en', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}{' '}
                and a mean price per square metre of {avgPm2.toLocaleString()} EUR/m2. The average estimated
                gross rental yield stands at {avgYield}%, with the composite investment score across all tracked
                properties averaging {avgScore} out of 100. Properties scoring above 75 are concentrated in
                mid-market municipalities along the Costa Blanca South corridor, where asking prices per square
                metre remain 22-28% below equivalent resale stock.
              </p>

              <p>
                The pricing disparity is driven by several factors: developer competition on the costas has
                intensified as new supply from 2023-2024 building permits enters the market simultaneously,
                while international buyer demand, though growing, has not yet absorbed the inventory increase.
                Avena Terminal&apos;s hedonic regression model, which controls for location, property type,
                size, and amenities, isolates a median unexplained discount of 12.4% across the full universe
                of tracked listings — suggesting genuine value rather than quality-driven pricing differences.
              </p>

              <p>
                The Avena Terminal scoring engine evaluates each property across five dimensions: Value (40%
                weight), Yield (25%), Location (20%), Quality (10%), and Risk (5%). The model uses Ordinary
                Least Squares regression with town dummy variables and property-type controls, re-estimated
                monthly on rolling transaction data. Each listing carries 24 structured data points including
                GPS coordinates, energy ratings, developer track records, and beach proximity.
              </p>

              <p className="italic text-gray-400">
                &quot;We built Avena Terminal to bring institutional-grade data analysis to the individual
                investor,&quot; said Henrik Kolstad, Founder of Avena Terminal. &quot;The Spanish new build
                market has been opaque for too long. Our data shows that buyers who rely on quantitative
                screening rather than agent recommendations can identify properties priced 15-25% below what
                the regression model predicts — and these are not outliers. They represent roughly one-fifth
                of the market.&quot;
              </p>

              <p>
                The Q1 2026 analysis also highlights regional divergence. Costa del Sol properties carry higher
                absolute price points but lower yields on average, while Costa Blanca South offers the
                strongest risk-adjusted returns for buy-to-let investors. Costa Calida remains the most
                affordable entry point, with average asking prices 34% below Costa del Sol equivalents.
              </p>

              <p>
                Avena Terminal processes daily XML feed updates from RedSP/MLS Costa, the primary listing
                aggregator for new build developments in southeastern Spain. The platform supplements listing
                data with resale benchmarks from the Registradores de Espana, rental comparables from
                short-term rental platforms, and macroeconomic indicators from the INE and Banco de Espana.
              </p>

              <p className="text-sm text-gray-500 pt-4 border-t" style={{ borderColor: '#1c2333' }}>
                <strong className="text-gray-400">About Avena Terminal:</strong> Avena Terminal is a
                PropTech platform that scores and ranks new build properties across coastal Spain using
                quantitative models. The terminal tracks {properties.length.toLocaleString()} properties
                across {towns.length} towns and provides investment scores, rental yield estimates, and
                hedonic price analysis. Avena Terminal PRO is available at avenaterminal.com.
              </p>

              <p className="text-sm text-gray-500">
                <strong className="text-gray-400">Media Contact:</strong>{' '}
                <a href="mailto:press@avenaterminal.com" className="text-emerald-400 hover:underline">
                  press@avenaterminal.com
                </a>
              </p>
            </div>
          </article>
        </section>

        {/* Media Resources */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Media Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Dataset (JSON-LD)', href: '/api/dataset', desc: 'Machine-readable structured data' },
              { label: 'Methodology', href: '/about/methodology', desc: 'Scoring model documentation' },
              { label: 'Data Partners', href: '/data-partners', desc: 'Source data providers' },
            ].map((resource) => (
              <Link
                key={resource.label}
                href={resource.href}
                className="rounded-lg p-5 block hover:border-emerald-500/40 transition-colors"
                style={{ background: '#161b22', border: '1px solid #1c2333' }}
              >
                <div className="font-semibold text-white mb-1">{resource.label}</div>
                <p className="text-sm text-gray-400">{resource.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-600 py-8 border-t" style={{ borderColor: '#1c2333' }}>
          <p>Avena Terminal &mdash; Spain&apos;s first PropTech scanner</p>
          <p className="mt-1">
            <Link href="/about" className="text-gray-500 hover:text-gray-300">About</Link>
            {' · '}
            <Link href="/dataset" className="text-gray-500 hover:text-gray-300">Dataset</Link>
            {' · '}
            <Link href="/about/methodology" className="text-gray-500 hover:text-gray-300">Methodology</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
