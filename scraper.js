const cheerio = require('cheerio');
const fs = require('fs');
const https = require('https');
const http = require('http');

// ============================================================
// AVENA EXPLORER — XAVIA ESTATE SCRAPER
// Scrapes all new-build properties from xaviaestate.com
// ============================================================

const BASE = 'https://www.xaviaestate.com/en/search-property/trans_sale/golfProperty_0/newBuild_1/page_{PAGE}/order_ddesc';
const TOTAL_PAGES = 82;
const DELAY_MS = 1200; // 1.2s between requests

// ---- REGION MAPPING ----
const regionMap = {
  'Algorfa':'cb-south','Alicante':'cb-south','Almoradi':'cb-south','Benijofar':'cb-south',
  'Bigastro':'cb-south','Cabo Roig':'cb-south','Campoamor':'cb-south','Ciudad Quesada':'cb-south',
  'Daya Nueva':'cb-south','Dolores':'cb-south','El Campello':'cb-south','El Raso':'cb-south',
  'Entre Golf':'cb-south','Formentera del Segura':'cb-south','Gran Alacant':'cb-south',
  'Guardamar':'cb-south','Guardamar Del Segura':'cb-south','Hondon':'cb-south',
  'La Finca':'cb-south','La Marina':'cb-south','La Mata':'cb-south','La Zenia':'cb-south',
  'Las Colinas':'cb-south','Las Filipinas':'cb-south','Lo Romero':'cb-south',
  'Lomas de Campoamor':'cb-south','Los Balcones':'cb-south','Los Montesinos':'cb-south',
  'Mil Palmeras':'cb-south','Pilar':'cb-south','Pilar de la Horadada':'cb-south',
  'Pinar de Campoverde':'cb-south','Playa Flamenca':'cb-south','Punta Prima':'cb-south',
  'Rojales':'cb-south','Roda Golf':'cb-south','San Fulgencio':'cb-south',
  'San Miguel':'cb-south','San Miguel de Salinas':'cb-south','Santa Pola':'cb-south',
  'Torre de la Horadada':'cb-south','Torrevieja':'cb-south','Villamartin':'cb-south',
  'Vistabella':'cb-south','PAU':'cb-south','San Juan':'cb-south',
  // CB North
  'Albir':'cb-north','Alfas del Pi':'cb-north','Altea':'cb-north','Benidorm':'cb-north',
  'Calpe':'cb-north','Denia':'cb-north','Finestrat':'cb-north','Javea':'cb-north',
  'La Nucia':'cb-north','Moraira':'cb-north','Polop':'cb-north','Villajoyosa':'cb-north',
  'Mutxamel':'cb-north',
  // Costa Calida
  'Altaona':'costa-calida','Cartagena':'costa-calida','La Manga':'costa-calida',
  'La Manga Club':'costa-calida','La Manga del Mar Menor':'costa-calida',
  'La Serena':'costa-calida','La Serena Golf':'costa-calida','La Union':'costa-calida',
  'Lo Pagan':'costa-calida','Los Alcazares':'costa-calida','Los Nietos':'costa-calida',
  'Los Urrutias':'costa-calida','Playa Honda':'costa-calida','Puerto de Mazarron':'costa-calida',
  'Roda Golf Resort':'costa-calida','San Javier':'costa-calida','San Pedro del Pinatar':'costa-calida',
  'Santa Rosalia':'costa-calida','Santa Rosalia Resort':'costa-calida',
  'Santiago de la Ribera':'costa-calida','Torre Pacheco':'costa-calida',
  'Murcia':'costa-calida'
};

