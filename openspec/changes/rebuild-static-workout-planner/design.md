# Design

## Context

The current product is a dependency-free static site. `website/app.js` fetches `plan.json`, renders one day at a time, stores records in `localStorage`, and generates WhatsApp summaries. The current plan uses positional exercise records and combines fixed plan data with generic alternatives. See `proposal.md` and `specs/static-workout-planner/spec.md` for the requested behavior.

## Goals / Non-Goals

**Goals:**

- Keep the application deployable as static files with no backend or new runtime dependency.
- Separate fixed exercise definitions, the current published recommendation, and actual client results.
- Make exercise identity stable across weekly plan updates.
- Preserve local historical records, export, warm-up gating, and manual WhatsApp sharing.
- Make the weekly trainer workflow explicit and safe for service-worker caching.

**Non-Goals:**

- Automatically importing incoming WhatsApp messages.
- Automatically deciding or publishing progression changes.
- Replacing the trainer's review of fatigue, RIR, discomfort, or next-day pain.
- Adding accounts, remote synchronization, or a server-side database.

## Decisions

### Separate fixed plan from weekly recommendation

Keep `website/plan.json` for stable exercise, machine, setup, warm-up, and general target definitions. Add a separate static weekly recommendation file, such as `website/recommendation.json`, for the published week, planned series, repetition ranges, RIR, and per-series weights. This preserves the existing rule that the plan mirror does not contain real weights and makes the weekly publication independently reviewable.

Alternatives considered: putting weekly weights directly in `plan.json` would mix long-lived exercise definitions with changing client data; calculating all values in the browser would not fit the agreed trainer-reviewed publication workflow.

### Use stable exercise IDs

Assign an immutable ID to each of the 20 fixed exercise slots, and store records by that ID rather than by array index. Display names, order, and explanatory text can change without changing the identity of the exercise.

Alternatives considered: retaining numeric indexes is unsafe because reordering or adding a field can make old records appear under the wrong exercise.

### Version local storage and migrate conservatively

Introduce an explicit storage schema version and retain the existing week/day partitioning. Existing positional records must either be mapped only when their day and position have an unambiguous match to the new fixed plan or be preserved as legacy/export-only data with a visible compatibility outcome. No ambiguous record should be silently reassigned.

Alternatives considered: clearing all existing storage is simpler but discards client history; an automatic best-effort remap risks corrupting the training history.

### Treat planned and actual values as separate fields

Render planned values as read-only prescription data and actual values as editable session data. The summary should include both where useful so the trainer can compare the recommendation with the result received by WhatsApp.

Alternatives considered: replacing the recommendation with actual values would prevent meaningful review and make a lower-load session look like the published plan.

The number of planned series is not a hard limit on actual recording. The UI should provide the planned rows and allow the client to remove unperformed rows or add an actual-only row when more work was completed; an actual-only row has no fabricated planned value.

Alternatives considered: rendering only the planned maximum would force the client to omit real work or misrepresent it.

### Keep machine setup as exercise guidance

Store setup instructions with the fixed exercise and render them before the set fields. Preserve free-text notes for values such as seat, chest-pad, and cable height rather than requiring a new structured form for every machine adjustment.

Alternatives considered: fully structured machine settings would be more queryable but would add fields that are not yet consistent across the supplied machines and are not needed for the first release.

### Manual weekly publication workflow

The trainer reviews the client's WhatsApp report, updates the weekly recommendation file, updates any authoritative Markdown documentation, and republishes the static assets. The service-worker cache name and file list must be updated when the published recommendation or other cached assets change.

Alternatives considered: a client-side progression engine would produce proposals from incomplete local data and would not be visible to the trainer unless separately exported; it can be considered later without changing the planned-vs-actual data model.

## Risks / Trade-offs

- [Risk] Browser storage can be lost when site data is cleared → retain and document JSON export as the backup path.
- [Risk] A stale service-worker cache can show an old recommendation → version the cache and include the recommendation file in the cached file list.
- [Risk] The initial WhatsApp report lacks actual RIR and next-day pain → preserve missing values as missing and do not infer medical or progression conclusions in the static plan.
- [Risk] Machine weight labels may not be physically comparable across equipment → keep the recorded unit as the machine's stated kg and retain machine identity; do not add cross-machine conversion.
- [Risk] Legacy positional storage may be ambiguous after fixing exercises → migrate only deterministic records and expose or preserve the remainder rather than guessing.

## Migration Plan

1. Define the fixed exercise IDs and map the supplied WhatsApp week into the new recommendation format.
2. Add the new recommendation file and update the static application to load it alongside the fixed plan.
3. Introduce the versioned local record shape and deterministic migration/legacy handling.
4. Manually exercise current-week recording, lower actual loads, missing optional values, export, completion, and WhatsApp sharing through a local static server.
5. Update `service-worker.js` cache metadata before publishing.
6. If rollback is needed, restore the previous static asset set and cache version; exported JSON remains the recovery source for client records.
