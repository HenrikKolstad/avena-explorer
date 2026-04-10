import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!supabase) return NextResponse.json({ events: [], stats: { todayCount: 0, total: 0 } });

  // Fetch last 100 real events only — no synthetic data
  const { data: events } = await supabase
    .from('market_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  // Today's count
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const { count: todayCount } = await supabase
    .from('market_events')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', todayStart);

  return NextResponse.json({
    events: events || [],
    stats: { todayCount: todayCount || 0, total: events?.length || 0 }
  });
}
