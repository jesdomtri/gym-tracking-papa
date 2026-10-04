# Design

## Context

The website is a dependency-free static app: it loads `plan.json` and `recommendation.json`, stores actual sessions in week/day-keyed `localStorage`, and exports those records. Markdown history is manually maintained; the existing history guide uses sequential filenames, while the provided WhatsApp export contains fourteen dated sessions from four calendar weeks. The prior `rebuild-static-workout-planner` change established the fixed-plan and published-recommendation model; its final manual end-to-end verification remains outstanding.

## Goals / Non-Goals

**Goals:**
- Make dated workout reports comparable across weeks without altering their source meaning.
- Publish the 2026-10-05 prescription using trainer-confirmed double progression.
- Keep the existing five-day plan, target rep ranges, conservative RIR targets, and browser-local/static architecture except for the confirmed biceps machine replacement.
- Preserve historical identity and data when changing the biceps machine from DHZ to Impulse.

**Non-Goals:**
- Changing the split, exercise selection beyond the confirmed biceps machine replacement, series count, or target repetition ranges.
- Inferring actual RIR, pain, sensations, or machine details from absent or ambiguous fields.
- Building WhatsApp import, automatic progression, a server, remote database, or analytics.

## Decisions

### Date-based weekly Markdown history

Use one immutable `semana_YYYY-MM-DD.md` per Monday-starting calendar week, with the Monday date in the filename and dated sections for each session. This is more useful for comparing actual dates than a sequence number and matches the user's request for a history organized by weeks. Preserve every workout field and source note; normalize only the date heading and Markdown formatting. Leave unreported fields unknown. Record explicitly confirmed non-training days as not performed, but do not infer other missing sessions. Keep the existing `semana_actual.md` as the working template and revise the history README to explain the date-based archive.

For the provided export, archive the weeks starting 2026-09-07, 2026-09-14, 2026-09-21, and 2026-09-28. Preserve generic exercise descriptions without guessed exercise IDs. Keep anomalous values in the archive but exclude the explicitly identified 12 kg × 20 hip thrust, 13 kg × 40 row, and 45 kg × 2 hack-squat entry from progression decisions.

### Trainer-applied double progression

Keep each exercise's established range. Increase load only if every prescribed set with valid, comparable results reaches or exceeds its upper bound; use the smallest increment verified for that machine. If trustworthy performance is below the lower bound, reduce load; otherwise hold the load and continue seeking repetitions within range. An omitted or excluded set cannot satisfy the increase threshold. The recommendation remains manual and trainer-approved; no progression is calculated in the browser. Preserve the current target RIR from the fixed plan/recommendation because actual RIR is missing from the reports; do not substitute generic RIR guidance from the principles document for the individualized plan.

### Separate machine identity for the biceps curl

Rename the fixed pairing to the Impulse machine and assign `pull-biceps-impulse`; do not reuse `pull-biceps-dhz`. The 2026-09-22 message heading says DHZ while its note says the machine changed to Impulse. Preserve both exactly in history and, per the trainer's confirmation, treat its 26 kg × 12 × 2 result as Impulse for progression. Keep the 2026-09-29 DHZ entry as DHZ and do not compare its load to Impulse. In the browser, retain prior DHZ data under its old ID and export; do not migrate it into the new exercise ID.

### Static publication and cache

Put the next week's planned series, ranges, target RIR, and per-series load in `website/recommendation.json`; keep actual weights out of `plan.json`. Update the fixed-plan mirror and trainer Markdown source together. Increment the service-worker cache name when published assets change. No new runtime dependencies or automated services are needed.

## Risks / Trade-offs

- [Risk] Machine increments or actual machine labels differ from assumed kg values → verify the smallest selectable increment on each machine and never invent one.
- [Risk] Historical reports have incomplete or contradictory fields → preserve source wording and unknowns; use only trainer-confirmed machine interpretations for progression.
- [Risk] Changing the exercise ID can make old local records invisible in the active exercise form → leave old records untouched and recoverable through the existing all-records export; never relabel DHZ data as Impulse.
- [Risk] Static browser cache can retain an old recommendation → update the cache version and validate a fresh served site.
- [Risk] The five-day recommendation has missing workout days and no actual RIR/pain values → make decisions only from completed reliable sessions and do not interpret missing fields as zero or normal.

## Migration Plan

1. Transcribe the source workout reports into the four dated weekly history files and cross-check all session fields against the WhatsApp export.
2. Update the fixed plan and its Markdown source to the Impulse biceps curl with a new ID; ensure the new recommendation covers every fixed exercise.
3. Prepare and review the week-starting 2026-10-05 recommendation from reliable same-machine results, preserving ranges and target RIR.
4. Update the weekly history instructions and service-worker cache metadata; validate JSON and OpenSpec artifacts.
5. Serve the website over HTTP and manually verify all five recommendations, new exercise identity, prior-week record retention/export, and current-week recording. Rollback by restoring the previous static assets/cache version; keep the Markdown history append-only.
