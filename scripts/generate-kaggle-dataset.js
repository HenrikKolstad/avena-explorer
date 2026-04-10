const fs = require('fs');
const path = require('path');

// Load and process data
const raw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'data.json'), 'utf8'));

// Anonymize and sample 500 properties
const sample = raw
  .sort(() => Math.random() - 0.5)
  .slice(0, 500)
  .map(p => ({
    region: p.r,
    town: p.l,
    type: p.t,
    price: p.pf,
    beds: p.bd,
    baths: p.ba,
    m2: p.bm,
    price_per_m2: p.bm > 0 ? Math.round(p.pf / p.bm) : null,
    pool: p.pool || null,
    beach_km: p.bk,
    status: p.s,
  }));

fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'kaggle', 'avena-spain-property-2026.json'),
  JSON.stringify(sample, null, 2)
);
console.log(`Generated ${sample.length} records`);
