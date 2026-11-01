# Demonstration 2 - SVG and interactive D3

Production: https://cos30045-demonstration-2.vercel.app/

This assessment assembles the canonical exercise sources in `Lab/Lab-4`, `Lab/Lab-5` and `Lab/Lab-6`. Shared website assets, evidence and separate GenAI PDFs live here. `Lab` contains only Lab 1-6 in Git. Original downloads and local preparation files remain on the student's computer and are ignored by Git.

## Run and verify

From the repository root:

```powershell
node Assignments/Demonstration-2/scripts/build_site.cjs
python Assignments/Demonstration-2/scripts/check_site.py
python Assignments/Demonstration-2/scripts/check_data.py
node Assignments/Demonstration-2/scripts/check_charts.cjs
python -m http.server 8005 --bind 127.0.0.1 --directory Assignments/Demonstration-2/dist
```

Open http://127.0.0.1:8005/. The build copies only website assets, declarations and chart data, and normalises relative paths for a self-contained public site. It excludes old labs, KNIME caches and development scripts. Do not edit `dist`; edit the source HTML, `shared/base.css`, `shared/chart.js` or the relevant lab JavaScript.

To preview source pages together, serve the repository root and open `/Assignments/Demonstration-2/`. Direct Lab 4-6 pages use the same shared assets.

## Deployment

Vercel project: `cos30045-demonstration-2`. Root Directory: `Assignments/Demonstration-2`. Preset: Other. Build Command: `node scripts/build_site.cjs`. Output Directory: `dist`. Include source files outside the Root Directory, since the build reads the canonical Lab 4-6 sources. Keep the production URL and `/Lab-4/`, `/Lab-5/`, `/Lab-6/` routes unchanged.

The student selected Vercel. Canvas names Mercury; acceptance for Demo 2 has not been independently confirmed. No Canvas submission has been made by the agent.

## Data and interaction

The website uses bundled D3 v7, plain HTML/CSS/JavaScript and relative CSV loading. See [Sources & methods](methodology.html) for the teaching snapshots, units, rounded screen-size grouping and interpretation limits. Registrations are not sales; wholesale prices are not household electricity prices.

Executed KNIME workflows and their real CSV outputs remain under Lab 4 and Lab 5. The independent data check compares the CSVs against the preserved February snapshot in Lab 2; it does not replace KNIME evidence.

The All/LCD/LED/OLED filter updates both charts with fixed bins and domains. Counts are 4,233/455/3,492/286. All outliers are retained. Hover/focus/tap shows a floating scatterplot label; persistent status, a record selector and tables provide alternatives. Keyboard focus and reduced motion are supported.

## Evidence and submission

- `output/pdf/GenAI-Declaration_Exercise-4.pdf`, `-5.pdf`, `-6.pdf`: separate document uploads.
- `evidence/TEST-RESULTS.md`: actual checks and limitations; older paths describe the layout at the time of each historical check.
- `REDESIGN-CHANGES.md`: attributed report from the student-supplied AI design ZIP. Its tool/model was not identified; review the declarations to include that additional tool before submission.

The classroom demonstration is complete as reported by the student. A genuine SVG-with-expanded-Developer-Tools-DOM screenshot remains a manual item. The coordinate sheet is labelled as a diagram, not fabricated evidence. Screen-reader, physical-device and 200% zoom checks remain unverified.
