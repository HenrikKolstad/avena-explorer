import { NextResponse } from 'next/server'

export const maxDuration = 60

/**
 * GET /api/cron/auto-post
 * Vercel Cron wrapper — calls the auto-post API internally.
 * Scheduled: 0 9,13,18 * * * (9am, 1pm, 6pm UTC)
 */
export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://avenaterminal.com'
    const res = await fetch(`${baseUrl}/api/auto-post`, {
      method: 'POST',
      headers: {
        'x-cron-key': process.env.CRON_SECRET || '',
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Auto-post cron failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
