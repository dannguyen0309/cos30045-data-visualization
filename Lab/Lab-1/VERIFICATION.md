# Lab 1 verification — 10 October 2026

Checked the saved `DataViz-Exercise-1` workflow and the exported `DataViz-Exercise-1.knwf` after the student ran Execute all.

## Passed

- All 14 nodes are saved as `EXECUTED` and have annotations.
- CSV Reader uses the current workflow data area and reads the unchanged 15 February 2026 teaching CSV.
- Cleaning includes Samsung, Q.Bell, SVISION and the reviewed Hubbl parent-brand grouping.
- Available filter: 4,710 records. Australia filter: 4,508 records.
- GroupBy/Sorter output: 73 brands. The exported CSV has 73 unique brand rows, with counts in descending order.
- Every brand count in `data/COS30045-Exercise1.csv` exactly matches an independent calculation from the original CSV; the counts total 4,508.
- Bar Chart category is `Brand_Reg`; value is `Count(SoldIn)`; direction is horizontal. Pie Chart category is `Brand_Reg`; value is `Count(SoldIn)`.
- The `.knwf` ZIP is intact and contains the original CSV, the exact exported CSV, README and GenAI declaration.
- The archived workflow graph and all node settings match the saved, executed workflow.

## Remaining submission checks

- Add the student's name to the exported filename, following the Week 2 class slide.
- Review the GenAI declaration for earlier AI use and personal confirmation.
- Open the two chart views to confirm visual appearance, and test importing the export into a new KNIME location. These interactive checks were not performed by Codex.

No Lab 1 data or workflow configuration was changed during this verification. The technical results are sufficient to proceed with Lab 2.
