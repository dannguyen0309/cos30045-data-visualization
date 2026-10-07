import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { loadData } from "../dashboard/src/data.js";
import { BANDS, catalogueSummary, technologyEnergy, lowestEnergyRegistrations, comparisonChoices, comparisonSize, defaultComparisonTVs, tvKey } from '../dashboard/src/analysis.js';

globalThis.fetch = async (path) => ({
  ok: true,
  text: () => readFile(new URL(`../dashboard/public${path}`, import.meta.url), "utf8"),
});
const { cleaned, standby } = await loadData();
assert.equal(cleaned.length, 4839);
assert.equal(new Set(cleaned.map((row) => row.Brand_Reg)).size, 73);
assert.equal(standby.length, 3985);

const catalogue = catalogueSummary(cleaned);
assert.deepEqual(catalogue.bands.map(item => item.count), [1175, 1240, 923, 1501]);
assert.equal(catalogue.largeCount, 2424);
assert.deepEqual(catalogue.technologies.map(item => item.count), [3940, 607, 292]);
const technologies = technologyEnergy(cleaned);
assert.deepEqual(technologies.find(item => item.technology === 'LCD (LED)').values.map(item => item.energy), [150, 321, 462, 685.5]);
assert.deepEqual(technologies.find(item => item.technology === 'OLED').values.map(item => item.energy), [232, 331, 444, 656]);
const oledSmall = cleaned.filter(row => row.Screen_Tech === 'OLED' && row['Screen Size Band'] === BANDS[0]);
const filtered = technologyEnergy(oledSmall);
assert.equal(filtered.length, 1);
assert.equal(filtered[0].values[0].count, 17);
assert.equal(filtered[0].values[1].energy, null); // Missing groups are not zero-energy TVs.
assert.deepEqual(technologyEnergy([]), []);
const originalOrder = cleaned.map(row => row['Registration Number']);
const ranked = lowestEnergyRegistrations(cleaned);
assert.equal(ranked.length, 10);
assert.ok(ranked.every((row, index) => !index || row['Labelled energy consumption (kWh/year)'] >= ranked[index - 1]['Labelled energy consumption (kWh/year)']));
assert.deepEqual(cleaned.map(row => row['Registration Number']), originalOrder);
assert.equal(lowestEnergyRegistrations(oledSmall.slice(0, 3)).length, 3);
assert.deepEqual(lowestEnergyRegistrations([]), []);
const fiftyInch = comparisonChoices(cleaned, 50);
assert.equal(comparisonSize({ 'Screen Size (inches)': 49.4988 }), 50);
const defaults = defaultComparisonTVs(fiftyInch);
assert.deepEqual(defaults.map(row => row.Brand_Reg), ['SAMSUNG', 'KOGAN', 'LG']);
assert.deepEqual(defaults.map(row => row['Labelled energy consumption (kWh/year)']), [222, 210, 141]);
assert.equal(new Set(defaults.map(tvKey)).size, 3);
assert.ok(defaults.every(row => comparisonSize(row) === 50));
assert.equal(defaultComparisonTVs(fiftyInch.filter(row => row.Brand_Reg === 'SAMSUNG')).length, 3);
assert.equal(defaultComparisonTVs(fiftyInch.slice(0, 1)).length, 1);
assert.deepEqual(defaultComparisonTVs([]), []);
assert.deepEqual(comparisonChoices(cleaned, 999), []);

globalThis.fetch = async () => ({
  ok: true,
  text: async () => "Screen Size Band,Count*(Submit_ID)\n1. Small,1175\n",
});
await assert.rejects(loadData(), /Invalid TV data/);
console.log('PASS: catalogue, technology, 3-TV defaults, size grouping, empty/single-brand cases and CSV validation.');
