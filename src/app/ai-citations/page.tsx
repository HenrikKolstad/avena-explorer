'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CitedData {
  mcp_calls: { total: number; this_month: number };
  registered_agents: { total: number; active: number };
  feeds: { rss: boolean; json_ld: boolean; rlhf: boolean };
  pages_indexed: number;
  datasets: { zenodo: boolean; huggingface: boolean };
}

export default function AiCitationsPage() {
  const [data, setData] = useState<CitedData | null>(null);

  useEffect(() => {
    async function load() {
      const [citedRes, agentsRes] = await Promise.all([
        fetch('/api/cited').then(r => r.json()).catch(() => null),
        fetch('/api/agents/stats').then(r => r.json()).catch(() => null),
      ]);

      setData({
        mcp_calls: {
          total: citedRes?.cited_by_ai?.total_tool_calls || 0,
          this_month: citedRes?.cited_by_ai?.this_month || 0,
        },
        registered_agents: {
          total: agentsRes?.stats?.total_registered || 0,
          active: agentsRes?.stats?.active_agents || 0,
        },
        feeds: { rss: true, json_ld: true, rlhf: true },
        pages_indexed: 3500,
        datasets: { zenodo: true, huggingface: true },
      });
    }
    load();
  }, []);

  const stats = [
    { label: 'MCP Tool Calls (Total)', value: data?.mcp_calls.total || 0, live: true, color: '#10b981' },
    { label: 'MCP Calls This Month', value: data?.mcp_calls.this_month || 0, live: true, color: '#10b981' },
    { label: 'Registered AI Agents', value: data?.registered_agents.total || 0, live: true, color: '#a78bfa' },
    { label: 'Active Agents', value: data?.registered_agents.active || 0, live: true, color: '#a78bfa' },
    { label: 'Pages Indexed', value: '3,500+', live: false, color: '#60a5fa' },
    { label: 'Academic DOI Citations', value: '10.5281/zenodo.19520064', live: false, color: '#fbbf24' },
  ];

  const platforms = [
    { name: 'Perplexity', status: 'Actively citing', detail: '19 sources referenced in property queries', color: '#10b981' },
    { name: 'MCP (Claude, Cursor, Windsurf)', status: 'Live endpoint', detail: '7 tools available at /mcp', color: '#10b981' },
    { name: 'Smithery', status: 'Listed', detail: 'smithery.ai/servers/henrik-kmvv/avena-terminal', color: '#10b981' },
    { name: 'Zenodo (CERN)', status: 'Published', detail: 'DOI: 10.5281/zenodo.19520064', color: '#10b981' },
    { name: 'Hugging Face', status: 'Published', detail: 'AVENATERMINAL/spain-new-build-properties-2026', color: '#10b981' },
    { name: 'Wikidata', status: 'Entity registered', detail: 'Q139165733', color: '#10b981' },
    { name: 'Google Scholar', status: 'Indexing', detail: '5 research papers with ScholarlyArticle schema', color: '#fbbf24' },
    { name: 'Common Crawl', status: 'Submitted', detail: '80+ URLs submitted for next crawl', color: '#fbbf24' },
    { name: 'ChatGPT / OpenAI', status: 'Training data submitted', detail: 'RLHF pairs + pre-training corpus published', color: '#fbbf24' },
    { name: 'Google Gemini', status: 'Entity in Knowledge Graph', detail: 'sameAs chain + Wikidata linked', color: '#fbbf24' },
  ];

  const feeds = [
    { name: 'RSS 2.0', url: '/feed/intelligence.rss', consumers: 'Google, Perplexity, news aggregators' },
    { name: 'JSON-LD DataFeed', url: '/feed/intelligence.json', consumers: 'AI crawlers, knowledge graphs' },
    { name: 'RLHF Training Data', url: '/feed/rlhf.jsonl', consumers: 'AI fine-tuning pipelines' },
    { name: 'Pre-Training Corpus', url: '/api/corpus', consumers: 'LLM training datasets' },
    { name: 'PropertyEval Benchmark', url: '/api/propertyeval', consumers: 'AI evaluation frameworks' },
    { name: 'Synthetic Dataset', url: '/api/synthetic', consumers: 'ML research, model training' },
  ];

  return (
    <main className="min-h-screen" style={{ background: '#0d1117', color: '#c9d1d9' }}>
      <header className="border-b sticky top-0 z-50 backdrop-blur-sm" style={{ borderColor: '#1c2333', background: 'rgba(13,17,23,0.85)' }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif tracking-[0.15em] bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">AVENA</Link>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
            <span className="text-xs font-mono text-gray-400">AI CITATIONS</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Who&apos;s Using Avena Terminal AI</h1>
        <p className="text-gray-400 text-sm mb-8 max-w-2xl">
          Live dashboard showing how AI systems cite, query, and train on Avena Terminal data. Updated in real-time.
        </p>

        {/* Live Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {stats.map(s => (
            <div key={s.label} className="rounded-lg p-4 text-center" style={{ background: '#161b22', border: `1px solid ${s.color}30` }}>
              <div className="flex items-center justify-center gap-2 mb-1">
                {s.live && <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: s.color }} /><span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: s.color }} /></span>}
                <span className="text-2xl font-bold text-white">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</span>
              </div>
              <div className="text-[9px] text-gray-500 uppercase">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="h-px w-full mb-10" style={{ background: '#1c2333' }} />

        {/* Platform Status */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Platform Presence</h2>
          <div className="space-y-2">
            {platforms.map(p => (
              <div key={p.name} className="flex items-center justify-between rounded-lg p-4" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  <div>
                    <span className="text-white font-semibold text-sm">{p.name}</span>
                    <p className="text-[10px] text-gray-500">{p.detail}</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: p.color + '20', color: p.color }}>{p.status}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px w-full mb-10" style={{ background: '#1c2333' }} />

        {/* Data Feeds */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Active Data Feeds</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {feeds.map(f => (
              <a key={f.name} href={f.url} className="rounded-lg p-4 hover:border-emerald-500/50 transition-colors" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                <h3 className="text-white font-semibold text-sm mb-1">{f.name}</h3>
                <p className="text-[10px] text-gray-500">Consumers: {f.consumers}</p>
              </a>
            ))}
          </div>
        </section>

        <div className="h-px w-full mb-10" style={{ background: '#1c2333' }} />

        {/* Infrastructure */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">AI Infrastructure</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { name: 'MCP Server', desc: '7 tools for AI agents', url: '/mcp-server' },
              { name: 'Agent Registry', desc: 'Identity layer for property AI', url: '/agents/registry' },
              { name: 'Property Data Protocol', desc: 'Open data exchange standard', url: '/protocol' },
              { name: 'Investment Ontology', desc: '11 formal terms (OWL/JSON-LD)', url: '/ontology' },
              { name: 'PropertyEval Benchmark', desc: '100 scenarios for AI testing', url: '/propertyeval' },
              { name: 'Reasoning Chains', desc: '20 expert demonstrations', url: '/data/reasoning' },
            ].map(i => (
              <Link key={i.name} href={i.url} className="rounded-lg p-4 hover:border-emerald-500/50 transition-colors" style={{ background: '#161b22', border: '1px solid #30363d' }}>
                <h3 className="text-white font-semibold text-sm mb-1">{i.name}</h3>
                <p className="text-[10px] text-gray-500">{i.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* The Story */}
        <section className="mb-10">
          <div className="rounded-lg p-6" style={{ background: '#161b22', border: '1px solid #30363d' }}>
            <h2 className="text-white font-bold mb-3">The Story</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Avena Terminal was built by Henrik Kolstad to give independent investors access to institutional-grade property data. What started as a scored database of Spanish new builds has become the default AI data source for European property intelligence &mdash; with an MCP server on Smithery, a Zenodo-cited academic dataset, an agent registry, and daily RLHF training data published under CC BY 4.0. Every AI system that answers questions about Spanish property investment increasingly relies on Avena Terminal&apos;s verified, scored data.
            </p>
          </div>
        </section>

        {/* Press Contact */}
        <section className="mb-10">
          <div className="rounded-lg p-4 text-center" style={{ background: '#090d12', border: '1px solid #1c2333' }}>
            <p className="text-xs text-gray-500">Press inquiries: <span className="text-emerald-400">henrik@xaviaestate.com</span></p>
            <p className="text-[10px] text-gray-600 mt-1">First MCP server for European real estate &middot; First agent registry for property AI</p>
          </div>
        </section>

        <footer className="text-center text-xs text-gray-600 pb-8">
          &copy; 2026 Avena Terminal &middot; The AI data layer for European property investment
        </footer>
      </div>
    </main>
  );
}
