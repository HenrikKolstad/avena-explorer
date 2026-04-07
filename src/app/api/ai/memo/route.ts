import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { property, comparables } = await req.json();
    const p = property;

    const prompt = `You are an expert Spanish property investment analyst. Analyze this new-build property and provide a concise, institutional-grade investment memo.

PROPERTY DATA:
- Project: ${p.p} by ${p.d}
- Location: ${p.l}, ${p.r}
- Type: ${p.t} | Bedrooms: ${p.bd} | Built: ${p.bm}m² ${p.pl ? `| Plot: ${p.pl}m²` : ''}
- Price: €${p.pf.toLocaleString()} ${p.pm2 ? `(€${p.pm2}/m²)` : ''}
- Market avg €/m² in area: €${p.mm2}/m²
- Price vs market: ${p.pm2 && p.mm2 ? `${(((p.mm2 - p.pm2) / p.mm2) * 100).toFixed(1)}% ${p.pm2 < p.mm2 ? 'below' : 'above'} market` : 'N/A'}
- Status: ${p.s} | Completion: ${p.c}
- Beach distance: ${p.bk !== null ? `${p.bk}km` : 'N/A'}
- Deal score: ${p._sc}/100
- Gross rental yield: ${p._yield ? `${p._yield.gross}%` : 'N/A'}
- Annual rental income: ${p._yield ? `€${p._yield.annual.toLocaleString()}` : 'N/A'}
- Energy rating: ${p.energy || 'N/A'}
- Categories: ${p.cats?.join(', ') || 'N/A'}
- Developer years active: ${p.dy}

COMPARABLE PROPERTIES IN SAME REGION:
${comparables.map((c: {p: string; pf: number; pm2?: number; _sc?: number; bk: number | null}) => `- ${c.p}: €${c.pf.toLocaleString()} | €${c.pm2 || 'N/A'}/m² | Score: ${c._sc} | Beach: ${c.bk !== null ? c.bk + 'km' : 'N/A'}`).join('\n')}

Respond in this EXACT JSON format (no markdown, pure JSON):
{
  "verdict": "BUY" | "CONSIDER" | "PASS",
  "confidence": 1-10,
  "headline": "One punchy sentence summarizing the opportunity",
  "price_prediction": {
    "year1": estimated price in €,
    "year3": estimated price in €,
    "year5": estimated price in €,
    "rationale": "2 sentence explanation of growth drivers"
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "risks": ["risk 1", "risk 2"],
  "yield_outlook": "2 sentence rental yield assessment",
  "market_context": "2 sentence regional market context",
  "comparable_position": "1 sentence on how this stacks vs comparables",
  "recommendation": "3-4 sentence actionable recommendation for an investor"
}`;

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = (message.content[0] as { type: string; text: string }).text;

    // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/, '')
      .trim();

    let json;
    try {
      json = JSON.parse(cleaned);
    } catch (parseErr) {
      // Try to extract JSON object from within the text
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        json = JSON.parse(match[0]);
      } else {
        console.error('AI memo parse error:', parseErr, 'raw:', raw.substring(0, 300));
        throw new Error('Could not parse AI response as JSON');
      }
    }

    return NextResponse.json(json);
  } catch (err) {
    console.error('AI memo error:', err);
    return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 });
  }
}
