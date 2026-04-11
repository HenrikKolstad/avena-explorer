import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getAllProperties, getUniqueTowns, getUniqueCostas, avg, slugify } from '@/lib/properties';
import { Property } from '@/lib/types';

function formatProperty(p: Property) {
  return {
    ref: p.ref,
    name: p.p || `${p.t} in ${p.l}`,
    type: p.t,
    town: p.l,
    region: p.costa || p.r,
    price: p.pf,
    price_to: p.pt || undefined,
    price_per_m2: p.pm2,
    market_price_per_m2: p.mm2 || undefined,
    built_area_m2: p.bm,
    bedrooms: p.bd,
    bathrooms: p.ba,
    beach_km: p.bk,
    pool: p.pool || 'none',
    energy_rating: p.energy || undefined,
    status: p.s || undefined,
    completion: p.c || undefined,
    developer: p.d,
    developer_years: p.dy || undefined,
    score: p._sc || 0,
    score_breakdown: p._scores || undefined,
    yield_gross: p._yield?.gross || undefined,
    yield_net: p._yield?.net || undefined,
    annual_rental_income: p._yield?.annual || undefined,
    url: p.ref ? `https://avenaterminal.com/property/${encodeURIComponent(p.ref)}` : undefined,
  };
}

function filterProperties(props: Property[], region?: string, maxPrice?: number, minScore?: number, type?: string, minBeds?: number) {
  let filtered = props;

  if (region) {
    const regionSlug = slugify(region);
    filtered = filtered.filter(p => {
      const costaSlug = p.costa ? slugify(p.costa) : '';
      const rSlug = p.r ? slugify(p.r) : '';
      return costaSlug.includes(regionSlug) || rSlug.includes(regionSlug);
    });
  }

  if (maxPrice) filtered = filtered.filter(p => p.pf <= maxPrice);
  if (minScore) filtered = filtered.filter(p => (p._sc ?? 0) >= minScore);
  if (type) filtered = filtered.filter(p => p.t?.toLowerCase() === type.toLowerCase());
  if (minBeds) filtered = filtered.filter(p => p.bd >= minBeds);

  return filtered;
}

