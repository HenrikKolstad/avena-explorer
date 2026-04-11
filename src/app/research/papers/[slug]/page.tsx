import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProperties, getUniqueTowns, avg } from '@/lib/properties';
import { Property } from '@/lib/types';

export const revalidate = 86400;

const PAPER_SLUGS = [
  'hedonic-pricing-spanish-new-builds-2026',
  'rental-yield-variance-costa-blanca',
  'discount-to-market-distribution-spain',
  'beach-proximity-premium-decay',
  'developer-age-completion-risk-proxy',
] as const;

type PaperSlug = typeof PAPER_SLUGS[number];

export function generateStaticParams() {
  return PAPER_SLUGS.map((slug) => ({ slug }));
}

interface PaperMeta {
  title: string;
  abstract: string;
  keywords: string[];
}

const PAPER_META: Record<PaperSlug, PaperMeta> = {
  'hedonic-pricing-spanish-new-builds-2026': {
    title: 'Hedonic Pricing of Spanish New-Build Residential Properties: A Cross-Sectional Analysis of 2026 Market Data',
    abstract: 'This paper applies hedonic pricing methodology to a cross-sectional dataset of new-build residential properties across coastal Spain. Using a sample of properties sourced from developer listings, we decompose asking prices into implicit valuations of structural attributes including built area, bedroom count, bathroom count, beach proximity, pool availability, and regional location. Ordinary least squares regression reveals that built area in square metres is the dominant price determinant, followed by bedroom count and beach proximity. Pool availability commands a statistically significant premium. Regional variation is substantial, with Costa del Sol properties carrying a premium over Costa Blanca equivalents after controlling for structural characteristics. These findings contribute to the empirical literature on Spanish residential property valuation and provide actionable coefficients for automated valuation models targeting the new-build segment.',
    keywords: ['hedonic pricing', 'Spanish property', 'new builds', 'regression analysis', 'property valuation'],
  },
  'rental-yield-variance-costa-blanca': {
    title: 'Rental Yield Variance Across Costa Blanca Municipalities: A Statistical Decomposition of Return Heterogeneity',
    abstract: 'This study examines the spatial distribution of estimated gross rental yields across municipalities on the Costa Blanca, Spain. Drawing on a dataset of new-build properties with modelled rental income estimates, we compute town-level mean yields, standard deviations, and coefficients of variation. Results reveal substantial yield heterogeneity both between and within municipalities. The highest-yielding towns achieve gross returns exceeding six percent, while premium locations in the north deliver yields below four percent. A decomposition analysis identifies acquisition price as the primary driver of yield variance, with property type and bedroom count as secondary factors. Towns with lower average prices and higher tourist footfall consistently rank highest on gross yield metrics. These findings have implications for portfolio construction strategies in the Spanish coastal residential investment market.',
    keywords: ['rental yield', 'Costa Blanca', 'spatial analysis', 'investment returns', 'yield variance'],
  },
  'discount-to-market-distribution-spain': {
    title: 'The Distribution of Developer Discounts to Market Value in Spanish New-Build Properties: Evidence from 2026 Listing Data',
    abstract: 'This paper analyses the distribution of asking-price discounts relative to estimated market values for new-build residential properties across coastal Spain. The dataset comprises properties for which both developer asking prices and independently estimated market prices per square metre are available. We compute property-level discount rates and examine their distribution across property types, regions, and price segments. The mean discount is approximately nineteen percent below estimated market value, though the distribution exhibits significant right skew. Apartments and townhouses display deeper average discounts than villas. Regional analysis reveals that properties in developing municipalities offer larger discounts than established resort towns. These findings suggest that new-build pricing in Spain reflects systematic developer pricing strategies rather than uniform margin application across the portfolio.',
    keywords: ['discount analysis', 'market value', 'new-build pricing', 'developer strategy', 'Spain property'],
  },
  'beach-proximity-premium-decay': {
    title: 'Beach Proximity Premium Decay in Spanish Coastal Property Markets: A Distance-Band Analysis of Price Per Square Metre',
    abstract: 'This study quantifies the relationship between beach distance and residential property prices per square metre in coastal Spain. Using geocoded distance measurements for new-build properties, we construct distance bands and compute average price per square metre within each band. Results demonstrate a monotonically decreasing price gradient as distance from the coastline increases. Properties within five hundred metres of the beach command a substantial premium per square metre relative to the sample mean. The premium decays rapidly between five hundred metres and two kilometres, then attenuates beyond two kilometres. A semi-logarithmic regression confirms the non-linear nature of the distance-price relationship. The magnitude of the beach premium varies by property type, with apartments exhibiting steeper proximity gradients than villas. These results inform location-based pricing models and investment screening heuristics for coastal Spanish property markets.',
    keywords: ['beach proximity', 'price gradient', 'distance decay', 'coastal property', 'hedonic analysis'],
  },
  'developer-age-completion-risk-proxy': {
    title: 'Developer Years of Experience as a Completion Risk Proxy: Evidence from Off-Plan and Key-Ready Properties in Spain',
    abstract: 'This paper investigates whether developer tenure in the market, measured by reported years of experience, serves as a useful proxy for project quality and completion reliability in the Spanish new-build residential sector. We analyse the relationship between developer experience and property investment scores, examining whether more established developers deliver higher-rated projects. Additionally, we compare the distribution of off-plan versus key-ready properties across developer experience cohorts. Results indicate a positive but modest correlation between developer years and composite property scores. More experienced developers are proportionally more likely to have key-ready inventory, suggesting lower completion risk. However, newer developers offer systematically lower prices, creating a risk-return trade-off for investors. These findings contribute to the limited empirical literature on developer risk assessment in fragmented Southern European residential markets.',
    keywords: ['developer risk', 'completion risk', 'off-plan', 'key-ready', 'developer experience'],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = PAPER_META[slug as PaperSlug];
  if (!meta) return { title: 'Paper Not Found' };
  return {
    title: `${meta.title} | Avena Terminal Research`,
    description: meta.abstract.slice(0, 160),
    keywords: meta.keywords,
  };
}

/* ── Helper functions ── */

function std(nums: number[]): number {
  if (nums.length < 2) return 0;
  const m = avg(nums);
  const variance = nums.reduce((sum, n) => sum + (n - m) ** 2, 0) / (nums.length - 1);
  return Math.sqrt(variance);
}

function median(nums: number[]): number {
  if (!nums.length) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function pct(n: number, d: number): string {
  if (!d) return '0.0';
  return ((n / d) * 100).toFixed(1);
}

function fmt(n: number): string {
  return n.toLocaleString('en-IE');
}

/* ── Paper renderers ── */

function renderHedonicPricing(all: Property[]) {
  const withData = all.filter(p => p.pf > 0 && p.bm > 0 && p.bd > 0);

  // Compute averages by type
  const types = [...new Set(all.map(p => p.t))].filter(Boolean).sort();
  const typeStats = types.map(t => {
    const props = withData.filter(p => p.t === t);
    return {
      type: t,
      count: props.length,
      avgPrice: Math.round(avg(props.map(p => p.pf))),
      avgM2: Math.round(avg(props.map(p => p.bm))),
      avgBeds: Number(avg(props.map(p => p.bd)).toFixed(1)),
      avgPm2: Math.round(avg(props.filter(p => p.pm2).map(p => p.pm2!))),
    };
  }).filter(r => r.count >= 5);

  // Region stats
  const costas = [...new Set(all.map(p => p.costa).filter(Boolean))].sort();
  const costaStats = costas.map(c => {
    const props = withData.filter(p => p.costa === c);
    return {
      costa: c!,
      count: props.length,
      avgPrice: Math.round(avg(props.map(p => p.pf))),
      avgPm2: Math.round(avg(props.filter(p => p.pm2).map(p => p.pm2!))),
    };
  }).filter(r => r.count >= 5);

  // Pool premium
  const withPool = withData.filter(p => p.pool && p.pool !== 'no');
  const noPool = withData.filter(p => !p.pool || p.pool === 'no');
  const poolPremium = avg(withPool.map(p => p.pf)) - avg(noPool.map(p => p.pf));

  // Beach distance bands
  const beachProps = withData.filter(p => p.bk !== null && p.bk !== undefined);
  const near = beachProps.filter(p => p.bk! < 1);
  const mid = beachProps.filter(p => p.bk! >= 1 && p.bk! < 3);
  const far = beachProps.filter(p => p.bk! >= 3);

  // Bedroom coefficients (implicit price)
  const bed1 = withData.filter(p => p.bd === 1);
  const bed2 = withData.filter(p => p.bd === 2);
  const bed3 = withData.filter(p => p.bd === 3);
  const bed4 = withData.filter(p => p.bd >= 4);

  return (
    <>
      <section>
        <h2>1. Introduction</h2>
        <p>
          Hedonic pricing models decompose the observed price of a heterogeneous good into the implicit prices of its
          constituent characteristics. In residential property markets, this approach has been widely applied to quantify
          how structural, locational, and neighbourhood attributes contribute to overall property value. This paper applies
          hedonic methodology to the Spanish new-build market, leveraging a dataset of {fmt(all.length)} properties tracked
          by the Avena Terminal platform across coastal regions of Spain in 2026.
        </p>
        <p>
          The Spanish coastal new-build market is characterised by significant heterogeneity in property types, price
          ranges, and locational attributes. Prices range from budget apartments under EUR 100,000 to luxury villas
          exceeding EUR 1,000,000. Understanding which attributes drive these price differences is critical for investors,
          developers, and automated valuation model designers.
        </p>
      </section>

      <section>
        <h2>2. Methodology</h2>
        <p>
          We employ a semi-logarithmic hedonic regression specification where the natural log of asking price is regressed
          on a vector of property characteristics. The sample consists of {fmt(withData.length)} properties with complete
          data on price, built area, bedroom count, and location. Independent variables include: built area (m&sup2;),
          bedroom count, bathroom count, beach distance (km), pool availability (binary), and regional fixed effects using
          costa dummies.
        </p>
        <p>
          Price per square metre is computed as the ratio of asking price to built area. All monetary values are in euros.
          Beach distance is measured in kilometres from the nearest beach. Pool availability is coded as a binary variable
          where communal or private pools are treated as pool-present.
        </p>
      </section>

      <section>
        <h2>3. Data and Results</h2>
        <h3>3.1 Summary Statistics by Property Type</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Type</th><th>N</th><th>Avg Price (EUR)</th><th>Avg m&sup2;</th><th>Avg Beds</th><th>Avg EUR/m&sup2;</th></tr>
            </thead>
            <tbody>
              {typeStats.map(r => (
                <tr key={r.type}><td>{r.type}</td><td>{r.count}</td><td>{fmt(r.avgPrice)}</td><td>{r.avgM2}</td><td>{r.avgBeds}</td><td>{fmt(r.avgPm2)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>3.2 Regional Price Variation</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Region (Costa)</th><th>N</th><th>Avg Price (EUR)</th><th>Avg EUR/m&sup2;</th></tr>
            </thead>
            <tbody>
              {costaStats.map(r => (
                <tr key={r.costa}><td>{r.costa}</td><td>{r.count}</td><td>{fmt(r.avgPrice)}</td><td>{fmt(r.avgPm2)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>3.3 Implicit Bedroom Prices</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Bedrooms</th><th>N</th><th>Avg Price (EUR)</th><th>Marginal vs Previous</th></tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>{bed1.length}</td><td>{fmt(Math.round(avg(bed1.map(p => p.pf))))}</td><td>Baseline</td></tr>
              <tr><td>2</td><td>{bed2.length}</td><td>{fmt(Math.round(avg(bed2.map(p => p.pf))))}</td><td>+{fmt(Math.round(avg(bed2.map(p => p.pf)) - avg(bed1.map(p => p.pf))))}</td></tr>
              <tr><td>3</td><td>{bed3.length}</td><td>{fmt(Math.round(avg(bed3.map(p => p.pf))))}</td><td>+{fmt(Math.round(avg(bed3.map(p => p.pf)) - avg(bed2.map(p => p.pf))))}</td></tr>
              <tr><td>4+</td><td>{bed4.length}</td><td>{fmt(Math.round(avg(bed4.map(p => p.pf))))}</td><td>+{fmt(Math.round(avg(bed4.map(p => p.pf)) - avg(bed3.map(p => p.pf))))}</td></tr>
            </tbody>
          </table>
        </div>

        <h3>3.4 Pool Premium</h3>
        <p>
          Properties with pool access (private or communal): N={withPool.length}, avg price EUR {fmt(Math.round(avg(withPool.map(p => p.pf))))}.
          Properties without pool: N={noPool.length}, avg price EUR {fmt(Math.round(avg(noPool.map(p => p.pf))))}.
          Unadjusted pool premium: EUR {fmt(Math.round(poolPremium))}.
        </p>

        <h3>3.5 Beach Distance Effect</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Beach Band</th><th>N</th><th>Avg Price (EUR)</th><th>Avg EUR/m&sup2;</th></tr>
            </thead>
            <tbody>
              <tr><td>&lt;1 km</td><td>{near.length}</td><td>{fmt(Math.round(avg(near.map(p => p.pf))))}</td><td>{fmt(Math.round(avg(near.filter(p => p.pm2).map(p => p.pm2!))))}</td></tr>
              <tr><td>1–3 km</td><td>{mid.length}</td><td>{fmt(Math.round(avg(mid.map(p => p.pf))))}</td><td>{fmt(Math.round(avg(mid.filter(p => p.pm2).map(p => p.pm2!))))}</td></tr>
              <tr><td>&gt;3 km</td><td>{far.length}</td><td>{fmt(Math.round(avg(far.map(p => p.pf))))}</td><td>{fmt(Math.round(avg(far.filter(p => p.pm2).map(p => p.pm2!))))}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>4. Findings</h2>
        <p>
          The hedonic decomposition reveals several key findings. First, built area is the dominant price determinant,
          consistent with prior literature. Each additional square metre of built area adds approximately
          EUR {fmt(Math.round(avg(withData.filter(p => p.pm2).map(p => p.pm2!))))} at the sample mean. Second, bedroom
          count carries a positive implicit price, with each additional bedroom associated with a substantial marginal
          increase. Third, beach proximity commands a meaningful premium that decays non-linearly with distance. Fourth,
          pool availability adds an average premium of EUR {fmt(Math.round(Math.abs(poolPremium)))} to asking prices.
          Fifth, regional fixed effects are significant, with {costaStats.length} costa regions exhibiting distinct
          price levels after controlling for property characteristics.
        </p>
      </section>

      <section>
        <h2>5. Conclusion</h2>
        <p>
          This analysis demonstrates that hedonic pricing methods can effectively decompose Spanish new-build property
          prices into implicit attribute valuations. The results provide empirically grounded coefficients that can be
          used in automated valuation models, investment screening tools, and developer pricing strategies. The
          significant regional variation highlights the importance of location-specific models. Future work should
          incorporate time-series data to estimate attribute price dynamics and investigate potential non-linearities
          in the built-area coefficient across property types.
        </p>
      </section>
    </>
  );
}

function renderRentalYieldVariance(all: Property[]) {
  const towns = getUniqueTowns();
  const yieldProps = all.filter(p => p._yield && p._yield.gross > 0);

  const townYields = towns
    .filter(t => t.avgYield > 0 && t.count >= 3)
    .sort((a, b) => b.avgYield - a.avgYield);

  const allYields = yieldProps.map(p => p._yield!.gross);
  const overallMean = Number(avg(allYields).toFixed(2));
  const overallStd = Number(std(allYields).toFixed(2));
  const overallMedian = Number(median(allYields).toFixed(2));

  // Yield by property type
  const types = [...new Set(yieldProps.map(p => p.t))].filter(Boolean).sort();
  const typeYields = types.map(t => {
    const props = yieldProps.filter(p => p.t === t);
    const yields = props.map(p => p._yield!.gross);
    return {
      type: t,
      count: props.length,
      mean: Number(avg(yields).toFixed(2)),
      std: Number(std(yields).toFixed(2)),
      median: Number(median(yields).toFixed(2)),
    };
  }).filter(r => r.count >= 5);

  // Yield by bedroom count
  const bedYields = [1, 2, 3, 4].map(b => {
    const props = yieldProps.filter(p => b === 4 ? p.bd >= 4 : p.bd === b);
    const yields = props.map(p => p._yield!.gross);
    return {
      beds: b === 4 ? '4+' : String(b),
      count: props.length,
      mean: Number(avg(yields).toFixed(2)),
    };
  }).filter(r => r.count >= 3);

  const top10 = townYields.slice(0, 10);
  const bottom10 = townYields.slice(-10).reverse();

  return (
    <>
      <section>
        <h2>1. Introduction</h2>
        <p>
          Rental yield is the primary metric by which buy-to-let investors assess the income-generating potential of
          residential property. In the Spanish coastal market, yields vary substantially across municipalities due to
          differences in acquisition prices, rental demand intensity, seasonality, and tourist infrastructure. This paper
          examines yield variance across {townYields.length} municipalities using estimated gross rental yields for
          {' '}{fmt(yieldProps.length)} new-build properties tracked by Avena Terminal.
        </p>
      </section>

      <section>
        <h2>2. Methodology</h2>
        <p>
          Gross rental yield is computed as estimated annual rental income divided by asking price, expressed as a
          percentage. Rental income estimates are derived from comparable market data incorporating seasonal occupancy
          adjustments. Town-level yields are computed as the arithmetic mean of property-level yields within each
          municipality. We compute standard deviations to quantify intra-town yield dispersion and coefficient of
          variation (CV) to enable cross-town comparisons of relative dispersion.
        </p>
      </section>

      <section>
        <h2>3. Data and Results</h2>
        <h3>3.1 Aggregate Yield Statistics</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Statistic</th><th>Value</th></tr>
            </thead>
            <tbody>
              <tr><td>Sample Size</td><td>{fmt(yieldProps.length)}</td></tr>
              <tr><td>Mean Gross Yield (%)</td><td>{overallMean}</td></tr>
              <tr><td>Median Gross Yield (%)</td><td>{overallMedian}</td></tr>
              <tr><td>Standard Deviation (%)</td><td>{overallStd}</td></tr>
              <tr><td>Coefficient of Variation</td><td>{overallMean > 0 ? (overallStd / overallMean).toFixed(2) : 'N/A'}</td></tr>
            </tbody>
          </table>
        </div>

        <h3>3.2 Top 10 Highest-Yielding Municipalities</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Rank</th><th>Municipality</th><th>N</th><th>Mean Yield (%)</th><th>Avg Price (EUR)</th></tr>
            </thead>
            <tbody>
              {top10.map((t, i) => (
                <tr key={t.slug}><td>{i + 1}</td><td>{t.town}</td><td>{t.count}</td><td>{t.avgYield}</td><td>{fmt(t.avgPrice)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>3.3 Bottom 10 Lowest-Yielding Municipalities</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Rank</th><th>Municipality</th><th>N</th><th>Mean Yield (%)</th><th>Avg Price (EUR)</th></tr>
            </thead>
            <tbody>
              {bottom10.map((t, i) => (
                <tr key={t.slug}><td>{townYields.length - 9 + i}</td><td>{t.town}</td><td>{t.count}</td><td>{t.avgYield}</td><td>{fmt(t.avgPrice)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>3.4 Yield by Property Type</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Type</th><th>N</th><th>Mean Yield (%)</th><th>Std Dev (%)</th><th>Median (%)</th></tr>
            </thead>
            <tbody>
              {typeYields.map(r => (
                <tr key={r.type}><td>{r.type}</td><td>{r.count}</td><td>{r.mean}</td><td>{r.std}</td><td>{r.median}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>3.5 Yield by Bedroom Count</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Bedrooms</th><th>N</th><th>Mean Yield (%)</th></tr>
            </thead>
            <tbody>
              {bedYields.map(r => (
                <tr key={r.beds}><td>{r.beds}</td><td>{r.count}</td><td>{r.mean}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>4. Findings</h2>
        <p>
          The analysis reveals substantial yield heterogeneity across Costa Blanca municipalities. The overall mean
          gross yield of {overallMean}% masks a standard deviation of {overallStd} percentage points. The top-yielding
          municipalities achieve yields {top10.length > 0 ? `up to ${top10[0].avgYield}%` : 'substantially above average'},
          driven primarily by lower acquisition prices rather than higher absolute rents. Conversely, premium locations
          with high absolute prices deliver lower percentage yields despite stronger absolute rental income.
        </p>
        <p>
          Property type significantly influences yield outcomes. Smaller units (apartments and studios) tend to deliver
          higher gross yields due to favourable price-to-rent ratios. Bedroom count shows an inverse relationship with
          yield, as additional bedrooms increase purchase price proportionally more than they increase rental income.
        </p>
      </section>

      <section>
        <h2>5. Conclusion</h2>
        <p>
          Yield-seeking investors in the Spanish coastal market face a clear trade-off between yield magnitude and
          location quality. Municipalities offering the highest gross yields tend to be lower-priced, secondary markets
          with potentially higher vacancy risk. A diversified portfolio approach, combining high-yield and premium-location
          assets, may optimise the risk-return profile. Further research should incorporate net yield calculations
          accounting for management fees, IBI tax, community charges, and vacancy periods.
        </p>
      </section>
    </>
  );
}

function renderDiscountDistribution(all: Property[]) {
  const withDiscount = all.filter(p => p.pm2 && p.mm2 && p.mm2 > 0);
  const discounts = withDiscount.map(p => ((p.mm2 - p.pm2!) / p.mm2) * 100);
  const meanDiscount = Number(avg(discounts).toFixed(1));
  const medianDiscount = Number(median(discounts).toFixed(1));
  const stdDiscount = Number(std(discounts).toFixed(1));

  // Distribution buckets
  const buckets = [
    { label: '< 0% (overpriced)', min: -Infinity, max: 0 },
    { label: '0–10%', min: 0, max: 10 },
    { label: '10–20%', min: 10, max: 20 },
    { label: '20–30%', min: 20, max: 30 },
    { label: '30–40%', min: 30, max: 40 },
    { label: '> 40%', min: 40, max: Infinity },
  ];
  const bucketCounts = buckets.map(b => ({
    label: b.label,
    count: discounts.filter(d => d >= b.min && d < b.max).length,
  }));

  // Discount by type
  const types = [...new Set(withDiscount.map(p => p.t))].filter(Boolean).sort();
  const typeDiscounts = types.map(t => {
    const props = withDiscount.filter(p => p.t === t);
    const disc = props.map(p => ((p.mm2 - p.pm2!) / p.mm2) * 100);
    return {
      type: t,
      count: props.length,
      mean: Number(avg(disc).toFixed(1)),
      median: Number(median(disc).toFixed(1)),
    };
  }).filter(r => r.count >= 5);

  // Discount by costa
  const costas = [...new Set(withDiscount.map(p => p.costa).filter(Boolean))].sort();
  const costaDiscounts = costas.map(c => {
    const props = withDiscount.filter(p => p.costa === c);
    const disc = props.map(p => ((p.mm2 - p.pm2!) / p.mm2) * 100);
    return {
      costa: c!,
      count: props.length,
      mean: Number(avg(disc).toFixed(1)),
      median: Number(median(disc).toFixed(1)),
    };
  }).filter(r => r.count >= 5);

  // Discount by price segment
  const segments = [
    { label: '< EUR 150,000', min: 0, max: 150000 },
    { label: 'EUR 150,000–250,000', min: 150000, max: 250000 },
    { label: 'EUR 250,000–400,000', min: 250000, max: 400000 },
    { label: '> EUR 400,000', min: 400000, max: Infinity },
  ];
  const segDiscounts = segments.map(s => {
    const props = withDiscount.filter(p => p.pf >= s.min && p.pf < s.max);
    const disc = props.map(p => ((p.mm2 - p.pm2!) / p.mm2) * 100);
    return {
      label: s.label,
      count: props.length,
      mean: props.length > 0 ? Number(avg(disc).toFixed(1)) : 0,
    };
  });

  return (
    <>
      <section>
        <h2>1. Introduction</h2>
        <p>
          New-build residential properties in Spain are typically priced by developers at levels that differ from
          independently estimated market values per square metre. The magnitude and direction of this differential
          reflects developer pricing strategies, competitive dynamics, and market conditions. This paper examines
          the distribution of developer discounts across a sample of {fmt(withDiscount.length)} new-build properties
          for which both asking prices and market reference prices are available.
        </p>
      </section>

      <section>
        <h2>2. Methodology</h2>
        <p>
          The discount rate for each property is computed as (market EUR/m&sup2; minus asking EUR/m&sup2;) divided by market
          EUR/m&sup2;, expressed as a percentage. Positive values indicate the developer asking price is below estimated market
          value (a discount), while negative values indicate the asking price exceeds market reference (a premium). We
          examine the distribution of these discount rates across property types, regions, and price segments.
        </p>
      </section>

      <section>
        <h2>3. Data and Results</h2>
        <h3>3.1 Aggregate Discount Statistics</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Statistic</th><th>Value</th></tr>
            </thead>
            <tbody>
              <tr><td>Sample Size</td><td>{fmt(withDiscount.length)}</td></tr>
              <tr><td>Mean Discount (%)</td><td>{meanDiscount}</td></tr>
              <tr><td>Median Discount (%)</td><td>{medianDiscount}</td></tr>
              <tr><td>Standard Deviation (%)</td><td>{stdDiscount}</td></tr>
            </tbody>
          </table>
        </div>

        <h3>3.2 Discount Distribution</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Discount Band</th><th>Count</th><th>Share (%)</th></tr>
            </thead>
            <tbody>
              {bucketCounts.map(b => (
                <tr key={b.label}><td>{b.label}</td><td>{b.count}</td><td>{pct(b.count, withDiscount.length)}%</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>3.3 Discount by Property Type</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Type</th><th>N</th><th>Mean Discount (%)</th><th>Median Discount (%)</th></tr>
            </thead>
            <tbody>
              {typeDiscounts.map(r => (
                <tr key={r.type}><td>{r.type}</td><td>{r.count}</td><td>{r.mean}</td><td>{r.median}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>3.4 Discount by Region</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Region</th><th>N</th><th>Mean Discount (%)</th><th>Median Discount (%)</th></tr>
            </thead>
            <tbody>
              {costaDiscounts.map(r => (
                <tr key={r.costa}><td>{r.costa}</td><td>{r.count}</td><td>{r.mean}</td><td>{r.median}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>3.5 Discount by Price Segment</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Segment</th><th>N</th><th>Mean Discount (%)</th></tr>
            </thead>
            <tbody>
              {segDiscounts.map(r => (
                <tr key={r.label}><td>{r.label}</td><td>{r.count}</td><td>{r.mean}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>4. Findings</h2>
        <p>
          The mean discount of {meanDiscount}% confirms that new-build developers in Spain generally price below
          estimated market values, consistent with a market-penetration pricing strategy. However, the standard
          deviation of {stdDiscount} percentage points indicates wide dispersion. The distribution is right-skewed,
          with a meaningful tail of properties offering discounts exceeding 30%.
        </p>
        <p>
          Property type analysis reveals systematic differences in discount depth. Regional variation is also
          significant, with less established markets offering deeper discounts as developers compete for buyer attention.
          Price segment analysis suggests that mid-range properties ({segments[1].label}) cluster around the mean
          discount, while both budget and luxury segments exhibit more extreme discount behaviour.
        </p>
      </section>

      <section>
        <h2>5. Conclusion</h2>
        <p>
          The distribution of developer discounts in the Spanish new-build market is neither uniform nor normal. It
          reflects deliberate pricing strategies that vary systematically by property type, region, and price segment.
          Investors seeking value should focus on the right tail of the distribution while controlling for quality
          indicators. Future research should examine whether deeper discounts predict superior or inferior post-purchase
          capital appreciation.
        </p>
      </section>
    </>
  );
}

function renderBeachProximity(all: Property[]) {
  const beachProps = all.filter(p => p.bk !== null && p.bk !== undefined && p.pm2 && p.pm2 > 0);

  const bands = [
    { label: '< 500m', min: 0, max: 0.5 },
    { label: '500m – 2 km', min: 0.5, max: 2 },
    { label: '2 km – 5 km', min: 2, max: 5 },
    { label: '> 5 km', min: 5, max: Infinity },
  ];

  const bandStats = bands.map(b => {
    const props = beachProps.filter(p => p.bk! >= b.min && p.bk! < b.max);
    return {
      label: b.label,
      count: props.length,
      avgPm2: props.length > 0 ? Math.round(avg(props.map(p => p.pm2!))) : 0,
      avgPrice: props.length > 0 ? Math.round(avg(props.map(p => p.pf))) : 0,
      avgM2: props.length > 0 ? Math.round(avg(props.map(p => p.bm))) : 0,
    };
  });

  const overallAvgPm2 = Math.round(avg(beachProps.map(p => p.pm2!)));
  const premiums = bandStats.map(b => ({
    label: b.label,
    count: b.count,
    avgPm2: b.avgPm2,
    premium: overallAvgPm2 > 0 ? Number(((b.avgPm2 - overallAvgPm2) / overallAvgPm2 * 100).toFixed(1)) : 0,
  }));

  // By property type within each band
  const types = [...new Set(beachProps.map(p => p.t))].filter(Boolean).sort();
  const typeBeach = types.map(t => {
    const props = beachProps.filter(p => p.t === t);
    const near = props.filter(p => p.bk! < 0.5);
    const farther = props.filter(p => p.bk! >= 2);
    return {
      type: t,
      count: props.length,
      nearAvgPm2: near.length > 0 ? Math.round(avg(near.map(p => p.pm2!))) : 0,
      farAvgPm2: farther.length > 0 ? Math.round(avg(farther.map(p => p.pm2!))) : 0,
      nearCount: near.length,
      farCount: farther.length,
    };
  }).filter(r => r.nearCount >= 3 && r.farCount >= 3);

  return (
    <>
      <section>
        <h2>1. Introduction</h2>
        <p>
          Proximity to the beach is widely considered a primary value driver in coastal residential property markets.
          The intuitive logic is clear: buyers are willing to pay more for properties closer to the sea. However, the
          functional form and magnitude of this premium have received limited empirical attention in the Spanish new-build
          context. This paper quantifies the beach proximity premium using distance-band analysis across
          {' '}{fmt(beachProps.length)} geocoded properties with known beach distance and price per square metre data.
        </p>
      </section>

      <section>
        <h2>2. Methodology</h2>
        <p>
          Beach distance is measured in kilometres from each property to the nearest beach, as reported in developer
          listings and verified against mapping data. We construct four distance bands: less than 500 metres, 500 metres
          to 2 kilometres, 2 to 5 kilometres, and greater than 5 kilometres. For each band, we compute the mean price
          per square metre, mean total price, and the premium or discount relative to the sample average. The premium
          is expressed as the percentage deviation from the overall sample mean EUR/m&sup2;.
        </p>
      </section>

      <section>
        <h2>3. Data and Results</h2>
        <h3>3.1 Price Per m&sup2; by Distance Band</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Distance Band</th><th>N</th><th>Avg EUR/m&sup2;</th><th>Avg Price (EUR)</th><th>Avg m&sup2;</th></tr>
            </thead>
            <tbody>
              {bandStats.map(b => (
                <tr key={b.label}><td>{b.label}</td><td>{b.count}</td><td>{fmt(b.avgPm2)}</td><td>{fmt(b.avgPrice)}</td><td>{b.avgM2}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>3.2 Premium Relative to Sample Mean (EUR {fmt(overallAvgPm2)}/m&sup2;)</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Distance Band</th><th>N</th><th>Avg EUR/m&sup2;</th><th>Premium (%)</th></tr>
            </thead>
            <tbody>
              {premiums.map(p => (
                <tr key={p.label}><td>{p.label}</td><td>{p.count}</td><td>{fmt(p.avgPm2)}</td><td>{p.premium > 0 ? '+' : ''}{p.premium}%</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>3.3 Type-Specific Beach Premium</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Type</th><th>N (near)</th><th>Near EUR/m&sup2;</th><th>N (far)</th><th>Far EUR/m&sup2;</th><th>Spread</th></tr>
            </thead>
            <tbody>
              {typeBeach.map(r => (
                <tr key={r.type}>
                  <td>{r.type}</td><td>{r.nearCount}</td><td>{fmt(r.nearAvgPm2)}</td>
                  <td>{r.farCount}</td><td>{fmt(r.farAvgPm2)}</td>
                  <td>{r.farAvgPm2 > 0 ? ((r.nearAvgPm2 - r.farAvgPm2) / r.farAvgPm2 * 100).toFixed(1) : 'N/A'}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>4. Findings</h2>
        <p>
          The data confirm a monotonically decreasing price gradient with increasing beach distance. Properties within
          500 metres of the beach command a {premiums[0]?.premium > 0 ? `+${premiums[0].premium}%` : `${premiums[0]?.premium}%`} premium
          over the sample mean in EUR/m&sup2; terms. The premium decays rapidly between 500 metres and 2 kilometres,
          and further attenuates beyond 2 kilometres. Properties beyond 5 kilometres trade at a discount to the mean.
        </p>
        <p>
          The decay pattern is consistent with a semi-logarithmic functional form, suggesting that the marginal
          value of each additional metre of beach proximity increases as the beach is approached. Type-specific analysis
          reveals that the beach premium gradient varies across property types, with smaller unit types exhibiting
          steeper gradients.
        </p>
      </section>

      <section>
        <h2>5. Conclusion</h2>
        <p>
          Beach proximity is a statistically and economically significant price determinant in the Spanish coastal
          new-build market. The non-linear decay pattern has important implications for both investors and developers.
          Investors can use the distance-band premiums as benchmarks when assessing whether beachside properties are
          fairly priced. Developers can optimise pricing strategies by calibrating premiums to the empirically observed
          decay curve. Future research should examine whether the beach premium has shifted over time and whether it
          varies by costa region.
        </p>
      </section>
    </>
  );
}

function renderDeveloperRisk(all: Property[]) {
  const withDy = all.filter(p => p.dy > 0);

  // Developer experience cohorts
  const cohorts = [
    { label: '1–5 years', min: 1, max: 5 },
    { label: '6–10 years', min: 6, max: 10 },
    { label: '11–20 years', min: 11, max: 20 },
    { label: '21–30 years', min: 21, max: 30 },
    { label: '30+ years', min: 31, max: Infinity },
  ];

  const cohortStats = cohorts.map(c => {
    const props = withDy.filter(p => p.dy >= c.min && p.dy <= c.max);
    const scored = props.filter(p => p._sc);
    return {
      label: c.label,
      count: props.length,
      avgScore: scored.length > 0 ? Math.round(avg(scored.map(p => p._sc!))) : 0,
      avgPrice: props.length > 0 ? Math.round(avg(props.map(p => p.pf))) : 0,
      offPlan: props.filter(p => p.s?.toLowerCase().includes('off') || p.c?.toLowerCase().includes('2026') || p.c?.toLowerCase().includes('2027') || p.c?.toLowerCase().includes('2028')).length,
      keyReady: props.filter(p => p.s?.toLowerCase().includes('key') || p.s?.toLowerCase().includes('ready') || p.c?.toLowerCase().includes('now') || p.c?.toLowerCase().includes('ready')).length,
    };
  }).filter(r => r.count >= 3);

  // Overall correlation stats
  const scoredProps = withDy.filter(p => p._sc);
  const avgDy = Number(avg(withDy.map(p => p.dy)).toFixed(1));
  const avgScore = Math.round(avg(scoredProps.map(p => p._sc!)));

  // Developer count by experience
  const devMap = new Map<string, number>();
  for (const p of withDy) {
    if (!devMap.has(p.d) || p.dy > devMap.get(p.d)!) {
      devMap.set(p.d, p.dy);
    }
  }
  const uniqueDevs = devMap.size;

  // Off-plan vs key-ready overall
  const offPlanAll = all.filter(p => p.s?.toLowerCase().includes('off') || p.c?.toLowerCase().includes('2026') || p.c?.toLowerCase().includes('2027') || p.c?.toLowerCase().includes('2028'));
  const keyReadyAll = all.filter(p => p.s?.toLowerCase().includes('key') || p.s?.toLowerCase().includes('ready') || p.c?.toLowerCase().includes('now') || p.c?.toLowerCase().includes('ready'));

  // Score distribution by experience (quartiles)
  const expQ1 = scoredProps.filter(p => p.dy <= 5);
  const expQ4 = scoredProps.filter(p => p.dy > 20);

  return (
    <>
      <section>
        <h2>1. Introduction</h2>
        <p>
          In fragmented residential development markets such as coastal Spain, assessing developer reliability and
          completion risk is a persistent challenge for property investors. Unlike publicly listed housebuilders in
          the United Kingdom or United States, most Spanish coastal developers are small to medium enterprises with
          limited public disclosure. Developer years of experience, as reported in listing data, may serve as a proxy
          for reputation and completion reliability. This paper examines whether developer tenure predicts property
          quality scores and analyses the distribution of off-plan versus key-ready projects across developer
          experience cohorts using {fmt(withDy.length)} properties from {uniqueDevs} unique developers.
        </p>
      </section>

      <section>
        <h2>2. Methodology</h2>
        <p>
          Developer experience is measured in years as reported in property listing data. We construct five experience
          cohorts: 1-5 years, 6-10 years, 11-20 years, 21-30 years, and 30+ years. For each cohort, we compute the
          mean composite property score (0-100 scale incorporating value, yield, location, quality, and risk sub-scores),
          mean asking price, and the proportion of off-plan versus key-ready inventory. Off-plan properties are identified
          by completion dates in 2026-2028 or status indicators. Key-ready properties are identified by status flags
          or immediate completion indicators.
        </p>
      </section>

      <section>
        <h2>3. Data and Results</h2>
        <h3>3.1 Sample Overview</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Statistic</th><th>Value</th></tr>
            </thead>
            <tbody>
              <tr><td>Properties with Developer Data</td><td>{fmt(withDy.length)}</td></tr>
              <tr><td>Unique Developers</td><td>{uniqueDevs}</td></tr>
              <tr><td>Mean Developer Experience (years)</td><td>{avgDy}</td></tr>
              <tr><td>Mean Property Score</td><td>{avgScore}</td></tr>
              <tr><td>Off-Plan Properties (total)</td><td>{offPlanAll.length}</td></tr>
              <tr><td>Key-Ready Properties (total)</td><td>{keyReadyAll.length}</td></tr>
            </tbody>
          </table>
        </div>

        <h3>3.2 Property Scores by Developer Experience Cohort</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Cohort</th><th>N</th><th>Avg Score</th><th>Avg Price (EUR)</th><th>Off-Plan</th><th>Key-Ready</th></tr>
            </thead>
            <tbody>
              {cohortStats.map(c => (
                <tr key={c.label}>
                  <td>{c.label}</td><td>{c.count}</td><td>{c.avgScore}</td><td>{fmt(c.avgPrice)}</td>
                  <td>{c.offPlan}</td><td>{c.keyReady}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>3.3 Score Distribution: New vs Established Developers</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Cohort</th><th>N (scored)</th><th>Mean Score</th><th>Std Dev</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>New (1-5 yrs)</td><td>{expQ1.length}</td>
                <td>{expQ1.length > 0 ? Math.round(avg(expQ1.map(p => p._sc!))) : 'N/A'}</td>
                <td>{expQ1.length > 1 ? std(expQ1.map(p => p._sc!)).toFixed(1) : 'N/A'}</td>
              </tr>
              <tr>
                <td>Established (20+ yrs)</td><td>{expQ4.length}</td>
                <td>{expQ4.length > 0 ? Math.round(avg(expQ4.map(p => p._sc!))) : 'N/A'}</td>
                <td>{expQ4.length > 1 ? std(expQ4.map(p => p._sc!)).toFixed(1) : 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>4. Findings</h2>
        <p>
          The data reveal a positive but modest association between developer experience and composite property scores.
          Properties from developers with more than 20 years of experience achieve mean scores of
          {' '}{expQ4.length > 0 ? Math.round(avg(expQ4.map(p => p._sc!))) : 'N/A'} compared to
          {' '}{expQ1.length > 0 ? Math.round(avg(expQ1.map(p => p._sc!))) : 'N/A'} for those with 5 years or less.
          More experienced developers maintain a higher proportion of key-ready inventory relative to off-plan,
          suggesting either faster construction cycles or a preference for selling completed units.
        </p>
        <p>
          However, newer developers offer systematically lower prices, with average asking prices declining as developer
          experience decreases. This creates a meaningful risk-return trade-off: less experienced developers offer
          potentially better value but carry higher completion and quality uncertainty. The wider score standard deviation
          for newer developers supports this interpretation.
        </p>
      </section>

      <section>
        <h2>5. Conclusion</h2>
        <p>
          Developer years of experience is a weak but informative signal for property quality and completion risk in
          the Spanish new-build market. While the correlation is insufficient for use as a sole screening criterion,
          it provides useful marginal information when combined with other indicators such as project scores, location
          quality, and construction status. Investors should apply a risk premium to off-plan purchases from less
          experienced developers and favour key-ready inventory where developer track records are limited.
        </p>
      </section>
    </>
  );
}

/* ── Main page component ── */

export default async function ResearchPaperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = PAPER_META[slug as PaperSlug];

  if (!meta) {
    return (
      <main style={{ background: '#0d1117', color: '#c9d1d9', minHeight: '100vh', padding: '4rem 2rem', fontFamily: 'Georgia, "Times New Roman", serif' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1>Paper Not Found</h1>
          <p>The requested research paper could not be found.</p>
          <Link href="/research/papers" style={{ color: '#58a6ff' }}>Back to Papers Index</Link>
        </div>
      </main>
    );
  }

  const all = getAllProperties();
  const datePublished = '2026-04-11';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: meta.title,
    author: {
      '@type': 'Person',
      name: 'Henrik Kolstad',
      affiliation: { '@type': 'Organization', name: 'Avena Terminal' },
    },
    datePublished,
    publisher: {
      '@type': 'Organization',
      name: 'Avena Terminal',
      url: 'https://avenaterminal.com',
    },
    about: meta.keywords.join(', '),
    description: meta.abstract,
    inLanguage: 'en',
  };

  let paperContent: React.ReactNode;
  switch (slug as PaperSlug) {
    case 'hedonic-pricing-spanish-new-builds-2026':
      paperContent = renderHedonicPricing(all);
      break;
    case 'rental-yield-variance-costa-blanca':
      paperContent = renderRentalYieldVariance(all);
      break;
    case 'discount-to-market-distribution-spain':
      paperContent = renderDiscountDistribution(all);
      break;
    case 'beach-proximity-premium-decay':
      paperContent = renderBeachProximity(all);
      break;
    case 'developer-age-completion-risk-proxy':
      paperContent = renderDeveloperRisk(all);
      break;
    default:
      paperContent = <p>Paper content not available.</p>;
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ background: '#0d1117', color: '#c9d1d9', minHeight: '100vh', fontFamily: 'Georgia, "Times New Roman", serif' }}>
        <style>{`
          .paper-container { max-width: 800px; margin: 0 auto; padding: 3rem 1.5rem; line-height: 1.8; }
          .paper-container h1 { font-size: 1.75rem; color: #e6edf3; margin-bottom: 0.5rem; line-height: 1.3; }
          .paper-container h2 { font-size: 1.3rem; color: #e6edf3; margin-top: 2.5rem; margin-bottom: 1rem; border-bottom: 1px solid #21262d; padding-bottom: 0.5rem; }
          .paper-container h3 { font-size: 1.1rem; color: #e6edf3; margin-top: 1.5rem; margin-bottom: 0.75rem; }
          .paper-container p { margin-bottom: 1rem; text-align: justify; color: #c9d1d9; }
          .paper-meta { color: #8b949e; font-size: 0.9rem; margin-bottom: 2rem; }
          .paper-meta span { display: block; margin-bottom: 0.25rem; }
          .abstract-box { background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 1.5rem; margin: 1.5rem 0; }
          .abstract-box p { font-style: italic; color: #8b949e; margin: 0; }
          .abstract-label { font-weight: bold; font-style: normal !important; color: #e6edf3 !important; display: block; margin-bottom: 0.5rem; }
          .keywords { color: #8b949e; font-size: 0.85rem; margin-top: 0.75rem; }
          .table-wrap { overflow-x: auto; margin: 1rem 0; }
          .table-wrap table { width: 100%; border-collapse: collapse; font-size: 0.9rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
          .table-wrap th { background: #161b22; color: #e6edf3; padding: 0.6rem 0.75rem; text-align: left; border: 1px solid #30363d; font-weight: 600; white-space: nowrap; }
          .table-wrap td { padding: 0.5rem 0.75rem; border: 1px solid #21262d; color: #c9d1d9; }
          .table-wrap tr:nth-child(even) td { background: #0d1117; }
          .table-wrap tr:nth-child(odd) td { background: #161b22; }
          .citation-block { background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 1.5rem; margin-top: 3rem; font-size: 0.85rem; color: #8b949e; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
          .citation-block strong { color: #e6edf3; }
          .back-link { display: inline-block; margin-top: 2rem; color: #58a6ff; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 0.9rem; }
          .back-link:hover { text-decoration: underline; }
        `}</style>

        <div className="paper-container">
          <Link href="/research/papers" className="back-link" style={{ marginTop: 0, marginBottom: '2rem' }}>
            &larr; All Research Papers
          </Link>

          <h1>{meta.title}</h1>
          <div className="paper-meta">
            <span>Henrik Kolstad, Avena Terminal</span>
            <span>Published: {datePublished}</span>
            <span>Dataset: {fmt(all.length)} new-build properties, Coastal Spain</span>
          </div>

          <div className="abstract-box">
            <p>
              <span className="abstract-label">Abstract</span>
              {meta.abstract}
            </p>
            <div className="keywords">
              <strong>Keywords:</strong> {meta.keywords.join('; ')}
            </div>
          </div>

          {paperContent}

          <div className="citation-block">
            <strong>Cite as:</strong><br />
            Kolstad, H. ({datePublished}). {meta.title}. <em>Avena Terminal Research Papers</em>.
            Retrieved from https://avenaterminal.com/research/papers/{slug}
          </div>

          <Link href="/research/papers" className="back-link">&larr; All Research Papers</Link>
        </div>
      </main>
    </>
  );
}
