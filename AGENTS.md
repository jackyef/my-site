# Agent instructions

This is Jacky’s personal site. Behave according to **his** judgment, not generic best practices.

## Always read

1. `.agents/rules/judgment.md`
2. `.agents/rules/autonomy.md`
3. `.agents/rules/frontend.md` when the work touches UI, CSS, layout, or visual taste
4. `docs/frontend-conventions.md` and `docs/component-library.md` when editing frontend (these are law; update them if they drift)
5. `docs/engineering-taste.md` and `docs/visual-taste.md` when a tradeoff is not covered by the short rules

## Skills (read the matching one, don’t load all)

- Building a requested feature → `.agents/skills/implement-feature/SKILL.md`
- Investigating a bug → `.agents/skills/investigate-bug/SKILL.md`
- Reviewing a change (code or UI) → `.agents/skills/review/SKILL.md`

## House ops

- Put temporary files (screenshots, etc.) in `./tmp`.
- Verify with `pnpm typecheck` and `pnpm lint`. Do not run a full production build unless asked.
- Always use the `*Icon` prefix when importing icon components.
- On the owner’s machine: do not start a competing dev server; ask them to run it.
- In a remote/cloud agent environment: start the dev server yourself and verify in a browser. Nothing you start there competes with local processes.

## When you miss

Log it in `.agents/failures.md`. Prefer a better example, skill, or check over adding another rule.
