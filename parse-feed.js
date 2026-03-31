const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

const FEED_URL = 'https://xml.redsp.net/files/915/89215pmi61h/ella-properties-spain-redsp_v4.xml';
const OUTPUT = 'public/data.json';

// Region mapping from costa field
function mapRegion(costa) {
  if (!costa) return 'cb-south';
  const c = costa.toLowerCase();
  if (c.includes('blanca south')) return 'cb-south';
  if (c.includes('blanca north')) return 'cb-north';
  if (c.includes('calida')) return 'costa-calida';
  if (c.includes('almeria')) return 'costa-almeria';
  if (c.includes('valencia')) return 'costa-valencia';
  return 'cb-south';
}

// Normalize property type
function mapType(type) {
  if (!type) return 'Apartment';
  const t = type.toLowerCase();
  if (t.includes('villa')) return 'Villa';
  if (t.includes('town') || t.includes('semi')) return 'Townhouse';
  if (t.includes('bungalow') || t.includes('quad')) return 'Bungalow';
  if (t.includes('penthouse') || t.includes('semi penthouse')) return 'Penthouse';
  if (t.includes('studio')) return 'Studio';
  return 'Apartment'; // apartment, ground floor apartment
}

// Market price lookup (€/m²) by town + type
const marketPrices = {
  'cb-south': { Apartment: 2800, Villa: 2600, Townhouse: 2700, Bungalow: 2500, Penthouse: 3200, Studio: 3000 },
  'cb-north': { Apartment: 3800, Villa: 3200, Townhouse: 3000, Bungalow: 3200, Penthouse: 4200, Studio: 3800 },
  'costa-calida': { Apartment: 1800, Villa: 1600, Townhouse: 1700, Bungalow: 1600, Penthouse: 2200, Studio: 2000 },
  'costa-almeria': { Apartment: 2000, Villa: 1800, Townhouse: 1900, Bungalow: 1800, Penthouse: 2400, Studio: 2200 },
  'costa-valencia': { Apartment: 2500, Villa: 2200, Townhouse: 2300, Bungalow: 2200, Penthouse: 3000, Studio: 2800 },
};

// Town-specific market overrides
const townMarket = {
  'Calpe': { Apartment: 4000, Villa: 3500 },
  'Benidorm': { Apartment: 3600, Villa: 3200 },
  'Altea': { Apartment: 4200, Villa: 3800 },
  'Moraira': { Apartment: 4500, Villa: 4000 },
  'Javea': { Apartment: 4200, Villa: 3800 },
  'Dénia': { Apartment: 3400, Villa: 3200 },
  'Finestrat': { Apartment: 3200, Villa: 2800 },
  'Villajoyosa': { Apartment: 3800, Villa: 3400 },
  'Torrevieja': { Apartment: 3000, Villa: 2600 },
  'Orihuela': { Apartment: 2900, Villa: 2800 },
  'Santa Pola': { Apartment: 2900, Villa: 2600 },
  'Guardamar': { Apartment: 2400, Villa: 2200 },
  'Algorfa': { Apartment: 2800, Villa: 2600 },
  'San Miguel de Salinas': { Apartment: 2800, Villa: 2500 },
  'Pilar de la Horadada': { Apartment: 2700, Villa: 2500 },
  'Los Alcázares': { Apartment: 2000, Villa: 1800 },
  'Torre Pacheco': { Apartment: 1800, Villa: 1600 },
  'Mazarrón': { Apartment: 2200, Villa: 2000 },
  'Águilas': { Apartment: 2200, Villa: 2000 },
  'Vera': { Apartment: 2200, Villa: 2000 },
};

function getMarketPrice(town, region, type) {
  // Check town-specific first
  if (town && townMarket[town]) {
    const simpleType = type === 'Penthouse' ? 'Apartment' : type === 'Bungalow' ? 'Apartment' : type === 'Studio' ? 'Apartment' : type === 'Townhouse' ? 'Villa' : type;
    if (townMarket[town][simpleType]) return townMarket[town][simpleType];
  }
  const regionPrices = marketPrices[region] || marketPrices['cb-south'];
  return regionPrices[type] || regionPrices['Apartment'];
}

function getStatus(prop) {
  if (prop.off_plan === 1 || prop.off_plan === '1') return 'off-plan';
  if (prop.key_ready === 1 || prop.key_ready === '1') return 'ready';
  return 'under-construction';
}

function getText(field) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (field.en) return field.en.toString().replace(/&#13;/g, '\n').trim();
  return '';
}

function getImages(prop) {
  if (!prop.images || !prop.images.image) return [];
  const imgs = Array.isArray(prop.images.image) ? prop.images.image : [prop.images.image];
  return imgs.map(img => img.url).filter(Boolean).slice(0, 15);
}

