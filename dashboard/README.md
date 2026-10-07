# TV Energy Explorer dashboard

React + Vite dashboard using Plotly and static CSV data.

The dashboard shows registration shares, energy by size, technology comparisons
within size bands, standby power, brand summaries and ten ranked energy bars.
Technology colours remain consistent across charts and filters.

The 04 Oct 2026 CSV is a registration snapshot, not sales or viewing data.
`GrandDate` is empty throughout the source; `ExpDate` is an expiry date.
Year-on-year changes cannot be calculated from this file. The page cites the
2024 E3 Digital Displays report separately for historical context.

## Development

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Production check

```powershell
npm run build
npm run preview
```

From the assignment root, validate the data and chart calculations:

```powershell
node scripts/check_dashboard_data.mjs
```

## Vercel deployment

```powershell
npx vercel
npx vercel --prod
```

## Refresh data

From `Assignments/Demonstration-1`:

```powershell
python scripts/sync_knime_data.py
```

Run the CSV Writer nodes in KNIME and save the workflow first. The sync command
checks column names, numeric values and summary counts before updating website data.
If an export is invalid, reset and execute its CSV Writer again.
