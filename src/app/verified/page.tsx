import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProperties, avg } from '@/lib/properties';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Verified Developer Programme | Avena Terminal',
  description:
    'The Avena Verified Developer badge is the trust standard for Spanish new-build property. Independent assessment across delivery, finance, quality, transparency, and after-sales.',
  openGraph: {
    title: 'Avena Verified Developer Programme | Avena Terminal',
    description:
      'Independent developer verification for Spanish new-build property. Trusted by investors across Europe.',
    url: 'https://avenaterminal.com/verified',
    siteName: 'Avena Terminal',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://avenaterminal.com/verified' },
};

const DIMENSIONS = [
  {
    name: 'Delivery Track Record',
    icon: '\u2713',
    description: 'Percentage of projects delivered on time and on spec over the past 5 years.',
  },
  {
    name: 'Financial Stability',
    icon: '\u26A1',
    description: 'Bank guarantees in place, audited accounts, no insolvency events.',
  },
  {
    name: 'Quality Consistency',
    icon: '\u2605',
    description: 'Build quality across multiple projects rated by independent surveyors.',
  },
  {
    name: 'Transparency',
    icon: '\u25CE',
    description: 'Open pricing, published specifications, accessible legal documentation.',
  },
  {
    name: 'After-Sales',
    icon: '\u260E',
    description: 'Post-completion support, snagging resolution, warranty responsiveness.',
  },
];

const STEPS = [
  { step: 1, title: 'Submit Application', description: 'Complete the form below with your company details and portfolio.' },
  { step: 2, title: 'Documentation Review', description: 'We verify financial records, completion certificates, and client references.' },
  { step: 3, title: 'On-Site Assessment', description: 'Independent surveyor visits active and completed projects.' },
  { step: 4, title: 'Badge Issued', description: 'Verified badge displayed across all your Avena Terminal listings.' },
];

