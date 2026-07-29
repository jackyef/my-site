# Component Library — `src/components/common/`

Shared UI primitives. All use Tailwind + `cn()` only (no goober, no inline styles except
where noted). Import from their directory: `@/components/common/Card`.

> **See them running: `/design`** (`src/pages/design.tsx`). Every primitive below is
> rendered live there with its variant matrix, prop table, and a copyable usage
> snippet, in whichever theme and type pairing you have selected. Prefer that page when
> you want to *look* at a component; this file is the written reference.
>
> Adding a primitive? Add a `<Spec>` for it in
> `src/components/design-system/sections/ComponentsSection.tsx` so it shows up there
> too — anything rendered on that page is exercised by `e2e/design-system.spec.ts`.

---

## Text

**File:** `src/components/common/Text/index.tsx`

Polymorphic body-text primitive. Provides consistent typography variants and theme-aware colors.
Default element: `<p>`. Override with `as` prop.

```tsx
interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'lead' | 'body' | 'body-sm' | 'caption' | 'caption-sm';
  color?: 'ink' | 'ink-2' | 'ink-3' | 'ink-4' | 'accent';
  as?: React.ElementType;   // default 'p'
  className?: string;
  children: React.ReactNode;
}
```

| Variant | Classes |
|---|---|
| `lead` | `text-lg md:text-xl leading-relaxed` |
| `body` (default) | `text-base leading-relaxed` |
| `body-sm` | `text-sm leading-relaxed` |
| `caption` | `text-[13px] leading-normal` |
| `caption-sm` | `text-[11px] leading-normal` |

| Color | CSS var |
|---|---|
| `ink` (default) | `--color-ink` |
| `ink-2` | `--color-ink-2` |
| `ink-3` | `--color-ink-3` |
| `ink-4` | `--color-ink-4` |
| `accent` | `--color-accent-text` |

---

## Heading

**File:** `src/components/common/Heading/index.tsx`

Polymorphic heading primitive. Maps semantic levels to responsive typography + Fraunces font.
Spreads `...rest` — critical for MDX `withTocHighlighter` HOC, `react-flip-toolkit` Flipped,
and any component that passes `id`, `data-*`, or event handlers.

```tsx
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 'hero' | 'page' | 1 | 2 | 3 | 4;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}
```

| Level | Styling | Default `as` |
|---|---|---|
| `'hero'` | `.hero-h1` (globals.css) | `h1` |
| `'page'` | `.page-title` (globals.css) | `h1` |
| `1` | `text-3xl md:text-5xl font-bold font-serif` | `h1` |
| `2` | `text-2xl md:text-3xl font-bold font-serif` | `h2` |
| `3` | `text-xl md:text-2xl font-bold font-serif` | `h3` |
| `4` | `text-lg md:text-xl font-bold font-serif` | `h4` |

Legacy `Typography/Heading.tsx` H1–H5 now wrap this component internally.

---

## Surface

**File:** `src/components/common/Surface/index.tsx`

Visual container primitive providing panel background, elevation shadow, rounded corners,
and optional border. Used as the base for Card, dialogs, and floating panels.

```tsx
interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;          // default true
  as?: React.ElementType;    // default 'div'
  className?: string;
  children: React.ReactNode;
}
```

| Elevation | Shadow |
|---|---|
| `none` | (no shadow) |
| `sm` (default) | `--shadow-sm` |
| `md` | `--shadow-md` |
| `lg` | `--shadow-lg` |

All surfaces get `bg-[var(--color-bg-panel)]`. Border adds `border border-[var(--color-border)]`.

---

## Card

**File:** `src/components/common/Card/index.tsx`

Panel container built on top of **Surface**. Provides hover lift and padding presets.
Use `hover` for interactive cards (replaces `onMouseEnter/Leave` style mutations).

```tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;          // adds .card-hover (CSS transition lift on :hover)
  padding?: 'none' | 'sm' | 'md';  // none | px-[14px] py-[12px] | px-[20px] py-[16px]
  as?: React.ElementType;   // default 'div' (via Surface)
}
```

Internally composes `<Surface rounded="lg">` — inherits panel bg, border, and shadow.

**Replaces:** OpenSourceView repo cards, ProjectsView project cards, CareerView detail panel,
WidgetGrid widget cards.

---

## Chip

**File:** `src/components/common/Chip/index.tsx`

Compact inline label. Three sizes map to the three existing usages across the site.
Always uses `chip` class (gets theme color transitions from globals.css).

```tsx
interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'highlight' | 'muted';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}
```

| Size | Font | Padding | Used in |
|---|---|---|---|
| `xs` | 11px | 2px 7px | OpenSourceView tags, CareerView "Current" badge |
| `sm` | 12px | 3px 9px | WidgetGrid day-to-day stack |
| `md` | 13px | 5px 12px | StackView tech items |

**Replaces:** 3 local `Chip` components in WidgetGrid, StackView, OpenSourceView.

---

## PageHeader

**File:** `src/components/common/PageHeader/index.tsx`

Standard page eyebrow + `<h1>` heading pair. Uses `.eyebrow` + `.page-title` globals.css
classes. The `title` prop supports `<em>` for serif-italic accent highlights.

```tsx
interface PageHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;   // supports <em> for accent color
  titleSpacing?: string;    // Tailwind class, default 'mb-8' (BioView uses 'mb-3')
  className?: string;
}
```

**Replaces:** the `<p className="eyebrow"> + <h1 className="page-title">` pattern in all
5 about-views, BioView, CareerView, StackView, OpenSourceView, ProjectsView.

---

## SectionLabel

**File:** `src/components/common/SectionLabel/index.tsx`

11px/600/uppercase/ink-4 section label used in widget headers, stack groups, etc.

