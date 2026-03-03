Use playwright MCP for your iteration.
Put temporary files in ./.playwright-mcp and cleanup after. Do NOT go outside the project directory.
A dev server has been run on port 3000 for you to work.
Implement the dim theme in the prototype html.

# OG Image API — Satori Implementation

Create `app/api/og/route.tsx`. Open `og-prototype.html` in a browser as your visual reference — match it exactly.

---

## What it does

Edge route that returns a 1200×630 PNG. Accepts two query params:

| param | fallback |
|---|---|
| `?title=` | `'jackyef.com'` |
| `?description=` | `''` |

Theme is read from the `theme` cookie (`light` \| `dim` \| `dark`), defaulting to `light`.

---

## Install

```bash
npm install @vercel/og
```

`@vercel/og` re-exports `ImageResponse` — import from there, not from `next/server`.

---

## Fonts

Fetch at module scope and cache. Do not re-fetch on every request.

```ts
export const runtime = 'edge'

type FontData = { name: string; data: ArrayBuffer; weight: number; style: 'normal' }
let cachedFonts: FontData[] | null = null

async function getFonts(): Promise<FontData[]> {
  if (cachedFonts) return cachedFonts

  const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'

  async function fetchFont(family: string, weight: number): Promise<ArrayBuffer> {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`,
      { headers: { 'User-Agent': UA } }
    ).then(r => r.text())

    const url = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/)?.[1]
    if (!url) throw new Error(`Font URL not found for ${family} ${weight}`)
    return fetch(url).then(r => r.arrayBuffer())
  }

  cachedFonts = [
    { name: 'Fraunces', data: await fetchFont('Fraunces:opsz,wght@9..144', 700), weight: 700, style: 'normal' },
    { name: 'Epilogue',  data: await fetchFont('Epilogue', 400), weight: 400, style: 'normal' },
    { name: 'Epilogue',  data: await fetchFont('Epilogue', 500), weight: 500, style: 'normal' },
    { name: 'Epilogue',  data: await fetchFont('Epilogue', 600), weight: 600, style: 'normal' },
  ]
  return cachedFonts
}
```

---

## Themes

```ts
const themes = {
  light: {
    bg:        '#f6f4ef',
    ink:       '#18181a',
    ink3:      '#6b6b72',
    ink4:      '#a0a0a8',
    accent:    '#2c6464',
    accentBar: '#c2dede',
    borderHi:  '#ccc8be',
    gridPrimary: 'rgba(44,100,100,0.12)',
    gridFaint:   'rgba(44,100,100,0.045)',
  },
  dim: {
    bg:        '#1e1f24',
    ink:       '#e8e6e0',
    ink3:      '#7a7880',
    ink4:      '#4e4d56',
    accent:    '#6ab8b8',
    accentBar: '#1e4040',
    borderHi:  '#3a3d48',
    gridPrimary: 'rgba(74,150,150,0.13)',
    gridFaint:   'rgba(74,150,150,0.05)',
  },
  dark: {
    bg:        '#0f0f11',
    ink:       '#f0eee8',
    ink3:      '#68686e',
    ink4:      '#3e3e44',
    accent:    '#7ac4c4',
    accentBar: '#1a3636',
    borderHi:  '#2e2e34',
    gridPrimary: 'rgba(74,150,150,0.14)',
    gridFaint:   'rgba(74,150,150,0.05)',
  },
} as const