export default function VerifiedPage() {
  const allProps = getAllProperties();
  const viaXaviaProps = allProps.filter((p) => p.d === 'Via Xavia Estate');
  const viaXaviaAvgScore = Math.round(
    avg(viaXaviaProps.filter((p) => p._sc).map((p) => p._sc!))
  );
  const viaXaviaYears = viaXaviaProps.length > 0 ? viaXaviaProps[0].dy : 4;

  return (
    <div className="min-h-screen text-gray-100" style={{ background: '#0d1117' }}>
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Verified Developer Programme
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Avena Verified Developer
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-2 max-w-3xl mx-auto">
            The trust standard for Spanish new-build property
          </p>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Independent, data-driven verification across five assessment dimensions.
            Trusted by investors across Europe.
          </p>
        </section>

        {/* Verified Badge */}
        <section className="flex justify-center mb-16">
          <div
            className="flex flex-col items-center gap-3 px-10 py-8 rounded-2xl border"
            style={{ background: '#161b22', borderColor: '#30363d' }}
          >
            <div
              className="w-20 h-20 rounded-xl flex items-center justify-center text-3xl"
              style={{ background: 'linear-gradient(135deg, #14b8a6, #059669)' }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 2.4H18v3.6L20 12l-2 4v3.6h-3.6L12 22l-2.4-2.4H6V16L4 12l2-4V4.4h3.6L12 2z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <span className="text-emerald-400 font-bold text-lg tracking-wide">AVENA VERIFIED</span>
            <span className="text-gray-500 text-sm">Independent Developer Trust Badge</span>
          </div>
        </section>

        {/* 5 Assessment Dimensions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-2 text-center">Five Assessment Dimensions</h2>
          <p className="text-gray-500 text-center mb-8 max-w-2xl mx-auto">
            Every developer is independently assessed across five critical dimensions before receiving the Avena Verified badge.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {DIMENSIONS.map((dim) => (
              <div
                key={dim.name}
                className="rounded-xl border p-5 text-center"
                style={{ background: '#161b22', borderColor: '#30363d' }}
              >
                <div className="text-2xl mb-2">{dim.icon}</div>
                <h3 className="font-semibold text-white text-sm mb-1">{dim.name}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{dim.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Verified Developer Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-2 text-center">Verified Developers</h2>
          <p className="text-gray-500 text-center mb-8">
            Developers that have passed all five assessment dimensions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Via Xavia Estate */}
            <div
              className="rounded-xl border p-6 relative overflow-hidden"
              style={{ background: '#161b22', borderColor: '#30363d' }}
            >
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l2.4 2.4H18v3.6L20 12l-2 4v3.6h-3.6L12 22l-2.4-2.4H6V16L4 12l2-4V4.4h3.6L12 2z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                Verified
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Via Xavia Estate</h3>
              <div className="flex flex-wrap gap-3 mb-3 text-sm">
                <span className="text-gray-400">
                  <span className="text-white font-semibold">{viaXaviaYears}</span> years active
                </span>
                <span className="text-gray-400">
                  <span className="text-white font-semibold">{viaXaviaProps.length}</span> listings
                </span>
                <span className="text-gray-400">
                  Avg score{' '}
                  <span className="text-emerald-400 font-semibold">{viaXaviaAvgScore}</span>
                </span>
              </div>
              <div className="flex gap-1 mb-3">
                {DIMENSIONS.map((dim) => (
                  <div
                    key={dim.name}
                    className="flex-1 h-1.5 rounded-full"
                    style={{ background: '#059669' }}
                    title={dim.name}
                  />
                ))}
              </div>
              <p className="text-gray-500 text-xs">
                All five dimensions passed. Badge issued 2025.
              </p>
            </div>

            {/* Placeholder slots */}
            {['Coming Soon', 'Coming Soon'].map((label, i) => (
              <div
                key={i}
                className="rounded-xl border p-6 flex items-center justify-center"
                style={{ background: '#161b22', borderColor: '#30363d', minHeight: 180 }}
              >
                <span className="text-gray-600 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How to Apply */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-2 text-center">How to Apply</h2>
          <p className="text-gray-500 text-center mb-8 max-w-2xl mx-auto">
            The verification process typically takes 4-6 weeks from application to badge issuance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="rounded-xl border p-5"
                style={{ background: '#161b22', borderColor: '#30363d' }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-3"
                  style={{ background: 'linear-gradient(135deg, #14b8a6, #059669)', color: '#000' }}
                >
                  {s.step}
                </div>
                <h3 className="font-semibold text-white mb-1">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Application Form */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-2 text-center">Apply for Verification</h2>
          <p className="text-gray-500 text-center mb-8">
            Submit your details and our team will begin the assessment process.
          </p>
          <div
            className="max-w-xl mx-auto rounded-xl border p-8"
            style={{ background: '#161b22', borderColor: '#30363d' }}
          >
            <form action="/api/verified/apply" method="POST" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Developer Name</label>
                <input
                  type="text"
                  name="developer_name"
                  required
                  className="w-full px-3 py-2 rounded-lg border text-white text-sm"
                  style={{ background: '#0d1117', borderColor: '#30363d' }}
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 rounded-lg border text-white text-sm"
                  style={{ background: '#0d1117', borderColor: '#30363d' }}
                  placeholder="contact@developer.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Website</label>
                <input
                  type="url"
                  name="website"
                  className="w-full px-3 py-2 rounded-lg border text-white text-sm"
                  style={{ background: '#0d1117', borderColor: '#30363d' }}
                  placeholder="https://your-website.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Years Active</label>
                  <input
                    type="number"
                    name="years"
                    min={1}
                    className="w-full px-3 py-2 rounded-lg border text-white text-sm"
                    style={{ background: '#0d1117', borderColor: '#30363d' }}
                    placeholder="e.g. 10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Completed Projects</label>
                  <input
                    type="number"
                    name="completed_projects"
                    min={0}
                    className="w-full px-3 py-2 rounded-lg border text-white text-sm"
                    style={{ background: '#0d1117', borderColor: '#30363d' }}
                    placeholder="e.g. 25"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-black text-sm"
                style={{ background: 'linear-gradient(135deg, #34d399, #10b981)' }}
              >
                Submit Application
              </button>
            </form>
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
