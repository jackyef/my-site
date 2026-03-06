import { test, expect } from '@playwright/test';

test.describe('Blog page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('page loads with post list', async ({ page }) => {
    await expect(page.getByText('All writings.')).toBeVisible();

    // Should have at least one post row
    const posts = page.locator('a[href^="/posts/"]');
    await expect(posts.first()).toBeVisible();
  });

  test('tag filtering works', async ({ page }) => {
    // Find and click a tag chip
    const firstTag = page.locator('a[href^="/blog?tags="]').first();
    const tagExists = (await firstTag.count()) > 0;

    if (tagExists) {
      await firstTag.click();

      // Title should change to indicate filtering
      await expect(page.getByText('Posts tagged')).toBeVisible();

      // Clear filter link should appear
      const clearFilter = page.getByText('Clear filter');
      await expect(clearFilter).toBeVisible();

      // Click clear filter to go back
      await clearFilter.click();
      await expect(page.getByText('All writings.')).toBeVisible();
    }
  });
});
