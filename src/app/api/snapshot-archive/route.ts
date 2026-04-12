import { NextRequest } from 'next/server';
import { getAllProperties, avg } from '@/lib/properties';
import { supabase } from '@/lib/supabase';

export const maxDuration = 60;

// Runs daily — archives current dataset state to price_history
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabase) return Response.json({ error: 'No Supabase' }, { status: 503 });

  const all = getAllProperties();
  const date = new Date().toISOString().split('T')[0];

  // Archive each property's current price + score
  const records = all.slice(0, 1900).map(p => ({
    snapshot_date: date,
    property_ref: p.ref || '',
    project_name: p.p || '',
    town: p.l,
    region: p.costa || p.r || '',
    property_type: p.t,
    price: p.pf,
    price_per_m2: p.pm2 || null,
    market_pm2: p.mm2 || null,
    score: p._sc || null,
    yield_gross: p._yield?.gross || null,
    status: p.s || '',
    beds: p.bd,
    built_m2: p.bm,
  }));

  // Batch insert in chunks of 500
  let inserted = 0;
  for (let i = 0; i < records.length; i += 500) {
    const chunk = records.slice(i, i + 500);
    const { error } = await supabase.from('price_history').upsert(chunk, {
      onConflict: 'snapshot_date,property_ref',
    });
    if (!error) inserted += chunk.length;
  }

  // Also archive market-level summary
  const avgPrice = Math.round(avg(all.map(p => p.pf)));
  const avgScore = Math.round(avg(all.filter(p => p._sc).map(p => p._sc!)));
  const avgYield = Number(avg(all.filter(p => p._yield?.gross).map(p => p._yield!.gross)).toFixed(1));

  await supabase.from('market_snapshots').upsert({
    snapshot_date: date,
    total_properties: all.length,
    avg_price: avgPrice,
    avg_score: avgScore,
    avg_yield: avgYield,
    above_70: all.filter(p => (p._sc ?? 0) >= 70).length,
  }, { onConflict: 'snapshot_date' });

  return Response.json({
    success: true,
    date,
    properties_archived: inserted,
    market_summary: { total: all.length, avgPrice, avgScore, avgYield },
  });
}
