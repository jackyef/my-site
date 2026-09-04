# Judgment

Owner-derived. Not generic best practices. Hierarchy and rationale: `docs/engineering-taste.md`. Visual: `docs/visual-taste.md`.

## Hierarchy (when principles fight)

1. **Purpose of the surface** — homepage = proof + personality for recruiters/peers. Writings and experiments support that. `useFlip` exists to teach. Foundational systems (theme, palette, MDX, blog layout) are real software.
2. **Keep the site free to run** — runtime-only is the default.
3. **Foundational vs one-off** — systems get structure. Widgets, experiments, page filters stay local.
4. **Proper when the diff stays small; otherwise ship + TODO.**
5. **Requested UI must look like this site** — homepage impression, pop on personality widgets, all three themes.
6. **Feature locality** — a feature folder is not a public API.
7. **Scope of this task** — only files the task already requires.
8. **Generic tiny things early, feature-shaped things late.**

Unrequested work loses. Backend loses unless the owner says otherwise. Purpose beats consistency (`useFlip` does not drop motion; CozyRoom may jank on phones).

## Hard constraints (MUST / MUST NOT)

- MUST NOT extract a shared widget framework (`WidgetShell` or equivalent). Local `Widget` + `Card` in the homepage is intentional. Canonical: `src/components/home/WidgetGrid.tsx`.
- MUST NOT import from one feature folder into another. Promote a generic helper to `src/utils` (or a real shared module) instead. Data clients in `src/utils` + hooks/UI in the feature is an accepted split. Canonical: `src/utils/chessCom.ts` + `src/components/ChessComStats/`.
- MUST NOT add a page, product feature, server, or database the owner did not request.
- MUST NOT delete code (including low-value tests) unless asked.
- MUST NOT expand the change set to “while I was here” files. Boy-scout only files already in the task.
- MUST NOT tidy idle playground code you are not changing.
- MUST use named exports for new modules. Exception: Next.js `pages/`, `_app`, `_document` (platform default-export). Convert default → named when you already have to touch a file.
- MUST NOT introduce `any`. Reuse types only when the **concept** is the same, not because the shape matches.
- MUST keep new UI looking correct in **light, dim, and dark**. Default theme follows system preference (`light` / `dark`); `dim` still has to work.
- MUST NOT nest a card in a card. Hairline dividers inside a card are fine.

## Strong preferences (SHOULD)

- SHOULD treat tiny generic helpers (`clamp`, `cn`) as promotable on first use. Feature-shaped code: duplicate at the 2nd occurrence; only start extracting at the 3rd.
- SHOULD match existing visuals by default. Intentional divergence gets a comment. Personality widgets SHOULD pop (see `docs/visual-taste.md`).
- SHOULD put state at the smallest owner. Theme/font: `_document` script + html attributes + hooks (intended — not a React `ThemeProvider`). Palette: own provider. Widgets: uncontrolled. TOC: derive from the DOM. CozyRoom: its container. Canonical: `src/pages/_app.tsx`, `src/pages/_document.tsx`, `src/hooks/useTheme.ts`.
- SHOULD extend an existing hook with more fields when the API is the same; write a **new hook on top of** the first when the aggregation is different.
- SHOULD add tests for global helpers **before extending them**, and for system promises humans will not reliably catch (prototype: `e2e/contrast.spec.ts`).
- SHOULD skip tests on the first version of a playground experiment; add some when changing it.
- SHOULD follow existing folder patterns for new work (split files, not one 250-line blob). Homepage widgets belong in separate files for review, without becoming a shared abstraction.
- SHOULD name primitives like the UI (`Card`, not `ElevatedSurface`).
- SHOULD comment only missing context and special cases. Don’t restate the code. Don’t essay taste that belongs in `docs/`.
- SHOULD allow clever code when the benefit is real (especially performance), with a comment that explains the constraint. Canonical: relative colour in `src/styles/globals.css` (`oklch(from var(--color-bg) …)`).

## Defaults (PREFER / AVOID / MAY)

- PREFER runtime-only behaviour. Server/database MAY exist only if the owner decides it is worth it.
- PREFER Tailwind + tokens per `docs/frontend-conventions.md`. One-off visual deviation, especially if lazy-loaded, MAY use CSS-in-JS so it does not pollute the main chunk.
- PREFER URL state for shareable filters; clearing a filter MUST yield a clean URL.
- PREFER client fetch + explicit error/retry for below-the-fold, non-essential personality data (Chess is both personality and a resilient-component demo).
- AVOID inventing product chrome: guestbook, view counts, newsletter, tip jar, “more widgets” as a program.
- AVOID cleaning or abstracting one-offs “for consistency.”
- MAY leave playgrounds messy until behaviour changes.
- MAY accept CozyRoom stutter on phones (GPU-bound; quality reduction is not required).
