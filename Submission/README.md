# Demonstration 1 — submission preparation

Student filename identifier: **NguyenNgocLamDan**.

The named `.knwf` files in this folder contain portable copies of the current workflows and their data. All source workflows were verified as executed (Lab 1: 14 nodes; Lab 2: 18; Demo 1: 31). The archives omit live runtime caches and start as CONFIGURED; run Execute all after import. CSV Writers in these portable copies overwrite only their derived outputs, never the original snapshots. Original saved workflows remain unchanged by packaging.

- `DataViz-Exercise-1_NguyenNgocLamDan.knwf` — Lab 1.
- `Exercise-2_NguyenNgocLamDan.knwf` — Lab 2, including the 20-bin Histogram whose saved source results were verified.
- `Demo-1_NguyenNgocLamDan.knwf` — independent October-snapshot analysis.
- `GenAI-Declaration_NguyenNgocLamDan.md` — consolidated declaration draft to review before submission.

See [verification results](../QA/VERIFICATION.md), [Lab 3 website](../Lab/Lab-3/index.html), [Lab 3 storyboard](../Lab/Lab-3/storyboard.html) and [Demo 1 story documentation](../Demonstration-1/DATA_STORY.md).

## Remaining before submission

1. Histogram remains at 20 bins by the student's choice. The 10/30-bin experiments were not performed; the Canvas question about changing bins remains an interpretation question to prepare for, not a claimed experiment.
2. Import the named `.knwf` files into a fresh KNIME location, run Execute all, verify the data paths/results, then export the executed version for submission. The portable ZIP content has been checked, but Codex did not perform a GUI import test. File checksums are recorded in `manifest.json`.
3. Review the GenAI declaration and add earlier assistance where applicable.
4. Update the repository and deployed website with the verified changes. The public Vercel page still differs from the local story; this task does not push or deploy.
5. Follow the current Canvas upload and tutor requirements. Do not submit until these remaining checks are complete.

## Links recorded in the project

- Repository: [cos30045-data-visualization](https://github.com/dannguyen0309/cos30045-data-visualization).
- Existing Demo deployment: [Australian TV Energy Explorer](https://cos30045-data-visualization-demo-1.vercel.app/).
- Submission page: [Demonstration 1](https://swinburne.instructure.com/courses/78028/assignments/803535).

The tutor's personal-repository instruction is recorded in the saved README. Lab 3 remains a separate February data story; Demo 1 is the October synthesis. Existing generic workflow exports are retained for established project links.
