import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'henrik@xaviaestate.com';
const ADMIN_USER_ID = '05facda5-23e1-4345-a754-ab584635784e';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }
  if (!password || password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: 'Server config missing' }, { status: 500 });
  }

  const supabaseAdmin = createClient(url, key);

  const { error } = await supabaseAdmin.auth.admin.updateUserById(ADMIN_USER_ID, { password });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
