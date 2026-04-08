import { MetadataRoute } from 'next';
import { readFileSync } from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';
import { Property } from '@/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://avena-estate.com';
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/developer`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.3,
    },
  ];

  // Blog posts from Supabase
  if (supabase) {
    const { data: posts } = await supabase
      .from('blogs')
      .select('slug, published_at')
      .eq('published', true);
    if (posts) {
      for (const post of posts) {
        entries.push({
          url: `${base}/blog/${post.slug}`,
          lastModified: new Date(post.published_at),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  }

  // Property pages from data.json
  try {
    const filePath = path.join(process.cwd(), 'public', 'data.json');
    const raw: Property[] = JSON.parse(readFileSync(filePath, 'utf8'));
    for (const p of raw) {
      if (p.ref) {
        entries.push({
          url: `${base}/property/${encodeURIComponent(p.ref)}`,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  } catch {
    // data.json not available at build time
  }

  return entries;
}
