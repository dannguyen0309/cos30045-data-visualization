# Lab 3 — Size first. Energy next.

Exercise 3 is a separate static data story based on the **15 February 2026 teaching dataset used in Lab 2**. Demonstration 1 remains the broader explorer and uses its own **4 October 2026** snapshot. The two projects share questions and design ideas; their figures are kept separate.

## Data Story

**Audience:** Australian TV shoppers who want to understand estimated annual energy use before comparing models. They recognise screen size in inches but may need help interpreting kWh/year, group averages and energy stars.

**Purpose:** Help readers compare size and technology together, then read the energy labels of similar-sized individual TVs. The story does not recommend a universal winning technology or claim to predict a household bill.

**Questions:**

1. How does mean annual energy differ between Small, Medium and Large screen groups?
2. Do the technology groups contain similar screen sizes?
3. How do technology-energy averages compare within a size group?

**Reading sequence:** Context and snapshot → size-energy comparison → technology size mix → within-size energy comparison → practical takeaway → source and limitations. See [storyboard.html](storyboard.html) and the completed [story page](index.html).

**Findings in this snapshot:** Small registrations average 158.1 kWh/year; Large registrations average 748.9. OLED registrations have a larger mean diagonal than the other technology groups. Technology rankings vary across size groups: in Medium, OLED averages 381.5 kWh/year and LCD (LED) 409.6; in Small, OLED averages 231.6 and LCD (LED) 163.0. These are descriptive associations, with broad size bands and different model mixes.

**Design guidelines:**

- Use three charts, each answering one question, with a finding above and a reading note below.
- Use labelled horizontal bars and a zero baseline. The grouped energy chart uses one 0–800 kWh/year scale across all nine bars.
- Keep the same technology colours throughout this page and repeat technology labels. Colour is supplementary to text.
- Put visible data tables after every chart, so key values do not depend on hover, image interpretation or colour discrimination.
- Use one column on phones; keep headings, sources and limitations readable. Provide a skip link and visible keyboard focus; avoid animation.
- Show sample counts and the snapshot date. Explain the small OLED sample and the limits of causal interpretation.

Munzner's audience/task framing guides the three comparison questions. Bertin's
quantitative position/length channels encode mean values, while colour identifies
nominal technology. Tufte's graphical integrity guides the zero baselines, shared
energy scale and restrained gridlines.

## About the data

### Source

Australian Government Energy Rating television registration data, supplied for Exercise 1 as `tv_2026_02_15.csv`. The unmodified course snapshot is included in [data/tv_2026_02_15.csv](data/tv_2026_02_15.csv). One row represents a TV registration record, not a sale or a unique household device.

Publisher references: [Energy Rating registration database](https://www.energyrating.gov.au/program-tools/energy-rating-registration-database), [data.gov.au dataset metadata](https://data.gov.au/data/dataset/energy-rating-for-household-appliances), and [official TV label guidance](https://www.energyrating.gov.au/consumer-information/products/televisions). The course CSV contains no licence field; no specific dataset licence is asserted here. Consult the publisher metadata and terms before redistributing outside the course.

### Processing and validation

- Keep `Availability Status = Available` and every `SoldIn` combination containing Australia: **4,508 of 4,724** records.
- Convert `screensize` from cm to inches using `/ 2.54`. Preserve exact inches for the technology mean-size chart.
- Round positive measured inches to the nearest integer for categories: Small ≤43, Medium 44–65, Large ≥66. This explicitly resolves the 43/66 boundary ambiguity in the Canvas examples.
- Calculate Mean labelled annual energy for size groups and technology × size groups. Do not replace missing values with zero. The selected size, technology and energy fields have no missing values in this filtered snapshot.
- Do not deduplicate registrations or add an ExpDate filter. This follows the Lab 2 analysis; model counts are registration counts.
- Brand-name normalisation belongs to Lab 1 and is not needed for these size/technology questions.

The saved Lab 2 size/technology nodes are `EXECUTED`. The static charts are rebuilt independently from the same original CSV by [build_story.py](build_story.py), using the same conversion, filtering and grouping rules. All nine technology × size mean-energy values were compared with the stored, executed KNIME Pivot table and matched within floating-point tolerance. The website's data and figures are not claimed to be CSV Writer exports.

The Lab 2 graph now has 18 saved, executed nodes. The restored screen-size Histogram has been executed with 20 bins; its stored bin frequencies total 4,508 records. The student has confirmed that the 10/30-bin experiments have not yet been performed. The size/technology results used by this story remain unchanged.

### Privacy

The analysis uses public product registration information. The website contains product-level aggregates and collects no participant, customer or household data. It has no analytics, cookies or form submissions. No usability participants or feedback results are claimed.

### Accuracy and limitations

- Available describes the registration snapshot, not current retailer stock.
- Mean is sensitive to extreme energy values; the charts include all selected registration records.
- Rounding measured diagonals does not establish a model's advertised nominal screen size.
- Broad size groups still contain different exact sizes and product features; grouping does not remove all confounding.
- The Small OLED group contains only 17 registrations.
- Labelled kWh/year is a standardised estimate; actual household use and tariffs vary. No electricity-cost calculation is made.
- One snapshot does not establish changes over time. February Lab 3 numbers are not mixed with October Demo 1 numbers.

### Ethics

Credit the data publisher and explain the filtering and grouping choices. Keep the source CSV unchanged. Use comparable axes, visible values and sample-size caveats. Avoid converting registration share into sales claims, implying causation, or ranking an entire technology from a single average.

## AI Declaration

OpenAI Codex assisted on 10 October 2026 with audience and story structure, the static HTML/CSS page, SVG charts, storyboard, data validation, this README, and the related narrative additions to Demonstration 1. Python standard-library calculations prepare and check the static figures; they do not replace the KNIME workflow evidence. The student chose to keep Lab 3 separate while using Demo 1 as a synthesis of Labs 1–3.

Review this declaration and add earlier AI assistance before submission. Be prepared to explain the data, chart choices, mean calculations and limitations independently.

## Run and repository

The site needs no JavaScript framework or package installation. Open `index.html` directly, or serve this folder:

```powershell
python -m http.server 8003 --bind 127.0.0.1 --directory Lab/Lab-3
```

Open `http://127.0.0.1:8003/`. Rebuild charts with `python Lab/Lab-3/build_story.py`; the script uses the Lab 2 CSV when available and the included local CSV otherwise. This fixed-snapshot page is static: changing the dataset also requires reviewing the narrative and tables in `index.html`.

The tutor has instructed the student to use the personal repository
[cos30045-data-visualization](https://github.com/dannguyen0309/cos30045-data-visualization)
instead of a separate GitHub Classroom repository. Lab 1, Lab 2 and this separate
Lab 3 website are organised under `Lab/`; Demonstration 1 remains the synthesis
under `Demonstration-1/`. The static files can be served by the course hosting
environment; no server-side Python is needed to view them.
