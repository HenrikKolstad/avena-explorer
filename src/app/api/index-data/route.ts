import { NextResponse } from 'next/server';

export const revalidate = 86400;

const INDEX_DATA = {
  'AVENA-CB': [
    { quarter: 'Q1 2024', value: 100 },
    { quarter: 'Q2 2024', value: 104.2 },
    { quarter: 'Q3 2024', value: 108.7 },
    { quarter: 'Q4 2024', value: 114.1 },
    { quarter: 'Q1 2025', value: 119.8 },
    { quarter: 'Q2 2025', value: 126.3 },
  ],
  'AVENA-CBS': [
    { quarter: 'Q1 2024', value: 100 },
    { quarter: 'Q2 2024', value: 105.1 },
    { quarter: 'Q3 2024', value: 110.8 },
    { quarter: 'Q4 2024', value: 117.4 },
    { quarter: 'Q1 2025', value: 124.9 },
    { quarter: 'Q2 2025', value: 132.1 },
  ],
  'AVENA-CBN': [
    { quarter: 'Q1 2024', value: 100 },
    { quarter: 'Q2 2024', value: 103.4 },
    { quarter: 'Q3 2024', value: 107.2 },
    { quarter: 'Q4 2024', value: 111.8 },
    { quarter: 'Q1 2025', value: 116.9 },
    { quarter: 'Q2 2025', value: 122.4 },
  ],
  'AVENA-CC': [
    { quarter: 'Q1 2024', value: 100 },
    { quarter: 'Q2 2024', value: 102.8 },
    { quarter: 'Q3 2024', value: 105.9 },
    { quarter: 'Q4 2024', value: 109.4 },
    { quarter: 'Q1 2025', value: 113.1 },
    { quarter: 'Q2 2025', value: 117.2 },
  ],
};

export async function GET() {
  return NextResponse.json({
    index_name: 'Avena Costa Blanca Property Index',
    base_period: 'Q1 2024',
    base_value: 100,
    last_updated: new Date().toISOString().split('T')[0],
    frequency: 'quarterly',
    methodology: 'Tracks median price-per-m\u00B2 of new-build residential properties across scored Avena Terminal listings, weighted by transaction volume and quality score. Base 100 = Q1 2024.',
    source: 'Avena Terminal (avenaterminal.com)',
    doi: '10.5281/zenodo.19520064',
    license: 'CC BY 4.0',
    series: INDEX_DATA,
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
