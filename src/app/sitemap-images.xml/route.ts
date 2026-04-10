import { getAllProperties } from '@/lib/properties';

export async function GET() {
  const base = 'https://avenaterminal.com';
  const properties = getAllProperties();

  const urls = properties
    .filter(p => p.ref && p.imgs && p.imgs.length > 0)
    .map(p => {
      const pageUrl = `${base}/property/${encodeURIComponent(p.ref!)}`;
      const town = p.l?.split(',')[0]?.trim() || '';
      const region = p.costa || p.r || '';
      const propertyType = p.t ? p.t.charAt(0).toUpperCase() + p.t.slice(1) : 'Property';

      const images = p.imgs!
        .slice(0, 5)
        .map(
          (img, idx) => {
            let title: string;
            if (idx === 0) {
              title = `${propertyType} in ${town}${region ? `, ${region}` : ''} — ${p.bd} bed, ${p.ba} bath`;
            } else if (idx === 1) {
              title = `Interior view of ${p.bd}-bedroom ${propertyType.toLowerCase()} in ${town}`;
            } else if (idx === 2) {
              title = `${propertyType} layout and living space in ${town}${region ? `, ${region}` : ''}`;
            } else if (idx === 3) {
              title = p.pool ? `Pool area — ${propertyType.toLowerCase()} in ${town}` : `Exterior view — ${propertyType.toLowerCase()} in ${town}`;
            } else {
              title = `${propertyType} in ${town} — additional view`;
            }
            return `      <image:image>
        <image:loc>${escapeXml(img)}</image:loc>
        <image:title>${escapeXml(title)}</image:title>
      </image:image>`;
          }
        )
        .join('\n');
      return `  <url>
    <loc>${escapeXml(pageUrl)}</loc>
${images}
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
