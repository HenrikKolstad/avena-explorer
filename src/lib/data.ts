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
