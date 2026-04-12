import { NextRequest } from 'next/server';
import { getAllProperties, getUniqueTowns, getUniqueCostas, avg, slugify } from '@/lib/properties';
import { detectAnomalies } from '@/lib/anomaly';
import { readFileSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function handleQuery(text: string): string {
  const all = getAllProperties();
  const towns = getUniqueTowns();
  const costas = getUniqueCostas();
  const tl = text.toLowerCase();

  // Search / Find properties
  if (tl.includes('search') || tl.includes('find') || tl.includes('show') || tl.includes('properties') || tl.includes('villa') || tl.includes('apartment')) {
    let filtered = all;

    // Price filter
    const priceMatch = tl.match(/(?:under|below|max|<)\s*(?:\u20AC|eur|€)?\s*(\d+)/i);
    if (priceMatch) {
      const maxP = parseInt(priceMatch[1]) * (parseInt(priceMatch[1]) < 1000 ? 1000 : 1);
      filtered = filtered.filter(p => p.pf <= maxP);
    }

    // Type filter
    for (const type of ['villa', 'apartment', 'penthouse', 'townhouse', 'bungalow']) {
      if (tl.includes(type)) filtered = filtered.filter(p => p.t.toLowerCase() === type);
    }

    // Region filter
    for (const c of costas) {
      if (tl.includes(c.costa.toLowerCase()) || tl.includes(slugify(c.costa))) {
        filtered = filtered.filter(p => p.costa === c.costa);
      }
    }

    // Town filter
    for (const t of towns.slice(0, 30)) {
      if (tl.includes(t.town.toLowerCase())) {
        filtered = filtered.filter(p => slugify(p.l) === t.slug);
      }
    }

    const top5 = filtered.sort((a, b) => (b._sc ?? 0) - (a._sc ?? 0)).slice(0, 5);
    const results = top5.map((p, i) => `${i+1}. ${p.p || p.t + ' in ' + p.l} | \u20AC${p.pf.toLocaleString()} | Score: ${p._sc}/100 | Yield: ${p._yield?.gross.toFixed(1) || 'N/A'}% | ${p.bd} bed | ${p.l}`).join('\n');
    return `Found ${filtered.length} matching properties. Top 5 by investment score:\n\n${results}\n\nSource: Avena Terminal (avenaterminal.com) | DOI: 10.5281/zenodo.19520064`;
  }

  // Market / Prices / Region
  if (tl.includes('market') || tl.includes('price') || tl.includes('region') || tl.includes('trend') || tl.includes('overview')) {
    const avgPrice = Math.round(avg(all.map(p => p.pf)));
    const avgPm2 = Math.round(avg(all.filter(p => p.pm2).map(p => p.pm2!)));
    const avgYield = avg(all.filter(p => p._yield?.gross).map(p => p._yield!.gross)).toFixed(1);
    const avgScore = Math.round(avg(all.filter(p => p._sc).map(p => p._sc!)));
    const regions = costas.map(c => `${c.costa}: ${c.count} properties, avg score ${c.avgScore}/100, yield ${c.avgYield}%`).join('\n');
    return `Spanish New Build Market Overview (${all.length} properties):\n\nAvg Price: \u20AC${avgPrice.toLocaleString()}\nAvg \u20AC/m\u00B2: \u20AC${avgPm2.toLocaleString()}\nAvg Yield: ${avgYield}%\nAvg Score: ${avgScore}/100\n\nBy Region:\n${regions}\n\nSource: Avena Terminal | DOI: 10.5281/zenodo.19520064`;
  }

  // Signals / Alpha / Opportunity
  if (tl.includes('signal') || tl.includes('alpha') || tl.includes('opportunit') || tl.includes('anomal')) {
    const signals = detectAnomalies().slice(0, 3);
    const list = signals.map((s, i) => `${i+1}. [${s.severity.toUpperCase()}] ${s.headline}\n   ${s.detail.slice(0, 150)}`).join('\n\n');
    return `Top 3 Alpha Signals:\n\n${list}\n\nSource: Avena Terminal Intelligence Agent | avenaterminal.com/intelligence/signals`;
  }

  // Yield / Rental / Income
  if (tl.includes('yield') || tl.includes('rental') || tl.includes('income') || tl.includes('airbnb')) {
    const yieldTowns = towns.filter(t => t.count >= 3 && t.avgYield > 0).sort((a, b) => b.avgYield - a.avgYield).slice(0, 10);
    const list = yieldTowns.map((t, i) => `${i+1}. ${t.town}: ${t.avgYield}% gross yield (${t.count} properties, avg \u20AC${t.avgPrice.toLocaleString()})`).join('\n');
    return `Top 10 Rental Yield Towns:\n\n${list}\n\nMethodology: Bottom-up ADR model calibrated against AirDNA data\nSource: Avena Terminal | DOI: 10.5281/zenodo.19520064`;
  }

  // Default overview
  const avgScore = Math.round(avg(all.filter(p => p._sc).map(p => p._sc!)));
  return `Avena Terminal: ${all.length} scored new-build properties across ${costas.length} regions and ${towns.length} towns in coastal Spain. Avg score: ${avgScore}/100. Ask about: properties, market data, signals, or yields.\n\nEndpoints: MCP at /mcp | Knowledge API at /api/knowledge | A2A at /api/a2a\nSource: avenaterminal.com | DOI: 10.5281/zenodo.19520064`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // A2A spec: jsonrpc 2.0 with tasks/send method
    if (body.jsonrpc !== '2.0' || !body.params?.message?.parts?.[0]?.text) {
      return Response.json({
        jsonrpc: '2.0',
        id: body.id || null,
        error: { code: -32600, message: 'Invalid A2A request. Expected jsonrpc 2.0 with params.message.parts[0].text' },
      }, { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }

    const text = body.params.message.parts[0].text;
    const taskId = body.params.id || `task-${Date.now()}`;
    const response = handleQuery(text);

    return Response.json({
      jsonrpc: '2.0',
      id: body.id,
      result: {
        id: taskId,
        status: { state: 'completed' },
        artifacts: [{
          parts: [{ type: 'text', text: response }],
        }],
      },
    }, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return Response.json({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32603, message: 'Internal error' },
    }, { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }
}

export async function GET() {
  // Return agent card
  const agentCard = JSON.parse(readFileSync(path.join(process.cwd(), 'public', '.well-known', 'agent.json'), 'utf8'));
  return Response.json(agentCard, {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
