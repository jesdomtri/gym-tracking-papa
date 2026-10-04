# Tasks

## 1. Archive the WhatsApp training history

- [x] 1.1 Create one Monday-dated Markdown file for each source week beginning 2026-09-07, 2026-09-14, 2026-09-21, and 2026-09-28; transcribe all 14 sessions with their source fields and dates, and verify every workout block against the WhatsApp export.
- [x] 1.2 Preserve unreported values, machine/setup notes, generic exercise labels, contradictory source details, and the explicitly excluded unusual results verbatim; mark only the confirmed 2026-09-28 and 2026-10-02 sessions as not performed, and verify no values were inferred or silently corrected.
- [x] 1.3 Update `gimnasio_padre/historial/README.md` to document the date-based immutable archive and relationship to `semana_actual.md`; verify the naming example and workflow match the four created files.

## 2. Update the fixed machine identity and publish the next week

- [x] 2.1 Change the fixed biceps curl from DHZ to Impulse in `gimnasio_padre/plan_activo.md` and `website/plan.json`, using a new unique ID and preserving the existing exercise slot and targets; verify the Markdown and JSON mirrors agree and the plan still has 20 unique IDs.
- [x] 2.2 Review every exercise's latest usable, same-machine results and create the 2026-10-05 recommendation with existing repetition ranges and target RIR; verify that weight increases occur only when every prescribed valid set reaches/exceeds the maximum, valid below-minimum results are reviewed for a reduction, and unknown/excluded data never decide a load.
- [x] 2.3 Use the 2026-09-22 biceps note as the confirmed Impulse reference while preserving its DHZ heading in history, and keep the 2026-09-29 DHZ result separate; verify no load comparison or local-record reassignment crosses machine IDs.
- [x] 2.4 Validate `website/plan.json` and `website/recommendation.json` as JSON and confirm the recommendation provides every planned exercise ID, series, repetition bounds, target RIR, and approved per-series load for all five days.

## 3. Preserve compatibility and document publication

- [x] 3.1 Keep existing DHZ localStorage records under their old exercise ID and ensure the existing export still contains them after the new recommendation week and Impulse ID are loaded; verify prior-week data is not deleted or relabeled.
- [x] 3.2 Update `website/README.md` and relevant trainer documentation with the machine-ID rule, double-progression threshold, unknown/anomalous-data handling, and manual weekly publication; verify documented sources and workflow match the plan and recommendation files.
- [x] 3.3 Increment `CACHE_NAME` and keep `website/service-worker.js`'s cached asset list synchronized; verify a fresh service-worker install can serve the changed plan and recommendation.

## 4. Verify the published experience

- [x] 4.1 Serve `website/` over HTTP and manually inspect all five days for the 2026-10-05 week, the Impulse biceps machine, planned loads/ranges/RIR, and recording behavior; verify the browser console has no load or validation errors.
- [x] 4.2 Run `openspec validate "weekly-workout-history-progression" --type change --strict` and review the final diff; verify the new history, plan mirror, recommendation, cache metadata, and change artifacts agree without modifying the separate in-progress planner change.
