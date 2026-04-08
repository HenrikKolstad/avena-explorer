export function getStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Avena Terminal',
    url: 'https://www.avena-estate.com',
    description: "Spain's first PropTech terminal. 1,800+ new builds ranked in real-time across Costa Blanca, Costa Cálida and Costa del Sol.",
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: 'https://www.avena-estate.com/?q={search_term_string}' },
      'query-input': 'required name=search_term_string',
    },
  };
}
