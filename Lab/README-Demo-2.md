# Demonstration 2 — Weeks 4–6

One static D3 v7 website, with every exercise on the home page and direct pages for individual demonstrations.

## Run locally

From the repository root:

```powershell
python -m http.server 8004 --bind 127.0.0.1 --directory Lab
```

Open **http://127.0.0.1:8004/**. Use the navigation to jump between the four exercises. D3 7.9.0 is stored locally; no npm install, build step or internet connection is needed for the website.

| Exercise | Main-page section | Direct page |
| --- | --- | --- |
| 4.1 SVG house | `/#house` | `/Lab-4/index.html` |
| 4.3–4.7 Bar chart | `/#brands` | `/Lab-4/bar.html` |
| 5 Multi-chart | `/#multichart` | `/Lab-5/index.html` |
| 6 Interactivity | `/#interactivity` | `/Lab-6/index.html` |

The source is plain HTML, CSS and JavaScript. Each chart has its own JavaScript file. `shared/chart.js` supplies numeric parsing, CSV validation, axes, tables and responsive sizing. Lab 6 loads its CSV once and separates constants, histogram, scatterplot, interactions and loading.

## Data and processing

- `Lab/2026 TV Data.knwf`: original Canvas workflow, [Exercise 4.4](https://swinburne.instructure.com/courses/78028/modules/items/5905243). The chart uses the actual CSV Writer output from the student's executed adapted workflow. Its values match the bundled reference CSV and an independent source calculation. The original snapshot is `tv_2026_02_15.csv`: 4,724 source rows, 4,508 Available registrations sold in Australia. Brands are trimmed/lowercased and Samsung Electronics is merged with Samsung. After keeping brands with count >=20, there are 25 brands and 4,240 registrations. This threshold excludes smaller brands; the chart is not the complete registration total.
- Lab 5 uses the same February source and existing Lab 2 cleaning/size rules. `screensize` is in centimetres. Divide by 2.54 and round to the nearest integer using HALF_AWAY_FROM_ZERO. Filter the rounded column for 55; GroupBy screen technology with Mean(annual energy) and Count(Model_No). This includes 736 records. Size groups: Small <=43, Medium 44–65, Large >=66 rounded inches. GroupBy counts total 4,508. No expiry-date filter or deduplication is added to this analysis.
- `ARE_Spot_Prices.csv`: original [Exercise 5.2](https://swinburne.instructure.com/courses/78028/modules/items/5905254) file. There are 27 annual observations, 1998–2024. The supplied average is the arithmetic mean of Queensland, NSW, Victoria and South Australia, excluding Tasmania and Snowy. Units are AUD per MWh, not household electricity tariffs. The original teaching file does not state an inflation adjustment; do not call it a real-price series.
- `Ex6_TVdata_withStar.csv`: original [Exercise 6.1](https://swinburne.instructure.com/courses/78028/modules/items/5905261) file, copied byte for byte into `Lab-6/data/`. There are 4,233 rows: LED 3,492; LCD 455; OLED 286. Energy ranges from 56 to 2,652 kWh/year. This prepared dataset differs from the 4,508-row Lab 5 population; do not combine their totals. The supplied W6 workflow includes deduplication and technology renaming. It references the February snapshot even though the Canvas prose calls it January 2026.
- Missing numeric values stay invalid rather than becoming zero. Lab 6 excludes records with missing/invalid size, stars, technology or energy, reports the exclusion count and retains all numeric outliers. No rows are excluded from the supplied Lab 6 CSV.

Each TV row is a registration record in a teaching snapshot, not a sale, household or measured electricity-use event. Star ratings are ordered ratings, not a ratio scale of energy use. Means and correlations do not establish causation. Teaching-file reuse licences have not been verified. Files were obtained from Canvas on 26 October 2026; their snapshot dates are distinct from the download date.

## KNIME evidence

Prepared workflows:

- `Lab-4/KNIME-Exercise-4.knwf`: supplied brand workflow plus a CSV Writer.
- `Lab-5/KNIME-Exercise-5.knwf`: existing Lab 2 preparation plus a rounded-55-inch filter, two GroupBy nodes and two CSV Writers.

Both workflows write to their own `data` area. Import, execute all nodes, save, and export with data. Keep the exported filenames above, then run:

```powershell
python Lab/scripts/sync_knime.py
python Lab/scripts/check_data.py
node Lab/scripts/check_charts.cjs
```

The default sync sources are the saved `KNIME-Exercise-4` and `KNIME-Exercise-5` directories. If workflows are elsewhere, pass their saved directories or exported `.knwf` paths to `sync_knime.py`. The script requires actual output CSVs and EXECUTED CSV Writer states. It does not turn calculated reference values into KNIME evidence. The actual exported count header is `Count*(Model_No)`; the website uses it exactly.

The generated workflow settings were adapted programmatically from the supplied workflows and existing Lab 2 nodes. `prepare_knime.py` refuses to overwrite an existing workflow folder. Do not rerun it over your executed work. The original downloaded workflows remain unchanged.

KNIME Batch Executor is not installed on this machine. The student executed and saved both workflows in the desktop application. Codex verified that all 22 saved nodes are EXECUTED, synchronised the three actual CSV Writer outputs, checked them against the raw snapshot, and archived the saved workflow folders as `.knwf` files. See `evidence/knime-execution.json` and `evidence/TEST-RESULTS.md`.

## Interaction and accessibility

- All/LCD/LED/OLED buttons update both histogram and scatterplot. They are native buttons with visible focus and `aria-pressed` state.
- Fourteen 200-kWh/year histogram bins span 0–2,800. Bin boundaries and axis domains stay fixed after filtering. The outlier is retained.
- Tooltip values appear below the scatterplot, within normal document flow. Hover, tap, focus, arrow-key navigation and a native record selector all provide inspection paths. The selector reaches overlapping points.
- Tables provide numerical equivalents. The complete filtered record table is generated when opened, keeping initial rendering lighter.
- ResizeObserver recomputes chart widths and tick density. Mobile uses the same data range with fewer ticks, not a scaled desktop screenshot.
- Reduced-motion preferences disable the histogram transition. The filter state is session-only; reload starts with All. No drag, permission prompts, external fonts or persistent user tracking are used.

## Submission and oral demonstration

Read [VAN-DAP.md](VAN-DAP.md), [SUBMISSION-CHECKLIST.md](SUBMISSION-CHECKLIST.md), and the separate GenAI declarations. Website code is not proof that the student can explain or modify it. Practise the changes before the interview.

Requirements checked against [Canvas Demonstration 2](https://swinburne.instructure.com/courses/78028/assignments/803536) and the local Week 4–6 course PDFs. D3 references: [CSV loading](https://d3js.org/d3-fetch), [binning](https://d3js.org/d3-array/bin), [data joins](https://d3js.org/d3-selection/joining), [scales](https://d3js.org/d3-scale), [shapes](https://d3js.org/d3-shape). D3 is redistributed under the ISC licence in `shared/D3-LICENSE.txt`.

No GitHub push, Mercury upload, Vercel deployment or Canvas submission is part of this local demo session.
