import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Institutional Data Room | Avena Terminal',
  description:
    'Structured property intelligence for professional investors. Full datasets, alpha signals, macro intelligence, and verified developer scores for PE, family offices, and funds.',
  openGraph: {
    title: 'Avena Institutional Data Room | Avena Terminal',
    description:
      'Structured property intelligence for professional investors. Datasets, indices, and alpha signals.',
    url: 'https://avenaterminal.com/data-room',
    siteName: 'Avena Terminal',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://avenaterminal.com/data-room' },
};

const AUDIENCES = [
  {
    title: 'Private Equity',
    description: 'Portfolio-level property data for underwriting Spanish residential development deals.',
    icon: '\uD83C\uDFE6',
  },
  {
    title: 'Family Offices',
    description: 'Curated investment intelligence for direct property allocation in coastal Spain.',
    icon: '\uD83C\uDFE0',
  },
  {
    title: 'Investment Funds',
    description: 'Benchmarking data, yield analytics, and market indices for fund reporting.',
    icon: '\uD83D\uDCC8',
  },
  {
    title: 'Developer Finance',
    description: 'Developer track records, project completion rates, and financial stability scores.',
    icon: '\uD83D\uDD27',
  },
];

const DATASETS = [
  { name: 'Full Property Dataset', records: '1,881+', format: 'JSON / CSV', frequency: 'Daily', tier: 'Professional' },
  { name: 'Avena Index', records: '365+', format: 'JSON', frequency: 'Daily', tier: 'Research' },
  { name: 'Alpha Signals', records: 'Live', format: 'JSON', frequency: 'Real-time', tier: 'Professional' },
  { name: 'RLHF Training Pairs', records: '250+', format: 'JSONL', frequency: 'Daily', tier: 'Institutional' },
  { name: 'Macro Intelligence', records: '50+', format: 'JSON', frequency: 'Weekly', tier: 'Research' },
  { name: 'Buyer Persona Matches', records: 'On-demand', format: 'JSON', frequency: 'Per-query', tier: 'Professional' },
  { name: 'Developer Verified Scores', records: '10+', format: 'JSON', frequency: 'Quarterly', tier: 'Institutional' },
];

const TIERS = [
  {
    name: 'Research',
    price: '\u20AC299',
    period: '/mo',
    features: [
      'Avena Index (daily)',
      'Macro intelligence feed',
      'Market summary reports',
      'API access (1,000 calls/mo)',
      'Email support',
    ],
  },
  {
    name: 'Professional',
    price: '\u20AC799',
    period: '/mo',
    features: [
      'Everything in Research',
      'Full property dataset',
      'Alpha signals (real-time)',
      'Buyer persona matching',
      'API access (10,000 calls/mo)',
      'Dedicated account manager',
    ],
    highlight: true,
  },
  {
    name: 'Institutional',
    price: 'Custom',
    period: '',
    features: [
      'Everything in Professional',
      'RLHF training pairs',
      'Developer verified scores',
      'Custom data exports',
      'Unlimited API access',
      'SLA and NDA available',
      'On-site briefings',
    ],
  },
];

const SECURITY = [
  { label: 'HTTPS Encrypted', description: 'All data transmitted over TLS 1.3 encrypted connections.' },
  { label: 'GDPR Compliant', description: 'Full compliance with EU General Data Protection Regulation.' },
  { label: 'EU Data Residency', description: 'All data stored and processed within EU jurisdiction.' },
];

