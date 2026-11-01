# Demonstration 2 verification record

Date: 26 October 2026. These are technical checks performed by Codex, not a usability study with participants.

## Data and saved KNIME evidence — passed

- The student executed and saved the adapted workflows in `Lab-4/KNIME-Exercise-4` and `Lab-5/KNIME-Exercise-5` using KNIME desktop.
- Codex inspected the saved settings: all 10 Lab 4 nodes and all 12 Lab 5 nodes have state EXECUTED. The three CSV Writers have actual output files in the workflow data areas. See `knime-execution.json`.
- Actual CSV outputs were copied with `python Lab/scripts/sync_knime.py`. No reference-calculation fallback remains in the website.
- `python Lab/scripts/check_data.py` passes. Brand counts match the original snapshot: 25 brands and 4,240 registrations after the >=20 threshold. Lab 5 counts and means match independent calculations: 736 rounded-55-inch records; size counts 1,111 / 2,059 / 1,338, totalling 4,508. All 27 supplied price averages match the four-state arithmetic means.
- The Lab 6 site copy is byte-identical to the downloaded CSV. It has 4,233 valid records, including the 2,652-kWh/year outlier. LED=3,492; LCD=455; OLED=286.
- The actual GroupBy count header is `Count*(Model_No)`; the charts and validation use this exact spelling.

## Automated JavaScript checks — passed

- `node Lab/scripts/check_charts.cjs` exercises the actual Lab 6 loader with real and small synthetic inputs. Missing numeric values remain NaN, valid zero energy is retained, negative energy is excluded and a header-only file produces the empty-state message.
- Bin totals equal selected record counts for LCD, LED, OLED, All and an absent technology. Boundaries remain identical. Both domain endpoints and the real outlier are retained.
- `node --check` passes for all 11 authored website JavaScript files after the English comments were added.

## Actual browser checks — passed

- The shared home page renders 25 horizontal bars, three mean-energy bars, 27 line-chart observations, three donut arcs, a histogram and a 4,233-point scatterplot using the local D3 file.
- Clicking LCD, LED and OLED updates the histogram totals and scatterplot point counts to 455, 3,492 and 286 respectively. All restores 4,233. Each chart retains exactly one SVG. Fixed histogram intervals span 0–2,800 in 200-kWh/year steps.
- Pressing Enter on OLED activates the native button, updates its pressed state and both charts, and retains a visible focus outline.
- Selecting record 171 displays `metz 65MXD9500A`, OLED, 65 inch, 4 stars and 586 kWh/year. ArrowRight from the first OLED point focuses that same second record and updates the tooltip. Escape restores the inspection prompt.
- At a 375px viewport, chart geometry is recalculated; the observed document scroll width is within the viewport. The tooltip remains within the viewport. See `interactivity-mobile.png`.
- Desktop and mobile screenshots were captured from the real localhost page. The desktop image captures the All controls and start of the histogram; the mobile image captures the histogram. These images are not KNIME or Developer Tools evidence.
- Three separate declaration PDFs were rendered to PNG and visually inspected. Each is one readable page without clipping.

## Remaining manual checks

- Capture the SVG drawing together with its expanded live DOM in Developer Tools. The inline source excerpt is not a substitute for this screenshot.
- Browser zoom at exactly 200%, real touch hardware, a screen reader and an OS-level reduced-motion browser setting were not verified.
- Browser failure/empty states were not exercised with network interception. The loader's empty and invalid-value behaviour was checked automatically.
- No participant testing or student oral understanding was assessed. No participant results are fabricated.
- No GitHub push, Mercury upload, Vercel deployment or Canvas submission was performed.

The English comments explain key statements and concepts. They do not prove the student can explain or modify the code without reading them.

## Post-demonstration refinement — 1 November 2026

The student reports the classroom demonstration is complete and authorised Vercel hosting for Demo 2. The source snapshot and analytical definitions were retained.

- Reworked the English interface with shared typography, a teal/cream palette, compact navigation, numbered exercise sections and responsive chart panels. Added a dedicated sources/methods page, direct evidence images and links to the separate declarations.
- Added numeric-axis gridlines and clearer donut centre text. These are display changes; original means, counts, units, grouping rules, domains and filters remain intact.
- Ran the data and chart-loader checks again: passed. All authored JavaScript passed syntax checking. The allowlist build and static-page check passed: seven pages, 125 valid local references, unique IDs and no old labs or KNIME caches in the public output.
- Real browser checks at an observed `innerWidth` of 375 px found and fixed navigation overflow. All seven pages then had document scroll widths within the viewport, no alert messages and no broken loaded images. See `redesign-pages-mobile.json`.
- Real mobile filter checks again returned LCD=455, LED=3,492, OLED=286 and All=4,233, matching point counts and bin totals. Each chart retained one SVG. Selecting record 171 displayed the expected screen size and energy; its tooltip stayed within the viewport. See `redesign-browser-checks.json`.
- Visually inspected the redesigned desktop hero in the browser. Later screenshot captures repeatedly timed out in the browser-control tool. The successful original screenshot is retained as `website-before-redesign.png`; no failed capture is represented as a new screenshot.
- Captured the original house in the browser (`house-before.png`). Added a vector coordinate diagram for all eight primitives (`house-coordinate-sheet.svg`) and labelled it as a diagram, not a screenshot. It preserves the original scene coordinates and adds an outer annotation margin.
- Revised the three declarations to distinguish the original implementation from post-demo assistance. Rendered and visually inspected all three one-page PDFs: readable, with no clipping.

