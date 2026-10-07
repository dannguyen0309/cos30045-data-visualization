# TV Energy Explorer dashboard

React + Vite dashboard using Plotly and static CSV data.

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
