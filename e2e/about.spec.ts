import { test, expect } from '@playwright/test';

test.describe('About page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('page loads', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'Bio' })).toBeVisible();
  });

  test('tab switching works', async ({ page }) => {
    const tabs = ['Bio', 'Career', 'Projects', 'Writing'];

    for (const tabName of tabs) {
      const tab = page.getByRole('tab', { name: tabName });
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');
    }
  });

  test('all tab panels exist', async ({ page }) => {
    const panels = ['bio', 'career', 'projects', 'writings'];

    for (const id of panels) {
      const panel = page.locator(`[role="tabpanel"]#${id}`);
      await expect(panel).toBeAttached();
    }
  });
});

test.describe('Career timeline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
    // Navigate to career section
    await page.getByRole('tab', { name: 'Career' }).click();
  });

  test('gantt chart renders with bars', async ({ page }) => {
    // Bars have id="career-bar-{i}" and aria-pressed
    const bars = page.locator('button[id^="career-bar-"]');
    const count = await bars.count();
    expect(count).toBeGreaterThan(0);

    // Last bar (most recent) should be selected by default
    const lastBar = page.locator(`#career-bar-${count - 1}`);
    await expect(lastBar).toHaveAttribute('aria-pressed', 'true');
  });

  test('career list renders with items', async ({ page }) => {
    const listItems = page.locator('[role="listitem"]');
    const count = await listItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking a bar selects it and expands the corresponding card', async ({
    page,
  }) => {
    // Click the first bar (oldest career entry)
    const firstBar = page.locator('#career-bar-0');
    await firstBar.click();

    // Bar should become selected
    await expect(firstBar).toHaveAttribute('aria-pressed', 'true');

    // Wait for collapse + expand animation sequence (220ms + 100ms + buffer)
    await page.waitForTimeout(500);

    // The corresponding list item's expanded details should be visible
    // First bar (index 0 in chart = last item in list)
    const listItems = page.locator('[role="listitem"]');
    const lastListItem = listItems.last();
    // Expanded content has a left border div with detail text
    await expect(
      lastListItem.locator('.text-\\[14px\\].leading-\\[1\\.75\\]'),
    ).toBeVisible();
  });

  test('clicking a different bar switches selection', async ({ page }) => {
    const bars = page.locator('button[id^="career-bar-"]');
    const count = await bars.count();

    // Click bar 0
    await page.locator('#career-bar-0').click();
    await expect(page.locator('#career-bar-0')).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    // Previously selected bar should be deselected
    await expect(
      page.locator(`#career-bar-${count - 1}`),
    ).toHaveAttribute('aria-pressed', 'false');

    // Click a middle bar
    const midIndex = Math.floor(count / 2);
    await page.locator(`#career-bar-${midIndex}`).click();
    await expect(
      page.locator(`#career-bar-${midIndex}`),
    ).toHaveAttribute('aria-pressed', 'true');

    // Previous selection should be cleared
    await expect(page.locator('#career-bar-0')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  test('clicking a list card selects the corresponding bar', async ({
    page,
  }) => {
    // Click the first list item (newest career entry = last chart bar)
    const firstListButton = page
      .locator('[role="listitem"]')
      .first()
      .locator('button');
    await firstListButton.click();

    const bars = page.locator('button[id^="career-bar-"]');
    const count = await bars.count();

    // Last bar in chart corresponds to first item in list (newest)
    await expect(
      page.locator(`#career-bar-${count - 1}`),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('expanded card shows details content', async ({ page }) => {
    // The most recent item should be expanded by default
    const firstListItem = page.locator('[role="listitem"]').first();

    // Check that expanded details content is visible
    const details = firstListItem.locator(
      '.text-\\[14px\\].leading-\\[1\\.75\\]',
    );
    await expect(details).toBeVisible();
  });

  test('clicking same list card toggles expansion', async ({ page }) => {
    // Click a different card first to change selection
    const secondListButton = page
      .locator('[role="listitem"]')
      .nth(1)
      .locator('button');
    await secondListButton.click();

    // Wait for expand
    await page.waitForTimeout(200);

    // Card should be expanded
    const secondListItem = page.locator('[role="listitem"]').nth(1);
    await expect(
      secondListItem.locator('.text-\\[14px\\].leading-\\[1\\.75\\]'),
    ).toBeVisible();

    // Click same card again — should still be selected (toggles via chart sync)
    await secondListButton.click();
    await expect(
      secondListItem.locator('.text-\\[14px\\].leading-\\[1\\.75\\]'),
    ).toBeVisible();
  });
});
