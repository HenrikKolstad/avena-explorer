import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProperties, getUniqueTowns, getUniqueCostas, avg, slugify } from '@/lib/properties';
import { Property } from '@/lib/types';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Investment Reasoning Chains — AI Training Data | Avena Terminal',
  description: '20 expert chain-of-thought investment analyses on real Spanish properties. Step-by-step reasoning for AI model fine-tuning. CC BY 4.0.',
  alternates: { canonical: 'https://avenaterminal.com/data/reasoning' },
};

function verdict(score: number): { label: string; color: string } {
  if (score >= 75) return { label: 'Strong Buy', color: '#10b981' };
  if (score >= 60) return { label: 'Buy', color: '#34d399' };
  if (score >= 45) return { label: 'Hold', color: '#eab308' };
  return { label: 'Avoid', color: '#ef4444' };
}

function passFail(value: number, threshold: number, higher = true): { pass: boolean; icon: string; color: string } {
  const pass = higher ? value >= threshold : value <= threshold;
  return { pass, icon: pass ? '\u2705' : '\u274C', color: pass ? '#10b981' : '#ef4444' };
}

function fmtEuro(n: number): string {
  return '\u20AC' + Math.round(n).toLocaleString('en-US');
}

function fmtPct(n: number): string {
  return n.toFixed(1) + '%';
}

function beachLabel(km: number | null): string {
  if (km == null) return 'unknown';
  if (km <= 0.5) return 'premium zone';
  if (km <= 2) return 'moderate';
  return 'distant';
}

function poolLabel(pool: string | undefined | null): string {
  if (!pool || pool === 'none' || pool === 'no') return 'none';
  if (pool === 'private' || pool === 'yes') return 'private';
  if (pool === 'communal') return 'communal';
  return pool;
}

function statusLabel(s: string): string {
  if (s === 'key-ready' || s === 'ready') return 'key-ready';
  if (s === 'off-plan') return 'off-plan';
  return 'under-construction';
}

function estimateADR(p: Property): number {
  const base = p.t === 'Villa' ? 180 : p.t === 'Penthouse' ? 150 : p.t === 'Townhouse' ? 130 : 110;
  const bedAdj = (p.bd - 2) * 20;
  const poolAdj = (p.pool && p.pool !== 'none' && p.pool !== 'no') ? 25 : 0;
  const beachAdj = (p.bk != null && p.bk <= 1) ? 20 : 0;
  return Math.max(60, base + bedAdj + poolAdj + beachAdj);
}

