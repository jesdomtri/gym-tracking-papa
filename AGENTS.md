# Repository Guide

## Project Boundaries

- This repository has no package/build/test toolchain; the product is a dependency-free static site in `website/` plus Markdown training records in `gimnasio_padre/`.
- `gimnasio_padre/plan_activo.md` is the fixed-plan source of truth, and `website/plan.json` is its manually maintained mirror. `website/recommendation.json` is a separate manually published weekly prescription containing weights; never put real weights in `website/plan.json`.
- The official file-based record workflow is `gimnasio_padre/semana_actual.md` -> a new numbered entry under `gimnasio_padre/historial/`; do not overwrite prior history. The website stores session data only in browser `localStorage` and does not modify these Markdown files.

## Website Development

- Run the site from `website/` through a static server, for example `python3 -m http.server 8000`, then open `http://localhost:8000`. Do not test by double-clicking `index.html`; `app.js` fetches `plan.json`, which requires HTTP.
- `website/app.js` owns behavior and local storage; personal WhatsApp/email/name values are the `CONFIG` constants at its top and must not be invented or committed with defaults. Records use stable exercise IDs and the weekly recommendation is trainer-published, not automatically calculated.
- If cached website assets change, update `CACHE_NAME` in `website/service-worker.js` and keep its `FILES` list in sync, including `recommendation.json`. Service-worker/offline behavior requires `localhost` or HTTPS.
- There are no automated tests, lint, typecheck, or build commands. At minimum, manually exercise the served site and validate edited JSON such as `website/plan.json` before finishing.

## OpenSpec

- OpenSpec uses the `spec-driven` schema configured in `openspec/config.yaml`; check `openspec list --json` before workflows that select or write a change. Do not manually scaffold change directories.
- `/opsx-propose` creates planning artifacts only; `/opsx-apply` implements an existing change; `/opsx-sync` updates main specs from delta specs; `/opsx-archive` is for completed changes. Read the corresponding `.opencode/commands/` or `.opencode/skills/` instructions when using these workflows.
