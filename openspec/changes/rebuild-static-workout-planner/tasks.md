# Tasks

## 1. Define the Fixed Plan and Weekly Recommendation

- [x] 1.1 Replace the generic pattern entries in `website/plan.json` with the 20 fixed exercise IDs, exact exercise names, machines, target ranges, RIRs, rests, warm-up, and available setup guidance; verify the file parses as valid JSON and contains five days with four exercises each.
- [x] 1.2 Add the trainer-published weekly recommendation data file with the supplied WhatsApp week as the initial seed, including planned series, repetition ranges, RIR targets, and per-series weights; verify every supplied exercise and series is represented without inventing missing RIR or pain values.
- [x] 1.3 Restructure `gimnasio_padre/plan_activo.md`, `gimnasio_padre/semana_actual.md`, `gimnasio_padre/historial/README.md`, and relevant exercise documentation around fixed exercises, setup notes, planned-versus-actual values, and manual weekly publication; verify all documentation links and the weekly workflow agree with the web data model.

## 2. Load and Render Published Prescriptions

- [x] 2.1 Update initialization to load the fixed plan and weekly recommendation as static assets, with a user-visible error when either required asset cannot be loaded; verify the site starts through a local static server and displays the selected day.
- [x] 2.2 Render each exercise with its fixed machine, target range, target RIR, rest, planned series, and planned weight per series while keeping planned values read-only; verify the initial seeded week shows the expected prescription for all five days.
- [x] 2.3 Render machine setup notes before the recording controls and preserve them independently from the client's session sensations and discomfort; verify supplied seat, chest-pad, and cable-height notes remain visible when changing days.

## 3. Implement Actual Recording and Versioned Storage

- [x] 3.1 Replace positional exercise records with versioned records keyed by stable exercise ID while retaining week/day separation; verify reordering display data does not change which exercise owns an existing record.
- [x] 3.2 Support actual-only series in addition to planned rows and allow unperformed planned rows to remain empty or be removed; verify the client can record fewer or more series without fabricating planned values.
- [x] 3.3 Preserve separate planned and actual values for weight, repetitions, RIR, sensations, discomfort, exercise-level lumbar pain, session status, and session-level lumbar pain; verify entering a lower actual weight does not change the published recommendation.
- [x] 3.4 Define and implement conservative handling for current positional `localStorage` data, migrating only deterministic matches and preserving ambiguous legacy data without silently reassigning it; verify the migration outcome is visible or recoverable through export.
- [x] 3.5 Keep weekly records available when the recommendation week changes and update export to include all versioned historical records; verify a new week does not delete the previous week's data and exported JSON parses successfully.

## 4. Preserve Completion and Sharing Behavior

- [x] 4.1 Keep warm-up gating, automatic saving, explicit completion, day navigation, and confirmed day deletion working with the new record shape; verify a completed session reloads with its data intact.
- [x] 4.2 Update the summary to include fixed exercise identity, planned values, actual values, RIR, setup-relevant notes where useful, sensations, discomfort, pain, warm-up status, and comments; verify the summary distinguishes planned and performed loads.
- [x] 4.3 Preserve manual WhatsApp, copy, email, and native share actions without adding incoming WhatsApp import; verify WhatsApp receives the completed summary body from a served local session.

## 5. Update Offline Assets and Documentation

- [x] 5.1 Add the weekly recommendation asset to `website/service-worker.js`, increment `CACHE_NAME`, and keep the cached `FILES` list synchronized; verify a fresh service-worker installation serves the current recommendation.
- [x] 5.2 Update `website/README.md` and root guidance to document fixed exercises, the separate weekly recommendation file, local storage/export limitations, manual trainer publication, and the no-backend boundary; verify the documented commands and source-of-truth relationships match the implementation.

## 6. End-to-End Verification

- [ ] 6.1 Serve `website/` over HTTP and manually exercise all five days, warm-up completion, planned-vs-actual entry, fewer/more series, missing optional values, local reload, week separation, export, completion, and WhatsApp sharing; record any browser-specific limitations.
- [x] 6.2 Validate all edited JSON files and run `openspec validate "rebuild-static-workout-planner" --type change --strict`; verify the change artifacts and implementation satisfy the spec scenarios before marking the change complete.
