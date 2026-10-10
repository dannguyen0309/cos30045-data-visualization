# Data story — Australian TV Energy Explorer

## Data Story

**Audience:** Australian TV shoppers comparing estimated energy consumption across screen sizes and technologies. They need understandable units, model-level detail and an explanation of why size belongs in a fair comparison.

**Purpose:** Support a reading sequence from catalogue context to screen size, within-size technology comparisons and individual models. The takeaway is to choose the size that meets the reader's needs, then compare labelled annual energy alongside stars.

**Questions:** How does annual energy relate to size? How do technology comparisons change within size bands? What do the selected similar-sized model records show?

The website preserves its broader charts and filters. Each chapter now includes reading context, and the final section connects the findings to the official TV label guidance. Text distinguishes registration share from sales and limits the model-comparison badge to the selected TVs.

### How Demo 1 synthesises Labs 1–3

| Lab concept | Demonstration 1 implementation |
|---|---|
| Lab 1: understand and clean data | Portable KNIME source, market filters, uppercase brand cleaning, reviewed brand replacements, aggregation and CSV exports |
| Lab 2: ask questions and compare charts | Size-energy scatter, energy summaries, technology comparisons, standby histogram and model inspection |
| Lab 3: communicate to an audience | Audience-led introduction, chapter sequence, contextual chart notes, practical takeaway and documented source/limits |

This is a synthesis of methods, not a concatenation of different snapshots. Demo 1 uses **4 October 2026**, median energy and four size bands. Standalone Lab 3 uses **15 February 2026**, mean energy and three rounded-size groups. The two sites do not treat their differences as a time trend.

### Storyboard

Open the [six-frame visual storyboard](dashboard/public/storyboard.html) or the
website's `/storyboard.html` page. The mapping below connects each frame to the
existing explorer.

| Scene | Reader question | Existing website section | Message |
|---|---|---|---|
| 1. Introduction and filters | What can this tell me? | Hero, filters and KPIs | Explore registered TVs using size and energy together |
| 2. Catalogue | What is represented? | Size counts and technology share | Registration counts describe the catalogue |
| 3. Size | How does energy vary with diagonal? | Scatter and median-by-size bars | Compare similar-sized models; read spread as well as typical values |
| 4. Technology | Is a technology comparison fair? | Grouped bars and standby histogram | Check size mix; distinguish annual energy from standby power |
| 5. Models | Which of these TVs uses less labelled energy? | Brand view and selected-TV cards | Inspect exact diagonals and model-level labels |
| 6. Takeaway and source | What should I check next? | Final reading guidance and footer | Compare kWh/year and stars within a suitable size; understand snapshot limits |

## About the data

**Source:** Australian Government Energy Rating registration data, original CSV `tv_2026_10_04.csv`. Snapshot: **4 October 2026**. [Publisher](https://www.energyrating.gov.au/program-tools/energy-rating-registration-database); [dataset metadata](https://data.gov.au/data/dataset/energy-rating-for-household-appliances). The CSV does not embed a licence; refer to publisher metadata and terms before reuse outside the course.

**Processing:** KNIME keeps records sold in Australia, marked Available, with a registration expiry on or after the snapshot date. It converts relevant numeric fields, converts cm to inches, creates four size bands, normalises brand case and reviewed aliases, and exports the cleaned and summarised tables. The source contains 5,030 rows; 4,839 remain, representing 73 cleaned brands and three screen technologies. Valid passive standby measurements total 3,985; unavailable measurements are excluded rather than converted to zero. See the [cleaning audit](DATA_CLEANING_AUDIT_VI.md) and the saved KNIME workflow for details.

**Privacy:** Public product registration records and aggregate summaries are used. No household usage, sales transactions or participant information is collected. No usability-study results are fabricated or claimed.

**Accuracy and limitations:** One record is a registration, not one sale. Available does not establish retailer stock. The labelled annual energy is a standardised estimate. Brands and technologies have different size/model mixes; broad bands reduce but do not eliminate those differences. Star ratings are ordered efficiency information and not a linear quantity of electricity. The dataset has no historical registration-date series; ExpDate is an expiry date. Historical context from the E3 report is identified as a separate source.

**Ethics:** Preserve and attribute the source. Disclose filters and missing-value handling, use zero baselines for magnitude comparisons, and keep technology labels consistent. Avoid sales-share claims, household-cost predictions without tariffs, causal conclusions and universal technology rankings. The selected-TV badge applies only to the selected records.

## AI Declaration

OpenAI Codex assisted with this Lab 3 integration on 10 October 2026: audience and story structure, contextual website text, the takeaway/source wording and this documentation. Existing chart calculations, filters and KNIME data were retained. Separate standalone Lab 3 artefacts were prepared from the February teaching snapshot.

This paragraph records this integration work, not the complete earlier AI history of Demonstration 1. Add and review earlier AI use in the final declaration. The student remains responsible for checking the outputs and explaining the submitted work.
