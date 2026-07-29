import { test, expect } from '@playwright/test';

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

  test('section tabs scroll to their section', async ({ page }) => {
    await page.goto('/design');
    await page.waitForLoadState('networkidle');

    await page.getByRole('tab', { name: 'Components' }).click();
    await page.waitForTimeout(900);

    const box = await page.locator('section#components').boundingBox();
    expect(box).not.toBeNull();
    // Section top is at or near the top of the viewport after the scroll.
    expect(Math.abs(box!.y)).toBeLessThan(300);
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

  test('is reachable from the sidebar', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav a[href="/design"]').first().click();
    await expect(page).toHaveURL('/design');
  });
});
