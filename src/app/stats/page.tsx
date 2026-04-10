import { Metadata } from "next";
import { getAllProperties, getUniqueTowns, getUniqueCostas, avg } from "@/lib/properties";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Spanish Property Market Statistics 2026 — Avena Terminal Data",
  description:
    "Comprehensive 2026 statistics on Spain new build property prices, rental yields, and investment scores across Costa Blanca, Costa Calida, and Costa del Sol.",
  keywords: [
    "spanish property statistics 2026",
    "spain property market data",
    "costa blanca property stats",
    "spain rental yield statistics",
    "new build prices spain 2026",
    "spanish real estate data",
  ],
  openGraph: {
    title: "Spanish Property Market Statistics 2026 — Avena Terminal Data",
    description:
      "Comprehensive 2026 statistics on Spain new build property prices, rental yields, and investment scores.",
    url: "https://avenaterminal.com/stats",
  },
};

function fmt(n: number): string {
  return n.toLocaleString("en-GB");
}

function fmtEur(n: number): string {
  return "€" + Math.round(n).toLocaleString("en-GB");
}

const REGIONS: { key: string; label: string }[] = [
  { key: "cb-south", label: "Costa Blanca South" },
  { key: "cb-north", label: "Costa Blanca North" },
  { key: "costa-calida", label: "Costa Calida" },
  { key: "costa-del-sol", label: "Costa del Sol" },
];

