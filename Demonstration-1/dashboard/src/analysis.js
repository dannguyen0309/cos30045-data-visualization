import { ANNUAL, group, median } from './data.js';

export const BANDS = ['1. ≤43 inches', '2. 44–55 inches', '3. 56–65 inches', '4. >65 inches'];
export const TECHNOLOGIES = ['LCD (LED)', 'LCD', 'OLED'];
export const TECHNOLOGY_COLORS = { 'LCD (LED)': '#3b82c4', LCD: '#668ab6', OLED: '#0ea5e9' };

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

export function tvKey(row) {
  return `${row.Brand_Reg}\u0000${row.Model_No}\u0000${row['Registration Number']}`;
}

export function comparisonSize(row) {
  return Math.round(Math.round(row['Screen Size (inches)'] * 10) / 10);
}

export function comparisonChoices(rows, size) {
  return rows.filter(row => comparisonSize(row) === size);
}

export function defaultComparisonTVs(rows) {
  const ordered = lowestEnergyRegistrations(rows, rows.length);
  const brands = Object.entries(group(rows, 'Brand_Reg')).sort((a, b) => b[1].length - a[1].length).map(([brand]) => brand);
  const preferred = [...new Set(['SAMSUNG', 'KOGAN', 'LG', ...brands])];
  const selected = preferred.map(brand => ordered.find(row => row.Brand_Reg === brand)).filter(Boolean).slice(0, 3);
  for (const row of ordered) {
    if (selected.length >= 3) break;
    if (!selected.some(item => tvKey(item) === tvKey(row))) selected.push(row);
  }
  return selected;
}
