# jackyef.com — Redesign Handoff for Claude Code

This document is a complete handoff package for implementing the redesign of `jackyef.com`. Read it fully before writing any code. The design direction has been prototyped and approved — your job is to faithfully implement it in the existing Next.js repo while simultaneously refactoring the codebase for long-term maintainability.

**Prototype file:** `jacky-redesign-v3.html` (attached — open it in a browser to reference the design at any point)

---

## 1. Project context

The repo at `github.com/jackyef/my-site` powers `jackyef.com`. It's built with:
- **Next.js** (Pages Router)
- **React** (migrated away from Preact — some Radix UI components are in use)
- **Tailwind CSS** (current version — upgrade to v4 as part of this work)
- **MDX** for blog posts
- **Vercel** for deployment

The repo has been used as a personal playground, so the codebase is not well-organized. **This redesign is also a refactor opportunity** — componentize, tidy up, and establish patterns that will make future Claude Code sessions efficient.

---

## 2. High-level goals

1. **Implement the new layout** (sidebar nav + content area with inline tabs) as shown in the prototype
2. **Refactor the codebase** into a clean, well-structured component hierarchy
3. **Upgrade Tailwind CSS to v4**
4. **Preserve all existing content** — posts, about text, README, uses page, etc. Only the **homepage hero section** copy changes (see Section 6)
5. **Replace all emoji icons** with `lucide-react` icons throughout the UI
6. **Maintain all existing routes** — `/`, `/about`, `/about/readme`, `/blog`, `/blog/[slug]`, `/uses`, `/tools/playground`, etc.

---

## 3. Layout architecture

The new layout is an **app-shell** pattern. Study the prototype carefully.

```
┌─────────────────────────────────────────────────────┐
│  Sidebar (220px fixed)  │  Content area (flex: 1)   │
│                         │                           │
│  Logo / site name       │  [Inline tab bar]  ← only │
│  ⌘K quick-action bar   │   shown on About & Blog   │
│  Nav links              │                           │
│  ─────────────────      │  Page content             │
│  Theme switcher         │                           │
│  Social links           │                           │
└─────────────────────────────────────────────────────┘
```

### Sidebar
- Fixed width `220px`, full height, `position: sticky` or part of a flex shell
- Contains: logo mark ("J" in a rounded accent square) + "jackyef.com" in Fraunces serif
- Quick-action `⌘K` trigger button
- Navigation sections: **Pages** (Home, About, README, Blog, Uses) and **Tools** (Playground, Claymorphism)
- Active nav item: teal background tint + left accent bar (3px wide, accent color)
- Bottom: theme switcher (Light / Dim / Dark) + social icon row (Twitter/X, GitHub, LinkedIn, Chess.com)

### Content area
- `flex: 1`, scrollable
- Background: blueprint line grid (see Section 5 for exact CSS)
- On **About**: sticky tab bar at top with tabs — Bio, Career, Projects, Open Source, Stack
- On **Blog**: sticky tab bar becomes a breadcrumb-style indicator (All Posts → Post Title when reading)
- No secondary/side panel — that's been removed in favor of the inline tabs

### Responsive behavior
- **≥1100px**: full sidebar + content
- **768–1099px**: sidebar collapses to icon-only strip (52px), content fills remaining width. Tab labels stay visible.
- **<768px**: sidebar hidden, bottom tab bar appears with Home / About / README / Blog / ⋯ More

---

## 4. Design tokens — implement as Tailwind v4 CSS variables

Tailwind v4 uses CSS `@theme` for token definitions. Set these up in your global CSS:

### Light theme (default)
```css
--color-bg: #f6f4ef;
--color-bg-panel: #ffffff;
--color-bg-sidebar: #f0ede6;
--color-bg-hover: #e8e4db;
--color-bg-active: #e0f0ee;
--color-border: #e0dcd4;
--color-border-hi: #ccc8be;
--color-ink: #18181a;
--color-ink-2: #38383c;
--color-ink-3: #6b6b72;
--color-ink-4: #a0a0a8;
--color-accent: #2c6464;
--color-accent-2: #1a4040;
--color-accent-l: #c2dede;
--color-accent-xl: #eaf3f3;
--color-accent-text: #2c6464;
--grid-primary: rgba(44, 100, 100, 0.12);
--grid-faint: rgba(44, 100, 100, 0.045);
```

