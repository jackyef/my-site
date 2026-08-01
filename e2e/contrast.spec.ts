import { test, expect, type Page } from '@playwright/test';

/**
 * Contrast is a promise the token ramp makes, and until now nothing kept it.
 *
 * `--color-ink-3` had drifted to 4.17:1 on `--color-bg-hover` in the light
 * theme and 4.08:1 on `--color-bg-active` in dim — both under the 4.5:1 AA
 * floor that docs/frontend-conventions.md advertises — and the only way to
 * notice was to open /design and read the grid. This suite makes that check
 * automatic.
 *
 * It resolves tokens from the live stylesheet rather than from a table of
 * hexes, so it measures what actually ships: a token changed in globals.css is
 * a token re-measured here, with no second list to update.
 */

const THEMES = ['light', 'dim', 'dark'] as const;

/** Every plane a piece of text can land on. */
const SURFACES = [
  '--color-bg',
  '--color-bg-panel',
  '--color-bg-sidebar',
  '--color-bg-hover',
  '--color-bg-active',
] as const;

/**
 * The ink steps that carry real copy, plus the accent used for links. `ink-4`
 * is deliberately absent: it is the decorative tier — separator marks,
 * sparkline fills, icons echoing an adjacent label — and sits around 2.4-3.2:1
 * by design. It is covered by the ramp-ordering check below instead.
 */
const BODY_FOREGROUNDS = [
  '--color-ink',
  '--color-ink-2',
  '--color-ink-3',
  '--color-accent-text',
] as const;

/** The full ramp, brightest to faintest, for the ordering invariant. */
const INK_RAMP = [
  '--color-ink',
  '--color-ink-2',
  '--color-ink-3',
  '--color-ink-4',
] as const;

const AA = 4.5;

type Rgb = [number, number, number];

function parseRgb(value: string): Rgb {
  const match = value.match(/-?[\d.]+/g);
  if (!match || match.length < 3) {
    throw new Error(`could not parse colour: ${value}`);
  }
  return [Number(match[0]), Number(match[1]), Number(match[2])];
}

/** WCAG 2.1 relative luminance. */
function luminance([r, g, b]: Rgb): number {
  const channel = (raw: number) => {
    const c = raw / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Reads the given custom properties out of the browser, once per theme.
 *
 * Each theme gets its own `data-theme` subtree, which re-declares the whole
 * palette for its descendants — the same trick /design uses to show all three
 * themes side by side without touching the visitor's setting. Colours are read
 * back off a probe's computed `color`, so the browser normalises whatever the
 * token holds (hex, `color-mix`, another `var`) into plain `rgb()`.
 */
async function resolveTokens(
  page: Page,
  tokens: readonly string[],
): Promise<Record<string, Record<string, Rgb>>> {
  const raw = await page.evaluate(
    ({ themes, names }) => {
      const host = document.createElement('div');
      host.style.cssText = 'position:absolute;left:-9999px;top:0';
      document.body.appendChild(host);

      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      const toRgbString = (value: string) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = '#000';
        ctx.fillStyle = value;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return `rgb(${r}, ${g}, ${b})`;
      };

      const out: Record<string, Record<string, string>> = {};

      for (const theme of themes) {
        const scope = document.createElement('div');
        scope.setAttribute('data-theme', theme);
        host.appendChild(scope);

        const probes = names.map((name) => {
          const probe = document.createElement('span');
          probe.style.color = `var(${name})`;
          scope.appendChild(probe);
          return probe;
        });

        // Read after the whole theme's probes are attached, so the batch costs
        // one style recalculation rather than one per token.
        //
        // Painted to a canvas rather than read as a string: getComputedStyle
        // returns whatever colour syntax the value was authored in, and these
        // tokens are oklch. Comparing notation is not comparing colour, so the
        // bytes the browser would actually paint are what get measured.
        out[theme] = Object.fromEntries(
          names.map((name, i) => [
            name,
            toRgbString(getComputedStyle(probes[i]).color),
          ]),
        );
      }

      host.remove();
      return out;
    },
    { themes: [...THEMES], names: [...tokens] },
  );

  return Object.fromEntries(
    Object.entries(raw).map(([theme, values]) => [
      theme,
      Object.fromEntries(
        Object.entries(values).map(([name, value]) => [name, parseRgb(value)]),
      ),
    ]),
  );
}

test.describe('Token contrast', () => {
  test('every body-text ink clears WCAG AA on every surface, in every theme', async ({
    page,
  }) => {
    await page.goto('/design');

    const resolved = await resolveTokens(page, [
      ...BODY_FOREGROUNDS,
      ...SURFACES,
    ]);

    // Collect every failure before asserting. One bad pair usually means a
    // whole row or column is off, and a report of all of them is far more
    // useful than whichever happened to be measured first.
    const failures: string[] = [];

    for (const theme of THEMES) {
      for (const fg of BODY_FOREGROUNDS) {
        for (const bg of SURFACES) {
          const ratio = contrastRatio(resolved[theme][fg], resolved[theme][bg]);
          if (ratio < AA) {
            failures.push(
              `${theme}: ${fg} on ${bg} = ${ratio.toFixed(2)}:1 (needs ${AA})`,
            );
          }
        }
      }
    }

    expect(
      failures,
      'a token in globals.css no longer meets the AA floor the ink ramp promises',
    ).toEqual([]);
  });

  test('the ink ramp stays monotonic — each step is fainter than the last', async ({
    page,
  }) => {
    await page.goto('/design');

    const resolved = await resolveTokens(page, [...INK_RAMP, ...SURFACES]);
    const inversions: string[] = [];

    for (const theme of THEMES) {
      for (const bg of SURFACES) {
        const ratios = INK_RAMP.map((fg) =>
          contrastRatio(resolved[theme][fg], resolved[theme][bg]),
        );

        for (let i = 1; i < ratios.length; i++) {
          if (ratios[i] >= ratios[i - 1]) {
            inversions.push(
              `${theme} on ${bg}: ${INK_RAMP[i]} (${ratios[i].toFixed(2)}) is not fainter than ${INK_RAMP[i - 1]} (${ratios[i - 1].toFixed(2)})`,
            );
          }
        }
      }
    }

    expect(
      inversions,
      'the ink ramp is meant to descend — two steps have crossed over',
    ).toEqual([]);
  });

  test('text on an accent fill clears AA', async ({ page }) => {
    await page.goto('/design');

    const resolved = await resolveTokens(page, [
      '--color-on-accent',
      '--color-accent',
    ]);

    for (const theme of THEMES) {
      const ratio = contrastRatio(
        resolved[theme]['--color-on-accent'],
        resolved[theme]['--color-accent'],
      );

      expect(
        ratio,
        `${theme}: --color-on-accent on --color-accent = ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(AA);
    }
  });

  test('hover and active surfaces are actually distinguishable from the page', async ({
    page,
  }) => {
    await page.goto('/design');

    const resolved = await resolveTokens(page, [...SURFACES]);

    // There is no WCAG floor for "this row is highlighted", but a state that
    // renders at 1.00 is no state at all. 1.05 is roughly where the shift stops
    // being visible on a mediocre panel.
    for (const theme of THEMES) {
      for (const surface of [
        '--color-bg-hover',
        '--color-bg-active',
      ] as const) {
        const ratio = contrastRatio(
          resolved[theme][surface],
          resolved[theme]['--color-bg'],
        );

        expect(
          ratio,
          `${theme}: ${surface} is indistinguishable from --color-bg`,
        ).toBeGreaterThan(1.05);
      }
    }
  });
});
