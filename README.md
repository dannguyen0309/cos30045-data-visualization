# COS30045 - Data Visualisation

Course exercises and assessment websites. Each exercise keeps its source code and data; each assessment keeps its shared assets, build instructions and evidence.

## Repository structure

```text
Assignments/
  Demonstration-1/     October TV explorer, KNIME analysis and React dashboard
  Demonstration-2/     SVG/D3 website, shared assets, declarations and evidence
Lab/
  Lab-1/              KNIME cleaning and brand counts
  Lab-2/              KNIME size and technology exploration
  Lab-3/              February TV data story and storyboard
  Lab-4/              SVG house and horizontal bar chart
  Lab-5/              Vertical bars, line chart and donut chart
  Lab-6/              Histogram, scatterplot, filters and tooltip
```

- [Demonstration 1](Assignments/Demonstration-1/README.md): development, data processing and deployment instructions.
- [Demonstration 2](Assignments/Demonstration-2/README.md): build, verification, sources and declarations.
- [Lab 1](Lab/Lab-1/DataViz-Exercise-1/README.md), [Lab 2](Lab/Lab-2/Exercise-2/README.md) and [Lab 3](Lab/Lab-3/README.md): exercise-specific notes.

Demo 1 uses the 4 October 2026 snapshot, medians and four size bands. Lab 1-3 and Demo 2 use their supplied February teaching data and their documented grouping rules. Product registrations are not sales or household consumption. Keep original datasets and real KNIME processing evidence.

The tutor instructed use of this personal repository. The critique assignment and its existing Git configuration remain separate.

## Quick start

Demo 1:

```powershell
cd Assignments/Demonstration-1/dashboard
npm ci
npm run dev
```

Demo 2, from the repository root:

```powershell
node Assignments/Demonstration-2/scripts/build_site.cjs
python -m http.server 8005 --bind 127.0.0.1 --directory Assignments/Demonstration-2/dist
```

Live Demo 2: https://cos30045-demonstration-2.vercel.app/

## Local files

`.local/` holds archived local material, including the old Lab-root website and original downloads under `.local/legacy-lab/`. Those files remain on this computer, outside the active source tree. Previously local-only submission helpers and redesign notes remain local-only.

`tmp/`, `dist/`, dependency folders and KNIME runtime caches are not source code. Regenerate builds with the commands above; regenerate node outputs in KNIME. Do not delete original datasets, workflows, declarations or assessment evidence as part of a build cleanup.