Still manual: a genuine screenshot of the revised drawing together with the expanded Developer Tools DOM; exact 200% zoom; real touch hardware and screen-reader testing. Attempted zoom key commands did not change the observed browser scale, so a 200% check is not claimed. Reduced-motion behaviour is covered by automated preference stubs, not an OS-level browser preference check.


## Production deployment verification - 1 November 2026

- Production: https://cos30045-demonstration-2.vercel.app/
- Project: `cos30045-demonstration-2`; separate project, Root Directory `Lab`, preset Other.
- Initial production source: `a38c448`, pushed to `main` with explicit student approval.
- Vercel displayed Deployed to Production. The initial browser security checkpoint completed; the public website loaded in Edge.
- The home page rendered six chart SVG images plus the scatterplot group. The four direct exercise pages and sources page loaded. CSV rendering was checked after loading, not immediately after navigation.
- Brand page: 25 bars and 4,240 registrations. Multi-chart page: three charts, 736 rounded-55-inch records, 4,508 size-group records and 27/27 valid annual price rows.
- Live filters: LCD 455, LED 3,492, OLED 286 and All 4,233. Each histogram frequency sum equalled the scatterplot point count. Each retained one histogram SVG and one scatterplot SVG. No role-alert errors were present.
- Actual public DOM results: `deployment-checks.json`.
- Re-ran data verification and chart assertions: PASS.
- No Canvas upload or submission was performed. Real Developer Tools evidence remains manual; 200% zoom and screen reader checks remain unverified.


## Imported designer ZIP integration - 1 November 2026

- Integrated `Demo-2-redesigned.zip` supplied by the student. CSVs, loaders, original SVGs, D3 and deployment configuration were byte-identical; only changed website files and supplied after-redesign image were imported. Original KNIME folders and course evidence were preserved.
- The external design report remains local. Its claims are not our independent test results. The external AI tool/model was not identified. Existing declaration PDFs predate this import; review them to include the additional tool before submission.
- Independent checks passed: Python data verification, Node chart assertions, authored JavaScript syntax and built-site reference/ID checks (7 HTML pages, 125 references).
- Edge local browser: all 7 pages at observed 376 CSS px (browser scaling), no horizontal page overflow, no role-alert errors. Combined page: 6 charts, 4,233 scatterplot points and 25 brand bars.
- Seven repeated technology filters retained one SVG per chart, fixed bin boundaries and all axis tick sets. Histogram totals equalled point counts: LCD 455, LED 3,492, OLED 286, All 4,233.
- Enter activated OLED. Record selector 171 displayed metz 65MXD9500A, OLED, 65 inch, 4 stars, 586 kWh/year. Tooltip stayed within the mobile viewport. No console warnings/errors during interaction checks.
- Checked 2022 peak label 144.5, 27 line observations, numeric Count/Share headers and absence of duplicate legend numbering.
- Captured and visually inspected the actual desktop homepage: `website-integrated-redesign.png`. DOM results: `imported-redesign-checks.json`.
- Source changes remain local, with no commit, push, deployment or Canvas submission for this import. Physical-device, screen-reader and 200% zoom checks were not performed.


## Floating scatterplot tooltip - 1 November 2026

- Added a single floating text label on pointer enter, focus and click. The persistent accessible status and record selector remain available. The label is hidden on pointer leave, blur, Escape and chart redraw/filter changes.
- Verified real pointer hover in Edge: Philips 65OLED789/98, OLED, 65 inch, 4.5 stars, 493 kWh/year; floating text matched the persistent status. Pointer leave hid it.
- Enter showed the label and Escape hid it. At observed 376 CSS px, the tooltip stayed horizontally within the chart (right edge 326.22 px).
- All reset retained exactly one hidden floating label and 4,233 points. The combined homepage also displayed the tooltip with 286 OLED points.
- JavaScript syntax, static reference checks and existing chart assertions passed. Actual DOM results: `scatter-tooltip-checks.json`.
- Changes remain local; no deployment performed.


## Repository reorganisation - 1 November 2026

- Git tracks only Lab 1-6 below `Lab/`. Other local Lab-root files are retained on disk and ignored. No local downloads or workflow archives were deleted.
- Shared assessment assets, declarations, evidence and the combined pages now live in `Assignments/Demonstration-2/`. Lab 4-6 remain the canonical chart sources; the build assembles them without duplicating source code.
- Updated direct source-page links and normalised build output paths. Source reference check passed: 7 pages and 114 local references. Public build check passed: 7 pages and 125 references. Independent data checks and chart assertions passed from their new locations.
- The build reads only tracked lab sources and assessment assets. Original CSV/workflow files at Lab root are no longer required by the build or data check.
- The production project keeps its domain and route paths. Root Directory is `Assignments/Demonstration-2`, with outside-root source files included. Automatic skipping for root-only changes is disabled so Lab 4-6 changes can trigger builds.
