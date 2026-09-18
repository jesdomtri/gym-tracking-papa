# Proposal

## Why

The current site displays generic movement patterns and alternatives, so the client does not see the fixed machine, exercise, or weekly prescription selected by the trainer. It also records results locally without separating the trainer's recommendation from the client's actual performance, which makes weekly review and progression harder.

## What Changes

- Replace generic pattern-based entries with the five fixed exercises and machines for each training day.
- Publish a separate weekly recommendation containing planned sets, repetition ranges, RIR targets, and a weight for each planned set.
- Show machine setup instructions as exercise guidance, including seat, chest-pad, cable-height, or similar notes where provided.
- Preserve editable actual results for weight, sets, repetitions, actual RIR, sensations, discomfort, and session-level lumbar pain.
- Store records with stable exercise IDs and versioned local data so weekly plan updates cannot associate old results with the wrong exercise.
- Keep the application static and browser-local; do not add a backend, account system, API, or automatic WhatsApp import.
- Keep the completed-session summary and manual WhatsApp sharing workflow.
- Keep trainer review and publication of the next week's recommendation manual; automatic progression calculation is not part of this change.

## Capabilities

### New Capabilities

- `static-workout-planner`: Fixed-machine weekly prescriptions, local session recording, historical persistence, and shareable completed-session summaries for a static website.

### Modified Capabilities

None. The repository currently has no main OpenSpec capabilities.

## Impact

- `website/index.html`, `website/app.js`, and `website/style.css` will change to display prescriptions, setup guidance, and actual-vs-planned recording fields.
- `website/plan.json` and a separate weekly recommendation data file will define the fixed plan and current trainer-published prescription.
- Existing browser data needs a versioned migration or an explicit compatibility policy because current records are indexed by exercise position.
- `website/service-worker.js` must include any new data file and receive a cache-version update when published assets change.
- Markdown plan and record documentation under `gimnasio_padre/` will be restructured to match the fixed-exercise and weekly-publication workflow.
- No new runtime dependencies, services, APIs, or automated test toolchain are introduced.