export default function DataRoomPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DataCatalog',
    name: 'Avena Institutional Data Room',
    description:
      'Structured property intelligence for professional investors. Datasets covering Spanish new-build property markets.',
    url: 'https://avenaterminal.com/data-room',
    creator: { '@type': 'Organization', name: 'Avena Terminal', url: 'https://avenaterminal.com' },
    dateModified: new Date().toISOString().split('T')[0],
    dataset: DATASETS.map((d) => ({
      '@type': 'Dataset',
      name: d.name,
      description: `${d.name} - ${d.records} records, updated ${d.frequency.toLowerCase()}.`,
      distribution: {
        '@type': 'DataDownload',
        encodingFormat: d.format,
      },
    })),
  };

  return (
    <div className="min-h-screen text-gray-100" style={{ background: '#0d1117' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header
        className="border-b sticky top-0 z-50 backdrop-blur-sm"
        style={{ borderColor: '#1c2333', background: 'rgba(13,17,23,0.85)' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
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

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Hero */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-emerald-500/30 text-emerald-400 text-sm">
            Institutional Access
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Avena Institutional Data Room
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-2 max-w-3xl mx-auto">
            Structured property intelligence for professional investors
          </p>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Institutional-grade datasets, indices, and signals covering the Spanish new-build residential market.
          </p>
        </section>

        {/* Audience Cards */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Built for Professionals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AUDIENCES.map((a) => (
              <div
                key={a.title}
                className="rounded-xl border p-6"
                style={{ background: '#161b22', borderColor: '#30363d' }}
              >
                <div className="text-2xl mb-3">{a.icon}</div>
                <h3 className="font-semibold text-white mb-1">{a.title}</h3>
                <p className="text-gray-500 text-sm">{a.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Datasets Table */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Available Datasets</h2>
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#30363d' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#161b22' }}>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Dataset</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Records</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Format</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Frequency</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Tier</th>
                </tr>
              </thead>
              <tbody>
                {DATASETS.map((d, i) => (
                  <tr
                    key={d.name}
                    className="border-t"
                    style={{ borderColor: '#21262d', background: i % 2 === 0 ? '#0d1117' : '#161b22' }}
                  >
                    <td className="px-4 py-3 text-white font-medium">{d.name}</td>
                    <td className="px-4 py-3 text-gray-400">{d.records}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background: '#1c2333', color: '#7ee787' }}>
                        {d.format}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{d.frequency}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold"
                        style={{
                          background:
                            d.tier === 'Institutional'
                              ? 'rgba(168,85,247,0.15)'
                              : d.tier === 'Professional'
                                ? 'rgba(59,130,246,0.15)'
                                : 'rgba(16,185,129,0.15)',
                          color:
                            d.tier === 'Institutional'
                              ? '#c084fc'
                              : d.tier === 'Professional'
                                ? '#60a5fa'
                                : '#34d399',
                        }}
                      >
                        {d.tier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-2 text-center">Pricing</h2>
          <p className="text-gray-500 text-center mb-8">Annual contracts with monthly billing. Volume discounts available.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border p-6 relative"
                style={{
                  background: '#161b22',
                  borderColor: t.highlight ? '#059669' : '#30363d',
                  boxShadow: t.highlight ? '0 0 30px rgba(5,150,105,0.1)' : undefined,
                }}
              >
                {t.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-black">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-white mb-1">{t.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">{t.price}</span>
                  <span className="text-gray-500 text-sm">{t.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-emerald-500 mt-0.5">\u2713</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-2.5 rounded-lg font-semibold text-sm"
                  style={
                    t.highlight
                      ? { background: 'linear-gradient(135deg, #34d399, #10b981)', color: '#000' }
                      : { background: 'transparent', border: '1px solid #30363d', color: '#d1d5db' }
                  }
                >
                  {t.name === 'Institutional' ? 'Contact Sales' : 'Request Access'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Request Access Form */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-2 text-center">Request Access</h2>
          <p className="text-gray-500 text-center mb-8">
            Tell us about your organisation and we will provision your account within 24 hours.
          </p>
          <div
            className="max-w-xl mx-auto rounded-xl border p-8"
            style={{ background: '#161b22', borderColor: '#30363d' }}
          >
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 rounded-lg border text-white text-sm"
                  style={{ background: '#0d1117', borderColor: '#30363d' }}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Organisation</label>
                <input
                  type="text"
                  name="organization"
                  required
                  className="w-full px-3 py-2 rounded-lg border text-white text-sm"
                  style={{ background: '#0d1117', borderColor: '#30363d' }}
                  placeholder="Company or fund name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Use Case</label>
                <textarea
                  name="use_case"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border text-white text-sm resize-none"
                  style={{ background: '#0d1117', borderColor: '#30363d' }}
                  placeholder="Describe your intended use of the data..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tier</label>
                <select
                  name="tier"
                  className="w-full px-3 py-2 rounded-lg border text-white text-sm"
                  style={{ background: '#0d1117', borderColor: '#30363d' }}
                >
                  <option value="research">Research (\u20AC299/mo)</option>
                  <option value="professional">Professional (\u20AC799/mo)</option>
                  <option value="institutional">Institutional (Custom)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 rounded-lg border text-white text-sm"
                  style={{ background: '#0d1117', borderColor: '#30363d' }}
                  placeholder="you@company.com"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-black text-sm"
                style={{ background: 'linear-gradient(135deg, #34d399, #10b981)' }}
              >
                Request Access
              </button>
            </form>
          </div>
        </section>

        {/* Security */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Security &amp; Compliance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SECURITY.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border p-5 text-center"
                style={{ background: '#161b22', borderColor: '#30363d' }}
              >
                <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-3 bg-emerald-500/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-1 text-sm">{s.label}</h3>
                <p className="text-gray-500 text-xs">{s.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-gray-600 text-sm" style={{ borderColor: '#1c2333' }}>
        <p>&copy; {new Date().getFullYear()} Avena Terminal. All rights reserved.</p>
      </footer>
    </div>
  );
}
