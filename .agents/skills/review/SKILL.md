---
name: review
description: Review a code or UI change against this repo's taste. Use when asked to review a diff, PR, or implementation, or before claiming UI work is done.
---

# Review

Read `.agents/rules/judgment.md`, `.agents/rules/autonomy.md`, and for UI `.agents/rules/frontend.md` plus `docs/visual-taste.md`.

## Code

Check, in order. Say which applied.

| Lens | Fail if |
|---|---|
| Correctness | Behaviour is wrong, types lie, three themes not considered |
| Scope | Files landed that the task did not require; idle playground “cleanup”; unrequested feature |
| Abstraction | `WidgetShell`-class frameworks; 2nd-occurrence feature DRY; `any`; types shared only because the shape matched |
| Locality | Feature A imported from feature B’s folder |
| Simplicity | Extra providers, libraries, or caches the owner did not choose |
| Hidden behaviour | URL shape changed, default theme changed, motion skipped, analytics fired |
| Tests | New smoke tests; missing tests on a new global helper; snapshots not updated for an intended visual change; snapshots updated to hide an unintended one |
| Exports | New default export outside Next.js page modules |

SHOULD also note drive-by that **is** in-scope (boy-scout in a file already touched) as a plus, not a smell.

## UI

Do not review visual taste from source alone. Look at the rendered page.

- Homepage: first impression. Cramped widgets, dead error holes, AI-slop hero (gradient name + badges) are failures.
- Personality widget: either matches `Card` chrome **or** pops on purpose (motion / enter-exit / extra colour / scale). Accidental in-between is worse than either.
- Nested cards, two outlines, lagging scrim vs panel, teal focus ring competing with accent, `ink-4` used as readable text — fail.
- Motion: keyboard-shortcut surfaces stay short and un-bouncy. Sitewide fades — fail.
- Light, dim, **and** dark. A shadow that dies in dim is a blocker.
- Mobile: widgets stack; touch targets (`pointer-coarse`) still hittable.
- Reduced motion: chrome respects it; `useFlip` on the FLIP post does not skip; CozyRoom is exempt.

## Report shape

- What is wrong (blocker)
- What is off-taste but not a blocker
- What was unverified (no browser, only one theme, etc.)

Do not delete code in a review pass unless the owner asked for the deletion.
