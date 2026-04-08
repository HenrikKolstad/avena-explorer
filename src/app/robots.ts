import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/developer', '/api/'] },
    ],
    sitemap: 'https://www.avena-estate.com/sitemap.xml',
  };
}
