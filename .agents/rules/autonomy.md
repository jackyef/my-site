# Autonomy

When to act, ask, or stop. Owner-derived. Workflows: `.agents/skills/`.

## Moves

| Situation | Move |
|---|---|
| Clear requested feature; taste is documented | **Act.** Go as far as the rules allow. |
| New pop/personality UI (new widget, new pop, new motion) | **Act**, with gated CSS-variable sliders. Owner tweaks. **Last commit before merge removes sliders**; baked values stay. |
| Vague (“make the homepage more interesting”) | **Suggest options. Do not implement.** |
| Might be foundational (e.g. blog tags as a content API) | **Ask, plan, then act.** |
| Owner asked for something the rules call wrong | **Push back with the reason. Discuss. Do not silently comply or silently refuse.** Canonical wrong request: extract `WidgetShell`. |
| Library vs platform | **Pros and cons; owner decides.** MUST NOT add a library quietly. |
| Uncertain extra architecture (caching “just in case”, rate limits) | **Ask before shipping.** |
| Unrequested feature, new colour token, rename of a primitive, extra test “promises”, server/db | **Ask.** |
| Deleting code | **MUST NOT**, unless asked. |
| Proper fix is small and fast | Do it now. |
| Proper fix is a large extra diff | Smaller path + TODO with enough context that an agent can pick it up. |
| Files not required by this task | Leave them. |

## Inspection radius

MUST read the file being changed and the place the new code will live.

MUST NOT read the rest of the repo hunting for hygiene.

## Sliders (type A visual work only)

Applies to **new personality/pop UI**, not copy fixes, error/retry-only work, or 2px polish.

1. Gate the debug overlay behind a prop or env flag. MUST NOT ship it as default UI.
2. Expose the CSS variables worth tweaking (colour, scale, motion, radius).
3. Owner tunes in the page.
4. Bake the chosen values into tokens/classes.
5. Remove the overlay in the **final commit** of the PR.

## What “done” means

**Homepage / UI feature**

- `pnpm typecheck` and `pnpm lint` pass
- Existing e2e still relevant; add a **useful** e2e if there is a promise humans won’t catch (not `getByText('Jacky Efendi')` smoke)
- Visual snapshots updated when the change is intended (`e2e/visual.spec.ts`)
- Contrast suite still green if tokens/surfaces moved
- Real browser in a cloud/remote environment: click, error/retry if it fetches, mobile width, **light + dim + dark**
- Then you MAY say **done** (owner’s eyes are not a gate)

**Non-UI helper**

- Types, lint, unit tests. No browser, no snapshots.

**Playground first version**

- Types + lint. Tests MAY wait until the next behaviour change.

## Communication

- SHOULD state what changed, what you assumed, and what you verified.
- SHOULD leave TODOs with context when the proper path was too large.
- Mixed PRs are fine when in-scope cleanup is a **separate commit**.
- MUST NOT claim visual polish is “on brand” without looking at the rendered result in all three themes.

## Human-only

The owner always decides: whether a feature exists, whether to pay for a backend, foundational-vs-one-off when it is ambiguous, library choice, and final visual values after a slider pass.
