import { Metadata } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  meta_description: string | null;
  content: string | null;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string;
}

export const revalidate = 60;

async function getPost(slug: string): Promise<BlogPost | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post Not Found | Avena Estate' };

  return {
    title: `${post.title} | Avena Estate Blog`,
    description: post.meta_description || post.excerpt || '',
    openGraph: {
      title: post.title,
      description: post.meta_description || post.excerpt || '',
      url: `https://avena-estate.com/blog/${post.slug}`,
      siteName: 'Avena Estate',
      images: post.cover_image ? [{ url: post.cover_image, width: 1200, height: 630 }] : [],
      type: 'article',
      publishedTime: post.published_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.meta_description || post.excerpt || '',
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export async function generateStaticParams() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('blogs')
    .select('slug')
    .eq('published', true);
  return (data ?? []).map((row) => ({ slug: row.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-amber-400 hover:text-amber-300 font-semibold">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <h1 className="text-xl font-bold font-serif tracking-[0.15em] bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">AVENA</h1>
          </Link>
          <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">← Back to Blog</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Title & Date */}
        <time className="text-sm text-gray-500 mb-3 block">
          {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </time>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">{post.title}</h1>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="aspect-[2/1] rounded-2xl overflow-hidden mb-10">
            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Markdown Content */}
        <article className="prose prose-invert prose-amber max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-amber-400 prose-strong:text-white prose-li:text-gray-300 prose-blockquote:border-amber-500 prose-blockquote:text-gray-400 prose-code:text-amber-300 prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
          <ReactMarkdown>{post.content || ''}</ReactMarkdown>
        </article>

        {/* CTA */}
        <div className="mt-16 py-10 border-t border-gray-800 text-center">
          <h2 className="text-xl font-bold text-white mb-3">Find the best deals in Spain</h2>
          <p className="text-gray-400 text-sm mb-6">1,800+ new builds ranked by investment score, rental yield, and value.</p>
          <a
            href="https://avena-estate.com"
            className="inline-block px-8 py-3 rounded-xl font-bold text-black text-sm shadow-lg hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c96a)' }}
          >
            Explore Avena Terminal →
          </a>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-gray-600 text-xs">
        © 2026 Avena Estate · <a href="https://avena-estate.com" className="text-gray-500 hover:text-gray-300">avena-estate.com</a>
      </footer>
    </div>
  );
}
