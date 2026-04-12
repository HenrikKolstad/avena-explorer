import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deal Alerts — Natural Language Property Alerts | Avena Terminal',
  description: 'Set deal alerts in plain English. Describe your ideal Spanish property and get emailed the moment it appears. Powered by AI parsing and live market data.',
  openGraph: {
    title: 'Deal Alerts — Natural Language Property Alerts | Avena Terminal',
    description: 'Set deal alerts in plain English. Describe your ideal Spanish property and get emailed the moment it appears.',
    url: 'https://avenaterminal.com/alerts',
    siteName: 'Avena Terminal',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

export default function AlertsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