```tsx
interface SectionLabelProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;  // default 'div'
}
```

Spreads `...rest`, so it can carry the `id` an `aria-labelledby` points at.

**Replaces:** repeated inline-styled label divs in WidgetGrid widgets, StackView group
labels, and the blog table-of-contents heading.

---

## SegmentedControl

**File:** `src/components/common/SegmentedControl/index.tsx`

Generic button-group picker. Renders a bordered pill container with one button per option.
Active button gets `--color-bg-active` / `--color-accent-text`.

```tsx
interface SegmentOption<T> {
  value: T;
  label?: string;           // shown as text if provided
  icon?: React.ReactNode;   // shown before label
  title?: string;           // button title attribute (falls back to label)
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T | null;          // null renders nothing as selected (pre-hydration)
  onChange: (value: T) => void;
  className?: string;       // pass 'w-full' to fill container width
  labelClassName?: string;  // e.g. 'hidden lg:inline' for sidebar label hiding
}
```

**Replaces:** the button-group in ThemeSwitcher (non-compact), the chess.com time-control
picker, and the theme picker on the contrast grid at `/design`.

---

## Button

**File:** `src/components/common/Button/index.tsx`

Polymorphic button with three visual variants. Use `as` prop to render as `Link`, `a`, etc.

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  as?: React.ElementType;   // default 'button' — pass Link, 'a', etc.
  className?: string;
}
```

| Variant | Look |
|---|---|
| `primary` | Accent bg, white text, brightness hover, slight lift |
| `secondary` | Transparent bg, high-contrast border, hover fill |
| `ghost` | Transparent, muted text, hover fill |

| Size | Font | Padding |
|---|---|---|
| `sm` | 13px | 12px 6px |
| `md` | 14px | 20px 9px |

**Replaces:** long Tailwind CTA strings in HeroSection.

---

## TextLink

**File:** `src/components/common/TextLink/index.tsx`

Accent-colored navigation link. Wraps `next/link`.

```tsx
interface TextLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}
```

Style: `text-[13px] text-[var(--color-accent-text)] no-underline hover:underline`.

**Replaces:** inline-styled accent links in index.tsx ("All posts →") and blog.tsx ("← Clear filter").

---

## StatusDot

**File:** `src/components/common/StatusDot/index.tsx`

Small pulsing indicator dot. Uses `--color-success` by default and `animate-status-pulse`
keyframe. The `style={{ background: color }}` inline style is the one intentional exception
— color is a runtime value.

```tsx
interface StatusDotProps {
  color?: string;   // default: var(--color-success) — inline style, runtime value
  pulse?: boolean;  // default true — adds .animate-status-pulse class
  className?: string;
}
```

**Replaces:** the inline-styled `<span>` status dots in HeroSection and WidgetGrid
"Currently" widget.

---

## Panel

**File:** `src/components/common/Panel/index.tsx`

Callout block: a hairline mixed from the semantic colour, its matching tint, and a small
marker dot. Registered in the MDX component map, so blog posts can use it without
importing anything.

```tsx
interface PanelProps {
  type: 'info' | 'warning' | 'danger' | 'success' | 'accent';
  title: string;
  children?: React.ReactNode;
}
```

The semantic colour deliberately never touches text. Measured against their own tints in
the light theme the semantic foregrounds run 2.58:1 (success) to 4.75:1 (info), so a
coloured title would fail AA for half the set — the colour lives in the border and the
marker dot, both decorative, and the title stays on `--color-ink`.

---

## Table

**File:** `src/components/common/Table/index.tsx`

Compound table wrapped in a panel with horizontal scroll. Also MDX-registered.

```tsx
<Table>
  <Table.THead>
    <Table.Tr><Table.Th>Name</Table.Th></Table.Tr>
  </Table.THead>
  <Table.TBody>
    <Table.Tr><Table.Td>Value</Table.Td></Table.Tr>
  </Table.TBody>
</Table>
```

Each part takes the props of the element it renders (`ComponentPropsWithoutRef<'td'>`
and friends) and spreads `...rest`.

---

## Divider

**File:** `src/components/common/Divider/index.tsx`

`HorizontalDivider` — an `<hr>` in `--color-border`. **MDX content only.** The content
area's blueprint grid already draws horizontal lines, so a divider in layout code
competes with it (see Borders & Dividers in frontend-conventions).

---

## Mark

**File:** `src/components/common/Mark/index.tsx`

Scroll-driven highlight — the fill sweeps in as the element enters the viewport, via
`animation-timeline: view()`. Uses `styled-jsx` rather than Tailwind because the effect
animates a custom property inside a keyframe.

---

## AnimatedNumber

**File:** `src/components/common/AnimatedNumber/index.tsx`

Counts up to `value` with an expo ease-out, and scrambles random digits while `value` is
still nullish — the loading state the homepage widgets show while their data is in
flight.

```tsx
interface AnimatedNumberProps {
  value: number | undefined | null;         // nullish → scramble loading state
  duration?: number;                        // default 1.2 (seconds)
  ease?: [number, number, number, number];  // default expo ease-out
  scrambleInterval?: number;                // default 80 (ms)
  scrambleRange?: [number, number];         // default [500, 2500]
  placeholder?: string;                     // default '—'
  className?: string;
}
```

---

## TypewriterText

**File:** `src/components/common/TypewriterText/index.tsx`

Types its text out when it enters the viewport, then blinks a caret. Pass `active` to
drive it yourself instead of using the IntersectionObserver.

```tsx
interface TypewriterTextProps {
  text: string;
  charSpeed?: number;          // default 45 (ms per character)
  startDelay?: number;         // default 600 (ms)
  active?: boolean;            // bypasses the observer; types when true
  onDone?: () => void;
  hideCursorOnDone?: boolean;  // default false
  className?: string;
}
```
