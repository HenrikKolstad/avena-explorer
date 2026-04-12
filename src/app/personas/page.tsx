import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProperties, avg, slugify } from '@/lib/properties';
import { Property } from '@/lib/types';
import { discount, formatPrice } from '@/lib/scoring';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Buyer Personas — Deal Matching for European Investors | Avena Terminal',
  description: 'Five hardcoded European buyer personas matched against live Spanish new-build property data. UK retirees, Dutch investors, Norwegian lifestyle buyers, German long-term investors, and Belgian value hunters.',
  openGraph: {
    title: 'Buyer Personas — Deal Matching for European Investors | Avena Terminal',
    description: 'Five European buyer personas matched against live Spanish new-build property data.',
    url: 'https://avenaterminal.com/personas',
    siteName: 'Avena Terminal',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

/* ── Persona definitions ─────────────────────────────────── */

interface PersonaDef {
  id: string;
  flag: string;
  flagCode: string;
  name: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  minScore: number;
  minYield?: number;
  maxBeachKm?: number;
  types?: string[];
  regions?: string[];
  statuses?: string[];
  wantsBiggestDiscount?: boolean;
}

const PERSONAS: PersonaDef[] = [
  {
    id: 'UK_RETIREE',
    flag: 'GB',
    flagCode: 'gb',
    name: 'UK Lifestyle Buyer',
    description: 'Aged 55-65, retiring to the Spanish sun. Prioritises beach proximity, walkable towns, and manageable budgets. Prefers apartments, bungalows, or townhouses on the Costa Blanca.',
    budgetMin: 150_000,
    budgetMax: 350_000,
    minScore: 60,
    maxBeachKm: 5,
    types: ['Apartment', 'Bungalow', 'Townhouse'],
    regions: ['cb-south', 'cb-north'],
  },
  {
    id: 'NL_INVESTOR',
    flag: 'NL',
    flagCode: 'nl',
    name: 'Dutch Cash Investor',
    description: 'Aged 40-55, pure investment play. Cash buyer seeking strong rental yield and solid score. Targets Costa Blanca South and Costa Calida for value.',
    budgetMin: 200_000,
    budgetMax: 500_000,
    minScore: 65,
    minYield: 5,
    regions: ['cb-south', 'costa-calida'],
  },
  {
    id: 'NO_LIFESTYLE',
    flag: 'NO',
    flagCode: 'no',
    name: 'Norwegian Lifestyle Buyer',
    description: 'Aged 45-60, seeking a quality second home on the northern Costa Blanca. Wants villas or townhouses with space, views, and a premium feel.',
    budgetMin: 250_000,
    budgetMax: 600_000,
    minScore: 65,
    regions: ['cb-north'],
    types: ['Villa', 'Townhouse'],
  },
  {
    id: 'DE_LONGTERM',
    flag: 'DE',
    flagCode: 'de',
    name: 'German Long-Term Investor',
    description: 'Aged 35-55, buying off-plan or under-construction for capital growth. Targets early-stage developments with strong fundamentals and high scores.',
    budgetMin: 300_000,
    budgetMax: 800_000,
    minScore: 68,
    statuses: ['off-plan', 'under-construction'],
  },
  {
    id: 'BE_VALUE',
    flag: 'BE',
    flagCode: 'be',
    name: 'Belgian Value Hunter',
    description: 'Aged 30-50, looking for the biggest discount to market. Wants undervalued properties with high scores — the best bang for the buck.',
    budgetMin: 150_000,
    budgetMax: 350_000,
    minScore: 70,
    wantsBiggestDiscount: true,
  },
];

/* ── Matching logic ──────────────────────────────────────── */

interface MatchedProperty {
  property: Property;
  reason: string;
}

function matchPersona(persona: PersonaDef, all: Property[]): MatchedProperty[] {
  const filtered = all.filter((p) => {
    if (p.pf < persona.budgetMin || p.pf > persona.budgetMax) return false;
    if ((p._sc ?? 0) < persona.minScore) return false;
    if (persona.minYield && (!p._yield || p._yield.gross < persona.minYield)) return false;
    if (persona.maxBeachKm != null && (p.bk == null || p.bk > persona.maxBeachKm)) return false;
    if (persona.types && !persona.types.some((t) => p.t.toLowerCase().includes(t.toLowerCase()))) return false;
    if (persona.regions && !persona.regions.includes(p.r)) return false;
    if (persona.statuses && !persona.statuses.some((s) => p.s.toLowerCase().includes(s.toLowerCase()))) return false;
    return true;
  });

  if (persona.wantsBiggestDiscount) {
    filtered.sort((a, b) => discount(b) - discount(a));
  } else {
    filtered.sort((a, b) => (b._sc ?? 0) - (a._sc ?? 0));
  }

  return filtered.slice(0, 3).map((property) => {
    const reasons: string[] = [];
    if (persona.maxBeachKm != null && property.bk != null) reasons.push(`Beach ${property.bk.toFixed(1)} km`);
    if (property._yield) reasons.push(`Yield ${property._yield.gross.toFixed(1)}%`);
    if (discount(property) > 0) reasons.push(`${discount(property).toFixed(0)}% below market`);
    if (persona.statuses) reasons.push(property.s);
    if (persona.types) reasons.push(property.t);
    return { property, reason: reasons.join(' · ') || 'Score match' };
  });
}

/* ── Helpers ──────────────────────────────────────────────── */

function criteriaTagsFor(p: PersonaDef): string[] {
  const tags: string[] = [];
  tags.push(`${formatPrice(p.budgetMin)} – ${formatPrice(p.budgetMax)}`);
  tags.push(`Min score ${p.minScore}`);
  if (p.minYield) tags.push(`Min yield ${p.minYield}%`);
  if (p.maxBeachKm != null) tags.push(`Beach < ${p.maxBeachKm} km`);
  if (p.types) tags.push(...p.types);
  if (p.regions) tags.push(...p.regions);
  if (p.statuses) tags.push(...p.statuses);
  if (p.wantsBiggestDiscount) tags.push('Biggest discount');
  return tags;
}

/* ── Page ─────────────────────────────────────────────────── */

export default function PersonasPage() {
  const all = getAllProperties();

  const personaResults = PERSONAS.map((persona) => ({
    ...persona,
    matches: matchPersona(persona, all),
    tags: criteriaTagsFor(persona),
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Avena Terminal Buyer Persona Engine',
    description: `Five European buyer personas matched against ${all.length.toLocaleString()} live Spanish new-build properties. Updated daily.`,
    url: 'https://avenaterminal.com/personas',
    creator: { '@type': 'Organization', name: 'Avena Terminal', url: 'https://avenaterminal.com' },
    dateModified: new Date().toISOString().split('T')[0],
    keywords: ['buyer persona', 'Spanish property', 'new build investment', 'Costa Blanca', 'deal matching'],
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
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-1">/</span>
          <span className="text-white">Buyer Personas</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Buyer Persona Engine</h1>
        <p className="text-gray-400 text-sm mb-10">
          Five European investor profiles matched against {all.length.toLocaleString()} live properties.
          Each persona filters by budget, score, yield, location, and property type to surface the top 3 deals.
        </p>

        {/* Persona sections */}
        {personaResults.map((persona) => (
          <section key={persona.id} className="mb-12">
            {/* Persona header */}
            <div className="flex items-center gap-3 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://flagcdn.com/w40/${persona.flagCode}.png`}
                alt={persona.flag}
                width={40}
                height={30}
                className="rounded"
                style={{ objectFit: 'cover' }}
              />
              <div>
                <h2 className="text-lg font-bold text-white">{persona.name}</h2>
                <p className="text-gray-400 text-sm">{persona.description}</p>
              </div>
            </div>

            {/* Criteria tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {persona.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ background: '#1c2333', color: '#6ee7b7', border: '1px solid #30363d' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Matched properties */}
            {persona.matches.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No properties match this persona right now.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {persona.matches.map(({ property: p, reason }, i) => {
                  const disc = discount(p);
                  return (
                    <div
                      key={p.ref ?? `${persona.id}-${i}`}
                      className="border rounded-xl p-4 hover:border-emerald-500/30 transition-all"
                      style={{ background: '#161b22', borderColor: '#30363d' }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-semibold text-sm leading-tight">{p.p}</h3>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: (p._sc ?? 0) >= 70 ? '#064e3b' : '#1c2333',
                            color: (p._sc ?? 0) >= 70 ? '#6ee7b7' : '#9ca3af',
                          }}
                        >
                          {p._sc ?? '—'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mb-3">{p.l}</p>

                      <div className="grid grid-cols-2 gap-y-1.5 text-xs mb-3">
                        <div>
                          <span className="text-gray-500">Price </span>
                          <span className="text-white font-medium">{formatPrice(p.pf)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Discount </span>
                          <span className={disc > 0 ? 'text-emerald-400 font-medium' : 'text-gray-500'}>
                            {disc > 0 ? `${disc.toFixed(0)}%` : '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Yield </span>
                          <span className="text-emerald-400 font-medium">
                            {p._yield ? `${p._yield.gross.toFixed(1)}%` : '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Score </span>
                          <span className="text-white font-medium">{p._sc ?? '—'}</span>
                        </div>
                      </div>

                      <p
                        className="text-[10px] px-2 py-1 rounded"
                        style={{ background: '#0d1117', color: '#6ee7b7' }}
                      >
                        {reason}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        ))}

        <p className="text-[9px] text-gray-600 text-right mt-4">
          Data last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </main>

      <footer
        className="border-t py-6 text-center text-gray-600 text-xs"
        style={{ borderColor: '#1c2333' }}
      >
        &copy; 2026 Avena Terminal &middot;{' '}
        <a href="https://avenaterminal.com" className="text-gray-500 hover:text-gray-300">
          avenaterminal.com
        </a>
      </footer>
    </div>
  );
}
