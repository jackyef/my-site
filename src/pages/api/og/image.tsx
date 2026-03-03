import { type JSX } from 'react';
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

// ── Themes ──
const themes = {
  light: {
    bg: '#f6f4ef',
    ink: '#18181a',
    ink3: '#6b6b72',
    ink4: '#a0a0a8',
    accent: '#2c6464',
    accentBar: '#c2dede',
    borderHi: '#ccc8be',
    gridPrimary: 'rgba(44,100,100,0.12)',
    gridFaint: 'rgba(44,100,100,0.045)',
  },
  dim: {
    bg: '#1e1f24',
    ink: '#e8e6e0',
    ink3: '#7a7880',
    ink4: '#4e4d56',
    accent: '#6ab8b8',
    accentBar: '#1e4040',
    borderHi: '#3a3d48',
    gridPrimary: 'rgba(74,150,150,0.13)',
    gridFaint: 'rgba(74,150,150,0.05)',
  },
  dark: {
    bg: '#0f0f11',
    ink: '#f0eee8',
    ink3: '#68686e',
    ink4: '#3e3e44',
    accent: '#7ac4c4',
    accentBar: '#1a3636',
    borderHi: '#2e2e34',
    gridPrimary: 'rgba(74,150,150,0.14)',
    gridFaint: 'rgba(74,150,150,0.05)',
  },
} as const;

type Theme = (typeof themes)[keyof typeof themes];

// ── Font cache ──
type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type FontData = {
  name: string;
  data: ArrayBuffer;
  weight: Weight;
  style: 'normal';
};
let cachedFonts: FontData[] | null = null;

function extractLatinWoffUrl(css: string): string | null {
  const latin = css.split('/* latin */').pop() ?? '';
  return latin.match(/src:\s*url\(([^)]+)\)\s*format\('woff'\)/)?.[1] ?? null;
}

async function getFonts(): Promise<FontData[]> {
  if (cachedFonts) return cachedFonts;

  // Safari UA → returns woff format (compatible with @vercel/og v0.0.22)
  const ua =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15';

  async function fetchFont(cssUrl: string): Promise<ArrayBuffer> {
    const cssRes = await fetch(cssUrl, {
      headers: { 'User-Agent': ua },
    });
    if (!cssRes.ok)
      throw new Error(`Font CSS fetch failed: ${cssRes.status} ${cssUrl}`);
    const css = await cssRes.text();

    const url = extractLatinWoffUrl(css);
    if (!url) throw new Error(`Font URL not found in CSS: ${cssUrl}`);

    const fontRes = await fetch(url);
    if (!fontRes.ok)
      throw new Error(`Font file fetch failed: ${fontRes.status} ${url}`);
    return fontRes.arrayBuffer();
  }

  const [fraunces700, epilogue400, epilogue500, epilogue600] =
    await Promise.all([
      fetchFont(
        'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&display=swap',
      ),
      fetchFont(
        'https://fonts.googleapis.com/css2?family=Epilogue:wght@400&display=swap',
      ),
      fetchFont(
        'https://fonts.googleapis.com/css2?family=Epilogue:wght@500&display=swap',
      ),
      fetchFont(
        'https://fonts.googleapis.com/css2?family=Epilogue:wght@600&display=swap',
      ),
    ]);

  cachedFonts = [
    { name: 'Fraunces', data: fraunces700, weight: 700, style: 'normal' },
    { name: 'Epilogue', data: epilogue400, weight: 400, style: 'normal' },
    { name: 'Epilogue', data: epilogue500, weight: 500, style: 'normal' },
    { name: 'Epilogue', data: epilogue600, weight: 600, style: 'normal' },
  ];
  return cachedFonts;
}

