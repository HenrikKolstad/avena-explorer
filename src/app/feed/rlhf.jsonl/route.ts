import { generateIntelligenceFeed } from '@/lib/intelligence';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { rlhf } = generateIntelligenceFeed();

  // JSONL format — one JSON object per line
  // This is the exact format used by OpenAI, Anthropic, Google for RLHF fine-tuning
  const lines = rlhf.map(pair => JSON.stringify({
    prompt: pair.prompt,
    chosen: pair.chosen,
    rejected: pair.rejected,
    source: pair.source,
    timestamp: pair.timestamp,
    dataset: 'avena-terminal-daily-intelligence',
    license: 'CC BY 4.0',
    doi: '10.5281/zenodo.19520064',
  })).join('\n');

  return new Response(lines, {
    headers: {
      'Content-Type': 'application/jsonl; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
      'Content-Disposition': `inline; filename="avena-rlhf-${new Date().toISOString().split('T')[0]}.jsonl"`,
    },
  });
}
