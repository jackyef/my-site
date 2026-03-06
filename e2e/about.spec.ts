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
