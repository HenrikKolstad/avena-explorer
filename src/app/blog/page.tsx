import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Spain Property Investment Blog | Avena Estate',
  description: 'Weekly insights on Spanish new build investment, rental yields, Costa Blanca & Costa del Sol market analysis.',
  openGraph: {
    title: 'Spain Property Investment Blog | Avena Estate',
    description: 'Weekly insights on Spanish new build investment, rental yields, and market analysis.',
    url: 'https://avena-estate.com/blog',
    siteName: 'Avena Estate',
    type: 'website',
  },
};

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string;
}

export const revalidate = 60;

async function getPosts(): Promise<BlogPost[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('blogs')
    .select('id, slug, title, excerpt, cover_image, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false });
  if (error || !data) return [];
  return data;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <h1 className="text-xl font-bold font-serif tracking-[0.15em] bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">AVENA</h1>
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">← Back to Terminal</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Investment Blog</h1>
        <p className="text-gray-400 mb-10">Weekly insights on Spanish new build investment and market analysis.</p>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-white mb-2">Coming soon</h2>
            <p className="text-gray-500">Weekly investment insights — launching shortly.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <article className="bg-gray-900 rounded-2xl overflow-hidden hover:bg-gray-800/80 transition-colors">
                  {post.cover_image && (
                    <div className="aspect-[3/1] overflow-hidden">
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <time className="text-xs text-gray-500 mb-2 block">
                      {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{post.title}</h2>
                    {post.excerpt && <p className="text-gray-400 text-sm line-clamp-2">{post.excerpt}</p>}
                    <span className="inline-block mt-4 text-amber-400 text-sm font-semibold">Read more →</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-gray-600 text-xs">
        © 2026 Avena Estate · <a href="https://avena-estate.com" className="text-gray-500 hover:text-gray-300">avena-estate.com</a>
      </footer>
    </div>
  );
}
