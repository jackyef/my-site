# Frontend Conventions

This document describes the styling conventions and patterns for this codebase.

---

## Styling Hierarchy (priority order)

### 1. Tailwind utilities — first choice

Use Tailwind for all static layout, spacing, typography, and color. Use `cn()` for
conditional class merging.

**CSS variable references** — use the Tailwind v4 shorthand (parentheses, no `var()`):

```tsx
// GOOD — canonical Tailwind v4 syntax
<div className={cn(
  'text-(--color-ink) font-semibold rounded-lg px-4 py-2',
  isActive && 'bg-(--color-bg-active)',
)} />

// BAD — legacy arbitrary-value syntax (triggers suggestCanonicalClasses warning)
<div className="text-[var(--color-ink)] bg-[var(--color-bg-active)]" />
```

Quick reference for the shorthand:
| Legacy | Canonical v4 |
|---|---|
| `text-[var(--color-ink-2)]` | `text-(--color-ink-2)` |
| `bg-[var(--color-bg-panel)]` | `bg-(--color-bg-panel)` |
| `border-[var(--color-border)]` | `border-(--color-border)` |
| `shadow-[var(--shadow-md)]` | `shadow-(--shadow-md)` |

For ambiguous utilities where Tailwind can't infer the CSS property, hint the type:
`text-(color:--my-var)` (color) vs `text-(length:--my-var)` (font-size).

### 2. CSS utility classes in `globals.css`

For cross-component patterns not expressible cleanly in Tailwind alone. Define here when
**≥ 3 components** share the same CSS rule set.

Current utilities:
- `.page-pad` — responsive content padding (20/24px mobile → 52/40px desktop)
- `.hero-pad`, `.widget-grid`, `.widget-full`, `.widget-mobile-full`, `.latest-pad` — homepage layout
- `.card-hover` — interactive card lift (replaces `onMouseEnter/Leave` style mutations)
- `.animate-status-pulse` — pulsing dot animation
- `.blueprint-bg` — grid background for the content area
- `.eyebrow`, `.page-title`, `.hero-h1` — typography primitives

### 3. goober `css` tagged template — only for complex selectors

Use only when pseudo-selectors or complex selectors are required AND a `globals.css`
utility class would be over-specific. Also the correct place for any remaining
`getHslaColor()` usage (legacy palette components).

### 4. Inline `style={{}}` — strictly limited

Allowed **only** for:
- framer-motion animation values (`initial`, `animate`, `exit`, `style` on `motion.*`)
- Truly computed JS values that change per-render (e.g., `left: yearToPx(y)` in CareerView)
- Runtime values with no Tailwind equivalent (e.g., a dynamic CSS var like `color: dotColor`)

**Never** for static colors, spacing, or typography.

---

## Design Tokens

Always use `var(--color-*)`, `var(--shadow-*)`, `var(--font-*)` — never hardcode hex/rgb
outside of `globals.css` token definitions. Tokens are defined per-theme in three blocks:
`:root / [data-theme="light"]`, `[data-theme="dim"]`, `[data-theme="dark"]`.

Key tokens:
| Token | Purpose |
|---|---|
| `--color-bg` | Page background |
| `--color-bg-panel` | Card / panel background |
| `--color-bg-sidebar` | Sidebar background |
| `--color-bg-hover` | Hover state fill |
| `--color-bg-active` | Active / selected fill |
| `--color-border` | Default border |
| `--color-border-hi` | High-contrast border |
| `--color-ink` | Primary text / headings (~12-14:1 contrast) |
| `--color-ink-2` | Body text (~8-11:1 contrast) |
| `--color-ink-3` | Secondary / meta text (≥4.5:1, WCAG AA) |
| `--color-ink-4` | Decorative / placeholder (~2.2-2.5:1) |
| `--color-accent` | Teal accent (bg) |
| `--color-accent-text` | Teal accent (text/icons) |
| `--color-accent-l`, `--color-accent-xl` | Tinted accent fills |
| `--color-success` | `#4caf84` — green status |
| `--shadow-sm`, `--shadow-md`, `--shadow-lg` | Elevation shadows |

---

## Component API Patterns

- Prefer `className?: string` over arbitrary `style` props on component interfaces.
- Prefer compound components over boolean prop explosions.
- Export named (not default) exports from `components/common/`.
- Accept `as?: React.ElementType` on layout primitives to allow semantic override.

---

## Animation

- **Spring animations** via `framer-motion` for interactive UI (layoutId, presence transitions).
- **CSS transitions** for hover/focus micro-interactions — no JS `onMouseEnter/Leave`.
  Use `.card-hover` for card lift, `transition-[...]` Tailwind utilities for others.
- Honor `useReduceMotion()` on non-essential animations.
- Keep framer-motion `style`, `initial`, `animate`, `exit` props as inline values — these
  are legitimately dynamic and not static styles.

---

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| mobile | `< 768px` | Bottom tabs, no sidebar, `pb-16` on content |
| md–lg | `768–1023px` | 60px icon-strip sidebar, no labels |
| lg+ | `≥ 1024px` | 220px full sidebar with labels |

Sidebar-responsive patterns:
- `hidden lg:inline` / `hidden lg:block` — text hidden on icon-strip
- `md:justify-center lg:justify-start` — icon-strip centering

---

## Typography Primitives

- Use `<Heading level={N}>` (`@/components/common/Heading`) for all headings — not raw `<h1>` with manual font/color classes.
- Use `<Text>` (`@/components/common/Text`) for body copy — not raw `<p>` with ad-hoc `text-(--color-ink-2)` strings.
- Use `<Surface>` (`@/components/common/Surface`) for elevated panels — not ad-hoc `bg-(--color-bg-panel) border shadow-lg` combos.
- Legacy `Typography/Heading.tsx` H1–H5 now wrap the new `<Heading>` component internally.

---

## Borders & Dividers

The content area uses a blueprint grid background (`.blueprint-bg`). Avoid adding visible
`border-b` / `<hr>` / `<HorizontalDivider>` lines within the content area — they clash
with the background grid lines. Use spacing (`gap`, `py`, `my`) to separate items instead.

Borders are fine inside:
- **Sidebar** — has its own solid `--color-bg-sidebar` background
- **Elevated panels** (`<Surface>`, `<Card>`, dialogs) — solid `--color-bg-panel` background
- **Interactive controls** (buttons, chips, inputs) — element boundaries, not section dividers

---

## Legacy Components (`src/components/Typography/`)

The following legacy Typography components have been **removed** — use the replacements below:

| Removed | Replacement |
|---|---|
| `PageTitle` | `<PageHeader>` from `@/components/common/PageHeader` |
| `Paragraph` | Plain `<p>` with Tailwind classes |
| `SectionTitle` | Inline `<h2>` with Tailwind classes |

These legacy components **remain** but are not recommended for new code:

| Component | Status | Reason |
|---|---|---|
| `HorizontalDivider` | Keep (limited) | Only used in MDX blog content; removed from layout code |
| `ExternalLink` | Keep | Used across many files + MDX pipeline |
| `InternalLink` | Keep | Used across many files + MDX pipeline |
| `LightButton` | Keep | Used in MDX components + live pages (goober-based, migrate later) |

---

## Import Order (enforced by ESLint)

Groups must be separated by blank lines:

```
1. react
2. external packages (framer-motion, lucide-react, next/*, etc.)

3. @/components/...

4. @/hooks/...

5. @/lib/... or @/utils/...

6. ./relative imports
```
