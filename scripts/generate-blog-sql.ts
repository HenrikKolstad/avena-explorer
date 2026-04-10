/**
 * Run with: npx tsx scripts/generate-blog-sql.ts > scripts/insert-blog-posts.sql
 * Generates INSERT statements for the Supabase `blogs` table from blog-posts.ts data.
 */
import { BLOG_POSTS } from '../src/lib/blog-posts';
import * as fs from 'fs';
import * as path from 'path';

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

const lines: string[] = [
  '-- Auto-generated blog post inserts for Supabase `blogs` table',
  '-- Generated from src/lib/blog-posts.ts',
  `-- Generated at: ${new Date().toISOString()}`,
  '',
  '-- Ensure no duplicates by slug',
  'BEGIN;',
  '',
];

for (const post of BLOG_POSTS) {
  lines.push(`INSERT INTO blogs (slug, title, meta_description, excerpt, content, published, published_at)
VALUES (
  '${escapeSql(post.slug)}',
  '${escapeSql(post.title)}',
  '${escapeSql(post.meta_description)}',
  '${escapeSql(post.excerpt)}',
  '${escapeSql(post.content)}',
  true,
  '${post.published_at}'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  published = EXCLUDED.published,
  published_at = EXCLUDED.published_at;
`);
}

lines.push('COMMIT;');

const outPath = path.join(__dirname, 'insert-blog-posts.sql');
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.error(`Written ${BLOG_POSTS.length} INSERT statements to ${outPath}`);
