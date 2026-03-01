# Component Library — `src/components/common/`

Shared UI primitives. All use Tailwind + `cn()` only (no goober, no inline styles except
where noted). Import from their directory: `@/components/common/Card`.

---

## Card

**File:** `src/components/common/Card/index.tsx`

The canonical panel container. Provides rounded border, panel background, and drop shadow.
Use `hover` for interactive cards (replaces `onMouseEnter/Leave` style mutations).

```tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;          // adds .card-hover (CSS transition lift on :hover)
  padding?: 'none' | 'sm' | 'md';  // none | px-[14px] py-[12px] | px-[20px] py-[16px]
  as?: React.ElementType;   // default 'div'
}
```

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
interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;  // default 'div'
}
```

**Replaces:** repeated inline-styled label divs in WidgetGrid widgets and StackView group
labels.

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
  value: T;
  onChange: (value: T) => void;
  className?: string;       // pass 'w-full' to fill container width
  labelClassName?: string;  // e.g. 'hidden lg:inline' for sidebar label hiding
}
```

**Replaces:** the button-group in ThemeSwitcher (non-compact) and the time-control picker
in ChessWidget.

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