function parseProperty(prop) {
  const town = prop.address?.town || '';
  const province = prop.address?.province || '';
  const costa = prop.costa || '';
  const region = mapRegion(costa);
  const type = mapType(prop.type);
  const price = parseInt(prop.price) || 0;
  const priceTo = parseInt(prop.price_to) || 0;
  const builtM2 = parseInt(prop.surface_area?.built_m2) || 0;
  const usableM2 = parseInt(prop.surface_area?.usable_living_area_m2) || 0;
  const plotM2 = parseInt(prop.surface_area?.plot_m2) || 0;
  const terraceM2 = parseInt(prop.surface_area?.terrace_m2) || 0;
  const solariumM2 = parseInt(prop.surface_area?.solarium_area_m2) || 0;
  const beds = parseInt(prop.beds) || 0;
  const baths = parseInt(prop.baths) || 0;
  const beachM = parseInt(prop.distances?.distance_to_beach_m) || 0;
  const beachKm = beachM > 0 ? +(beachM / 1000).toFixed(1) : null;
  const lat = parseFloat(prop.location?.latitude) || null;
  const lng = parseFloat(prop.location?.longitude) || null;
  const mm2 = getMarketPrice(town, region, type);
  const area = usableM2 > 0 ? usableM2 : builtM2; // prefer usable area

  if (price <= 0 || area <= 0) return null;

  const title = getText(prop.title);
  const desc = getText(prop.desc);
  const images = getImages(prop);

  // Delivery date
  let completion = 'TBA';
  if (prop.delivery_date) {
    const d = prop.delivery_date.toString();
    if (d.length >= 7) {
      const [y, m] = d.split('-');
      const quarter = Math.ceil(parseInt(m) / 3);
      completion = `${y}-Q${quarter}`;
    }
  }

  // Categories
  const categories = [];
  if (prop.category?.golf == 1) categories.push('golf');
  if (prop.category?.beach == 1) categories.push('beach');
  if (prop.category?.urban == 1) categories.push('urban');
  if (prop.category?.countryside == 1) categories.push('countryside');
  if (prop.category?.first_line == 1) categories.push('frontline');

  // Views
  const views = [];
  if (prop.views?.sea_views == 1) views.push('sea');
  if (prop.views?.mountain_views == 1) views.push('mountain');
  if (prop.views?.pool_views == 1) views.push('pool');
  if (prop.views?.garden_views == 1) views.push('garden');
  if (prop.views?.open_views == 1) views.push('open');

  return {
    d: 'Via Xavia Estate',
    p: title || `${type} in ${town}`,
    l: province ? `${town}, ${province}` : town,
    r: region,
    t: type,
    pf: price,
    pt: priceTo > 0 ? priceTo : price,
    mm2,
    bm: area,
    bm_full: builtM2,
    terrace: terraceM2,
    solarium: solariumM2,
    pl: plotM2 > 0 ? plotM2 : null,
    bd: beds,
    ba: baths,
    bk: beachKm,
    c: completion,
    s: getStatus(prop),
    dy: 0,
    f: desc.substring(0, 400),
    u: `https://www.xaviaestate.com/en/property/${prop.ref || prop.id}/`,
    ref: prop.ref || prop.id,
    dev_ref: prop.development_ref || null,
    imgs: images,
    lat, lng,
    cats: categories,
    views,
    energy: prop.energy_rating?.consumption || null,
    parking: parseInt(prop.parking?.number_of_parking_spaces) || 0,
    pool: prop.pools?.private_pool == 1 ? 'private' : prop.pools?.communal_pool == 1 ? 'communal' : prop.pools?.pool == 1 ? 'yes' : 'no',
    costa: costa,
  };
}

async function main() {
  console.log('Downloading XML feed...');
  const res = await fetch(FEED_URL);
  const xml = await res.text();
  console.log(`Downloaded ${(xml.length / 1024 / 1024).toFixed(1)}MB`);

  console.log('Parsing XML...');
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });
  const data = parser.parse(xml);

  const properties = Array.isArray(data.root.property) ? data.root.property : [data.root.property];
  console.log(`Found ${properties.length} properties in feed`);

  // Filter new builds only + Costa Blanca & Calida only (no Almería, Valencia)
  const allowedCostas = ['costa blanca south', 'costa blanca north', 'costa calida', 'costa blanca south - inland', 'costa blanca north - inland'];
  const parsed = properties
    .filter(p => p.new_build == 1)
    .filter(p => {
      const costa = (p.costa || '').toLowerCase();
      return allowedCostas.some(c => costa.includes(c.split(' - ')[0]) || c.includes(costa));
    })
    .map(parseProperty)
    .filter(Boolean);

  console.log(`Parsed ${parsed.length} new-build properties`);

  // Deduplicate by ref
  const seen = new Set();
  const unique = parsed.filter(p => {
    if (seen.has(p.ref)) return false;
    seen.add(p.ref);
    return true;
  });

  console.log(`${unique.length} unique properties after dedup`);

  // Stats
  const regions = {};
  const types = {};
  unique.forEach(p => {
    regions[p.r] = (regions[p.r] || 0) + 1;
    types[p.t] = (types[p.t] || 0) + 1;
  });
  console.log('By region:', regions);
  console.log('By type:', types);
  console.log(`With images: ${unique.filter(p => p.imgs.length > 0).length}`);
  console.log(`With GPS: ${unique.filter(p => p.lat && p.lng).length}`);

  fs.writeFileSync(OUTPUT, JSON.stringify(unique, null, 0));
  console.log(`Wrote ${OUTPUT} (${(fs.statSync(OUTPUT).size / 1024).toFixed(0)}KB)`);
}

main().catch(console.error);
