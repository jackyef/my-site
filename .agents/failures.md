# Agent failures

A miss is a chance to pick the **right layer**, not to add a rule by default.

## Layers (pick one)

1. **Better context** — the agent did not read the file / canonical example it needed
2. **Better rule** — a hard constraint was missing or easy to misread
3. **Better example** — the rule existed; a pointer to real code would have done it
4. **Better workflow** — the skill steps were wrong or skipped
5. **Better tooling** — lint, types, contrast, snapshots should have caught it
6. **Better automated verification** — a *promise* humans will not catch, worth a test
7. **Human review** — taste call that should not be automated

Do not grow `.agents/rules/` unless the miss was a rule-shaped miss.

## How to log

Append a dated entry. Keep it short.

```md
## YYYY-MM-DD — short title

- **Did:**
- **Expected:**
- **Why it mattered:**
- **Likely cause:**
- **Layer:** context | rule | example | workflow | tooling | verification | human
- **Action:**
```

## Log

(none yet)
