import { ANNUAL, group, median } from './data.js';

export const BANDS = ['1. ≤43 inches', '2. 44–55 inches', '3. 56–65 inches', '4. >65 inches'];
export const TECHNOLOGIES = ['LCD (LED)', 'LCD', 'OLED'];
export const TECHNOLOGY_COLORS = { 'LCD (LED)': '#1463ff', LCD: '#0b2c5f', OLED: '#0ea5e9' };

export function catalogueSummary(rows) {
  const bands = group(rows, 'Screen Size Band');
  const technologies = group(rows, 'Screen_Tech');
  return {
    bands: BANDS.map(band => ({ band, count: bands[band]?.length ?? 0 })),
    technologies: TECHNOLOGIES.filter(technology => technologies[technology]?.length)
      .map(technology => ({ technology, count: technologies[technology].length })),
    largeCount: rows.filter(row => row['Screen Size (inches)'] > 55).length,
  };
}

export function technologyEnergy(rows) {
  const bands = group(rows, 'Screen Size Band');
  return TECHNOLOGIES.map(technology => ({
    technology,
    values: BANDS.map(band => {
      const records = (bands[band] ?? []).filter(row => row.Screen_Tech === technology);
      return { band, count: records.length, energy: records.length ? median(records.map(row => row[ANNUAL])) : null };
    }),
  })).filter(summary => summary.values.some(value => value.count));
}

export function lowestEnergyRegistrations(rows, limit = 10) {
  return [...rows].sort((a, b) => a[ANNUAL] - b[ANNUAL]
    || String(a['Registration Number']).localeCompare(String(b['Registration Number']))).slice(0, limit);
}
