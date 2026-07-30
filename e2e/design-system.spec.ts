import { test, expect, type Page } from '@playwright/test';

/**
 * The design system page reads its values out of the live stylesheet rather
 * than repeating them, which makes it a usable regression net for the tokens
 * themselves: if a token is renamed or dropped from globals.css while the
 * registry still lists it, the swatch resolves to nothing and these fail.
 *
 * Deliberately behavioural rather than pixel-based. The visual suite's
 * snapshots are platform-suffixed (…-chromium-darwin.png) and generated on a
 * Mac, so a screenshot test added from another OS would fail CI until someone
 * regenerated it locally.
 */

const SECTIONS = [
  'color',
  'contrast',
  'surfaces',
  'typography',
  'components',
  'patterns',
];

test.describe('Design system page', () => {
  test('renders every section', async ({ page }) => {
    await page.goto('/design');

    for (const id of SECTIONS) {
      await expect(page.locator(`section#${id}`)).toHaveCount(1);
    }
  });

  test('every documented colour token resolves in all three themes', async ({
    page,
  }) => {
    await page.goto('/design');
    await page.waitForLoadState('networkidle');

    // Swatch captions are "<theme> #rrggbb" on mobile, "#rrggbb" on desktop —
    // either way an unresolved token renders the em dash placeholder.
    const captions = page.locator('section#color .font-mono.tabular-nums');
    const count = await captions.count();
    expect(count).toBeGreaterThan(0);

    const texts = await captions.allInnerTexts();
    const unresolved = texts.filter((t) => !/#[0-9a-f]{6}/i.test(t));

    expect(
      unresolved,
      'a token in the registry no longer resolves — check globals.css',
    ).toEqual([]);
  });

  test('the three themes resolve to genuinely different values', async ({
    page,
  }) => {
    await page.goto('/design');
    await page.waitForLoadState('networkidle');

    // First row of the Surfaces group is --color-bg, in light / dim / dark.
    const row = page.locator('section#color .font-mono.tabular-nums');
    const [light, dim, dark] = await Promise.all([
      row.nth(0).innerText(),
      row.nth(1).innerText(),
      row.nth(2).innerText(),
    ]);

    const hex = (s: string) => s.match(/#[0-9a-f]{6}/i)?.[0];

    expect(hex(light)).toBeTruthy();
    expect(new Set([hex(light), hex(dim), hex(dark)]).size).toBe(3);
  });

  test('the contrast grid computes real WCAG ratios', async ({ page }) => {
    await page.goto('/design');
    await page.waitForLoadState('networkidle');

    const grid = page.locator('section#contrast table');
    await expect(grid).toBeVisible();

    const ratios = await grid.locator('td .tabular-nums').allInnerTexts();
    // 5 foregrounds x 5 backgrounds
    expect(ratios).toHaveLength(25);

    for (const text of ratios) {
      const value = Number(text);
      expect(Number.isNaN(value)).toBe(false);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(21);
    }

    // ink on bg must stay the strongest pairing in the ramp.
    expect(Number(ratios[0])).toBeGreaterThan(Number(ratios[5]));
  });

  test('switching the grid theme recomputes the ratios', async ({ page }) => {
    await page.goto('/design');
    await page.waitForLoadState('networkidle');

    const firstCell = page
      .locator('section#contrast table td .tabular-nums')
      .first();
    const before = await firstCell.innerText();

    await page
      .locator('section#contrast')
      .getByRole('button', { name: 'Dark' })
      .click();

    await expect(firstCell).not.toHaveText(before);
  });

  /**
   * Components sits ~9000px down, and a smooth scroll of that length settles at
   * its own pace — slower on a loaded CI runner than locally. Poll for the
   * resting position rather than sleeping on a guessed duration.
   */
  const expectScrolledToComponents = async (page: Page) =>
    expect
      .poll(
        async () => {
          const box = await page.locator('section#components').boundingBox();
          return box ? Math.abs(box.y) : Infinity;
        },
        { timeout: 15_000 },
      )
      .toBeLessThan(300);

  test('the rail navigates to a section', async ({ page }) => {
    // The rail replaces the tab strip from 1200px up.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/design');
    await page.waitForLoadState('networkidle');

    const rail = page.getByRole('navigation', { name: 'On this page' });
    await expect(rail).toBeVisible();
    await rail.getByRole('link', { name: 'Components', exact: true }).click();

    await expectScrolledToComponents(page);
  });

  test('the rail lists the components it documents', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/design');
    await page.waitForLoadState('networkidle');

    const rail = page.getByRole('navigation', { name: 'On this page' });

    // Discovered from the rendered specs, so a new <Spec> shows up here with no
    // second list to maintain — which is exactly what this asserts.
    for (const name of ['Button', 'Surface', 'Panel', 'Table']) {
      await expect(rail.getByRole('link', { name, exact: true })).toBeVisible();
    }
  });

  test('the tab strip navigates below the rail breakpoint', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1100, height: 900 });
    await page.goto('/design');
    await page.waitForLoadState('networkidle');

    await page.getByRole('tab', { name: 'Components' }).click();

    await expectScrolledToComponents(page);
  });

  test('the tab strip stays pinned to the top while scrolling', async ({
    page,
  }) => {
    // Regression: the strip was wrapped in a plain div carrying its responsive
    // hiding, which made that div the sticky bar's containing block. A sticky
    // element cannot leave its parent's box, and the wrapper was only as tall
    // as the tabs, so the bar scrolled away on the first flick — on phones,
    // where it is the *only* navigation the page has.
    await page.setViewportSize({ width: 390, height: 780 });
    await page.goto('/design');
    await page.waitForLoadState('networkidle');

    const tablist = page.getByRole('tablist');
    await expect(tablist).toBeVisible();

    const main = page.locator('main');
    await main.evaluate((el) => el.scrollTo(0, 1500));

    // <main> carries `scroll-smooth`, so the scroll animates. Wait for it to
    // land before measuring — polling the tab bar's position directly would
    // sample it at offset 0 on the first tick and pass without ever scrolling.
    await expect
      .poll(() => main.evaluate((el) => el.scrollTop), { timeout: 5_000 })
      .toBeGreaterThan(1_000);

    expect((await tablist.boundingBox())?.y).toBe(0);
  });

  test('component demos render the real primitives', async ({ page }) => {
    await page.goto('/design');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('#component-button')).toBeVisible();
    await expect(
      page
        .locator('#component-button')
        .getByRole('button', { name: 'Primary' }),
    ).toBeVisible();

    // Prop tables and usage snippets are behind a toggle.
    const surfaceSpec = page.locator('#component-surface');
    await surfaceSpec.getByRole('button', { name: 'Usage' }).click();
    await expect(surfaceSpec.locator('pre')).toBeVisible();
  });

  test('usage snippets are syntax highlighted', async ({ page }) => {
    await page.goto('/design');
    await page.waitForLoadState('networkidle');

    const spec = page.locator('#component-button');
    await spec.getByRole('button', { name: 'Usage' }).click();

    const classes = await spec
      .locator('pre code span')
      .evaluateAll((nodes) => nodes.map((n) => n.className));

    expect(classes.length).toBeGreaterThan(0);

    // Must be the site's own --code-* palette. Prism's raw `token …` classes
    // showing up here would mean its auto-highlighting has clobbered React's
    // output again — it hunts for code[class*="language-"] on load, and is
    // opted out of in src/lib/prism.ts.
    expect(classes.some((c) => c.startsWith('token'))).toBe(false);
    expect(classes.some((c) => c.startsWith('text-code-'))).toBe(true);

    // tsx grammar actually loaded: keyword, string and JSX tag are distinct.
    for (const cls of [
      'text-code-purple',
      'text-code-green',
      'text-code-red',
    ]) {
      expect(classes, `expected a ${cls} token`).toContain(cls);
    }
  });

  test('is reachable from the sidebar', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav a[href="/design"]').first().click();
    await expect(page).toHaveURL('/design');
  });
});