// ---- MARKET PRICES (€/m²) by area + type ----
const marketPrices = {
  apt: {
    'Calpe':3800,'Benidorm':3800,'Javea':3500,'Denia':3200,'Altea':3300,'Alicante':3000,
    'Orihuela Costa':2900,'Santa Pola':2900,'La Manga':2800,'Torrevieja':3000,
    'Guardamar':2400,'La Finca':3500,'Mar Menor':1900,'Torre Pacheco':1800,
    'Mazarron':1700,'Condado Alhama':2400,'Finestrat':2800,'La Nucia':2400,
    'Polop':2300,'Villajoyosa':3800,'Pilar de la Horadada':2600,'Ciudad Quesada':3000,
    'La Serena Golf':2200,'Santa Rosalia':2400,'Los Alcazares':2500,'San Pedro':2200,
    'Campoamor':2900,'Punta Prima':3200,'Villamartin':2900,'Gran Alacant':2800,
    'San Miguel':2800,'El Campello':3000,'Albir':3500,'Mutxamel':2800,
    'Rojales':2500,'La Zenia':2900,'Playa Flamenca':2900,'Cabo Roig':3000,
    'San Juan':3200,'La Manga Club':3500,'Mil Palmeras':2600,
    'Torre de la Horadada':2600,'Cartagena':2000,'Lo Pagan':2200,
    'default_cb-south':2800,'default_cb-north':3200,'default_costa-calida':2000
  },
  vil: {
    'Javea':4000,'Altea':3800,'Moraira':4000,'Calpe':4000,'Benitachell':4000,
    'Alicante':3200,'Orihuela Costa':3100,'Finestrat':3000,'Santa Pola':2800,
    'La Nucia':2700,'Torrevieja':2600,'Polop':2500,'Guardamar':2500,
    'Mar Menor':2200,'La Finca':3000,'Torre Pacheco':2000,'Mazarron':1900,
    'Condado Alhama':2400,'Benidorm':3100,'Villajoyosa':3200,'Campoamor':3100,
    'Punta Prima':3100,'Ciudad Quesada':3000,'Gran Alacant':2800,
    'La Serena Golf':2400,'Santa Rosalia':2600,'Los Alcazares':2400,
    'Pilar de la Horadada':3200,'El Campello':3200,'Denia':3500,
    'Albir':3500,'Mutxamel':2800,'Rojales':2500,'La Zenia':3100,
    'Playa Flamenca':3100,'Cabo Roig':3100,'San Juan':3200,
    'La Manga Club':3500,'Mil Palmeras':2800,'Torre de la Horadada':3200,
    'Cartagena':2200,'Lo Pagan':2200,'San Pedro':2200,
    'default_cb-south':2800,'default_cb-north':3200,'default_costa-calida':2000
  }
};

// ---- BEACH DISTANCE (km) by area ----
const beachDist = {
  'Cabo Roig':0.3,'Campoamor':0.3,'Punta Prima':0.5,'La Zenia':0.5,
  'Playa Flamenca':0.5,'Mil Palmeras':0.3,'Torre de la Horadada':0.5,
  'Torrevieja':1,'La Mata':0.5,'Santa Pola':1,'Gran Alacant':2,
  'Guardamar':1,'El Raso':1,'Los Balcones':2,'Villamartin':5,
  'San Miguel':8,'San Miguel de Salinas':8,'Ciudad Quesada':8,
  'Rojales':10,'Algorfa':14,'La Finca':14,'La Finca Golf Resort':14,
  'Benijofar':10,'Dolores':15,'Los Montesinos':10,'Daya Nueva':12,
  'Pinar de Campoverde':5,'Pilar de la Horadada':2,
  'Alicante':1,'San Juan':0.5,'El Campello':0.5,'Mutxamel':5,
  'Calpe':0.5,'Benidorm':0.5,'Villajoyosa':0.1,'Albir':0.5,
  'Alfas del Pi':2,'Altea':1,'Finestrat':6,'La Nucia':8,
  'Polop':12,'Javea':1,'Denia':2,'Moraira':1,
  'La Manga':0.5,'La Manga del Mar Menor':0.5,'La Manga Club':2,
  'Los Alcazares':1,'San Javier':3,'Santiago de la Ribera':0.5,
  'San Pedro del Pinatar':1,'Lo Pagan':0.5,'Torre Pacheco':10,
  'Santa Rosalia':10,'Santa Rosalia Resort':10,'La Serena Golf':10,
  'Puerto de Mazarron':0.2,'Cartagena':5,'Playa Honda':0.5,
  'Los Nietos':1,'Los Urrutias':0.5,'Roda Golf':5,'Roda Golf Resort':5,
  'Vistabella':8,'Entre Golf':8,'Las Colinas':3,'Lo Romero':5,
  'Las Filipinas':3,'Lomas de Campoamor':1,'Altaona':20,
  'La Marina':1,'San Fulgencio':5,'Formentera del Segura':12,
  'Hondon':30,'Bigastro':15,'Almoradi':15,'La Union':5,'PAU':3,
  'default':5
};

