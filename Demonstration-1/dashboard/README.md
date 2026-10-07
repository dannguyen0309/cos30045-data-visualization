# TV Energy Explorer dashboard

React + Vite dashboard using Plotly and static CSV data.

The dashboard shows registration shares, energy by size, technology comparisons
within size bands, standby power, brand summaries and three selectable TV cards.
The comparison cards group TVs by approximate screen size and show their exact
diagonals, annual energy, technologies and star ratings. Each card has brand/model
selectors; the lowest-energy badge applies only to the selected TVs.
Technology colours remain consistent across charts and filters.

The 04 Oct 2026 CSV is a registration snapshot, not sales or viewing data.
`GrandDate` is empty throughout the source; `ExpDate` is an expiry date.
Year-on-year changes cannot be calculated from this file. The page cites the
2024 E3 Digital Displays report separately for historical context.

## Development

Run these commands inside `Demonstration-1/dashboard` in the repository.

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

For GitHub imports, set Root Directory to `Demonstration-1/dashboard`, Application
Preset to Vite, Build Command to `npm run build`, and Output Directory to `dist`.
For CLI deployment, run the following inside this dashboard directory:

```powershell
npx vercel
npx vercel --prod
```

## Refresh data

From `Demonstration-1/` inside the repository:

```powershell
python scripts/sync_knime_data.py
```

Run the CSV Writer nodes in KNIME and save the workflow first. The sync command
checks column names, numeric values and summary counts before updating website data.
If an export is invalid, reset and execute its CSV Writer again.
