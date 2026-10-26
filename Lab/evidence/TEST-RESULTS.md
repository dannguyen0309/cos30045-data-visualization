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
