import { NextResponse } from 'next/server'

export const maxDuration = 60

/**
 * GET /api/cron/deal-alerts
 * Vercel Cron wrapper — calls the deal-alerts check API internally.
 * Scheduled: 0 8 * * * (8am UTC daily)
 */
export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://avenaterminal.com'
    const res = await fetch(`${baseUrl}/api/deal-alerts/check`, {
      headers: {
        'x-cron-key': process.env.CRON_SECRET || '',
      },
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Deal alerts cron failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