// ── Title splitting ──
function splitTitle(title: string): [string, string] {
  const words = title.split(' ');
  if (words.length === 1) return [title, ''];
  const mid = Math.ceil(title.length / 2);
  let cursor = 0;
  let splitAt = 1;
  for (let i = 0; i < words.length - 1; i++) {
    cursor += words[i].length + 1;
    if (cursor >= mid) {
      splitAt = i + 1;
      break;
    }
  }
  return [words.slice(0, splitAt).join(' '), words.slice(splitAt).join(' ')];
}

// ── Grid lines ──
// @vercel/og v0.0.22 silently returns empty body when JSX tree is too large.
// Keep grid to primary lines only (~20 divs) to stay under the threshold.
function gridLines(t: Theme) {
  const W = 1200;
  const H = 630;
  const els: JSX.Element[] = [];

  // Primary grid: 96px spacing
  for (let x = 0; x <= W; x += 96)
    els.push(
      <div
        key={`pv${x}`}
        style={{
          position: 'absolute',
          top: 0,
          left: x,
          width: 1,
          height: H,
          backgroundColor: t.gridPrimary,
        }}
      />,
    );
  for (let y = 0; y <= H; y += 96)
    els.push(
      <div
        key={`ph${y}`}
        style={{
          position: 'absolute',
          left: 0,
          top: y,
          width: W,
          height: 1,
          backgroundColor: t.gridPrimary,
        }}
      />,
    );

  // Sub-grid: 24px spacing, offset 37px 19px
  for (let x = 37 % 24; x <= W; x += 24)
    els.push(
      <div
        key={`sv${x}`}
        style={{
          position: 'absolute',
          top: 0,
          left: x,
          width: 1,
          height: H,
          backgroundColor: t.gridFaint,
        }}
      />,
    );
  for (let y = 19 % 24; y <= H; y += 24)
    els.push(
      <div
        key={`sh${y}`}
        style={{
          position: 'absolute',
          left: 0,
          top: y,
          width: W,
          height: 1,
          backgroundColor: t.gridFaint,
        }}
      />,
    );

  return els;
}

// ── Handler ──
export default async function handler(req: NextRequest) {
  const url = new URL(req.url);
  const title = url.searchParams.get('title') ?? 'jackyef.com';
  const description = url.searchParams.get('description') ?? '';

  const t = themes['light'];

  const fonts = await getFonts();
  const [line1, line2] = splitTitle(title);

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: t.bg,
        position: 'relative',
      }}
    >
      {gridLines(t)}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          padding: '0 96px',
          width: '100%',
          zIndex: 1,
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            fontFamily: 'Epilogue',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '1.32px',
            textTransform: 'uppercase',
            color: t.accent,
            marginBottom: 20,
          }}
        >
          Blog
        </div>
        {/* Title block */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            paddingLeft: 22,
            marginLeft: -22,
            marginBottom: 26,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 8,
              bottom: 8,
              width: 3,
              backgroundColor: t.accentBar,
              borderRadius: 2,
            }}
          />
          <div
            style={{
              fontFamily: 'Fraunces',
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: '-2.28px',
              color: t.ink,
            }}
          >
            {line1}
          </div>
          {line2 ? (
            <div
              style={{
                fontFamily: 'Fraunces',
                fontSize: 76,
                fontWeight: 700,
                lineHeight: 1.02,
                letterSpacing: '-2.28px',
                color: t.ink,
              }}
            >
              {line2}
            </div>
          ) : null}
        </div>
        {/* Description */}
        {description ? (
          <div
            style={{
              fontFamily: 'Epilogue',
              fontSize: 18,
              fontWeight: 400,
              lineHeight: 1.6,
              color: t.ink3,
              maxWidth: 680,
              marginBottom: 44,
            }}
          >
            {description}
          </div>
        ) : null}
        {/* Domain stamp */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'Epilogue',
            fontSize: 13,
            fontWeight: 500,
            color: t.ink4,
            letterSpacing: '0.26px',
          }}
        >
          <div style={{ width: 24, height: 1, backgroundColor: t.borderHi }} />
          jackyef.com
        </div>
      </div>
    </div>,
    { width: 1200, height: 630, fonts },
  );
}
