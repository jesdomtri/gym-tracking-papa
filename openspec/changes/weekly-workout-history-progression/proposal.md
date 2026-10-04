# Proposal

## Why

The WhatsApp reports contain dated training results, but the repository has no per-week records yet, making it difficult to compare loads and repetitions over time. The next recommendation should use those results with the agreed double-progression rule while preserving the original messages, unknown fields, and machine identity instead of guessing or conflating records.

## What Changes

- Create dated Markdown history files organized by training week, transcribing the supplied sessions and preserving their planned and actual sets, RIR, notes, machine setup, and session fields. Keep missing information unknown and retain unusual values in the source history even when excluded from progression decisions.
- Publish the trainer-reviewed recommendation for the week starting 2026-10-05. Keep the established exercise and repetition ranges: increase load when every prescribed, valid set reaches or exceeds its upper bound; reduce it when reliable performance falls below the lower bound; otherwise hold load and continue progressing repetitions. Do not use explicitly excluded anomalous values to change the prescription.
- Change the fixed biceps-curl machine to Impulse with a new stable exercise ID. Preserve historical messages and browser records under their original DHZ identity; do not compare loads across machines.
- Document the weekly archive and manual review workflow. Keep the website static and its recommendation manually published; do not add automatic WhatsApp import or automatic progression.

## Capabilities

### New Capabilities
- `weekly-training-review`: Dated weekly workout history and trainer-reviewed, manually published prescriptions using recorded performance and an explicit progression rule.

### Modified Capabilities
- None. There are no main OpenSpec capabilities yet; this change introduces the durable weekly review behavior.

## Impact

- `gimnasio_padre/historial/` and its README will gain dated weekly records and a date-based naming/workflow convention; `semana_actual.md` remains the working template.
- `gimnasio_padre/plan_activo.md` and `website/plan.json` will identify the biceps curl as Impulse under a new exercise ID; `website/recommendation.json` will contain the 2026-10-05 prescription for all five days.
- Existing localStorage and exported records for the former DHZ curl must remain preserved and must not be silently reassigned to the Impulse exercise. Update the service-worker cache version for changed published assets.
- The source is the user-provided WhatsApp export. No backend, database, API, runtime dependency, or automated test toolchain is introduced; verify JSON and manually exercise the static site over HTTP.