### Dim theme (`[data-theme="dim"]`)
```css
--color-bg: #1e1f24;
--color-bg-panel: #25262d;
--color-bg-sidebar: #1a1b20;
--color-bg-hover: #2e3038;
--color-bg-active: #1e3535;
--color-border: #2e3038;
--color-border-hi: #3a3d48;
--color-ink: #e8e6e0;
--color-ink-2: #c0bdb6;
--color-ink-3: #7a7880;
--color-ink-4: #4e4d56;
--color-accent: #4a9696;
--color-accent-2: #6ab8b8;
--color-accent-l: #1e4040;
--color-accent-xl: #162e2e;
--color-accent-text: #6ab8b8;
--grid-primary: rgba(74, 150, 150, 0.13);
--grid-faint: rgba(74, 150, 150, 0.05);
```

### Dark theme (`[data-theme="dark"]`)
```css
--color-bg: #0f0f11;
--color-bg-panel: #161618;
--color-bg-sidebar: #0c0c0e;
--color-bg-hover: #1e1e22;
--color-bg-active: #162424;
--color-border: #222226;
--color-border-hi: #2e2e34;
--color-ink: #f0eee8;
--color-ink-2: #b8b6b0;
--color-ink-3: #68686e;
--color-ink-4: #3e3e44;
--color-accent: #4a9696;
--color-accent-2: #7ac4c4;
--color-accent-l: #1a3636;
--color-accent-xl: #111e1e;
--color-accent-text: #7ac4c4;
--grid-primary: rgba(74, 150, 150, 0.14);
--grid-faint: rgba(74, 150, 150, 0.05);
```

Persist the user's theme choice in `localStorage` under the key `"theme"`. Apply `data-theme` to `<html>`.

---

## 5. Background pattern

The content area uses a **blueprint-style asymmetric line grid**, not a dot grid. This is intentional — it should feel like a technical drawing, not a decorative pattern. The asymmetry (sub-grid is offset, not centered within the primary grid cells) is a key design detail.

```css
.blueprint-bg {
  background-image:
    linear-gradient(to right, var(--grid-primary) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-primary) 1px, transparent 1px),
    linear-gradient(to right, var(--grid-faint) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-faint) 1px, transparent 1px);
  background-size:
    96px 96px,
    96px 96px,
    24px 24px,
    24px 24px;
  background-position:
    0 0,
    0 0,
    37px 19px,
    37px 19px;
}
```

The `37px 19px` offset is deliberate — it places the sub-grid off-center within primary cells, giving the "shows intention, not symmetry" feel that was requested.

---

## 6. Typography

- **Display / headings**: `Fraunces` (variable, optical size 9–144, weights 300/600/700, includes italic)
- **Body / UI**: `Inter` (weights 300/400/500/600)
- Load both from Google Fonts. In Next.js, use `next/font/google` for optimal loading.

```ts
import { Fraunces, Inter } from 'next/font/google'

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  weight: ['300', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
})
```

Apply both `variable` classes to `<html>` and define in Tailwind config:
```css
@theme {
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-serif: var(--font-fraunces), Georgia, serif;
}
```

Key typographic rules:
- `h1` hero: `clamp(40px, 5vw, 64px)`, weight 700, tracking `-0.03em`, Fraunces
- `h1` page titles: `clamp(32px, 4vw, 50px)`, weight 700, tracking `-0.025em`, Fraunces
- `em` inside headings: italic + `color: var(--color-accent-text)`
- Body text: 15–16px, `line-height: 1.75`, `color: var(--color-ink-2)`
- Eyebrow labels: 11px, weight 600, `letter-spacing: 0.12em`, uppercase, `color: var(--color-accent-text)`

