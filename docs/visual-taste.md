# Visual taste

How this site should look and move. Tokens, Tailwind, and component APIs: `docs/frontend-conventions.md` and `docs/component-library.md`. Agent deltas: `.agents/rules/frontend.md`. Live: `/design`.

These are **taste**, not laws of design. Still: do not ship the cheap version of this site.

## What the UI is for

The homepage must give a strong first impression. It is allowed to be denser, more “wow,” and more characterful than the blog. Inner pages can be quieter. Experiments and the 3D resume room may look unlike the chrome — that is the point of those surfaces.

Quiet persistent affordances (sidebar search + `⌘K`) are fine. Teaching modals and “marketing every feature” are not.

## Paper, not SaaS gray

Warm light background, ink hierarchy, teal used for **active / CTA**, not decoration soup.

Canonical: the token blocks in `src/styles/globals.css` (`:root` / `[data-theme='light']`, `[data-theme='dim']`, `[data-theme='dark']`).

- **Depth is lighting.** Light from above. Elevation is directional light, hairlines, and — in dark themes — rings, not stacked drop-shadows on near-black (those vanish). Read the comments on `--shadow-*`, `--shadow-fab`, `--panel-fill`, `--panel-tray` in `globals.css`; they are the design notes.
- **Neutral focus, branded accent.** Focus ring is ink, not teal, so accent keeps the “this is active” job.
- **Display serif (Fraunces) + switchable text sans.** Headings carry character; body pairing can change without retuning every size. `src/utils/fonts/pairings.ts`, `data-type-pairing` on `<html>`.
- **Restraint.** If two treatments say the same thing (tray fill + hairline), pick one. Nested cards read as a stack of boxes — don’t.

## Cheap vs intentional

**Cheap / fail**

- Competing outlines (ring + border a pixel apart)
- Scrim finishing before its panel (looks like a missed timing, not a decision)
- Tinted image edges that read as grime (`--image-outline` exists to avoid that)
- Same hue used as a vivid fill and as small text (career labels needed a separate text ramp)
- Contrast that misses AA on `ink-3` / `accent-text` (`e2e/contrast.spec.ts` is the net)
- Gradient hero name + badge row — too common, AI-slop, not a standout
- Sitewide 200ms fades on every route and card
- Brutalism; glassmorphism as costume

**Polish** (do these)

- Contrast, alignment, timing, hit targets (`pointer-coarse:` padding on homepage links)
- All three themes. A shadow that only works in light is a blocker.
- Motion that matches frequency (below)

**Decoration** (do not sprinkle)

- Extra grid on top of `.blueprint-bg`, glow, gradient text, emoji as a system, more “stickers” without a pop brief

## Pop

Personality widgets (Chess, Now, a future Currently Reading) may **pop** to steal a few extra seconds. Pop is some combination of:

- interaction animations
- enter / exit animations
- non-standard colour
- larger scale than neighbours

That mix is **not** for `Button`, `Text`, or other chrome. Colour is rarely added to common components.

If the owner did not ask for pop, match existing `Card` chrome (`hover`, `rounded-xl`, token borders, ~16/14 padding). Intentional divergence: comment it.

New pop/personality UI: gated in-page CSS-variable sliders, then bake values and **remove the sliders** before merge. See `.agents/rules/autonomy.md`.

## Motion

Reference: Emil Kowalski. Magnets: Linear, Vercel, PostHog.

- Things that can happen **10+ times a session**, and anything with a **keyboard shortcut**, are high-frequency → very subtle if any. Canonical command palette: `--animate-palette-in` / `--animate-palette-overlay`, **180ms**, same `cubic-bezier(0.32, 0.72, 0, 1)` on scrim and panel.
- Rare openings (a modal without a shortcut) MAY use more budget. Still AVOID bouncy “premium” 400ms springs on `⌘K`.
- `Card` lift is ~1px / 200ms (`.card-hover`). Buttons ~180ms. Copy those, don’t invent a third curve.
- App chrome: `MotionConfig reducedMotion="user"` in `src/pages/_app.tsx`.
- **Exemption:** `useFlip` in `src/lib/flip/react.tsx` on the FLIP blog post never skips — the motion is the lesson.
- **Exemption:** CozyRoom (`src/components/resume/CozyRoom/`) is a set piece. Phone stutter is acceptable; do not gut quality to smooth every GPU.

## Type and hero

Canonical hero: `src/components/home/HeroSection.tsx` — serif name, italic surname, clamp’d subtitle, body `max-w-[540px]` at ~1.75 leading, two paragraphs. That length is the pitch, not a failure to be an agency landing page.

## Surfaces

- `Surface` is the primitive (`src/components/common/Surface/index.tsx`): panel fill, border, elevation, radius.
- `Card` is the productized surface (`hover`, padding, `as`). Canonical use: homepage widgets.
- Hairline inside a card: fine. Card in a card: not.
- Radius vocabulary is incomplete (pills vs `rounded-xl` vs `rounded-[7px]` logo). **TODO:** put the specs on `/design`. Until then copy the nearest neighbour; do not author a new scale.

## Responsive

Homepage widgets stack on a single column. Other screens: decide per surface. A separate mobile design is allowed when stacking is not enough.

## Canonical files (look here before inventing)

| Thing | Where |
|---|---|
| Tokens, shadows, palette motion, type pairings | `src/styles/globals.css` |
| App composition | `src/pages/_app.tsx` |
| Anti-flash theme/font | `src/pages/_document.tsx` |
| Card / Surface / Button / Heading | `src/components/common/*` |
| Homepage widgets + in-card hairlines | `src/components/home/WidgetGrid.tsx` |
| Hero | `src/components/home/HeroSection.tsx` |
| Contrast promise | `e2e/contrast.spec.ts` |
| Live matrix | `/design` |
