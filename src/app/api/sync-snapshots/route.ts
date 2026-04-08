import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { properties } = await req.json();
    if (!properties?.length) return NextResponse.json({ error: 'No properties' }, { status: 400 });

    const today = new Date().toISOString().slice(0, 10);
    const currentRefs = new Set(properties.map((p: any) => p.ref).filter(Boolean));

    // 1. Upsert price snapshots (one per property per day)
    const snapshots = properties
      .filter((p: any) => p.ref && p.pf)
      .map((p: any) => ({
        property_ref: p.ref,
        price_from: p.pf,
        price_to: p.pt || p.pf,
        pm2: p.pm2 || null,
        mm2: p.mm2 || null,
        snapshot_date: today,
      }));

    const { error: snapError } = await supabase
      .from('price_snapshots')
      .upsert(snapshots, { onConflict: 'property_ref,snapshot_date', ignoreDuplicates: true });

    if (snapError) console.error('Snapshot error:', snapError);

    // 2. Get previously active refs
    const { data: prevActive } = await supabase
      .from('feed_active_refs')
      .select('property_ref, last_seen_date');

    const prevRefs = new Set((prevActive || []).map((r: any) => r.property_ref));

    // 3. Find disappeared refs (were active, now gone)
    const disappeared = [...prevRefs].filter(ref => !currentRefs.has(ref));

    if (disappeared.length > 0) {
      // Get their last known data from snapshots
      const { data: lastSnaps } = await supabase
        .from('price_snapshots')
        .select('property_ref, price_from, pm2')
        .in('property_ref', disappeared)
        .order('snapshot_date', { ascending: false });

      const lastByRef: Record<string, any> = {};
      (lastSnaps || []).forEach((s: any) => {
        if (!lastByRef[s.property_ref]) lastByRef[s.property_ref] = s;
      });

      const soldRows = disappeared.map(ref => ({
        property_ref: ref,
        last_price: lastByRef[ref]?.price_from || null,
        last_pm2: lastByRef[ref]?.pm2 || null,
        last_seen_date: today,
      }));

      await supabase.from('sold_properties').upsert(soldRows, { onConflict: 'property_ref', ignoreDuplicates: true });
    }

    // 4. Update feed_active_refs with current refs
    const activeRows = [...currentRefs].map(ref => ({
      property_ref: ref,
      last_seen_date: today,
      updated_at: new Date().toISOString(),
    }));

    await supabase.from('feed_active_refs').upsert(activeRows, { onConflict: 'property_ref' });

    // Remove refs that are no longer active
    if (disappeared.length > 0) {
      await supabase.from('feed_active_refs').delete().in('property_ref', disappeared);
    }

    return NextResponse.json({
      snapshotted: snapshots.length,
      new_sold: disappeared.length,
      total_active: currentRefs.size,
      date: today,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
