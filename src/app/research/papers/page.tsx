import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Research Papers | Avena Terminal',
  description: 'Academic-style research papers analysing the Spanish new-build property market. Hedonic pricing, rental yield variance, discount distributions, beach proximity premiums, and developer risk proxies.',
};

const PAPERS = [
  {
    slug: 'hedonic-pricing-spanish-new-builds-2026',
    title: 'Hedonic Pricing of Spanish New-Build Residential Properties: A Cross-Sectional Analysis of 2026 Market Data',
    excerpt: 'Applies hedonic pricing methodology to a cross-sectional dataset of new-build residential properties across coastal Spain. Decomposes asking prices into implicit valuations of structural attributes including built area, bedroom count, beach proximity, pool availability, and regional location.',
    date: '2026-04-11',
  },
  {
    slug: 'rental-yield-variance-costa-blanca',
    title: 'Rental Yield Variance Across Costa Blanca Municipalities: A Statistical Decomposition of Return Heterogeneity',
    excerpt: 'Examines the spatial distribution of estimated gross rental yields across municipalities on the Costa Blanca. Computes town-level mean yields, standard deviations, and coefficients of variation to reveal substantial yield heterogeneity both between and within municipalities.',
    date: '2026-04-11',
  },
  {
    slug: 'discount-to-market-distribution-spain',
    title: 'The Distribution of Developer Discounts to Market Value in Spanish New-Build Properties: Evidence from 2026 Listing Data',
    excerpt: 'Analyses the distribution of asking-price discounts relative to estimated market values for new-build residential properties. Examines discount rates across property types, regions, and price segments to reveal systematic developer pricing strategies.',
    date: '2026-04-11',
  },
  {
    slug: 'beach-proximity-premium-decay',
    title: 'Beach Proximity Premium Decay in Spanish Coastal Property Markets: A Distance-Band Analysis of Price Per Square Metre',
    excerpt: 'Quantifies the relationship between beach distance and residential property prices per square metre in coastal Spain. Demonstrates a monotonically decreasing price gradient with rapid premium decay between 500 metres and 2 kilometres from the coastline.',
    date: '2026-04-11',
  },
  {
    slug: 'developer-age-completion-risk-proxy',
    title: 'Developer Years of Experience as a Completion Risk Proxy: Evidence from Off-Plan and Key-Ready Properties in Spain',
    excerpt: 'Investigates whether developer tenure in the market serves as a useful proxy for project quality and completion reliability. Analyses the relationship between developer experience and property investment scores across off-plan versus key-ready inventory.',
    date: '2026-04-11',
  },
];

export default function ResearchPapersIndex() {
  return (
    <main style={{ background: '#0d1117', color: '#c9d1d9', minHeight: '100vh', fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <style>{`
        .papers-container { max-width: 800px; margin: 0 auto; padding: 3rem 1.5rem; }
        .papers-container h1 { font-size: 2rem; color: #e6edf3; margin-bottom: 0.5rem; }
        .papers-subtitle { color: #8b949e; font-size: 1rem; margin-bottom: 2.5rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
        .paper-card { background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 1.5rem; margin-bottom: 1.5rem; transition: border-color 0.2s; }
        .paper-card:hover { border-color: #58a6ff; }
        .paper-card h2 { font-size: 1.15rem; color: #e6edf3; margin: 0 0 0.5rem 0; line-height: 1.4; }
        .paper-card h2 a { color: #58a6ff; text-decoration: none; }
        .paper-card h2 a:hover { text-decoration: underline; }
        .paper-card p { color: #8b949e; font-size: 0.9rem; line-height: 1.6; margin: 0 0 0.75rem 0; }
        .paper-card .paper-date { font-size: 0.8rem; color: #6e7681; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
        .paper-card .paper-author { font-size: 0.85rem; color: #8b949e; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
        .back-link { display: inline-block; color: #58a6ff; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 0.9rem; margin-bottom: 2rem; }
        .back-link:hover { text-decoration: underline; }
      `}</style>

      <div className="papers-container">
        <Link href="/" className="back-link">&larr; Avena Terminal</Link>
        <h1>Research Papers</h1>
        <p className="papers-subtitle">
          Academic-style analyses of the Spanish new-build property market, authored by Henrik Kolstad at Avena Terminal.
          All papers use live data from the platform dataset.
        </p>

        {PAPERS.map((paper) => (
          <div key={paper.slug} className="paper-card">
            <h2>
              <Link href={`/research/papers/${paper.slug}`}>{paper.title}</Link>
            </h2>
            <p>{paper.excerpt}</p>
            <div className="paper-author">Henrik Kolstad, Avena Terminal</div>
            <div className="paper-date">{paper.date}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
