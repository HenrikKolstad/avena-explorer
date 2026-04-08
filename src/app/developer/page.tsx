'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// ---------------------------------------------------------------------------
// Supabase client (anon key is fine for reading; leads inserts use service key)
// ---------------------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Lead {
  id: string;
  created_at: string;
  user_email: string | null;
  property_ref: string | null;
  property_name: string | null;
  property_price: number | null;
  developer: string | null;
  action: string | null;
  status: string | null;
}

interface PropertyRow {
  p: string;   // project name
  d: string;   // developer
  l: string;   // location
  pf: number;  // price from
  _sc?: number; // score
  ref?: string;
}

type Tab = 'leads' | 'properties' | 'stats';

type LeadStatus = 'New' | 'Contacted' | 'Viewing' | 'Sold';
const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Viewing', 'Sold'];

// ---------------------------------------------------------------------------
// Commission modal
// ---------------------------------------------------------------------------
interface CommissionModalProps {
  lead: Lead;
  onClose: () => void;
  onConfirm: (leadId: string, salePrice: number, rate: number) => void;
}

function CommissionModal({ lead, onClose, onConfirm }: CommissionModalProps) {
  const [salePrice, setSalePrice] = useState<number>(lead.property_price ?? 0);
  const [rate, setRate] = useState<number>(8);

  const gross = (salePrice * rate) / 100;
  const avena = gross / 2;
  const xavia = gross / 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        className="w-full max-w-md rounded border mx-4"
        style={{ background: '#0d0d0f', borderColor: '#c9a84c33' }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#c9a84c33' }}>
          <span className="font-serif text-lg tracking-wide" style={{ color: '#c9a84c' }}>
            Commission Calculator
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Modal body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Property</p>
            <p className="text-sm text-gray-200 truncate">{lead.property_name ?? lead.property_ref ?? '—'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">
                Sale Price (€)
              </label>
              <input
                type="number"
                value={salePrice}
                onChange={e => setSalePrice(Number(e.target.value))}
                className="w-full rounded px-3 py-2 text-sm font-mono focus:outline-none"
                style={{ background: '#1a1a1f', border: '1px solid #c9a84c44', color: '#e5e5e5' }}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">
                Rate (%)
              </label>
              <input
                type="number"
                value={rate}
                step="0.1"
                onChange={e => setRate(Number(e.target.value))}
                className="w-full rounded px-3 py-2 text-sm font-mono focus:outline-none"
                style={{ background: '#1a1a1f', border: '1px solid #c9a84c44', color: '#e5e5e5' }}
              />
            </div>
          </div>

          {/* Commission breakdown */}
          <div className="rounded p-4 space-y-2" style={{ background: '#111115', border: '1px solid #c9a84c22' }}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Gross commission</span>
              <span className="font-mono" style={{ color: '#c9a84c' }}>€{gross.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Avena share (50%)</span>
              <span className="font-mono text-green-400">€{avena.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Xavia share (50%)</span>
              <span className="font-mono text-blue-400">€{xavia.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex gap-3 px-6 pb-5">
          <button
            onClick={onClose}
            className="flex-1 rounded py-2 text-sm font-medium text-gray-400 hover:text-white border border-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(lead.id, salePrice, rate)}
            className="flex-1 rounded py-2 text-sm font-medium transition-colors"
            style={{ background: '#c9a84c', color: '#070709' }}
          >
            Mark as Sold
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------
function StatusBadge({ status }: { status: string | null }) {
  const colors: Record<string, string> = {
    New: '#3b82f6',
    Contacted: '#f59e0b',
    Viewing: '#8b5cf6',
    Sold: '#10b981',
  };
  const s = status ?? 'New';
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-medium"
      style={{ background: (colors[s] ?? '#6b7280') + '22', color: colors[s] ?? '#9ca3af', border: `1px solid ${colors[s] ?? '#6b7280'}44` }}
    >
      {s}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function DeveloperPortal() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);

  // Commission modal
  const [modalLead, setModalLead] = useState<Lead | null>(null);

  // Status update map (leadId → new status) for optimistic UI
  const [pendingStatus, setPendingStatus] = useState<Record<string, string>>({});

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/');
    }
  }, [authLoading, user, router]);

  // Load leads
  const loadLeads = useCallback(async () => {
    if (!supabase) { setLeadsLoading(false); return; }
    setLeadsLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setLeads(data as Lead[]);
    setLeadsLoading(false);
  }, []);

  // Load properties from public/data.json
  const loadProperties = useCallback(async () => {
    try {
      const res = await fetch('/data.json');
      const raw = await res.json();
      setProperties(raw as PropertyRow[]);
    } catch {
      setProperties([]);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadLeads();
      loadProperties();
    }
  }, [user, loadLeads, loadProperties]);

  // Update lead status
  async function updateStatus(leadId: string, newStatus: string) {
    if (newStatus === 'Sold') {
      const lead = leads.find(l => l.id === leadId);
      if (lead) { setModalLead(lead); return; }
    }
    await persistStatus(leadId, newStatus);
  }

  async function persistStatus(leadId: string, newStatus: string) {
    setPendingStatus(prev => ({ ...prev, [leadId]: newStatus }));
    if (!supabase) return;
    await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    setPendingStatus(prev => { const n = { ...prev }; delete n[leadId]; return n; });
  }

  async function handleCommissionConfirm(leadId: string, _salePrice: number, _rate: number) {
    setModalLead(null);
    await persistStatus(leadId, 'Sold');
  }

  // ---------------------------------------------------------------------------
  // Derived stats
  // ---------------------------------------------------------------------------
  const now = new Date();
  const thisMonthLeads = leads.filter(l => {
    const d = new Date(l.created_at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });

  const soldLeads = leads.filter(l => (l.status ?? 'New') === 'Sold');
  const conversionRate = leads.length > 0 ? ((soldLeads.length / leads.length) * 100).toFixed(1) : '0.0';

  const viewingLeads = leads.filter(l => (l.status ?? 'New') === 'Viewing');
  const commissionPipeline = viewingLeads.reduce((sum, l) => sum + ((l.property_price ?? 0) * 0.08), 0);

  // Leads by action
  const actionCounts: Record<string, number> = {};
  leads.forEach(l => {
    const k = l.action ?? 'unknown';
    actionCounts[k] = (actionCounts[k] ?? 0) + 1;
  });

  // Leads per property ref
  const leadsByRef: Record<string, number> = {};
  leads.forEach(l => {
    if (l.property_ref) leadsByRef[l.property_ref] = (leadsByRef[l.property_ref] ?? 0) + 1;
  });

  // Top 5 properties by leads
  const top5 = Object.entries(leadsByRef)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Properties enriched with lead count
  const propertiesWithLeads = properties.map(prop => ({
    ...prop,
    leadCount: leadsByRef[prop.ref ?? ''] ?? 0,
  }));

  // ---------------------------------------------------------------------------
  // Auth loading / gate
  // ---------------------------------------------------------------------------
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#070709' }}>
        <div className="text-sm text-gray-500 tracking-widest uppercase">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#070709' }}>
        <div className="text-center space-y-3">
          <p className="font-serif text-2xl" style={{ color: '#c9a84c' }}>Access Denied</p>
          <p className="text-sm text-gray-500">You must be logged in to view this page.</p>
          <a href="/" className="inline-block mt-2 text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
            ← Return to Terminal
          </a>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen" style={{ background: '#070709', color: '#e5e5e5' }}>
      {/* Commission modal */}
      {modalLead && (
        <CommissionModal
          lead={modalLead}
          onClose={() => setModalLead(null)}
          onConfirm={handleCommissionConfirm}
        />
      )}

      {/* Header */}
      <header className="border-b px-6 py-5" style={{ borderColor: '#c9a84c22', background: '#070709' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1
              className="font-serif text-xl tracking-wide"
              style={{ color: '#c9a84c' }}
            >
              AVENA TERMINAL — Developer Portal
            </h1>
            <p className="text-xs text-gray-500 mt-0.5 tracking-widest uppercase">
              Leads & Commission Dashboard
            </p>
          </div>
          <a
            href="/"
            className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors border border-gray-700 px-3 py-1.5 rounded"
          >
            ← Terminal
          </a>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b px-6" style={{ borderColor: '#c9a84c22' }}>
        <div className="max-w-7xl mx-auto flex gap-0">
          {(['leads', 'properties', 'stats'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-5 py-3 text-sm uppercase tracking-widest transition-colors"
              style={{
                color: activeTab === tab ? '#c9a84c' : '#6b7280',
                borderBottom: activeTab === tab ? '2px solid #c9a84c' : '2px solid transparent',
              }}
            >
              {tab === 'leads' ? `Leads${leads.length ? ` (${leads.length})` : ''}` : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* ------------------------------------------------------------------ */}
        {/* TAB: LEADS                                                          */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'leads' && (
          <div>
            {leadsLoading ? (
              <div className="text-sm text-gray-500 py-12 text-center tracking-widest uppercase">Loading leads…</div>
            ) : leads.length === 0 ? (
              <div className="text-sm text-gray-500 py-12 text-center tracking-widest uppercase">No leads yet</div>
            ) : (
              <div className="overflow-x-auto rounded border" style={{ borderColor: '#c9a84c22' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#0d0d0f', borderBottom: '1px solid #c9a84c22' }}>
                      {['Date', 'Investor Email', 'Property', 'Developer', 'Action', 'Status'].map(col => (
                        <th
                          key={col}
                          className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium"
                          style={{ color: '#c9a84c' }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, idx) => {
                      const currentStatus = pendingStatus[lead.id] ?? lead.status ?? 'New';
                      return (
                        <tr
                          key={lead.id}
                          style={{
                            background: idx % 2 === 0 ? '#070709' : '#0a0a0c',
                            borderBottom: '1px solid #ffffff08',
                          }}
                        >
                          {/* Date */}
                          <td className="px-4 py-3 font-mono text-xs text-gray-400 whitespace-nowrap">
                            {new Date(lead.created_at).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>

                          {/* Email */}
                          <td className="px-4 py-3 text-gray-300 text-xs max-w-[180px] truncate">
                            {lead.user_email ?? <span className="text-gray-600">—</span>}
                          </td>

                          {/* Property */}
                          <td className="px-4 py-3 max-w-[220px]">
                            <span className="text-gray-300 text-xs block truncate" title={lead.property_name ?? ''}>
                              {lead.property_name ?? lead.property_ref ?? '—'}
                            </span>
                            {lead.property_price && (
                              <span className="font-mono text-xs mt-0.5 block" style={{ color: '#c9a84c' }}>
                                €{lead.property_price.toLocaleString('en-GB')}
                              </span>
                            )}
                          </td>

                          {/* Developer */}
                          <td className="px-4 py-3 text-xs text-gray-400 max-w-[140px] truncate">
                            {lead.developer ?? '—'}
                          </td>

                          {/* Action */}
                          <td className="px-4 py-3">
                            <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: '#1a1a1f', color: '#94a3b8' }}>
                              {lead.action ?? '—'}
                            </span>
                          </td>

                          {/* Status dropdown */}
                          <td className="px-4 py-3">
                            <select
                              value={currentStatus}
                              onChange={e => updateStatus(lead.id, e.target.value)}
                              className="rounded px-2 py-1 text-xs font-medium focus:outline-none cursor-pointer"
                              style={{
                                background: '#1a1a1f',
                                border: '1px solid #c9a84c33',
                                color: '#e5e5e5',
                              }}
                            >
                              {LEAD_STATUSES.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB: PROPERTIES                                                     */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'properties' && (
          <div>
            {properties.length === 0 ? (
              <div className="text-sm text-gray-500 py-12 text-center tracking-widest uppercase">Loading properties…</div>
            ) : (
              <div className="overflow-x-auto rounded border" style={{ borderColor: '#c9a84c22' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#0d0d0f', borderBottom: '1px solid #c9a84c22' }}>
                      {['Project Name', 'Developer', 'Town', 'Price From', 'Score', 'Leads'].map(col => (
                        <th
                          key={col}
                          className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium"
                          style={{ color: '#c9a84c' }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {propertiesWithLeads
                      .sort((a, b) => b.leadCount - a.leadCount)
                      .map((prop, idx) => (
                        <tr
                          key={`${prop.ref ?? prop.p}-${idx}`}
                          style={{
                            background: idx % 2 === 0 ? '#070709' : '#0a0a0c',
                            borderBottom: '1px solid #ffffff08',
                          }}
                        >
                          <td className="px-4 py-3 max-w-[260px]">
                            <span className="text-gray-200 text-xs block truncate" title={prop.p}>{prop.p}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{prop.d}</td>
                          <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                            {prop.l.split(',')[0]}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs whitespace-nowrap" style={{ color: '#c9a84c' }}>
                            €{prop.pf?.toLocaleString('en-GB') ?? '—'}
                          </td>
                          <td className="px-4 py-3">
                            {prop._sc != null ? (
                              <span
                                className="font-mono text-xs px-2 py-0.5 rounded"
                                style={{
                                  background: prop._sc >= 70 ? '#10b98122' : prop._sc >= 50 ? '#f59e0b22' : '#ef444422',
                                  color: prop._sc >= 70 ? '#10b981' : prop._sc >= 50 ? '#f59e0b' : '#ef4444',
                                }}
                              >
                                {prop._sc}
                              </span>
                            ) : (
                              <span className="text-gray-600 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {prop.leadCount > 0 ? (
                              <span
                                className="font-mono text-xs px-2 py-0.5 rounded"
                                style={{ background: '#c9a84c22', color: '#c9a84c', border: '1px solid #c9a84c44' }}
                              >
                                {prop.leadCount}
                              </span>
                            ) : (
                              <span className="text-gray-600 text-xs font-mono">0</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB: STATS                                                          */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            {/* Stat cards row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Leads This Month', value: thisMonthLeads.length.toString(), accent: '#c9a84c' },
                { label: 'Total Leads', value: leads.length.toString(), accent: '#94a3b8' },
                { label: 'Conversion Rate', value: `${conversionRate}%`, accent: '#10b981' },
                {
                  label: 'Commission Pipeline',
                  value: `€${commissionPipeline.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`,
                  accent: '#8b5cf6',
                },
              ].map(card => (
                <div
                  key={card.label}
                  className="rounded p-5"
                  style={{ background: '#0d0d0f', border: '1px solid #c9a84c22' }}
                >
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">{card.label}</p>
                  <p className="font-mono text-2xl font-bold" style={{ color: card.accent }}>
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Leads by action */}
            <div
              className="rounded p-6"
              style={{ background: '#0d0d0f', border: '1px solid #c9a84c22' }}
            >
              <h2 className="font-serif text-sm uppercase tracking-widest mb-4" style={{ color: '#c9a84c' }}>
                Leads by Action
              </h2>
              {Object.keys(actionCounts).length === 0 ? (
                <p className="text-xs text-gray-600">No data</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(actionCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([action, count]) => {
                      const pct = leads.length > 0 ? (count / leads.length) * 100 : 0;
                      return (
                        <div key={action} className="flex items-center gap-3">
                          <span className="text-xs font-mono text-gray-400 w-36 truncate">{action}</span>
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#1a1a1f' }}>
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, background: '#c9a84c' }}
                            />
                          </div>
                          <span className="text-xs font-mono w-10 text-right" style={{ color: '#c9a84c' }}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Status breakdown */}
            <div
              className="rounded p-6"
              style={{ background: '#0d0d0f', border: '1px solid #c9a84c22' }}
            >
              <h2 className="font-serif text-sm uppercase tracking-widest mb-4" style={{ color: '#c9a84c' }}>
                Leads by Status
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {LEAD_STATUSES.map(status => {
                  const count = leads.filter(l => (l.status ?? 'New') === status).length;
                  const statusColors: Record<string, string> = {
                    New: '#3b82f6',
                    Contacted: '#f59e0b',
                    Viewing: '#8b5cf6',
                    Sold: '#10b981',
                  };
                  const color = statusColors[status];
                  return (
                    <div
                      key={status}
                      className="rounded p-4 text-center"
                      style={{ background: color + '11', border: `1px solid ${color}33` }}
                    >
                      <p className="font-mono text-2xl font-bold" style={{ color }}>{count}</p>
                      <p className="text-xs uppercase tracking-widest mt-1" style={{ color: color + 'aa' }}>{status}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top 5 properties */}
            <div
              className="rounded p-6"
              style={{ background: '#0d0d0f', border: '1px solid #c9a84c22' }}
            >
              <h2 className="font-serif text-sm uppercase tracking-widest mb-4" style={{ color: '#c9a84c' }}>
                Top 5 Properties by Leads
              </h2>
              {top5.length === 0 ? (
                <p className="text-xs text-gray-600">No lead data yet</p>
              ) : (
                <div className="space-y-3">
                  {top5.map(([ref, count], i) => {
                    const prop = properties.find(p => p.ref === ref);
                    return (
                      <div key={ref} className="flex items-center gap-4">
                        <span
                          className="text-xs font-mono w-6 text-center rounded"
                          style={{ color: '#c9a84c', background: '#c9a84c22' }}
                        >
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-200 truncate">{prop?.p ?? ref}</p>
                          <p className="text-xs text-gray-500 truncate">{prop?.d ?? '—'} · {prop?.l?.split(',')[0] ?? '—'}</p>
                        </div>
                        <span
                          className="font-mono text-sm font-bold shrink-0"
                          style={{ color: '#c9a84c' }}
                        >
                          {count} leads
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
