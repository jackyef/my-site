# Frontend

Law: `docs/frontend-conventions.md`, `docs/component-library.md`. Live spec: `/design` (`src/pages/design.tsx`). Taste: `docs/visual-taste.md`.

This file is **deltas and pointers**, not a second token encyclopedia.

## Follow the existing docs

- Tailwind utilities first, `cn()` for conditionals, canonical `text-(--color-ink)` not `text-[var(--color-ink)]`.
- Tokens only; no hardcoded hex/rgb outside `src/styles/globals.css`.
- `ink-4` is decorative. If a human has to read it, it is not `ink-4`.
- `Surface` / `Card` / `Heading` / `Text` / `Button` as documented. Lift-on-pointer belongs on `Card` (`hover`). Do not pile `label` / `span` / `interactive` onto `Card` — compose locally.
- Adding a primitive? Add a `<Spec>` on `/design` so `e2e/design-system.spec.ts` exercises it.

## Deltas from the owner’s judgment

- MUST match existing card chrome for a new homepage widget **unless** the owner asked for pop. Pop = some mix of interaction motion, enter/exit, non-standard colour, and larger scale, to steal a few seconds. Pop is for personality widgets, not `Button` / `Text`.
- MUST NOT nest cards. Hairline `<hr className="border-(--color-border)">` inside a card is the in-card grouping tool. Canonical: About widget in `src/components/home/WidgetGrid.tsx`.
- MUST NOT invent a new hue for common chrome. Widgets MAY use a non-standard colour as a pop lever. Career-chart hues stay on the career chart.
- SHOULD animate by **frequency**. Keyboard-shortcut UI is high-frequency → ~180ms, no bouncy springs. Canonical: `--animate-palette-in` in `src/styles/globals.css` (scrim and panel share duration and curve). Rare modals MAY use more budget. AVOID sitewide 200ms route/card fades.
- `src/lib/flip/react.tsx` (`useFlip`) on the FLIP blog post MUST play even if the user prefers reduced motion — that motion is the lesson. App chrome SHOULD keep `MotionConfig reducedMotion="user"` in `src/pages/_app.tsx`. CozyRoom is exempt (Three.js set piece).
- Homepage widgets SHOULD stack on mobile. Other surfaces: case-by-case; a dedicated mobile layout MAY be the right call. Touch targets: see existing `pointer-coarse:` padding on homepage links.
- Composition root is `_app.tsx`: providers and palette sit **beside** `AppShell`, not inside it as a junk drawer. Canonical: `src/pages/_app.tsx`.
- Local homepage `Widget` helper is intentional. Split new widgets into their own files for review; do not promote a framework.

## Styling escape hatches (already in conventions, restated)

- `globals.css` utility when **≥ 3** components share the rule.
- goober / CSS-in-JS when selectors are complex **or** a lazy one-off would pollute the main chunk.
- Inline `style` only for motion values, per-render computed layout, or a runtime CSS variable.

## Radius

Button pills (`rounded-full`) vs card `rounded-xl` vs logo `rounded-[7px]` are not fully specified. MUST NOT invent a new radius scale. TODO: document the vocabulary on `/design`. Until then, copy the nearest neighbour.

## Magnets / anti

Steal density and quiet chrome from Linear, Vercel, PostHog. AVOID Brutalism, glass-for-its-own-sake, and gradient-name + badge-row heroes (AI-slop, too common).