---

## 7. Icons

**All icons must use `lucide-react`.** No emojis anywhere in the UI chrome (nav, tabs, badges, social links, etc.).

Install: `npm install lucide-react`

Key icon mappings (use these exact Lucide icon names):
| UI element | Lucide icon |
|---|---|
| Home nav | `House` |
| About nav | `User` |
| README nav | `BookOpen` |
| Blog nav | `PenLine` |
| Uses nav | `Wrench` |
| Playground nav | `FlaskConical` |
| Claymorphism nav | `Palette` |
| Bio tab | `MessageCircle` |
| Career tab | `CalendarDays` |
| Projects tab | `Rocket` |
| Open Source tab | `Github` |
| Stack tab | `Layers` |
| Twitter/X social | `Twitter` |
| GitHub social | `Github` |
| LinkedIn social | `Linkedin` |
| Chess.com | `Crown` (closest approximation) |
| Search / ⌘K | `Search` |
| Theme: Light | `Sun` |
| Theme: Dim | `Moon` |
| Theme: Dark | `CircleDot` or `Circle` |
| Live/online status dot | custom pulsing `div`, not an icon |
| External link arrow | `ArrowUpRight` |
| Back arrow | `ArrowLeft` |
| Blog post tag | `Tag` |

Icon sizing: `16px` in nav, `14px` in tabs, `13px` in social strip. Apply `aria-hidden="true"` to all decorative icons.

---

## 8. Component structure

Refactor the existing `src/components/` into this hierarchy. Create new files as needed.

```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx          ← flex container (sidebar + content)
│   │   ├── Sidebar.tsx           ← full sidebar component
│   │   ├── SidebarNav.tsx        ← nav items + active state logic
│   │   ├── ThemeSwitcher.tsx     ← light/dim/dark toggle
│   │   ├── SocialLinks.tsx       ← icon row at sidebar bottom
│   │   ├── ContentArea.tsx       ← scrollable main with blueprint bg
│   │   ├── SectionTabs.tsx       ← sticky tab bar (About & Blog)
│   │   └── BottomTabs.tsx        ← mobile bottom nav
│   │
│   ├── ui/
│   │   ├── Button.tsx            ← primary, ghost, icon variants
│   │   ├── Badge.tsx             ← eyebrow labels, tags, chips
│   │   ├── Card.tsx              ← generic card wrapper (used by widgets)
│   │   ├── CommandPalette.tsx    ← ⌘K palette (port from existing)
│   │   └── StatusDot.tsx         ← pulsing online indicator
│   │
│   ├── home/
│   │   ├── HeroSection.tsx       ← new hero content (see Section 6)
│   │   └── WidgetGrid.tsx        ← stat widgets on homepage
│   │
│   ├── about/
│   │   ├── BioView.tsx
│   │   ├── CareerView.tsx        ← timeline + calendar widget
│   │   ├── ProjectsView.tsx      ← project card grid
│   │   ├── OpenSourceView.tsx    ← OSS library list
│   │   └── StackView.tsx         ← grouped chip display
│   │
│   ├── blog/
│   │   ├── PostList.tsx          ← list of post rows
│   │   ├── PostRow.tsx           ← individual post list item
│   │   └── PostHeader.tsx        ← post title/meta header
│   │
│   └── [keep existing MDX/content components, refactored to fit above]
│
├── hooks/
│   ├── useTheme.ts               ← theme state + localStorage
│   └── useCommandPalette.ts      ← ⌘K open/close/filter state
│
├── lib/
│   └── posts.ts                  ← existing post fetching logic (keep, tidy)
│
└── styles/
    └── globals.css               ← Tailwind v4 @theme block + base styles
```

---

## 9. Page-by-page content rules

### Homepage (`/`)
**Hero section — UPDATE this copy:**
```
Name display: "Jacky" on line 1, italic "Efendi." on line 2 (Fraunces serif)
Role line: "Product Engineer, Frontend & beyond." (Fraunces light/300)
Description: "I build for the web — from performance infrastructure and design
systems to the product interfaces people actually use. Deep enough in the
frontend to care about every detail, fluent enough across the stack to never
be blocked."
Badge: pulsing green dot + "Jakarta · Open to remote"
CTAs: "Read about me →" (primary) + "My README" (ghost)
```