type Theme = typeof themes.light
```

---

## Satori constraints

Satori renders JSX with inline styles only — no stylesheets, no class names. Important limitations:

- **No `::before`/`::after`** — use explicit `<div>` children
- **No `<br>`** — split title into two `<div>` elements (see below)
- **No CSS gradient backgrounds** — the grid must be rendered as `<div>` elements in a loop (see below)
- **No `overflow: hidden`**, **no `box-shadow`**, **no `transform`**
- `letterSpacing` must be in `px`, not `em`
- `lineHeight` as a unitless number works fine

---

## Blueprint grid

`background-image` gradients are not supported. Render the grid as absolutely-positioned 1px `<div>` elements:

```tsx
function GridLines({ t }: { t: Theme }) {
  const W = 1200, H = 630
  const els: React.ReactNode[] = []

  // Primary grid: 96px spacing
  for (let x = 0; x <= W; x += 96)
    els.push(<div key={`pv${x}`} style={{ position: 'absolute', top: 0, left: x, width: 1, height: H, backgroundColor: t.gridPrimary }} />)
  for (let y = 0; y <= H; y += 96)
    els.push(<div key={`ph${y}`} style={{ position: 'absolute', left: 0, top: y, width: W, height: 1, backgroundColor: t.gridPrimary }} />)

  // Sub-grid: 24px spacing, offset 37px 19px
  for (let x = 37 % 24; x <= W; x += 24)
    els.push(<div key={`sv${x}`} style={{ position: 'absolute', top: 0, left: x, width: 1, height: H, backgroundColor: t.gridFaint }} />)
  for (let y = 19 % 24; y <= H; y += 24)
    els.push(<div key={`sh${y}`} style={{ position: 'absolute', left: 0, top: y, width: W, height: 1, backgroundColor: t.gridFaint }} />)

  return <>{els}</>
}
```

---

## Title splitting

`<br>` doesn't work in satori. Split at roughly the character midpoint:

```ts
function splitTitle(title: string): [string, string] {
  const words = title.split(' ')
  if (words.length === 1) return [title, '']
  const mid = Math.ceil(title.length / 2)
  let cursor = 0, splitAt = 1
  for (let i = 0; i < words.length - 1; i++) {
    cursor += words[i].length + 1
    if (cursor >= mid) { splitAt = i + 1; break }
  }
  return [words.slice(0, splitAt).join(' '), words.slice(splitAt).join(' ')]
}
```

---

## JSX layout

Pixel values come from the prototype. Do not deviate.

```tsx
function OgImage({ title, description, t }: { title: string; description: string; t: Theme }) {
  const [line1, line2] = splitTitle(title)

  return (
    <div style={{ width: 1200, height: 630, display: 'flex', alignItems: 'center',
                  backgroundColor: t.bg, position: 'relative' }}>

      {/* Grid */}
      <GridLines t={t} />

      {/* Content */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column',
                    padding: '0 96px', width: '100%', zIndex: 1 }}>

        {/* Eyebrow */}
        <div style={{ fontFamily: 'Epilogue', fontSize: 11, fontWeight: 600,
                      letterSpacing: '1.32px', textTransform: 'uppercase',
                      color: t.accent, marginBottom: 20 }}>
          Blog
        </div>

        {/* Title block */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative',
                      paddingLeft: 22, marginLeft: -22, marginBottom: 26 }}>
          {/* Accent bar — replaces ::before */}
          <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8,
                        width: 3, backgroundColor: t.accentBar, borderRadius: 2 }} />
          {/* Line 1 */}
          <div style={{ fontFamily: 'Fraunces', fontSize: 76, fontWeight: 700,
                        lineHeight: 1.02, letterSpacing: '-2.28px', color: t.ink }}>
            {line1}
          </div>
          {/* Line 2 — only render if non-empty */}
          {line2 && (
            <div style={{ fontFamily: 'Fraunces', fontSize: 76, fontWeight: 700,
                          lineHeight: 1.02, letterSpacing: '-2.28px', color: t.ink }}>
              {line2}
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <div style={{ fontFamily: 'Epilogue', fontSize: 18, fontWeight: 400,
                        lineHeight: 1.6, color: t.ink3, maxWidth: 680,
                        marginBottom: 44 }}>
            {description}
          </div>
        )}

        {/* Domain stamp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10,
                      fontFamily: 'Epilogue', fontSize: 13, fontWeight: 500,
                      color: t.ink4, letterSpacing: '0.26px' }}>
          <div style={{ width: 24, height: 1, backgroundColor: t.borderHi }} />
          jackyef.com
        </div>

      </div>
    </div>
  )
}
```

---

## Route handler

```ts
export async function GET(req: NextRequest) {
  const { searchParams, cookies } = new URL(req.url)

  // Read theme from cookie
  const cookieHeader = req.headers.get('cookie') ?? ''
  const themeCookie = cookieHeader.match(/(?:^|;\s*)theme=([^;]+)/)?.[1] ?? 'light'
  const theme = themeCookie in themes ? themeCookie as keyof typeof themes : 'light'
  const t = themes[theme]

  const title       = searchParams.get('title')       ?? 'jackyef.com'
  const description = searchParams.get('description') ?? ''

  const fonts = await getFonts()

  return new ImageResponse(
    <OgImage title={title} description={description} t={t} />,
    { width: 1200, height: 630, fonts }
  )
}
```

---

## Usage

```
/api/og?title=1-Billion+Row+Challenge+with+Node.js&description=Processing+a+12+GB+file...
```

In `layout.tsx` or per-page metadata:

```ts
export const metadata = {
  openGraph: {
    images: [`/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`],
  },
}
```

---

## Checklist

- [ ] Grid renders — primary lines (96px) and sub-grid (24px, offset 37/19)
- [ ] Title in Fraunces 76px, weight 700, letter-spacing −2.28px, correct theme ink color
- [ ] Accent bar is 3px wide, runs full title block height, correct theme color
- [ ] Description in Epilogue 18px, weight 400, ink3 color — hidden when empty
- [ ] Domain stamp is 13px, ink4, preceded by 24px rule in borderHi color
- [ ] All three themes render correctly — verify by hitting `/api/og` with the theme cookie set
- [ ] Output is exactly 1200×630px
