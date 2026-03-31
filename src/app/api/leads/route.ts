import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { property_ref, property_name, property_price, developer, action, user_email } = body;

    if (!property_ref) {
      return NextResponse.json({ error: 'property_ref required' }, { status: 400 });
    }

    // If Supabase is not configured, just log
    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('Lead tracked (no DB):', { property_ref, property_name, action, user_email });
      return NextResponse.json({ ok: true, stored: false });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase.from('leads').insert({
      property_ref,
      property_name: property_name || null,
      property_price: property_price || null,
      developer: developer || null,
      action: action || 'click_contact',
      user_email: user_email || null,
    });

    if (error) {
      console.error('Lead insert error:', error);
      return NextResponse.json({ error: 'Failed to store lead' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, stored: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
