import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Semantic Search — Find Properties by Description | Avena Terminal',
  description:
    'Use natural language to search Spanish new-build properties. Describe your ideal home and our AI finds the best matches from 1,000+ developments.',
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
