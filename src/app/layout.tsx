import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { getStructuredData } from "./structured-data";

export const metadata: Metadata = {
  title: "Avena Terminal — Spain Property Investment Terminal",
  verification: { google: "197e3d48f8d51384" },
  description: "Spain's first PropTech/Fintech terminal. 1,040+ new builds ranked in real-time. Save up to 35% on new builds in Costa Blanca & Costa Cálida.",
  metadataBase: new URL("https://www.avena-estate.com"),
  keywords: ['Spain new builds', 'Costa Blanca property', 'Costa del Sol investment', 'new build Spain 2025', 'Spanish property investment', 'proptech Spain', 'rental yield Spain', 'Marbella new builds', 'Alicante new builds'],
  openGraph: {
    title: "Avena Terminal — Spain's First PropTech Terminal",
    description: "1,040+ new builds ranked in real-time. Save up to 35% vs market price. Deal scoring, rental yield & luxury segment analysis.",
    url: "https://avena-estate.com",
    siteName: "Avena Terminal",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Avena Terminal" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Avena Terminal — Spain's First PropTech Terminal",
    description: "1,040+ new builds ranked in real-time. Save up to 35% vs market price.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getStructuredData()) }}
        />
      </head>
      <body className="bg-gray-950 text-gray-100 antialiased">
        <LanguageProvider><AuthProvider>{children}</AuthProvider></LanguageProvider>
      </body>
    </html>
  );
}