export function createAvenaServer() {
  const server = new McpServer({
    name: 'avena-terminal',
    version: '1.0.0',
  });

  // Tool 1: Search Properties
  server.tool(
    'search_properties',
    "Search Avena Terminal's database of 1,881 scored new build properties in Spain. Returns investment-ranked results filtered by region (costa-blanca, costa-calida, costa-del-sol), maximum price in EUR, minimum investment score (0-100), property type, and minimum bedrooms. Each result includes composite score, yield estimate, price per m2, beach distance, and developer info.",
    {
      region: z.string().optional().describe('Region filter: costa-blanca, costa-calida, costa-del-sol, or a town name'),
      max_price: z.number().optional().describe('Maximum price in EUR'),
      min_score: z.number().optional().describe('Minimum investment score (0-100)'),
      type: z.string().optional().describe('Property type: Villa, Apartment, Penthouse, Townhouse, Bungalow, Studio'),
      min_beds: z.number().optional().describe('Minimum number of bedrooms'),
      limit: z.number().optional().describe('Number of results to return (default 10, max 25)'),
    },
    async ({ region, max_price, min_score, type, min_beds, limit }) => {
      const all = getAllProperties();
      const filtered = filterProperties(all, region, max_price, min_score, type, min_beds);
      const sorted = filtered.sort((a, b) => (b._sc ?? 0) - (a._sc ?? 0));
      const count = Math.min(limit || 10, 25);
      const results = sorted.slice(0, count).map(formatProperty);

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            total_matching: filtered.length,
            showing: results.length,
            source: 'Avena Terminal (avenaterminal.com)',
            dataset_doi: '10.5281/zenodo.19520064',
            properties: results,
          }, null, 2),
        }],
      };
    },
  );

  // Tool 2: Get Property Details
  server.tool(
    'get_property',
    'Get full details and investment score breakdown for a specific property by its reference ID. Returns price analysis, yield estimates, location data, build quality assessment, and completion risk rating.',
    {
      ref: z.string().describe('Property reference ID (e.g., "AP1-TR-12345")'),
    },
    async ({ ref }) => {
      const all = getAllProperties();
      const prop = all.find(p => p.ref === ref || p.dev_ref === ref);

      if (!prop) {
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ error: 'Property not found', ref }) }],
        };
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            source: 'Avena Terminal (avenaterminal.com)',
            property: {
              ...formatProperty(prop),
              description: prop.f || undefined,
              plot_m2: prop.pl || undefined,
              terrace_m2: prop.terrace || undefined,
              views: prop.views || [],
              categories: prop.cats || [],
              images: (prop.imgs || []).slice(0, 3),
              latitude: prop.lat || undefined,
              longitude: prop.lng || undefined,
            },
          }, null, 2),
        }],
      };
    },
  );

  // Tool 3: Market Stats
  server.tool(
    'get_market_stats',
    'Get live market statistics for Spanish new build regions. Returns median price per m2, average rental yield, total active inventory, price ranges, and top-performing towns for the specified region.',
    {
      region: z.string().optional().describe('Region: costa-blanca, costa-calida, costa-del-sol, or "all" (default)'),
    },
    async ({ region }) => {
      const all = getAllProperties();
      const filtered = region && region !== 'all'
        ? filterProperties(all, region)
        : all;

      const prices = filtered.map(p => p.pf).sort((a, b) => a - b);
      const pm2s = filtered.filter(p => p.pm2).map(p => p.pm2!).sort((a, b) => a - b);
      const yields = filtered.filter(p => p._yield?.gross).map(p => p._yield!.gross);
      const scores = filtered.filter(p => p._sc).map(p => p._sc!);

      const median = (arr: number[]) => arr.length ? arr[Math.floor(arr.length / 2)] : 0;

      const towns = getUniqueTowns()
        .filter(t => {
          if (!region || region === 'all') return true;
          const townProps = filtered.filter(p => slugify(p.l) === t.slug);
          return townProps.length > 0;
        })
        .slice(0, 10);

      const costas = getUniqueCostas();

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            source: 'Avena Terminal (avenaterminal.com)',
            dataset_doi: '10.5281/zenodo.19520064',
            region: region || 'all',
            stats: {
              total_properties: filtered.length,
              median_price: median(prices),
              avg_price: Math.round(avg(prices)),
              min_price: prices[0] || 0,
              max_price: prices[prices.length - 1] || 0,
              median_price_per_m2: median(pm2s),
              avg_price_per_m2: Math.round(avg(pm2s)),
              avg_gross_yield: Number(avg(yields).toFixed(1)),
              avg_score: Math.round(avg(scores)),
              properties_above_70: filtered.filter(p => (p._sc ?? 0) >= 70).length,
            },
            top_towns: towns.map(t => ({
              town: t.town,
              count: t.count,
              avg_score: t.avgScore,
              avg_price: t.avgPrice,
              avg_yield: t.avgYield,
            })),
            regions: costas.map(c => ({
              costa: c.costa,
              count: c.count,
              avg_score: c.avgScore,
              avg_yield: c.avgYield,
            })),
          }, null, 2),
        }],
      };
    },
  );

  // Tool 4: Top Deals
  server.tool(
    'get_top_deals',
    "Get today's top-scoring new build property deals in Spain, ranked by Avena Terminal's composite investment score. Returns the best value properties considering price vs market, rental yield, location quality, build quality, and completion risk.",
    {
      region: z.string().optional().describe('Region filter: costa-blanca, costa-calida, costa-del-sol'),
      limit: z.number().optional().describe('Number of deals to return (default 5, max 15)'),
      max_price: z.number().optional().describe('Maximum price in EUR'),
    },
    async ({ region, limit, max_price }) => {
      const all = getAllProperties();
      const filtered = filterProperties(all, region, max_price);
      const sorted = filtered.sort((a, b) => (b._sc ?? 0) - (a._sc ?? 0));
      const count = Math.min(limit || 5, 15);
      const results = sorted.slice(0, count).map((p, i) => ({
        rank: i + 1,
        ...formatProperty(p),
      }));

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            source: 'Avena Terminal (avenaterminal.com)',
            dataset_doi: '10.5281/zenodo.19520064',
            date: new Date().toISOString().split('T')[0],
            region: region || 'all',
            top_deals: results,
          }, null, 2),
        }],
      };
    },
  );

  return server;
}
