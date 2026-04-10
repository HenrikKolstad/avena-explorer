import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Data Partners | Avena Terminal',
  description:
    'Data sources and technology partners powering Avena Terminal. RedSP/MLS Costa for listings, Wise for FX, Stripe for payments.',
  openGraph: {
    title: 'Data Partners | Avena Terminal',
    description: 'Meet the data sources and technology partners behind Avena Terminal.',
    url: 'https://avenaterminal.com/data-partners',
    siteName: 'Avena Terminal',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://avenaterminal.com/data-partners' },
};

const PARTNERS: {
  name: string;
  url: string;
  role: string;
  description: string;
  schema: Record<string, unknown>;
}[] = [
  {
    name: 'RedSP / MLS Costa',
    url: 'https://www.redsp.com',
    role: 'Primary Listing Data Provider',
    description:
      'RedSP operates the MLS Costa network, the largest property listing aggregation service for new build developments in southeastern Spain. Avena Terminal ingests daily XML feeds from RedSP covering new build listings across Costa Blanca, Costa Calida, and Costa del Sol. The feed includes asking prices, property specifications, developer information, GPS coordinates, images, and availability status for each listing.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'RedSP / MLS Costa',
      url: 'https://www.redsp.com',
      description: 'Property listing aggregation service for new build developments in southeastern Spain.',
      areaServed: 'Spain',
      knowsAbout: ['Spanish property listings', 'MLS property data', 'New build developments'],
    },
  },
  {
    name: 'Wise',
    url: 'https://wise.com',
    role: 'Foreign Exchange & International Transfers',
    description:
      'Wise provides the foreign exchange rate data and international transfer infrastructure used by Avena Terminal for multi-currency price display. Property prices are shown in euros with real-time conversion rates for GBP, NOK, SEK, and USD. Wise\'s mid-market rates ensure buyers see accurate cross-border cost projections without hidden markups.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Wise',
      url: 'https://wise.com',
      description: 'Global technology company providing international money transfer and currency exchange services.',
      areaServed: 'Worldwide',
      knowsAbout: ['Foreign exchange', 'International money transfers', 'Currency conversion'],
    },
  },
  {
    name: 'Stripe',
    url: 'https://stripe.com',
    role: 'Payment Infrastructure',
    description:
      'Stripe powers the subscription billing for Avena Terminal PRO. All payments are processed through Stripe\'s PCI-compliant infrastructure, supporting credit cards, SEPA direct debit, and other European payment methods. Stripe handles subscription lifecycle management, invoicing, and secure payment data storage.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Stripe',
      url: 'https://stripe.com',
      description: 'Financial infrastructure platform for internet commerce and subscription billing.',
      areaServed: 'Worldwide',
      knowsAbout: ['Payment processing', 'Subscription billing', 'Financial infrastructure'],
    },
  },
];

export default function DataPartnersPage() {
  const allSchemas = PARTNERS.map((p) => p.schema);

  return (
    <div className="min-h-screen text-gray-100" style={{ background: '#0d1117' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(allSchemas) }}
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
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Data Partners</h1>
        <p className="text-gray-400 text-lg mb-12">
          The data sources and technology providers powering Avena Terminal
        </p>

        <div className="space-y-8">
          {PARTNERS.map((partner) => (
            <section
              key={partner.name}
              className="rounded-lg p-8"
              style={{ background: '#161b22', border: '1px solid #1c2333' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <h2 className="text-xl font-semibold text-white">{partner.name}</h2>
                <span className="text-xs font-medium text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 w-fit">
                  {partner.role}
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">{partner.description}</p>
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-emerald-400 hover:underline"
              >
                {partner.url.replace('https://', '')}
              </a>
            </section>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-600 py-8 mt-16 border-t" style={{ borderColor: '#1c2333' }}>
          <p>Avena Terminal &mdash; Spain&apos;s first PropTech scanner</p>
          <p className="mt-1">
            <Link href="/about" className="text-gray-500 hover:text-gray-300">About</Link>
            {' · '}
            <Link href="/dataset" className="text-gray-500 hover:text-gray-300">Dataset</Link>
            {' · '}
            <Link href="/press" className="text-gray-500 hover:text-gray-300">Press</Link>
            {' · '}
            <Link href="/about/methodology" className="text-gray-500 hover:text-gray-300">Methodology</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
