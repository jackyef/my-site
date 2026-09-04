---
name: investigate-bug
description: Investigate and fix a bug. Use when something is broken, flaky, visually wrong, or a test failed. Do not use for greenfield features.
---

# Investigate a bug

Read `.agents/rules/judgment.md` and `.agents/rules/autonomy.md`. UI bugs also read `.agents/rules/frontend.md`.

Keep these distinct. Do not jump to a fix from a vibe.

1. **Symptom** — what did the owner (or a test) see?
2. **Reproduction** — exact route, theme (`light` / `dim` / `dark`), viewport, interaction. If you cannot reproduce, say so; do not shotgun-fix.
3. **Hypothesis** — one or two, not ten.
4. **Evidence** — code path, DOM, network, contrast measurement, screenshot. Prefer evidence over narrative.
5. **Root cause** — the promise that broke (token contrast, missed `data-theme`, a hook returning stale data, a visual snapshot that was never updated, etc.).
6. **Fix** — smallest change in files already in the bug’s path. MUST NOT “clean up” `BallisticSlider` on the way.
7. **Regression** — add a test **only** if this is a promise humans will not reliably catch (see `e2e/contrast.spec.ts`). Do not add `getByText` smoke. If the visual change is intended, update snapshots; if it is not, the snapshot failure **is** the bug.

## Scope

- Inspection radius: the failing surface and its data/theme dependencies — not the whole repo.
- If the proper fix is large, ship a narrow fix + TODO with context.
- If you are unsure the “fix” is extra architecture (caching, retries, a new provider), **ask before shipping**.

## Verify

`pnpm typecheck`, `pnpm lint`, the relevant e2e. For UI: real browser in cloud/remote, all three themes, the viewport that failed.