**Widget grid — PRESERVE existing data, adapt to new card style:**
- Currently at Sticker Mule as Tech Lead — keep accurate
- Based in Jakarta, UTC+7
- Stack chips (React, TypeScript, Next.js, etc.)
- Years of experience
- Talks given count
- Chess.com widget (links to `chess.com/member/pixelparser`)

**Recent posts section — PRESERVE**, pull from existing MDX blog post system.

### About (`/about`) 
Render as tab-based subviews. **All existing content preserved.** Tabs: Bio, Career, Projects, Open Source, Stack.

The `about` page in the current site maps to `Bio`. Sub-pages (`/about/readme`, etc.) stay as separate routes but are also reachable via the new tab UI.

### Blog (`/blog` and `/blog/[slug]`)
**PRESERVE all posts.** Adapt list and post layouts to the new design. Post list shows title, excerpt, tag chip, date, and read time per row.

### README, Uses, Playground, Claymorphism
**PRESERVE all content.** Wrap in the new layout shell. No content changes.

---

## 10. ⌘K Command palette

Port the existing command palette (if one exists) or implement new. It should be a keyboard-first overlay. Trigger: `Cmd+K` / `Ctrl+K` or clicking the search trigger in the sidebar.

Commands include:
- Navigate to each page section
- Navigate to About sub-tabs (Bio, Career, Projects, etc.)
- Switch themes (Light, Dim, Dark)
- Open social links in new tab

Implementation: `useCommandPalette` hook manages open state, filter query, selected index, and keyboard navigation (↑↓ arrows, Enter, Escape).

---

## 11. Tailwind v4 upgrade notes

Tailwind v4 changes the configuration model significantly:

1. **No more `tailwind.config.js`** — tokens live in `globals.css` inside `@theme {}`
2. **CSS-first configuration**: use `@import "tailwindcss"` in your CSS entry
3. **`@apply` works differently** — prefer utility classes directly in JSX; use `@apply` only in `globals.css` for base element styles
4. **Dark mode**: use `[data-theme="dark"]` CSS attribute selectors (which you're already doing), not Tailwind's `dark:` variant — this gives you three themes (light/dim/dark) instead of two
5. **Remove `tailwind.config.js`** once migration is complete; ensure `postcss.config.js` points to the v4 PostCSS plugin

Check the [Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide) for any breaking changes. Run their codemod: `npx @tailwindcss/upgrade`.

---

## 12. Optical alignment details

These are subtle but important. Do not skip them.

- **Sidebar logo**: the "J" mark is a `26×26px` rounded square (`border-radius: 7px`) in accent color with white "J" at 13px bold. Vertically center-align the text baseline with the mark — use `items-center` and verify visually.
- **Nav active indicator**: the left bar is `3px wide × 16px tall`, positioned at `left: -8px` from the nav item padding edge, centered vertically. It should appear to "bleed" into the sidebar left edge, not float in space.
- **Tab underline**: `2px solid` border-bottom on active tab, with `-1px` margin-bottom to sit flush with the container border below it. Without this the tab border and container border create a double line.
- **Section eyebrow + heading spacing**: `10px` gap between eyebrow and `h1/h2`. `12px` gap between heading and lead paragraph.
- **Chip / badge**: `border-radius: 100px` (pill). Padding `3px 9px`. Font size `12px`. Line height should be `1` — use `leading-none` to avoid extra vertical space inside chips.
- **Widget cards**: hover state translates `–1px` on Y axis + adds `box-shadow`. Don't just add border color — the lift effect matters.
- **Icon + text alignment in nav**: use `gap-2` (8px), ensure icon is `flex-shrink-0` so it never squishes on narrow widths. Icons should be visually centered, not just CSS-baseline aligned — check at 14px and 16px sizes.
- **Post row**: the tag chip should be `flex-shrink-0` and float right within the row's title line. Without this, long titles push the chip to wrap.
- **Timeline dot**: the current-role dot has a `box-shadow: 0 0 0 3px var(--color-accent-xl)` ring. The ring should use the theme's extra-light accent, not a hardcoded color.
- **Blueprint grid**: the background is on the `ContentArea` wrapper, not on individual page views. Ensure it stays fixed/static (not `background-attachment: fixed`) so it scrolls with content naturally.

---

## 13. Animation & transitions

Keep animations subtle and purposeful:

- **Theme transition**: `background-color`, `border-color`, `color` — all `0.22s ease` on the shell elements
- **Nav hover/active**: `0.13s` background transition
- **Hero online badge dot**: `pulse` animation — `opacity` and `scale` cycle, `2.5s ease-in-out infinite`
- **Button hover**: primary button `filter: brightness(1.1)` + `translateY(-1px)`, `0.18s`
- **Widget card hover**: `translateY(-1px)` + shadow increase, `0.2s`
- **Post row hover**: subtle background color shift, `0.12s`
- **Tab switching**: no animation needed — instant show/hide is fine
- **Command palette**: fade-in backdrop + scale-up palette, `0.15s`

No gratuitous animations. If it doesn't help the user orient themselves, remove it.

---

## 14. Code quality standards for this repo going forward

Since this is also a cleanup pass, establish these patterns:

### Component conventions
- Every component file exports one default export (the component) and optionally named type exports
- Props interfaces named `[ComponentName]Props`
- No inline `style={{}}` objects — use Tailwind classes exclusively. The only exception is for dynamic values that can't be expressed as classes (e.g. `style={{ width: `${percent}%` }}`)

### File naming
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` prefixed with `use`
- Utilities: `camelCase.ts`
- Page files follow Next.js conventions

### Path aliases
Ensure `tsconfig.json` has:
```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```
Use `@/components/...`, `@/hooks/...`, `@/lib/...` everywhere. No relative `../../` imports.

### Avoid
- Any component file over ~200 lines — split it
- Prop drilling more than 2 levels — use context or composition
- Hardcoded color values anywhere in components — always use CSS variables via Tailwind tokens

---

## 15. Implementation order (recommended)

Work in this order to avoid large rework:

1. **Set up Tailwind v4** — install, configure `globals.css` with `@theme`, verify build works
2. **Define tokens** — all CSS variables from Section 4 in `globals.css`
3. **Set up fonts** — `next/font/google` for Fraunces + Inter, apply CSS variables
4. **Build `AppShell` + `Sidebar`** — get the chrome working, theme switching functional
5. **Build `ContentArea` + `SectionTabs`** — blueprint background, sticky tabs
6. **Port homepage** — `HeroSection` (new copy), `WidgetGrid` (existing data)
7. **Port About** — all five tab views with existing content
8. **Port Blog** — list + post detail with existing MDX pipeline
9. **Port remaining pages** — README, Uses, Playground, Claymorphism
10. **Build `CommandPalette`** — ⌘K overlay
11. **Responsive polish** — icon-strip sidebar at 768–1099px, bottom tabs at <768px
12. **Icon pass** — audit every emoji in the UI and replace with `lucide-react`
13. **Optical alignment pass** — go through Section 12 checklist item by item
14. **Final cleanup** — remove dead code, old component files, unused dependencies

---

## 16. Reference files

- `jacky-redesign-v3.html` — **Open this in a browser whenever you need to check a design detail.** It is the source of truth for layout, spacing, colors, and interactions. When in doubt, inspect the prototype.
- `jackyef.com` — the live site, for reference on existing content and routes

The prototype is a faithful representation of the approved design direction, but treat it as a reference, not as code to copy verbatim — the implementation should be clean React/Next.js, not ported JavaScript.

---

*Handoff prepared March 2026. Questions or ambiguities → check the prototype first, then use your best judgment consistent with the design direction described above.*
