# Demonstration 1

- [Dashboard](dashboard/README.md): TV energy visualisation website.
- [KNIME workflow](Demo-1_NguyenNgocLamDan.knwf): importable workflow archive.
- `Demo-1/`: unpacked KNIME workflow and exported data.
- `tv_2026_10_04.csv`: source dataset snapshot, 04 October 2026.
- [Visual storyboard](dashboard/public/storyboard.html).

## Data Story

The explorer is for Australian TV shoppers comparing estimated annual energy
between similar-sized models. Its sequence moves from catalogue context to
screen size, technology within size bands, and individual TVs. The closing
guidance connects those comparisons to the official Energy Rating label.
The reading sequence is shown in the
[visual storyboard](dashboard/public/storyboard.html).

## About the data

The source is the Australian Government Energy Rating registration CSV dated
**4 October 2026**. KNIME filters Australian Available registrations and expiry
status, standardises brands, converts units and exports chart data: 4,839 records
remain from 5,030 source rows. These are public product registrations, not sales,
retailer stock or household usage. The analysis describes this snapshot and does not establish causal relationships.

Standalone Lab 3 uses the **15 February 2026** teaching snapshot, mean energy and
three size groups. Demo 1 uses its October snapshot, median energy and four size
bands. The sites share methods, while keeping their figures separate.

## AI Declaration

See [GenAI-Declaration_Demo-1.md](GenAI-Declaration_Demo-1.md).

## Development

Run the website from `Assignments/Demonstration-1/`:

```powershell
cd dashboard
npm ci
npm run dev
```

Validate dashboard data from `Assignments/Demonstration-1/`:

```powershell
node scripts/check_dashboard_data.mjs
```

After executing and saving the KNIME workflow, synchronise its exports from `Assignments/Demonstration-1/`:

```powershell
python scripts/sync_knime_data.py
```

For Vercel, set Root Directory to `Assignments/Demonstration-1/dashboard`, Application Preset
to Vite, Build Command to `npm run build`, and Output Directory to `dist`.


## Source and generated files

`Demo-1/` contains KNIME settings, input data and exported CSVs. The `.knwf` archive is retained. KNIME runtime caches stay on the original machine and are ignored by Git; a fresh checkout may need Execute all to regenerate node outputs.

`dashboard/public/data/` is the only website CSV directory. `scripts/sync_knime_data.py` validates the KNIME exports and updates it. `npm run build` generates `dashboard/dist/`; do not edit built assets or maintain a second `dashboard/data/` copy.