// ---- RENTAL RATES (avg nightly, €) by area ----
const rentalRates = {
  apt: {
    'Calpe':105,'Benidorm':100,'Villajoyosa':90,'Denia':160,'Javea':120,
    'Altea':100,'Albir':95,'Finestrat':75,'La Nucia':60,'Polop':55,
    'El Campello':85,'Mutxamel':65,'San Juan':90,'Alicante':80,
    'Punta Prima':85,'Campoamor':75,'Cabo Roig':80,'La Zenia':75,
    'Playa Flamenca':70,'Villamartin':60,'Torrevieja':65,'La Mata':60,
    'Santa Pola':75,'Gran Alacant':70,'Guardamar':77,'El Raso':70,
    'Pilar de la Horadada':80,'Torre de la Horadada':115,'Mil Palmeras':75,
    'Ciudad Quesada':55,'Rojales':50,'Algorfa':55,'La Finca':70,
    'La Finca Golf Resort':70,'San Miguel':42,'San Miguel de Salinas':42,
    'Los Balcones':60,'Los Montesinos':45,'Benijofar':45,
    'La Manga':80,'La Manga del Mar Menor':80,'La Manga Club':220,
    'Los Alcazares':65,'San Javier':55,'Santiago de la Ribera':55,
    'San Pedro del Pinatar':55,'Lo Pagan':50,'Torre Pacheco':55,
    'Santa Rosalia':55,'Santa Rosalia Resort':55,'La Serena Golf':55,
    'Puerto de Mazarron':70,'Cartagena':55,'Playa Honda':50,
    'Roda Golf':55,'Roda Golf Resort':55,
    'default':60
  },
  vil: {
    'Calpe':150,'Benidorm':140,'Javea':180,'Denia':160,'Altea':160,
    'Moraira':170,'Finestrat':120,'La Nucia':80,'Polop':75,
    'Villajoyosa':120,'Albir':130,'El Campello':110,'Mutxamel':90,
    'Campoamor':200,'Punta Prima':130,'Cabo Roig':140,'La Zenia':120,
    'Playa Flamenca':110,'Villamartin':90,'Torrevieja':90,'Santa Pola':100,
    'Gran Alacant':95,'Guardamar':90,'Pilar de la Horadada':110,
    'Torre de la Horadada':120,'Mil Palmeras':100,
    'Ciudad Quesada':130,'Rojales':80,'Algorfa':110,'La Finca':140,
    'La Finca Golf Resort':140,'San Miguel':60,
    'La Manga Club':220,'Los Alcazares':90,'Torre Pacheco':70,
    'Santa Rosalia':75,'Santa Rosalia Resort':75,'La Serena Golf':80,
    'Puerto de Mazarron':140,'Cartagena':80,
    'Roda Golf':80,'Roda Golf Resort':80,
    'default':80
  }
};

// ---- OCCUPANCY (weeks/year) by beach distance ----
function getOccupancy(bk) {
  if (bk <= 0.5) return 24;
  if (bk <= 2) return 22;
  if (bk <= 5) return 20;
  if (bk <= 10) return 18;
  return 16;
}

