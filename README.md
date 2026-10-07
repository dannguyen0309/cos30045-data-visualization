# COS30045-Data-Visualization

Course assignments for COS30045 Data Visualisation.

## Demonstration 1

- [Dashboard](Demonstration-1/dashboard/README.md): TV energy visualisation website.
- [KNIME workflow](Demonstration-1/Demo-1.knwf): importable workflow archive.
- `Demonstration-1/Demo-1/`: unpacked KNIME workflow and exported data.
- `Demonstration-1/tv_2026_10_04.csv`: source dataset snapshot, 04 October 2026.
- [Data cleaning audit](Demonstration-1/DATA_CLEANING_AUDIT_VI.md).

Run the website from the repository root:

```powershell
cd Demonstration-1/dashboard
npm ci
npm run dev
```

Validate dashboard data from the repository root:

```powershell
node Demonstration-1/scripts/check_dashboard_data.mjs
```

After executing and saving the KNIME workflow, synchronise its exports:

```powershell
python Demonstration-1/scripts/sync_knime_data.py
```

For Vercel, set Root Directory to `Demonstration-1/dashboard`, Application Preset
to Vite, Build Command to `npm run build`, and Output Directory to `dist`.
