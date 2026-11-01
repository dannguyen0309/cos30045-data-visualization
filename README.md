# COS30045-Data-Visualization

Course assignments for COS30045 Data Visualisation.

Repository layout:

```text
Assignments/Demonstration-1/   October-snapshot explorer and KNIME analysis
Assignments/Demonstration-2/   SVG and interactive D3 assessment website
Lab/
  Lab-1/          Cleaning, brand counts and annotated KNIME export
  Lab-2/          Size/technology exploration and annotated KNIME export
  Lab-3/          February-snapshot data story and storyboard
  Lab-4/          SVG house and brand bars
  Lab-5/          Multi-chart exercises
  Lab-6/          Coordinated filters and scatterplot tooltips
```

Lab 1/2 node annotations are concise single lines. Their `.knwf` exports include
source data and saved EXECUTED states, verified after import and Execute all.
Import and run Execute all to reproduce the results. Lab 2 keeps the verified 20-bin Histogram. The 10/30-bin experiments were
not performed, by the student's choice.

## Labs

- [Lab 1](Lab/Lab-1/DataViz-Exercise-1/README.md): KNIME cleaning, brand counts and the [exported workflow](Lab/Lab-1/Exercise-1_NguyenNgocLamDan.knwf).
- [Lab 2](Lab/Lab-2/Exercise-2/README.md): KNIME size/technology exploration and the [exported workflow](Lab/Lab-2/Exercise-2_NguyenNgocLamDan.knwf).
- [Lab 3](Lab/Lab-3/README.md): separate February-snapshot data story, three static charts and a visual storyboard.

The tutor has instructed use of this personal repository. Lab 3 is separate from
the broader Demonstration 1 explorer, which brings together methods from Labs
1–3 with its October snapshot.

Run the Lab 3 story from the repository root:

```powershell
python -m http.server 8003 --bind 127.0.0.1 --directory Lab/Lab-3
```

## Demonstration 1

- [Dashboard](Assignments/Demonstration-1/dashboard/README.md): TV energy visualisation website.
- [KNIME workflow](Assignments/Demonstration-1/Demo-1_NguyenNgocLamDan.knwf): importable workflow archive.
- `Assignments/Demonstration-1/Demo-1/`: unpacked KNIME workflow and exported data.
- `Assignments/Demonstration-1/tv_2026_10_04.csv`: source dataset snapshot, 04 October 2026.
- [Visual storyboard](Assignments/Demonstration-1/dashboard/public/storyboard.html).

## Data Story

The explorer is for Australian TV shoppers comparing estimated annual energy
between similar-sized models. Its sequence moves from catalogue context to
screen size, technology within size bands, and individual TVs. The closing
guidance connects those comparisons to the official Energy Rating label.
The reading sequence is shown in the
[visual storyboard](Assignments/Demonstration-1/dashboard/public/storyboard.html).

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

See [GenAI-Declaration_Demo-1.md](Assignments/Demonstration-1/GenAI-Declaration_Demo-1.md).

## Development

Run the website from the repository root:

```powershell
cd Assignments/Demonstration-1/dashboard
npm ci
npm run dev
```

Validate dashboard data from the repository root:

```powershell
node Assignments/Demonstration-1/scripts/check_dashboard_data.mjs
```

After executing and saving the KNIME workflow, synchronise its exports:

```powershell
python Assignments/Demonstration-1/scripts/sync_knime_data.py
```

For Vercel, set Root Directory to `Assignments/Demonstration-1/dashboard`, Application Preset
to Vite, Build Command to `npm run build`, and Output Directory to `dist`.

## Demonstration 2

See [Demonstration 2](Assignments/Demonstration-2/README.md) for the shared website, submission links, declarations and verification. Lab 4-6 keep the canonical exercise code; the assessment build assembles those sources with shared assets.

```powershell
node Assignments/Demonstration-2/scripts/build_site.cjs
python -m http.server 8005 --bind 127.0.0.1 --directory Assignments/Demonstration-2/dist
```

Live website: https://cos30045-demonstration-2.vercel.app/
