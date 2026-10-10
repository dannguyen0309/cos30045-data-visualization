# COS30045-Data-Visualization

Course assignments for COS30045 Data Visualisation.

Repository layout:

```text
Demonstration-1/   October-snapshot explorer and KNIME analysis
Lab/
  Lab-1/          Cleaning, brand counts and annotated KNIME export
  Lab-2/          Size/technology exploration and annotated KNIME export
  Lab-3/          February-snapshot data story and storyboard
Submission/       Named portable workflow archives and declaration draft
QA/               Verification results and screenshots
```

Lab 1/2 node annotations are concise single lines. Their `.knwf` exports include
source data and start as CONFIGURED; import and run Execute all to reproduce the
results. Lab 2 keeps the verified 20-bin Histogram. The 10/30-bin experiments were
not performed, by the student's choice.

## Labs

- [Lab 1](Lab/Lab-1/DataViz-Exercise-1/README.md): KNIME cleaning, brand counts and the exported workflow.
- [Lab 2](Lab/Lab-2/Exercise-2/README.md): KNIME size/technology exploration and the exported workflow.
- [Lab 3](Lab/Lab-3/README.md): separate February-snapshot data story, three static charts and a visual storyboard.

The tutor has instructed use of this personal repository. Lab 3 is separate from
the broader Demonstration 1 explorer, which brings together methods from Labs
1–3 with its October snapshot.

Run the Lab 3 story from the repository root:

```powershell
python -m http.server 8003 --bind 127.0.0.1 --directory Lab/Lab-3
```

## Demonstration 1

- [Dashboard](Demonstration-1/dashboard/README.md): TV energy visualisation website.
- [KNIME workflow](Demonstration-1/Demo-1.knwf): importable workflow archive.
- `Demonstration-1/Demo-1/`: unpacked KNIME workflow and exported data.
- `Demonstration-1/tv_2026_10_04.csv`: source dataset snapshot, 04 October 2026.
- [Data cleaning audit](Demonstration-1/DATA_CLEANING_AUDIT_VI.md).
- [Data story and storyboard](Demonstration-1/DATA_STORY.md): Demo 1 synthesis of Labs 1–3.
- [Visual storyboard](Demonstration-1/dashboard/public/storyboard.html).

## Data Story

The explorer is for Australian TV shoppers comparing estimated annual energy
between similar-sized models. Its sequence moves from catalogue context to
screen size, technology within size bands, and individual TVs. The closing
guidance connects those comparisons to the official Energy Rating label.
Audience, questions and the six-scene storyboard are documented in
[DATA_STORY.md](Demonstration-1/DATA_STORY.md).

## About the data

The source is the Australian Government Energy Rating registration CSV dated
**4 October 2026**. KNIME filters Australian Available registrations and expiry
status, standardises brands, converts units and exports chart data: 4,839 records
remain from 5,030 source rows. These are public product registrations, not sales,
retailer stock or household usage. Processing, privacy, accuracy/limitations and
ethics are documented in [DATA_STORY.md](Demonstration-1/DATA_STORY.md).

Standalone Lab 3 uses the **15 February 2026** teaching snapshot, mean energy and
three size groups. Demo 1 uses its October snapshot, median energy and four size
bands. The sites share methods, while keeping their figures separate.

## AI Declaration

OpenAI Codex assisted with this Lab 3 narrative integration and its documentation
on 10 October 2026. Existing chart calculations and KNIME outputs were retained.
Review and add earlier AI assistance before submitting the complete declaration.

## Development

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
