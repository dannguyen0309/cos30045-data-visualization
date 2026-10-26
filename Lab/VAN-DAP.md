# Oral demonstration — quick preparation

Open `http://127.0.0.1:8004/`. Demonstrate each idea using the actual drawing, DOM and source code. Do not read comments as your explanation.

## Suggested five-minute walkthrough

1. **SVG house:** explain the top-left origin, x/y directions and viewBox. Show the roof polygon, curved path and two windows. Explain that transforms move a local coordinate system; the second window inherits the outer translation and adds its own.
2. **Brand chart:** show the CSV and the console length/min/max/extent. Explain numeric conversion and the asynchronous Promise. Show `.data(data, key).join(...)`, the linear count scale and band category scale. Counts mean registrations, with a >=20 brand threshold.
3. **Multi-chart:** show why the energy comparison fixes size at rounded 55 inches. Point to the reversed y range and bar height `h - y(mean)`. Explain that the price line follows sorted numeric years; circles show observations, while `d3.line()` generates the path. Explain how `d3.pie()` calculates angles and `d3.arc()` draws the donut.
4. **Interactivity:** choose OLED, then LCD, then All. Both charts and the record count update. Explain `filter`, the keyed join, separate chart scales and the fixed bins/domains. Select a record to demonstrate the tooltip and its screen size. Explain why removing the outlier or rescaling after each filter would change the comparison.

## Questions to answer in your own words

| Question | Point to demonstrate |
| --- | --- |
| How does `viewBox` differ from CSS width? | SVG uses internal drawing coordinates; CSS controls displayed size. |
| What does `translate(250,210)` do? | Moves the group origin; children keep local coordinates and inherit styles. |
| Why does blank numeric input need special handling? | `Number('')` returns 0. `Chart.number()` returns NaN for blanks. |
| Why call rendering inside `.then()`? | CSV loading is asynchronous; data becomes available when the Promise resolves. |
| What does a join do? | Matches data to elements; creates missing elements, updates matches and removes exits. |
| Why use keys? | Stable record/brand IDs preserve the intended identity across updates. |
| Why `scaleBand` for brands? | Brands are categories; the scale allocates separate positions and bandwidth. |
| Why start bar scales at 0? | Length encodes magnitude; a truncated baseline distorts the visual ratio. |
| Why is the y range reversed? | SVG y increases downward, so larger values need smaller screen y coordinates. |
| What do axes add? | Ticks and labels generated from the scale, positioned in translated groups. |
| Why sort years before drawing a line? | The path follows row order; an unsorted file can connect years backward. |
| What creates the donut hole? | A positive inner radius in `d3.arc()`. Set it to 0 for a pie. |
| How do histogram bins differ from categories? | Bins are adjacent numeric intervals. Height counts records in each interval. |
| Why keep bins and domains fixed when filtering? | Positions and heights remain directly comparable between technologies. |
| What are `(event, d)` in a D3 listener? | The DOM event and the datum bound to the selected element. |
| Why is star rating not an energy amount? | It is an ordered efficiency rating. Equal stars do not mean equal annual kWh. |
| What happens when two points overlap? | Both records remain in the data. Use the selector/table to inspect them individually. |
| What did GenAI produce? | Initial/revised SVG, website and chart code, workflow adaptations, tests and document drafts. Describe your own execution/review separately. |

## Practise these live changes

1. In `Lab-4/house.svg` and the inline SVG in `index.html`, change the roof fill and window translation. Predict the new coordinates before reloading.
2. In `Lab-4/bar-chart.js`, change `.padding(.2)` to `.4`. Explain why the bars become thinner.
3. In `Lab-5/donut-chart.js`, change `.innerRadius(r*.6)` to `.innerRadius(0)`. Explain the unchanged proportions.
4. In `Lab-6/load-data.js`, change the tick target from 14 to 7, reload and inspect the new intervals. The number is a tick target, not always an exact bin count.
5. In `Lab-6/shared-constants.js`, change the LED colour. Show the matching legend and scatterplot points.
6. In `Lab-6/shared-constants.js`, edit `describeTV`. Confirm that tooltip, selector and point accessible labels agree.

## Numbers worth checking before the interview

- Brand chart: 25 brands, 4,240 registrations after the brand threshold.
- Available Australian TV records used for Lab 5: 4,508.
- Rounded 55-inch subset: 736 records — LCD (LED) 585, OLED 68, LCD 83.
- Price series: 27 years, 1998–2024.
- Lab 6: All 4,233; LED 3,492; LCD 455; OLED 286. Energy extent 56–2,652 kWh/year.

These are checks against the supplied snapshots, not claims about current market sales. KNIME output verification status is recorded separately.
