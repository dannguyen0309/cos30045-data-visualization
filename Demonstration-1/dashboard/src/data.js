export const ANNUAL = "Labelled energy consumption (kWh/year)";

const NUMERIC_COLUMNS = new Set([
  "Screen Size (inches)", ANNUAL, "Star2", "Star Rating Index",
  "Avg_mode_power", "Passive Standby Power (W)",
]);

export function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") { row.push(field); field = ""; }
    else if (character === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += character;
  }
  if (field || row.length) { row.push(field); rows.push(row); }

  const headers = rows.shift().map((header) => header.replace(/^\uFEFF/, ""));
  return rows.filter((values) => values.length > 1).map((values) => Object.fromEntries(
    headers.map((header, index) => [header, NUMERIC_COLUMNS.has(header) ? Number(values[index]) : (values[index] ?? "")]),
  ));
}

async function loadCsv(path, signal, requiredColumns) {
  const response = await fetch(path, { signal });
  if (!response.ok) throw new Error(`Could not load ${path}`);
  const rows = parseCsv(await response.text());
  if (!rows.length || requiredColumns.some((column) => !Object.hasOwn(rows[0], column))) {
    throw new Error(`Invalid TV data in ${path}. Re-export the CSV from KNIME.`);
  }
  if (rows.some((row) => requiredColumns.some((column) => NUMERIC_COLUMNS.has(column) && !Number.isFinite(row[column])))) {
    throw new Error(`Invalid numeric values in ${path}. Re-export the CSV from KNIME.`);
  }
  return rows;
}

export async function loadData(signal) {
  const [cleaned, standby] = await Promise.all([
    loadCsv("/data/cleaned_tv.csv", signal, ["Brand_Reg", "Model_No", "Registration Number", "Screen_Tech", "Screen Size (inches)", "Screen Size Band", ANNUAL, "Star2", "Star Rating Index"]),
    loadCsv("/data/standby_records.csv", signal, ["Brand_Reg", "Model_No", "Screen_Tech", "Screen Size (inches)", "Passive Standby Power (W)"]),
  ]);
  return { cleaned, standby };
}

export function median(values) {
  const ordered = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!ordered.length) return 0;
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;
}

export function group(rows, key) {
  return rows.reduce((groups, row) => {
    const label = row[key] || "Unknown";
    (groups[label] ||= []).push(row);
    return groups;
  }, {});
}
