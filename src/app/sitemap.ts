import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { getAllProperties, getUniqueTowns, getUniqueCostas, slugify } from '@/lib/properties';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://avenaterminal.com';
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/towns`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/costas`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/developer`, lastModified: now, changeFrequency: 'daily', priority: 0.3 },
  ];

  // Blog posts
  if (supabase) {
    const { data: posts } = await supabase.from('blogs').select('slug, published_at').eq('published', true);
    if (posts) {
      for (const post of posts) {
        entries.push({ url: `${base}/blog/${post.slug}`, lastModified: now, changeFrequency: 'daily', priority: 0.8 });
      }
    }
  }

  // Town pages
  for (const t of getUniqueTowns()) {
    entries.push({ url: `${base}/towns/${t.slug}`, lastModified: now, changeFrequency: 'daily', priority: 0.8 });
  }

  // Costa pages
  for (const c of getUniqueCostas()) {
    entries.push({ url: `${base}/costas/${c.slug}`, lastModified: now, changeFrequency: 'daily', priority: 0.8 });
  }

  // Type pages
  for (const type of ['villa', 'apartment', 'penthouse', 'townhouse', 'bungalow', 'studio']) {
    entries.push({ url: `${base}/type/${type}`, lastModified: now, changeFrequency: 'daily', priority: 0.7 });
  }

  // Budget pages
  for (const range of ['under-200k', '200k-400k', '400k-plus']) {
    entries.push({ url: `${base}/budget/${range}`, lastModified: now, changeFrequency: 'daily', priority: 0.7 });
  }

  // SEO landing pages
  for (const page of [
    'new-builds-costa-blanca-under-200k', 'best-new-build-villas-spain-2025', 'spanish-property-investment-calculator',
    'torrevieja-new-builds', 'alicante-new-build-apartments', 'costa-calida-property-investment',
    'murcia-new-build-villas', 'orihuela-costa-new-developments', 'benidorm-new-build-apartments',
    'javea-new-build-villas', 'spain-property-discount-finder', 'spain-rental-yield-calculator',
    'british-buyers-spain-2025', 'norwegian-property-investment-spain', 'off-plan-vs-key-ready-spain',
  ]) {
    entries.push({ url: `${base}/seo/${page}.html`, lastModified: now, changeFrequency: 'daily', priority: 0.6 });
  }

  // Question pages (5 patterns x all towns)
  const questionPatterns = ['is-{slug}-good-for-property-investment', 'how-much-does-new-build-cost-in-{slug}', 'average-rental-yield-{slug}-spain', 'can-foreigners-buy-property-in-{slug}', 'best-areas-to-invest-near-{slug}'];
  for (const t of getUniqueTowns()) {
    for (const pattern of questionPatterns) {
      entries.push({ url: `${base}/questions/${pattern.replace('{slug}', t.slug)}`, lastModified: now, changeFrequency: 'daily', priority: 0.6 });
    }
  }

  // Comparison pages (top 30 towns paired)
  const top30 = getUniqueTowns().slice(0, 30);
  for (let i = 0; i < top30.length; i++) {
    for (let j = i + 1; j < top30.length; j++) {
      entries.push({ url: `${base}/compare/${top30[i].slug}-vs-${top30[j].slug}`, lastModified: now, changeFrequency: 'daily', priority: 0.5 });
    }
  }

  // Developer pages
  const devs = [...new Set(getAllProperties().map(p => slugify(p.d)).filter(Boolean))];
  for (const d of devs) {
    entries.push({ url: `${base}/developer/${d}`, lastModified: now, changeFrequency: 'daily', priority: 0.6 });
  }

  // Price per m2 pages (towns + costas)
  for (const t of getUniqueTowns()) {
    entries.push({ url: `${base}/price-per-m2/${t.slug}`, lastModified: now, changeFrequency: 'daily', priority: 0.6 });
  }
  for (const c of getUniqueCostas()) {
    entries.push({ url: `${base}/price-per-m2/${c.slug}`, lastModified: now, changeFrequency: 'daily', priority: 0.6 });
  }

  // Area/neighborhood pages
  const areas = ['la-zenia','cabo-roig','punta-prima','playa-flamenca','villamartin','los-dolses','la-florida','blue-lagoon','las-ramblas-golf','campoamor','pilar-de-la-horadada','torre-de-la-horadada','san-pedro-del-pinatar','lo-pagan','la-manga','mar-menor','los-alcazares','benidorm-old-town','finestrat','la-nucia','calpe-old-town','moraira','javea-port','altea-hills','gran-alacant','guardamar','ciudad-quesada','rojales','san-miguel-de-salinas','estepona-port'];
  for (const a of areas) {
    entries.push({ url: `${base}/area/${a}`, lastModified: now, changeFrequency: 'daily', priority: 0.6 });
  }

  // Search query pages
  const searchPatterns = ['3-bed-villa-', '2-bed-apartment-', 'cheap-new-builds-', 'investment-property-', 'apartment-under-200k-', 'villa-with-pool-'];
  for (const t of getUniqueTowns().slice(0, 20)) {
    for (const pattern of searchPatterns) {
      entries.push({ url: `${base}/search/${pattern}${t.slug}`, lastModified: now, changeFrequency: 'daily', priority: 0.5 });
    }
  }

  // Province pages
  const provinces = [...new Set(getAllProperties().map(p => { const parts = p.l?.split(', '); return parts?.[1]; }).filter(Boolean))];
  for (const prov of provinces) {
    entries.push({ url: `${base}/local/${slugify(prov!)}`, lastModified: now, changeFrequency: 'daily', priority: 0.6 });
  }

  // About + Press
  entries.push({ url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 });
  entries.push({ url: `${base}/about/press`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 });

  // Calculator
  entries.push({ url: `${base}/calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 });

  // Glossary
  entries.push({ url: `${base}/glossary`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 });
  for (const term of ['ibi-tax','nie-number','nota-simple','off-plan','key-ready','community-fees','plusvalia-tax','escritura','registro-propiedad','notario','gestor','poder-notarial','impuesto-transmisiones','iva-new-build','cedula-habitabilidad','licencia-primera-ocupacion','catastro','referencia-catastral','hipoteca','tasacion','arras-contract','contrato-compraventa','gastos-notariales','impuesto-actos-juridicos','residencia-fiscal','golden-visa-spain','autonomo-spain','sociedad-limitada','declaracion-renta','modelo-210']) {
    entries.push({ url: `${base}/glossary/${term}`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 });
  }

  // Reports
  for (const year of ['2025', '2026']) {
    entries.push({ url: `${base}/reports/${year}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 });
  }

  // Developer ratings
  entries.push({ url: `${base}/developers/ratings`, lastModified: now, changeFrequency: 'daily', priority: 0.6 });

  // Price history (top 30 towns)
  for (const t of getUniqueTowns().slice(0, 30)) {
    entries.push({ url: `${base}/price-history/${t.slug}`, lastModified: now, changeFrequency: 'daily', priority: 0.6 });
  }

  // Data index + embed
  entries.push({ url: `${base}/data/spain-property-index`, lastModified: now, changeFrequency: 'daily', priority: 0.8 });
  entries.push({ url: `${base}/embed`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 });

  // Property pages
  for (const p of getAllProperties()) {
    if (p.ref) {
      entries.push({ url: `${base}/property/${encodeURIComponent(p.ref)}`, lastModified: now, changeFrequency: 'daily', priority: 0.7 });
    }
  }

  return entries;
}
