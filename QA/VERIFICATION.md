# Verification — 10 October 2026

Student filename identifier: **NguyenNgocLamDan**.

Update on 11 October: Lab 1/2 node annotations were shortened to single lines
of at most 40 characters. Calculations and saved execution states were preserved.
The generic Lab exports and named submission archives were refreshed consistently.
Repository publication is requested by the student; the dated production checks
below describe the pre-publication verification rather than a deployment claim.

## Results

| Area | Result |
|---|---|
| Lab 1 | 14 saved EXECUTED nodes. The 73-brand CSV matches the original snapshot; counts total 4,508. |
| Lab 2 | Restored one Histogram, keeping the existing 17 node settings. All 18 nodes are now saved EXECUTED. |
| Histogram | Saved 20-bin frequencies total 4,508. See `knime-histogram-20-bins.json`. The student confirms 10/30 bins have not yet been tried. |
| Lab 3 data | Source counts and means match `story_summary.json`; all nine technology × size means match the stored KNIME Pivot table. |
| Demo 1 data | `check_dashboard_data.mjs` passes catalogue/technology calculations, comparison defaults, empty cases and CSV validation. October snapshot: 4,839 records and 3,985 valid standby records. |
| Demo 1 production build | Passes after the skip-link fix. Sandbox initially blocked esbuild spawning; the authorised build outside the sandbox succeeded. |
| Keyboard | Lab 3 and Demo 1 skip links now focus `main`. Demo reset and TV-card selection were checked with keyboard controls. |
| Demo filters | OLED: 292 records. OLED with ≤43 inches: 17. HUBBL + OLED: zero, with an empty-state message. Reset restores 4,839. |
| TV comparison | Switching to approximately 65 inches yields three models with measured diagonals around 64.5 inches. Changing TV 1 to LG selects another model and keeps the lowest-energy badge tied to the selected TVs. |
| Local links | Lab 3 story/storyboard and Demo storyboard internal file links exist. Lab 3 storyboard has six frames. |
| Copies | Updated Lab 2 and Lab 3 files are synchronised into the repository under `Assignments/Demonstration-1/Lab/`. |
| Portable archives | Three named archives contain current graph/settings, documentation and raw/derived data. Source states were verified EXECUTED; portable archives deliberately start CONFIGURED without live caches. Derived CSV Writers use overwrite so an imported workflow can be rerun. ZIP CRC/content checks pass; checksums are recorded in the submission manifest. |

## Responsive and visual evidence

The external browser's viewport override did not change the page viewport. Mobile verification therefore used temporary **375 × 812 CSS-pixel iframes**, rather than claiming a physical-device test. The Lab 3 and Demo frames had no horizontal overflow. Lab 3 tables fit the frame; all chart values also have text/table alternatives. The Lab 3 mobile storyboard uses a single 328px column and contains six frames; the desktop storyboard uses two columns.

SVG font size increased from 23 to 26 viewBox pixels, approximately 12.3 CSS pixels at the tested mobile chart width. Principal Lab 3 text contrasts against its page background are 13.75:1, 5.71:1 and 6.66:1. These are targeted checks, not a complete WCAG certification or a screen-reader/usability study.

Evidence images:

- `lab3-desktop.jpg`
- `lab3-mobile.jpg`
- `lab3-mobile-comparison.jpg`
- `lab3-storyboard-mobile.jpg`
- `demo1-mobile.jpg`
- `demo1-desktop-comparison.jpg`

## Production status and remaining work

The public Vercel page was opened during verification. Its introductory text still differs from the current local story, and the new `takeaway-title` section is absent. The verified local build has not been pushed or deployed in this task.

Before submission:

1. The student chose on 11 October to retain 20 bins and skip the 10/30-bin experiments. No 10/30-bin results or evidence are claimed.
2. Review the consolidated GenAI declaration for earlier AI use and accuracy.
3. Test importing the named workflow archives in a fresh KNIME location. Archive content/CRC checks are completed; an interactive import/re-execution test was not performed by Codex.
4. Publish the latest website/repository changes if the submission requires live access. Confirm tutor-specific hosting and deadline requirements on Canvas.

February Lab 3 mean/three-category figures remain separate from October Demo 1 median/four-band figures. No participant feedback, sales figures or time trend was inferred.
