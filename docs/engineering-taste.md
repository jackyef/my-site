# Engineering taste

Approved model of how this site should be built. Short rules that agents must follow live in `.agents/rules/`. This file is the rationale. Do not invent preferences that are not here.

Owner: Jacky. This is a personal site — portfolio proof and personality for recruiters, peers, and employers. Writings and playgrounds support that job. It is also a gym for production-shaped problems (theme, command palette, MDX) and a playground for one-offs.

## Hierarchy

When principles conflict, use this order:

1. **Purpose of the surface** — homepage is proof + personality. `useFlip` teaches. Experiments play. Theme / palette / MDX / blog layout are real software.
2. **Keep the site free to run** — runtime-only by default. Server or database has to be unusually worth it.
3. **Foundational vs one-off** — systems get structure, tests, and hygiene *when you are in them*. Widgets, experiments, page filters stay local and may duplicate.
4. **Do it properly when the diff stays small; otherwise ship and TODO.**
5. **Requested UI must look like this site** — homepage impression, pop on personality widgets, all three themes.
6. **Feature locality** — code in a feature folder is private to that feature. Other features do not import it.
7. **Scope of the current task** — boy-scout only what the task already touches. Do not hunt the repo for virtue.
8. **Generic tiny things early, feature-shaped things late** — `clamp` may live in `src/utils` on day one. A `WidgetShell` does not.

Unrequested work loses. Backend loses unless explicitly chosen. Purpose beats consistency (`useFlip` keeps motion; CozyRoom may jank on phones). A small proper fix beats a TODO; a large proper fix loses to a TODO under time pressure.

## What “foundational” means here

Do it properly if it is a production-shaped system, something professionally useful, something to practice, or something the owner wants to understand. Theme, command palette, MDX API, blog post layout qualify.

One-off page behaviour (a `/uses` filter) ships unless it janks or it is on the homepage.

## Duplication and abstraction

- One-offs (homepage widgets, experiments) **may duplicate**. They change with vibe. A shared primitive is a liability.
- Feature-shaped code: still duplicate at the **second** occurrence; start extracting at the **third**.
- Tiny generic utilities (`clamp`, `cn`, date) may be promoted on first use.
- Looking consistent is not the same as sharing a component. Match spacing and cards by default; do not invent a widget framework. Canonical: local `Widget` + shared `Card` in `src/components/home/WidgetGrid.tsx` — intentional, not a half-extraction.
- Data client in `src/utils`, hooks and UI in the feature: accepted. Canonical: `src/utils/chessCom.ts`.

## State and composition

Intended today (not a future React `ThemeProvider`):

- Theme and font: inline script in `src/pages/_document.tsx`, attributes on `<html>`, hooks (`src/hooks/useTheme.ts`, font pairing). Anti-flash is the point.
- Command palette: own provider; mounted **beside** `AppShell` in `src/pages/_app.tsx`.
- Analytics: app-root side effect, prod only. Not a design-system layout concern. Tracking taxonomy is a known gap, not a standard yet.
- Homepage widgets: uncontrolled local state.
- Blog TOC heading: derive from the DOM (shared hook with a singleton observer if a second consumer appears — consumers should not know about each other).
- CozyRoom: owns its container.

`AppShell` is the frame (sidebar, content, mobile nav), not the junk drawer.

## Code style

- New modules: named exports. Next.js pages / `_app` / `_document` are a platform exception. Default exports elsewhere are legacy; convert when the file is already in the diff.
- No `any`. Share types only when the concept is the same.
- Primitive names should read like UI (`Card`, `Text`), not like architecture diagrams.
- Comments add missing context and mark special cases. Taste that already lives in `docs/` or `.agents/rules/` does not need repeating. Clever code that buys a real constraint (especially performance) needs a real comment.
- Mixed PR is fine if logically separate work is separate commits.
- Logging is unused; do not build a logging platform.

## Testing

Test **promises humans will not reliably catch**. Prototype: `e2e/contrast.spec.ts` (AA floor on ink vs surfaces). Do not invent suites for theme-flash, skip-link, or palette shortcut until those are named as promises.

- Low-value smoke (`getByText('Jacky Efendi')`) is not a preference. Consider deleting only when asked.
- Visual snapshots (`e2e/visual.spec.ts`) are a real gate. Update them when the change is intended.
- Global helpers get tests before they grow.
- Playground: first version may skip tests; changing it means adding some.
- Excessive: unit-testing an object literal; Playwright-clicking every sidebar link when `href` is enough.

## Product constraints

- Homepage job: wow + proof of character. Density and extra motion are allowed there. Blog may be quieter and more linear — intentional.
- Do not market chrome in people’s faces. A quiet `⌘K` hint in the sidebar is enough; fine if some visitors never find the palette.
- Feature test: does it teach the owner something, or does it serve the homepage job? Guestbook, view counts, related posts, newsletter, tip jar, “more widgets” as a program: clutter.
- A failed Chess widget stays on screen (error + retry): it is personality, and resilience is part of the proof.
- Runtime-only UX is default. Better UX that needs a server loses unless the owner says it is worth it.

## Explicitly out of scope for agents to invent

- Analytics event taxonomy (learning backlog)
- Radius scale (TODO on `/design`)
- Extra a11y/test promises not named above
- Cleaning idle experiments