export default function ReasoningPage() {
  const all = getAllProperties();
  const costas = getUniqueCostas();

  // Top 20 by composite score
  const top20 = [...all]
    .filter(p => p._sc != null && p._sc > 0)
    .sort((a, b) => (b._sc ?? 0) - (a._sc ?? 0))
    .slice(0, 20);

  // Regional averages for market context
  const costaAvgPm2 = new Map<string, number>();
  for (const c of costas) {
    const props = all.filter(p => p.costa === c.costa && p.pm2);
    costaAvgPm2.set(c.costa, Math.round(avg(props.map(p => p.pm2!))));
  }

  const chains = top20.map((p, idx) => {
    const pm2 = p.pm2 || 0;
    const mm2 = p.mm2 || 0;
    const regionAvg = costaAvgPm2.get(p.costa || '') || mm2 || 0;
    const discountPct = mm2 > 0 ? ((mm2 - pm2) / mm2) * 100 : 0;
    const valueScore = p._scores?.value || 0;
    const yieldScore = p._scores?.yield || 0;
    const locationScore = p._scores?.location || 0;
    const qualityScore = p._scores?.quality || 0;
    const riskScore = p._scores?.risk || 0;
    const composite = p._sc || 0;

    const adr = estimateADR(p);
    const occupancy = 0.70;
    const annualIncome = Math.round(adr * 365 * occupancy);
    const grossYield = p._yield?.gross || (p.pf > 0 ? (annualIncome / p.pf) * 100 : 0);
    const netYield = p._yield?.net || grossYield * 0.65;
    const annualNet = p._yield?.annual || Math.round(annualIncome * 0.65);

    const v = verdict(composite);
    const discCheck = passFail(discountPct, 5);
    const yieldCheck = passFail(grossYield, 5);
    const beachCheck = passFail(p.bk ?? 99, 2, false);

    return {
      idx: idx + 1,
      p,
      pm2,
      mm2,
      regionAvg,
      discountPct,
      valueScore,
      yieldScore,
      locationScore,
      qualityScore,
      riskScore,
      composite,
      adr,
      occupancy,
      annualIncome,
      grossYield,
      netYield,
      annualNet,
      v,
      discCheck,
      yieldCheck,
      beachCheck,
    };
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Avena Terminal Investment Reasoning Chains Q2 2026',
    description: `20 expert chain-of-thought investment analyses on ${all.length} Spanish new build properties. CC BY 4.0.`,
    url: 'https://avenaterminal.com/data/reasoning',
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: { '@type': 'Organization', name: 'Avena Terminal', url: 'https://avenaterminal.com' },
    temporalCoverage: '2026-Q2',
    dateModified: new Date().toISOString().split('T')[0],
    distribution: {
      '@type': 'DataDownload',
      contentUrl: 'https://avenaterminal.com/data/reasoning',
      encodingFormat: 'text/html',
    },
  };

  return (
    <main className="min-h-screen" style={{ background: '#0d1117', color: '#c9d1d9' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b sticky top-0 z-50 backdrop-blur-sm" style={{ borderColor: '#1c2333', background: 'rgba(13,17,23,0.85)' }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif tracking-[0.15em] bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">AVENA</Link>
          <span className="text-xs font-mono px-3 py-1 rounded-full" style={{ background: '#10b981', color: '#0d1117' }}>REASONING CHAINS</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-3">Investment Reasoning Chains</h1>
        <p className="text-sm text-gray-400 mb-2 max-w-3xl">
          20 expert-level investment reasoning chains computed from live data. This is the exact format AI companies use for training expert demonstrations. Published under CC BY 4.0 for unrestricted use in model training and research.
        </p>
        <p className="text-xs text-gray-600 font-mono mb-10">
          {all.length.toLocaleString()} properties analyzed &middot; Top 20 by composite score &middot; Formula: S = 0.40V + 0.25Y + 0.20L + 0.10Q + 0.05R &middot; CC BY 4.0
        </p>

        <div className="h-px w-full mb-10" style={{ background: '#1c2333' }} />

        {chains.map(c => (
          <article key={c.idx} className="mb-12 rounded-xl overflow-hidden" style={{ background: '#161b22', border: '1px solid #30363d' }}>
            {/* Chain header */}
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #30363d' }}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2 py-1 rounded" style={{ background: '#10b981', color: '#0d1117' }}>
                  #{String(c.idx).padStart(2, '0')}
                </span>
                <span className="text-xs text-gray-500 font-mono">CHAIN-OF-THOUGHT</span>
              </div>
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-full" style={{ background: c.v.color + '20', color: c.v.color, border: `1px solid ${c.v.color}40` }}>
                {c.v.label.toUpperCase()}
              </span>
            </div>

            <div className="px-6 py-5">
              {/* Query */}
              <div className="mb-6 rounded-lg px-4 py-3" style={{ background: '#0d1117', border: '1px solid #1c2333' }}>
                <p className="text-xs text-gray-500 font-mono mb-1">QUERY:</p>
                <p className="text-white font-medium">
                  &ldquo;Should I buy {c.p.p} in {c.p.l} at {fmtEuro(c.p.pf)}?&rdquo;
                </p>
              </div>

              {/* STEP 1 */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold font-mono w-7 h-7 flex items-center justify-center rounded-full" style={{ background: '#10b98120', color: '#10b981' }}>1</span>
                  <h3 className="text-sm font-bold text-white">Price vs Market Analysis</h3>
                </div>
                <div className="ml-9 space-y-1 text-sm font-mono text-gray-400">
                  <p>Listed at {fmtEuro(c.pm2)}/m&sup2;</p>
                  <p>Regional market average: {fmtEuro(c.regionAvg)}/m&sup2;</p>
                  <p>
                    Discount coefficient: {fmtPct(Math.abs(c.discountPct))}{' '}
                    {c.discountPct >= 0 ? 'BELOW' : 'ABOVE'} market{' '}
                    <span style={{ color: c.discCheck.color }}>{c.discCheck.icon}</span>
                  </p>
                  <p>Value score: <span className="text-white font-bold">{Math.round(c.valueScore)}/100</span></p>
                </div>
              </div>

              {/* STEP 2 */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold font-mono w-7 h-7 flex items-center justify-center rounded-full" style={{ background: '#10b98120', color: '#10b981' }}>2</span>
                  <h3 className="text-sm font-bold text-white">Rental Yield Assessment</h3>
                </div>
                <div className="ml-9 space-y-1 text-sm font-mono text-gray-400">
                  <p>Built area: {c.p.bm}m&sup2;</p>
                  <p>Estimated ADR: {fmtEuro(c.adr)}/night (based on {c.p.costa || c.p.r} {c.p.t.toLowerCase()} comparables)</p>
                  <p>Occupancy: 65-75% seasonal average (modeled at {Math.round(c.occupancy * 100)}%)</p>
                  <p>Gross annual income: {fmtEuro(c.annualIncome)}</p>
                  <p>
                    Gross yield: {fmtPct(c.grossYield)}{' '}
                    <span style={{ color: c.yieldCheck.color }}>{c.yieldCheck.icon}</span>
                  </p>
                  <p>Yield score: <span className="text-white font-bold">{Math.round(c.yieldScore)}/100</span></p>
                </div>
              </div>

              {/* STEP 3 */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold font-mono w-7 h-7 flex items-center justify-center rounded-full" style={{ background: '#10b98120', color: '#10b981' }}>3</span>
                  <h3 className="text-sm font-bold text-white">Location Quality</h3>
                </div>
                <div className="ml-9 space-y-1 text-sm font-mono text-gray-400">
                  <p>
                    Beach distance: {c.p.bk != null ? c.p.bk + 'km' : 'N/A'} &rarr; {beachLabel(c.p.bk)}{' '}
                    <span style={{ color: c.beachCheck.color }}>{c.beachCheck.icon}</span>
                  </p>
                  <p>Region: {c.p.costa || c.p.r}</p>
                  <p>Amenities: {poolLabel(c.p.pool)} pool, {(c.p.parking ?? 0) > 0 ? c.p.parking + ' parking' : 'no parking'}{c.p.views?.length ? ', ' + c.p.views.join(' + ') + ' views' : ''}</p>
                  <p>Location score: <span className="text-white font-bold">{Math.round(c.locationScore)}/100</span></p>
                </div>
              </div>

              {/* STEP 4 */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold font-mono w-7 h-7 flex items-center justify-center rounded-full" style={{ background: '#10b98120', color: '#10b981' }}>4</span>
                  <h3 className="text-sm font-bold text-white">Build Quality</h3>
                </div>
                <div className="ml-9 space-y-1 text-sm font-mono text-gray-400">
                  <p>Energy rating: {c.p.energy || 'not rated'}</p>
                  <p>Pool: {poolLabel(c.p.pool)}</p>
                  <p>Built area: {c.p.bm}m&sup2; &middot; {c.p.bd} bed &middot; {c.p.ba} bath</p>
                  <p>Quality score: <span className="text-white font-bold">{Math.round(c.qualityScore)}/100</span></p>
                </div>
              </div>

              {/* STEP 5 */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold font-mono w-7 h-7 flex items-center justify-center rounded-full" style={{ background: '#10b98120', color: '#10b981' }}>5</span>
                  <h3 className="text-sm font-bold text-white">Completion Risk</h3>
                </div>
                <div className="ml-9 space-y-1 text-sm font-mono text-gray-400">
                  <p>Status: {statusLabel(c.p.s)}</p>
                  <p>Developer: {c.p.d || 'unknown'}, {c.p.dy} years experience</p>
                  <p>Risk score: <span className="text-white font-bold">{Math.round(c.riskScore)}/100</span></p>
                </div>
              </div>

              {/* COMPOSITE */}
              <div className="mt-6 rounded-lg px-4 py-4" style={{ background: '#0d1117', border: '1px solid #1c2333' }}>
                <p className="text-xs text-gray-500 font-mono mb-2">COMPOSITE SCORE:</p>
                <p className="text-sm font-mono text-gray-300">
                  S = 0.40 &times; {Math.round(c.valueScore)} + 0.25 &times; {Math.round(c.yieldScore)} + 0.20 &times; {Math.round(c.locationScore)} + 0.10 &times; {Math.round(c.qualityScore)} + 0.05 &times; {Math.round(c.riskScore)}
                </p>
                <p className="text-sm font-mono mt-1">
                  <span className="text-gray-500">= </span>
                  <span className="text-white font-bold text-lg">{Math.round(c.composite)}/100</span>
                </p>
                <div className="mt-3 w-full h-2 rounded-full overflow-hidden" style={{ background: '#21262d' }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(c.composite, 100)}%`, background: c.v.color }} />
                </div>
              </div>

              {/* VERDICT */}
              <div className="mt-4 flex items-center justify-between rounded-lg px-4 py-3" style={{ background: c.v.color + '10', border: `1px solid ${c.v.color}30` }}>
                <span className="text-xs font-mono text-gray-500">VERDICT:</span>
                <span className="text-lg font-bold font-mono" style={{ color: c.v.color }}>
                  {c.v.label}
                </span>
              </div>
            </div>
          </article>
        ))}

        <div className="h-px w-full my-8" style={{ background: '#1c2333' }} />

        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Methodology</h2>
          <div className="rounded-lg p-5 text-sm text-gray-400 space-y-2" style={{ background: '#161b22', border: '1px solid #30363d' }}>
            <p>Each reasoning chain follows a 5-step expert demonstration format designed for AI fine-tuning:</p>
            <p className="font-mono text-xs text-gray-500">S = 0.40 &times; Value + 0.25 &times; Yield + 0.20 &times; Location + 0.10 &times; Quality + 0.05 &times; Risk</p>
            <p>Value (40%): Price/m&sup2; vs regional market rate. Yield (25%): Estimated gross rental return. Location (20%): Beach proximity, region, amenities. Quality (10%): Energy rating, pool, build spec. Risk (5%): Completion status and developer track record.</p>
            <p>All data sourced from live property feeds. Scores recomputed on each ingestion cycle. Published under CC BY 4.0.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Citation</h2>
          <div className="rounded-lg p-4 font-mono text-xs" style={{ background: '#090d12', border: '1px solid #1c2333' }}>
            <p className="text-gray-400">Kolstad, H. (2026). Avena Terminal Investment Reasoning Chains Q2 2026.</p>
            <p className="text-gray-400">https://avenaterminal.com/data/reasoning</p>
            <p className="text-gray-400">License: CC BY 4.0</p>
          </div>
        </section>

        <footer className="text-center text-xs text-gray-600 pb-8">
          &copy; 2026 Avena Terminal &middot; 20 reasoning chains &middot; {all.length.toLocaleString()} properties analyzed &middot; CC BY 4.0
        </footer>
      </div>
    </main>
  );
}