export default function StatsPage() {
  const all = getAllProperties();
  const towns = getUniqueTowns();
  const costas = getUniqueCostas();

  const totalProperties = all.length;
  const avgPrice = avg(all.map((p) => p.pf));
  const avgYield = avg(all.filter((p) => p._yield).map((p) => p._yield!.gross));
  const avgNetYield = avgYield * 0.67;

  const pricesPerM2 = all.filter((p) => p.pm2 && p.pm2 > 0).map((p) => p.pm2!);
  const avgPricePerM2 = avg(pricesPerM2);

  const propertiesAbove80 = all.filter((p) => p._sc && p._sc > 80).length;

  // Best region by yield
  const bestRegionByYield = costas.length
    ? costas.reduce((a, b) => (b.avgYield > a.avgYield ? b : a))
    : null;

  // Highest yield town
  const townsWithYield = towns.filter((t) => t.avgYield > 0);
  const highestYieldTown = townsWithYield.length
    ? townsWithYield.reduce((a, b) => (b.avgYield > a.avgYield ? b : a))
    : null;

  // Lowest price town
  const townsWithPrice = towns.filter((t) => t.avgPrice > 0);
  const lowestPriceTown = townsWithPrice.length
    ? townsWithPrice.reduce((a, b) => (a.avgPrice < b.avgPrice ? a : b))
    : null;

  // Regional breakdown
  const regionData = REGIONS.map((region) => {
    const regionProps = all.filter((p) => p.r === region.key);
    const regionTowns = new Map<string, typeof regionProps>();
    for (const p of regionProps) {
      if (!p.l) continue;
      if (!regionTowns.has(p.l)) regionTowns.set(p.l, []);
      regionTowns.get(p.l)!.push(p);
    }
    const townList = [...regionTowns.entries()]
      .map(([name, props]) => ({
        name,
        count: props.length,
        avgPrice: avg(props.map((p) => p.pf)),
        avgYield: avg(props.filter((p) => p._yield).map((p) => p._yield!.gross)),
        avgScore: avg(props.filter((p) => p._sc).map((p) => p._sc!)),
      }))
      .sort((a, b) => b.avgYield - a.avgYield)
      .slice(0, 3);
    return {
      ...region,
      count: regionProps.length,
      avgPrice: avg(regionProps.map((p) => p.pf)),
      avgYield: avg(regionProps.filter((p) => p._yield).map((p) => p._yield!.gross)),
      avgScore: avg(regionProps.filter((p) => p._sc).map((p) => p._sc!)),
      top3: townList,
    };
  });

  const now = new Date().toISOString().split("T")[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Spain New Build Property Market Statistics 2026",
    description:
      "Comprehensive dataset of new build property prices, rental yields, and investment scores across coastal Spain.",
    url: "https://avenaterminal.com/stats",
    creator: { "@type": "Organization", name: "Avena Terminal" },
    dateModified: now,
    license: "https://creativecommons.org/licenses/by/4.0/",
    spatialCoverage: "Spain",
    temporalCoverage: "2026",
    variableMeasured: [
      "Property Price",
      "Rental Yield",
      "Investment Score",
      "Price per Square Meter",
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#headline", "#summary-stats"],
    },
  };

  return (
    <main className="min-h-screen bg-[#0d1117] text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1
          id="headline"
          className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2"
        >
          Spanish Property Market Statistics 2026
        </h1>
        <p className="text-gray-400 mb-12 text-sm">
          Avena Terminal Data &middot; Updated {now}
        </p>

        {/* Summary Stats */}
        <section id="summary-stats" className="mb-16">
          <h2 className="text-xl font-semibold text-emerald-400 mb-6 border-b border-gray-800 pb-2">
            Market Overview
          </h2>
          <div className="font-mono text-sm space-y-1 bg-[#161b22] rounded-lg p-6 border border-gray-800">
            <Row label="Total Properties" value={fmt(totalProperties)} />
            <Row label="Average Price" value={fmtEur(avgPrice)} />
            <Row label="Average Gross Yield" value={avgYield.toFixed(1) + "%"} />
            <Row label="Average Net Yield (est.)" value={avgNetYield.toFixed(1) + "%"} />
            <Row label="Average Price per m2" value={fmtEur(avgPricePerM2)} />
            <Row label="Properties Scored 80+" value={fmt(propertiesAbove80)} />
            <Row
              label="Best Region (Yield)"
              value={bestRegionByYield ? `${bestRegionByYield.costa} (${bestRegionByYield.avgYield}%)` : "N/A"}
            />
            <Row
              label="Highest Yield Town"
              value={highestYieldTown ? `${highestYieldTown.town} (${highestYieldTown.avgYield}%)` : "N/A"}
            />
            <Row
              label="Lowest Price Town"
              value={lowestPriceTown ? `${lowestPriceTown.town} (${fmtEur(lowestPriceTown.avgPrice)})` : "N/A"}
            />
          </div>
        </section>

        {/* Regional Breakdown */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-emerald-400 mb-6 border-b border-gray-800 pb-2">
            Regional Breakdown
          </h2>
          <div className="space-y-8">
            {regionData.map((region) => (
              <div
                key={region.key}
                className="bg-[#161b22] rounded-lg p-6 border border-gray-800"
              >
                <h3 className="text-lg font-semibold text-emerald-300 mb-4">
                  {region.label}
                </h3>
                <div className="font-mono text-sm space-y-1 mb-4">
                  <Row label="Properties" value={fmt(region.count)} />
                  <Row label="Avg Price" value={fmtEur(region.avgPrice)} />
                  <Row label="Avg Gross Yield" value={region.avgYield.toFixed(1) + "%"} />
                  <Row label="Avg Score" value={Math.round(region.avgScore).toString()} />
                </div>
                {region.top3.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Top 3 Towns by Yield
                    </p>
                    <div className="font-mono text-sm space-y-1">
                      {region.top3.map((town, i) => (
                        <div key={town.name} className="flex justify-between text-gray-300">
                          <span>
                            {i + 1}. {town.name}
                          </span>
                          <span className="text-emerald-400">
                            {town.avgYield.toFixed(1)}% &middot; {fmtEur(town.avgPrice)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Costa Summary */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-emerald-400 mb-6 border-b border-gray-800 pb-2">
            Costa Summary
          </h2>
          <div className="bg-[#161b22] rounded-lg p-6 border border-gray-800 font-mono text-sm space-y-1">
            {costas.map((c) => (
              <div key={c.costa} className="flex justify-between text-gray-300">
                <span>{c.costa}</span>
                <span className="text-emerald-400">
                  {c.count} props &middot; {c.avgYield}% yield &middot; Score {c.avgScore}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Citation */}
        <section className="border-t border-gray-800 pt-8 mt-16">
          <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
            Citation
          </h2>
          <div className="bg-[#161b22] rounded-lg p-4 border border-gray-800 font-mono text-xs text-gray-400">
            <p>
              Avena Terminal. &quot;Spanish Property Market Statistics 2026.&quot;
              avenaterminal.com/stats. Accessed {now}.
            </p>
            <p className="mt-2 text-gray-500">
              Data sourced from {fmt(totalProperties)} new build listings across{" "}
              {towns.length} towns in coastal Spain.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-gray-300">
      <span className="text-gray-500">{label}</span>
      <span className="text-emerald-400">{value}</span>
    </div>
  );
}
