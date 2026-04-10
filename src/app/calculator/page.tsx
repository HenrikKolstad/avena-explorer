'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function CalculatorPage() {
  const [price, setPrice] = useState(250000);
  const [rent, setRent] = useState(1200);
  const [mgmtFee, setMgmtFee] = useState(18);
  const [annualCosts, setAnnualCosts] = useState(3000);

  const results = useMemo(() => {
    const annualRent = rent * 12;
    const grossYield = price > 0 ? (annualRent / price) * 100 : 0;
    const mgmtCost = annualRent * (mgmtFee / 100);
    const netIncome = annualRent - mgmtCost - annualCosts;
    const netYield = price > 0 ? (netIncome / price) * 100 : 0;
    const monthlyCashflow = netIncome / 12;

    // 5-year ROI: net income over 5 years + 8% total appreciation
    const totalNetIncome5yr = netIncome * 5;
    const appreciation = price * 0.08;
    const totalReturn5yr = totalNetIncome5yr + appreciation;
    const roi5yr = price > 0 ? (totalReturn5yr / price) * 100 : 0;

    return {
      grossYield,
      netYield,
      annualIncome: netIncome,
      monthlyCashflow,
      roi5yr,
    };
  }, [price, rent, mgmtFee, annualCosts]);

  const fmt = (n: number) =>
    n.toLocaleString('en-EU', { maximumFractionDigits: 0 });
  const fmtPct = (n: number) => n.toFixed(2);

  return (
    <>
      <head>
        <title>Spanish Property Investment Calculator — Free Tool | Avena Terminal</title>
        <meta
          name="description"
          content="Free spanish property investment calculator. Estimate gross yield, net yield, monthly cashflow and 5-year ROI for Spanish new build and resale properties."
        />
        <meta property="og:title" content="Spanish Property Investment Calculator — Free Tool | Avena Terminal" />
        <meta
          property="og:description"
          content="Free calculator for Spanish property investment returns. Estimate yield, cashflow and ROI."
        />
        <meta property="og:url" content="https://avenaterminal.com/calculator" />
        <meta property="og:site_name" content="Avena Terminal" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://avenaterminal.com/calculator" />
      </head>

      <div className="min-h-screen bg-gray-950 text-gray-100">
        {/* Breadcrumbs */}
        <nav className="max-w-3xl mx-auto px-4 pt-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">Investment Calculator</span>
        </nav>

        <main className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Spanish Property Investment Calculator
          </h1>
          <p className="text-gray-400 mb-10 text-lg">
            Estimate yield, cashflow and ROI for any Spanish property in seconds.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-emerald-400 mb-1">Inputs</h2>

              <label className="block">
                <span className="text-sm text-gray-400">Property Price (EUR)</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-400">Expected Monthly Rent (EUR)</span>
                <input
                  type="number"
                  value={rent}
                  onChange={(e) => setRent(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-400">Management Fee (%)</span>
                <input
                  type="number"
                  value={mgmtFee}
                  step={0.5}
                  onChange={(e) => setMgmtFee(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-400">Annual Costs (EUR) — IBI, insurance, community fees</span>
                <input
                  type="number"
                  value={annualCosts}
                  onChange={(e) => setAnnualCosts(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </label>
            </div>

            {/* Outputs */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-emerald-400 mb-1">Results</h2>

              <div className="rounded-xl bg-gray-900 border border-gray-800 p-5 space-y-4">
                <ResultRow label="Gross Yield" value={`${fmtPct(results.grossYield)}%`} />
                <ResultRow
                  label="Net Yield"
                  value={`${fmtPct(results.netYield)}%`}
                  highlight={results.netYield >= 5}
                />
                <ResultRow label="Annual Net Income" value={`€${fmt(results.annualIncome)}`} />
                <ResultRow
                  label="Monthly Cashflow"
                  value={`€${fmt(results.monthlyCashflow)}`}
                  highlight={results.monthlyCashflow > 0}
                />
                <hr className="border-gray-800" />
                <ResultRow
                  label="5-Year ROI Estimate"
                  value={`${fmtPct(results.roi5yr)}%`}
                  subtitle="Includes 8% capital appreciation"
                  highlight
                />
              </div>

              <p className="text-xs text-gray-600 mt-2">
                Estimates are indicative only. Actual returns depend on occupancy, tax status, and market conditions.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Browse 1,800+ Spanish New Builds
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}

function ResultRow({
  label,
  value,
  subtitle,
  highlight,
}: {
  label: string;
  value: string;
  subtitle?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-baseline">
      <div>
        <span className="text-sm text-gray-400">{label}</span>
        {subtitle && <span className="block text-xs text-gray-600">{subtitle}</span>}
      </div>
      <span className={`text-xl font-bold ${highlight ? 'text-emerald-400' : 'text-white'}`}>
        {value}
      </span>
    </div>
  );
}