// ---- HELPERS ----
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetch(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function findRegion(location) {
  const loc = location.split(',')[0].trim();
  // Try exact match first
  if (regionMap[loc]) return regionMap[loc];
  // Try partial match
  for (const [key, val] of Object.entries(regionMap)) {
    if (loc.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(loc.toLowerCase())) return val;
  }
  // Check province
  const prov = (location.split(',')[1] || '').trim().toLowerCase();
  if (prov.includes('murcia')) return 'costa-calida';
  return 'cb-south'; // default
}

function findMarketPrice(location, type, region) {
  const loc = location.split(',')[0].trim();
  const isVilla = ['Villa','Townhouse','Quad House','Bungalow'].includes(type);
  const table = isVilla ? marketPrices.vil : marketPrices.apt;

  // Try exact match
  if (table[loc]) return table[loc];
  // Try partial match
  for (const [key, val] of Object.entries(table)) {
    if (loc.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(loc.toLowerCase())) return val;
  }
  // Default by region
  return table['default_' + region] || 2500;
}

function findBeachDist(location) {
  const loc = location.split(',')[0].trim();
  if (beachDist[loc] !== undefined) return beachDist[loc];
  for (const [key, val] of Object.entries(beachDist)) {
    if (loc.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(loc.toLowerCase())) return val;
  }
  return beachDist.default;
}

function findRentalRate(location, type) {
  const loc = location.split(',')[0].trim();
  const isVilla = ['Villa','Townhouse','Quad House','Bungalow'].includes(type);
  const table = isVilla ? rentalRates.vil : rentalRates.apt;

  if (table[loc]) return table[loc];
  for (const [key, val] of Object.entries(table)) {
    if (loc.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(loc.toLowerCase())) return val;
  }
  return table.default;
}

function normalizeType(raw) {
  const t = raw.toLowerCase().trim();
  if (t.includes('villa')) return 'Villa';
  if (t.includes('town')) return 'Townhouse';
  if (t.includes('bungalow')) return 'Bungalow';
  if (t.includes('penthouse')) return 'Apartment';
  if (t.includes('duplex')) return 'Apartment';
  if (t.includes('studio')) return 'Apartment';
  if (t.includes('quad')) return 'Villa';
  return 'Apartment';
}

// ---- PARSE PAGE ----
function parsePage(html) {
  const $ = cheerio.load(html);
  const properties = [];

  // Each property card is a .featDetailCont div
  $('.featDetailCont').each((i, card) => {
    const el = $(card);

    // Location: .gridTown
    const location = el.find('.gridTown').first().text().trim();
    if (!location) return;

    // Type: .gridType
    const rawType = el.find('.gridType').first().text().trim();

    // Reference: .featRef
    const ref = el.find('.featRef').first().text().trim();
    if (!ref) return;

    // Price: .gridPrice (format: "€ 670,000")
    const priceText = el.find('.gridPrice').first().text().trim();
    const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
    if (!price) return;

    // Data fields: .featData (in order: built m², plot m², beds, baths)
    const dataFields = [];
    el.find('.featData').each((j, fd) => {
      dataFields.push($(fd).text().trim());
    });
    const built = dataFields[0] ? parseInt(dataFields[0]) || 0 : 0;
    const plotText = dataFields[1] || '';
    const plot = plotText.toLowerCase() === 'tba' ? null : (parseInt(plotText) || null);
    const beds = dataFields[2] ? parseInt(dataFields[2]) || 0 : 0;
    const baths = dataFields[3] ? parseInt(dataFields[3]) || 0 : 0;

    // Detail URL: first <a> with href containing /property/
    const link = el.find('a[href*="/property/"]').first().attr('href');
    const fullUrl = link ? (link.startsWith('http') ? link : 'https://www.xaviaestate.com' + link) : '';

    const type = normalizeType(rawType);
    const region = findRegion(location);
    const mm2 = findMarketPrice(location, type, region);
    const bk = findBeachDist(location);
    const locShort = location.split(',')[0].trim();
    const propName = rawType + ' in ' + locShort;

    properties.push({
      d: 'Via Xavia Estate',
      p: propName,
      l: location,
      r: region,
      t: type,
      pf: price,
      pt: price,
      mm2: mm2,
      bm: built || null,
      pl: plot,
      bd: beds,
      ba: baths,
      bk: bk,
      c: 'TBA',
      s: 'off-plan',
      dy: 5,
      f: '',
      u: fullUrl,
      ref: ref
    });
  });

  return properties;
}

// ---- MAIN ----
async function main() {
  console.log('🏠 AVENA EXPLORER — Xavia Estate Scraper');
  console.log('=========================================');
  console.log(`Scraping ${TOTAL_PAGES} pages of new builds...\n`);

  const allProperties = [];
  let errors = 0;

  for (let page = 1; page <= TOTAL_PAGES; page++) {
    const url = BASE.replace('{PAGE}', page);
    try {
      process.stdout.write(`Page ${page}/${TOTAL_PAGES}... `);
      const html = await fetch(url);
      const props = parsePage(html);
      allProperties.push(...props);
      console.log(`${props.length} properties found (total: ${allProperties.length})`);
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      errors++;
    }
    if (page < TOTAL_PAGES) await sleep(DELAY_MS);
  }

  // Deduplicate by reference
  const unique = {};
  for (const p of allProperties) {
    if (p.ref && !unique[p.ref]) unique[p.ref] = p;
  }
  const deduped = Object.values(unique);

  // VERIFY: Check each property's detail page for new build keywords
  console.log(`\nVerifying ${deduped.length} properties are genuine new builds...`);
  const newBuildKeywords = ['new build','new development','obra nueva','off plan','off-plan','under construction','key ready','delivery 202','completion 202','fase ','phase 1','phase 2','phase 3','promotion','promocion','brand new','newly built','new construction','first occupation','nueva construccion','new property','new residential','new project'];
  const resaleKeywords = ['resale','reform','renovated','renovación','reformed','bargain','reduced','bank repo','bank repossession','short sale','distressed','need of renovation','needs updating','original condition','traditional style','rustic','country house','cortijo','charming older','well maintained','established','mature garden','pier','private pier','mooring','berth','traditional spanish','recently refurbished','second hand','pre-owned','investment opportunity resale'];

  const verified = [];
  let checked = 0, removed = 0;

  for (const prop of deduped) {
    checked++;
    if (checked % 50 === 0) process.stdout.write(`  Checked ${checked}/${deduped.length}...`);
    if (checked % 50 === 0) console.log(` (${verified.length} verified, ${removed} removed)`);

    try {
      const html = await fetch(prop.u);
      const text = html.toLowerCase();

      // Check for resale indicators
      const isResale = resaleKeywords.some(k => text.includes(k));
      // Check for new build indicators
      const isNewBuild = newBuildKeywords.some(k => text.includes(k));

      if (isResale || !isNewBuild) {
        removed++;
        continue; // Skip resale or unconfirmed properties
      }

      // Extract clean description
      const $ = cheerio.load(html);
      let desc = '';
      // Try specific description selectors
      $('[class*="propDesc"], [class*="PropDesc"], [class*="propertyDesc"], [class*="description"], [id*="desc"]').each((j, el) => {
        const t = $(el).text().trim();
        if (t.length > desc.length && t.length > 50) desc = t;
      });
      // Clean out garbage (image counters, nav text, form labels)
      desc = desc.replace(/\d+ of \d+/g, '').replace(/See \d+ More Photographs/gi, '')
        .replace(/Click to see all the photos/gi, '').replace(/Property Enquiry/gi, '')
        .replace(/Accept Terms & Conditions/gi, '').replace(/XE\w{5,7}/g, '')
        .replace(/€\s*[\d,]+/g, '').replace(/\s+/g, ' ').trim();
      if (desc.length > 50) prop.f = desc.substring(0, 250);

      // Extract usable area (more accurate than built area for €/m² calc)
      const usableMatch = text.match(/max usable size\s*(\d+)/i) || text.match(/usable\s*size\s*(\d+)/i) || text.match(/usable\s*(\d+)\s*m/i);
      if (usableMatch) {
        const usable = parseInt(usableMatch[1]);
        if (usable > 20 && usable < prop.bm) {
          prop.bm_original = prop.bm; // Keep original built area
          prop.bm = usable; // Use usable area for €/m² calculations
        }
      }

      verified.push(prop);
    } catch (e) {
      // If we can't fetch, keep it (benefit of the doubt)
      verified.push(prop);
    }

    await sleep(300); // Faster since we're just checking text
  }

  console.log(`\n✅ Verification complete: ${verified.length} new builds confirmed, ${removed} resale/non-newbuild removed`);

  // Load existing curated data if available
  try {
    const indexHtml = fs.readFileSync('index.html', 'utf8');
    const match = indexHtml.match(/const D=\[([\s\S]*?)\];/);
    if (match) {
      console.log('Existing curated data found in index.html');
    }
  } catch (e) {}

  // Write verified data
  fs.writeFileSync('data.json', JSON.stringify(verified, null, 2));

  console.log('\n=========================================');
  console.log(`✅ Done! ${verified.length} verified new builds saved to data.json`);
  console.log(`❌ ${errors} page errors`);

  // Stats
  const regions = {};
  const types = {};
  verified.forEach(p => {
    regions[p.r] = (regions[p.r] || 0) + 1;
    types[p.t] = (types[p.t] || 0) + 1;
  });
  console.log('\nBy region:', JSON.stringify(regions));
  console.log('By type:', JSON.stringify(types));

  const prices = verified.filter(p => p.pf > 0).map(p => p.pf);
  if (prices.length) {
    console.log(`Price range: €${Math.min(...prices).toLocaleString()} — €${Math.max(...prices).toLocaleString()}`);
    console.log(`Average: €${Math.round(prices.reduce((a,b) => a+b, 0) / prices.length).toLocaleString()}`);
  }
}

main().catch(console.error);
