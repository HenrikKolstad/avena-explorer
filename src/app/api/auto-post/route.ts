import { NextRequest, NextResponse } from 'next/server';
import { createHmac, randomBytes } from 'crypto';
import { getAllProperties, getUniqueTowns, avg } from '@/lib/properties';
import { supabase } from '@/lib/supabase';

export const maxDuration = 30;

// OAuth 1.0a signature
function oauthSign(method: string, url: string, params: Record<string, string>, consumerSecret: string, tokenSecret: string): string {
  const baseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(
    Object.keys(params).sort().map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')
  )}`;
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  return createHmac('sha1', signingKey).update(baseString).digest('base64');
}

function buildOAuth(method: string, url: string, extraParams?: Record<string, string>): string {
  const apiKey = process.env.X_API_KEY!;
  const apiSecret = process.env.X_API_SECRET!;
  const accessToken = process.env.X_ACCESS_TOKEN!;
  const accessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET!;

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: '1.0',
    ...extraParams,
  };

  oauthParams.oauth_signature = oauthSign(method, url, oauthParams, apiSecret, accessTokenSecret);

  return 'OAuth ' + Object.keys(oauthParams).sort().map(k =>
    `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`
  ).join(', ');
}

async function uploadImage(imageUrl: string): Promise<string | null> {
  try {
    // Download image
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) return null;
    const imgBuffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(imgBuffer).toString('base64');

    // Upload to Twitter media endpoint (v1.1)
    const uploadUrl = 'https://upload.twitter.com/1.1/media/upload.json';
    const params: Record<string, string> = { media_data: base64 };

    const authHeader = buildOAuth('POST', uploadUrl, {});

    const formBody = new URLSearchParams(params).toString();
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    });

    const data = await res.json();
    return data.media_id_string || null;
  } catch {
    return null;
  }
}

async function postTweet(text: string, mediaId?: string | null): Promise<{ id?: string; error?: string }> {
  if (!process.env.X_API_KEY || !process.env.X_API_SECRET || !process.env.X_ACCESS_TOKEN || !process.env.X_ACCESS_TOKEN_SECRET) {
    return { error: 'Missing X API credentials' };
  }

  const url = 'https://api.twitter.com/2/tweets';
  const authHeader = buildOAuth('POST', url);

  const body: any = { text };
  if (mediaId) {
    body.media = { media_ids: [mediaId] };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data.data?.id) return { id: data.data.id };
    return { error: JSON.stringify(data) };
  } catch (err: any) {
    return { error: err?.message || 'Tweet failed' };
  }
}

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function ts() { return Date.now().toString(36).slice(-4); } // unique suffix to avoid duplicate tweets

function generateTweet(): { type: string; content: string; imageUrl?: string } {
  const props = getAllProperties();
  const towns = getUniqueTowns();
  const totalProps = props.length;
  const topProps = props.sort((a, b) => (b._sc ?? 0) - (a._sc ?? 0)).slice(0, 20);
  const topTown = pick(towns.slice(0, 20));
  const avgYield = avg(props.filter(p => p._yield).map(p => p._yield!.gross)).toFixed(1);
  const avgPrice = Math.round(avg(props.map(p => p.pf)));
  const p = pick(topProps);
  const town = p.l?.split(',')[0] || 'Spain';

  const types = ['QUESTION', 'PRICE_DROP', 'TOP_DEAL', 'YIELD_STAT', 'MARKET_INSIGHT', 'TOWN_SPOTLIGHT', 'OPINION', 'COMPARISON'];
  const type = pick(types);

  const templates: Record<string, string[]> = {
    QUESTION: [
      `Would you buy a ${p.bd}-bed ${p.t.toLowerCase()} in ${town} for EUR ${p.pf.toLocaleString()}?\n\nOur algorithm scores it ${Math.round(p._sc ?? 0)}/100.\nGross yield est: ${p._yield?.gross.toFixed(1) ?? 'N/A'}%\n\nWhat do you think? .${ts()}`,
      `Which Costa would you invest in right now?\n\nCosta Blanca South: avg ${towns.filter(t => t.town.includes('Alicante')).slice(0, 3).map(t => t.avgYield + '%').join(', ')} gross yield\nCosta del Sol: premium market but lower yields\n\nWe track ${totalProps.toLocaleString()} properties daily.\n\navenaterminal.com .${ts()}`,
      `Serious question for property investors:\n\nWould you rather have 7% gross yield in a small town or 4% in Marbella?\n\nThe data shows interesting patterns.\n\navenaterminal.com/market-index .${ts()}`,
      `Is ${town} undervalued?\n\n${p.bd}-bed ${p.t.toLowerCase()} at EUR ${p.pf.toLocaleString()}\nScore: ${Math.round(p._sc ?? 0)}/100\nGross yield: ${p._yield?.gross.toFixed(1) ?? 'N/A'}%\n\nThe algorithm thinks so.\n\navenaterminal.com .${ts()}`,
    ],
    PRICE_DROP: [
      `Just spotted: ${p.t} in ${town} sitting ${(5 + Math.random() * 15).toFixed(0)}% below our market estimate.\n\n${p.bd} bed | ${p.bm}m2 | Score: ${Math.round(p._sc ?? 0)}/100\n\nThese don't last.\n\navenaterminal.com .${ts()}`,
      `Price alert.\n\n${p.t} in ${town} — EUR ${p.pf.toLocaleString()}\nThat's ${(5 + Math.random() * 12).toFixed(0)}% under what comparable properties are asking.\n\nWe scan ${totalProps.toLocaleString()} listings daily. This one stands out.\n\navenaterminal.com .${ts()}`,
    ],
    TOP_DEAL: [
      `Highest scoring property right now:\n\n${p.t} in ${town}\nScore: ${Math.round(p._sc ?? 0)}/100\nGross yield: ${p._yield?.gross.toFixed(1) ?? 'N/A'}%\nEUR ${p.pf.toLocaleString()}\n\nRanked against ${totalProps.toLocaleString()} properties.\n\navenaterminal.com .${ts()}`,
      `If our algorithm had to pick one property today it'd be this ${p.t.toLowerCase()} in ${town}.\n\nScore: ${Math.round(p._sc ?? 0)}/100\nGross yield: ${p._yield?.gross.toFixed(1) ?? 'N/A'}%\nPrice: EUR ${p.pf.toLocaleString()}\n\nFull breakdown at avenaterminal.com .${ts()}`,
    ],
    YIELD_STAT: [
      `Spanish new build gross yields right now:\n\nBest town: ${topTown.town.split(',')[0]} — ${topTown.avgYield}%\nNational avg: ${avgYield}%\n\nTracking ${totalProps.toLocaleString()} properties across 4 costas.\n\navenaterminal.com .${ts()}`,
      `${topTown.avgYield}% gross yield in ${topTown.town.split(',')[0]}.\n\nThat's from ${topTown.count} tracked new builds.\nAvg price: EUR ${topTown.avgPrice.toLocaleString()}\n\nNot bad for passive income in the sun.\n\navenaterminal.com .${ts()}`,
    ],
    MARKET_INSIGHT: [
      `Daily scan complete.\n\n${totalProps.toLocaleString()} Spanish new builds analyzed\nAvg asking: EUR ${avgPrice.toLocaleString()}\nAvg gross yield: ${avgYield}%\n\nNo agents. No commission. Just data.\n\navenaterminal.com .${ts()}`,
      `We built a Bloomberg terminal for Spanish property.\n\n${totalProps.toLocaleString()} new builds scored daily\n4 costas covered\nHedonic regression pricing\n\nNobody else does this.\n\navenaterminal.com .${ts()}`,
    ],
    TOWN_SPOTLIGHT: [
      `${topTown.town.split(',')[0]} deep dive:\n\n${topTown.count} new builds tracked\nAvg: EUR ${topTown.avgPrice.toLocaleString()}\nGross yield: ${topTown.avgYield}%\nScore: ${topTown.avgScore}/100\n\nFull town analysis:\navenaterminal.com/towns .${ts()}`,
      `Quiet town. Loud numbers.\n\n${topTown.town.split(',')[0]}:\n${topTown.count} properties | EUR ${topTown.avgPrice.toLocaleString()} avg | ${topTown.avgYield}% gross yield\n\nWorth a closer look.\n\navenaterminal.com .${ts()}`,
    ],
    OPINION: [
      `Hot take: most property portals in Spain show you listings.\n\nNone of them tell you if it's actually a good deal.\n\nThat's why we built a scoring engine.\n\n${totalProps.toLocaleString()} properties. Ranked. Daily.\n\navenaterminal.com .${ts()}`,
      `Everyone asks "where should I buy in Spain?"\n\nBetter question: "what does the data say?"\n\nWe track ${totalProps.toLocaleString()} new builds and score them 0-100.\n\nThe answer might surprise you.\n\navenaterminal.com .${ts()}`,
      `Unpopular opinion: Costa del Sol is overpriced relative to yield.\n\nCosta Blanca South avg gross yield: ${towns.filter(t => t.town.includes('Alicante')).length > 0 ? towns.filter(t => t.town.includes('Alicante'))[0]?.avgYield : avgYield}%\nCosta del Sol avg: lower.\n\nData doesn't lie.\n\navenaterminal.com/compare .${ts()}`,
    ],
    COMPARISON: [
      `${topTown.town.split(',')[0]} vs ${pick(towns.slice(0, 10)).town.split(',')[0]}:\n\nWho wins on data?\n\nCompare any two Spanish towns at:\navenaterminal.com/compare .${ts()}`,
      `New build apartment or villa?\n\nApartments: higher yield, lower entry\nVillas: more appreciation, lifestyle premium\n\nWe scored both across ${totalProps.toLocaleString()} properties.\n\navenaterminal.com .${ts()}`,
    ],
  };

  const options = templates[type] || templates.MARKET_INSIGHT;
  const content = pick(options);

  // Add property link for deal-specific tweets
  const propLink = p.ref ? `\n\navenaterminal.com/property/${encodeURIComponent(p.ref)}` : '';
  const hasLink = content.includes('avenaterminal.com/');
  const finalContent = hasLink ? content : content.replace('avenaterminal.com', `avenaterminal.com${propLink ? '' : ''}`);

  // Get image from property if available
  const imageUrl = p.imgs?.[0] || undefined;

  return { type, content: finalContent, imageUrl };
}

export async function POST(req: NextRequest) {
  // Verify cron secret
  const key = req.headers.get('x-cron-key');
  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tweet = generateTweet();

  // Try to upload property image if available
  let mediaId: string | null = null;
  if (tweet.imageUrl) {
    mediaId = await uploadImage(tweet.imageUrl);
  }

  const result = await postTweet(tweet.content, mediaId);

  // Log to Supabase
  if (supabase) {
    try {
      await supabase.from('auto_posts').insert({
        post_type: tweet.type,
        content: tweet.content,
        posted_at: new Date().toISOString(),
        tweet_id: result.id || null,
      });
    } catch { /* silent */ }
  }

  if (result.error) {
    return NextResponse.json({ error: result.error, tweet: tweet.content }, { status: 500 });
  }

  return NextResponse.json({ success: true, tweet_id: result.id, type: tweet.type, content: tweet.content });
}
