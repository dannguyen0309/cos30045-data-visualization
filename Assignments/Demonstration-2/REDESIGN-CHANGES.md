# Imported design report

Source: student-provided `Demo-2-redesigned.zip`, integrated 1 November 2026.
The report below describes checks claimed by the external designer; these are not independent verification by this agent. See `evidence/TEST-RESULTS.md` for our checks. The supplied after-redesign screenshot is external evidence, not captured during integration.

---

# Demo 2 - redesign change summary

All text and code comments remain English. Plain HTML/CSS/JavaScript and bundled D3 v7 only; no new
dependencies, no deployment, no GitHub changes. Source CSVs, D3, PDFs, `vercel.json`,
`scripts/build_site.cjs` and the original evidence images are byte-identical to the handoff.

## Design changes
- **Design system** (`shared/base.css`, rewritten): colour, type, spacing and radius tokens; warm paper
  background; serif display headings (system fonts only, so nothing to download) with a clean sans body;
  consistent cards, kickers, callouts and disclosure chevrons.
- **Hierarchy:** lighter two-column home hero, chapter headings with a large numeral, a kicker above every
  chart heading (Comparison / Proportion / Trend / Distribution / Relationship), takeaways as callouts.
- **Chart layout and colour:** quieter gridlines, larger axis text, bold axis titles. The leading brand bar
  keeps the accent colour; the others use a tint. The 2022 price peak is marked and labelled. Size groups
  use one sequential ramp (Small -> Large). LCD/LED/OLED use a colour-blind-safer trio; the histogram takes
  the selected technology's colour so it visibly links to the scatterplot.
- **Controls:** the technology filter is a labelled segmented control (44px targets); on desktop it stays
  visible while scrolling Exercise 6. Table numbers are right-aligned.
- **Responsive:** verified at 375px, 768px and 1280px. On phones the header is static with a 2x2 nav, the
  filter is a four-up row and the duplicate hero illustration is hidden.

## Fixes found while testing
- Donut legend read "1. 1. Small..." (CSV names already carry the number) - now "1. Small...".
- Status line read "25 brand;" - now "25 brands;".
- Methodology page wrongly marked "03 / Multi-chart" as the current page.
- In-page quick links used an external-link arrow; they now point down.
- Footer declaration links are each labelled ("AI declaration · 4/5/6") instead of bare "5" and "6".

## Script changes (presentation only; data logic untouched)
`shared/chart.js` (numeric column flag), `Lab-4/bar-chart.js`, `Lab-5/line-chart.js`,
`Lab-5/donut-chart.js`, `Lab-6/shared-constants.js`, `Lab-6/interactions.js`, `Lab-6/histogram.js`.
Legend swatches now use a `--swatch` CSS variable instead of inline borders. Cache-busting query strings
were bumped (`base.css?v=4`, scripts `?v=3`).

## Preserved requirements (verified in headless Chromium)
- Counts All/LCD/LED/OLED = 4233/455/3492/286; histogram frequencies sum to each count; the scatterplot
  point count matches; bin boundaries and all four axis tick sets are identical across 13 repeated filter
  clicks and an All reset; resizing 375 -> 768 -> 1280 -> 375 keeps the filter, with one SVG per chart.
- Bar charts keep zero baselines; all 25 brands, 27 price points and all outliers retained.
- Pointer, keyboard (arrow keys, Enter/Space, Escape) and record-selector inspection all work; keyboard
  focus is visible on points (3px ring), buttons and summaries; reduced-motion is respected.
- No console errors, failed requests or horizontal overflow on any of the 7 pages at 3 widths.
- `node scripts/build_site.cjs` still builds `dist/` correctly.

## Evidence
`evidence/website-after-redesign.png` is a 1280x800 headless-Chromium capture of the redesigned home page,
taken after the redesign. The original `website-before-redesign.png` is unchanged.

## Not checked
Real Safari/Firefox/physical-device testing and a screen-reader pass were not possible here; only Chromium
was used. Fallback serif fonts differ by operating system, so headline widths may vary slightly.
