import { Property } from './types';
import { initProperty } from './scoring';

export async function loadProperties(): Promise<Property[]> {
  try {
    const res = await fetch('/data.json');
    const properties: Property[] = await res.json();
    return properties.map(initProperty);
  } catch {
    return [];
  }
}

export async function syncSnapshots(properties: Property[]): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const lastSync = localStorage.getItem('avena-last-snapshot');
  if (lastSync === today) return; // Already synced today

  try {
    await fetch('/api/sync-snapshots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ properties: properties.map(p => ({ ref: p.ref, pf: p.pf, pt: p.pt, pm2: p.pm2, mm2: p.mm2 })) }),
    });
    localStorage.setItem('avena-last-snapshot', today);
  } catch (e) {
    // Silent fail — don't break the app if Supabase is down
  }
}
