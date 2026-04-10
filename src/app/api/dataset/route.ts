import { NextResponse } from 'next/server';
import { getAllProperties, getUniqueTowns, getUniqueCostas } from '@/lib/properties';

export async function GET() {
  const properties = getAllProperties();
  const towns = getUniqueTowns();
  const costas = getUniqueCostas();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Spanish New Build Property Dataset 2026',
    alternateName: 'Avena Terminal Property Dataset',
    description: `Structured dataset of ${properties.length.toLocaleString()} new build properties across coastal Spain (Costa Blanca, Costa Calida, Costa del Sol). Includes asking prices, price per square metre, estimated rental yields, investment scores, property specifications, developer data, GPS coordinates, and 24 data points per listing. Updated daily via automated XML feed ingestion.`,
    url: 'https://avenaterminal.com/dataset',
    identifier: 'https://avenaterminal.com/dataset',
    license: 'https://avenaterminal.com/terms',
    isAccessibleForFree: false,
    dateModified: new Date().toISOString().split('T')[0],
    datePublished: '2026-01-15',
    creator: {
      '@type': 'Organization',
      name: 'Avena Terminal',
      url: 'https://avenaterminal.com',
      logo: 'https://avenaterminal.com/logo.png',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Avena Terminal',
      url: 'https://avenaterminal.com',
    },
    keywords: [
      'Spanish property data',
      'new build Spain',
      'Costa Blanca property prices',
      'Costa del Sol property prices',
      'Costa Calida property prices',
      'rental yield Spain',
      'property investment data',
      'hedonic regression real estate',
      'PropTech dataset',
      'Spain real estate 2026',
    ],
    spatialCoverage: {
      '@type': 'Place',
      name: 'Coastal Spain',
      geo: {
        '@type': 'GeoShape',
        box: '36.7 -5.4 38.9 0.5',
      },
      containedInPlace: {
        '@type': 'Country',
        name: 'Spain',
      },
    },
    temporalCoverage: '2025-01-01/..',
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'Asking Price', unitCode: 'EUR', description: 'Listed asking price in euros' },
      { '@type': 'PropertyValue', name: 'Price per m2', unitCode: 'EUR/m2', description: 'Price per square metre of built area' },
      { '@type': 'PropertyValue', name: 'Gross Rental Yield', unitCode: 'P1', description: 'Estimated gross annual rental yield as a percentage' },
      { '@type': 'PropertyValue', name: 'Investment Score', description: 'Composite 0-100 score from hedonic regression model' },
      { '@type': 'PropertyValue', name: 'Built Area', unitCode: 'MTK', description: 'Interior built area in square metres' },
      { '@type': 'PropertyValue', name: 'Beach Distance', unitCode: 'KMT', description: 'Straight-line distance to nearest beach in kilometres' },
    ],
    measurementTechnique: 'Hedonic regression with OLS estimation, town dummy variables, property-type controls, and premium multipliers for amenities. Model re-estimated monthly on rolling 12-month transaction data from Registradores de Espana.',
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: 'https://avenaterminal.com/api/dataset',
        name: 'Dataset JSON-LD',
      },
    ],
    size: `${properties.length} properties across ${towns.length} towns and ${costas.length} coastal regions`,
    includedInDataCatalog: {
      '@type': 'DataCatalog',
      name: 'Avena Terminal Data Catalog',
      url: 'https://avenaterminal.com/data/spain-property-index',
    },
  };

  return NextResponse.json(jsonLd, {
    headers: { 'Content-Type': 'application/json' },
  });
}
