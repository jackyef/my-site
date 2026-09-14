---
name: implement-feature
description: Implement a requested feature on this site. Use when adding or changing product behaviour, a page, a widget, or a foundational module. Do not use for pure bugfixes or reviews.
---

# Implement a feature

Read `.agents/rules/judgment.md` and `.agents/rules/autonomy.md` first. UI work also reads `.agents/rules/frontend.md` and the frontend docs they point at.

## 1. Understand the request

- If the prompt is vague (“make the homepage more interesting”), **stop**. Suggest options. Do not implement.
- If the request might be foundational (new content API, palette action type, MDX surface) **or** a one-off, **ask**, then plan, then act.
- If the request is something the rules call wrong (e.g. `WidgetShell`), push back with the reason and wait.

## 2. Inspect (narrow)

Read:

- the file you will change
- the directory where new code will live
- the nearest canonical neighbour (another widget, another palette action, another `Card` use)

Do not tour the repo for unrelated hygiene.

## 3. Classify

| Kind | How to build |
|---|---|
| Foundational (theme, palette, MDX, blog layout) | Proper structure. Tests for the promise you are making. Refactor first if the current path is awkward **and** the extra diff stays small. |
| Personality widget | Client-only, error/retry, no shared widget framework. Pop if it is meant to steal attention. Split into its own file. |
| Playground experiment | Match the experiments folder pattern. First version MAY skip tests. Do not tidy siblings. |
| Page one-off (`/uses` filter) | Good enough unless it janks or it is the homepage. Shareable URL; clear filter → clean URL. |

## 4. Implement

- Stay in the task’s files. Boy-scout those files (including default → named export).
- Tiny generic helper → `src/utils` is fine on first use. Feature-shaped abstraction: wait for a 3rd occurrence.
- Same fetch → extend the hook, consumer picks fields. Different aggregation → new hook **on top of** the first.
- Library vs `URLSearchParams` / platform: write pros/cons and wait unless the owner already chose.

### Type A (new pop / personality / motion)

1. Implement using documented taste.
2. Add **gated** in-page CSS-variable sliders (prop or flag, off by default in production).
3. Let the owner tweak.
4. Bake values.
5. **Remove sliders in the last commit before merge.**

Do not add sliders for copy-only, error/retry-only, or tiny polish.

## 5. Verify

See “done” in `.agents/rules/autonomy.md`.

- `pnpm typecheck` and `pnpm lint`
- Useful tests only (no object-literal unit tests, no sidebar click-tours)
- Intended visual change → update Playwright snapshots
- Cloud/remote UI: real browser, mobile, light/dim/dark, error/retry if it fetches

## 6. Report

What changed, what you assumed, what you verified, TODOs left with context.

Deadline pressure: if the proper version is fast and small, do it. If it blows the diff, ship the smaller path + TODO.
