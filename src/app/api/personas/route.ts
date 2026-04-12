import { NextResponse } from 'next/server';
import { getAllProperties } from '@/lib/properties';
import { Property } from '@/lib/types';
import { discount } from '@/lib/scoring';

export const revalidate = 86400;

/* ── Persona definitions ─────────────────────────────────── */

interface PersonaDef {
  id: string;
  flag: string;
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
    name: 'UK Lifestyle Buyer',
    description: 'Aged 55-65, retiring to the Spanish sun. Beach proximity, walkable towns, manageable budgets.',
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
    name: 'Dutch Cash Investor',
    description: 'Aged 40-55, pure investment play. Strong rental yield and solid score.',
    budgetMin: 200_000,
    budgetMax: 500_000,
    minScore: 65,
    minYield: 5,
    regions: ['cb-south', 'costa-calida'],
  },
  {
    id: 'NO_LIFESTYLE',
    flag: 'NO',
    name: 'Norwegian Lifestyle Buyer',
    description: 'Aged 45-60, quality second home on the northern Costa Blanca. Villas or townhouses.',
    budgetMin: 250_000,
    budgetMax: 600_000,
    minScore: 65,
    regions: ['cb-north'],
    types: ['Villa', 'Townhouse'],
  },
  {
    id: 'DE_LONGTERM',
    flag: 'DE',
    name: 'German Long-Term Investor',
    description: 'Aged 35-55, buying off-plan or under-construction for capital growth.',
    budgetMin: 300_000,
    budgetMax: 800_000,
    minScore: 68,
    statuses: ['off-plan', 'under-construction'],
  },
  {
    id: 'BE_VALUE',
    flag: 'BE',
    name: 'Belgian Value Hunter',
    description: 'Aged 30-50, biggest discount to market. Undervalued properties with high scores.',
    budgetMin: 150_000,
    budgetMax: 350_000,
    minScore: 70,
    wantsBiggestDiscount: true,
  },
];

/* ── Matching logic ──────────────────────────────────────── */

function matchPersona(persona: PersonaDef, all: Property[]) {
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

  return filtered.slice(0, 3).map((p) => {
    const disc = discount(p);
    return {
      ref: p.ref ?? null,
      p: p.p,
      l: p.l,
      r: p.r,
      costa: p.costa ?? null,
      t: p.t,
      d: p.d,
      s: p.s,
      pf: p.pf,
      pm2: p.pm2 ?? null,
      mm2: p.mm2,
      bd: p.bd,
      bm: p.bm,
      bk: p.bk,
      pool: p.pool ?? null,
      energy: p.energy ?? null,
      cats: p.cats ?? [],
      views: p.views ?? [],
      _sc: p._sc ?? null,
      _yield: p._yield ? { gross: p._yield.gross } : null,
      _scores: p._scores ?? null,
      discount_pct: Math.round(disc * 10) / 10,
    };
  });
}

/* ── GET handler ──────────────────────────────────────────── */

export async function GET() {
  const all = getAllProperties();

  const result = PERSONAS.map((persona) => ({
    id: persona.id,
    flag: persona.flag,
    name: persona.name,
    description: persona.description,
    criteria: {
      budgetMin: persona.budgetMin,
      budgetMax: persona.budgetMax,
      minScore: persona.minScore,
      minYield: persona.minYield ?? null,
      maxBeachKm: persona.maxBeachKm ?? null,
      types: persona.types ?? null,
      regions: persona.regions ?? null,
      statuses: persona.statuses ?? null,
      wantsBiggestDiscount: persona.wantsBiggestDiscount ?? false,
    },
    matches: matchPersona(persona, all),
  }));

  return NextResponse.json(
    { personas: result, total_properties: all.length, generated: new Date().toISOString() },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    },
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
