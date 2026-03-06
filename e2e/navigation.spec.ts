import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('sidebar links navigate correctly', async ({ page }) => {
    // Start at homepage
    await page.goto('/');

    // Navigate to About
    await page.locator('nav a[href="/about"]').first().click();
    await expect(page).toHaveURL('/about');

    // Navigate to Blog
    await page.locator('nav a[href="/blog"]').first().click();
    await expect(page).toHaveURL('/blog');

    // Navigate back to Home
    await page.locator('nav a[href="/"]').first().click();
    await expect(page).toHaveURL('/');
  });

  test('theme switcher changes theme', async ({ page }) => {
    await page.goto('/');

    // Wait for client hydration
    await page.waitForFunction(
      () => document.documentElement.hasAttribute('data-theme'),
    );

    const getTheme = () =>
      page.evaluate(() =>
        document.documentElement.getAttribute('data-theme'),
      );

    const initialTheme = await getTheme();
    expect(initialTheme).toBeTruthy();

    // Click the "Dim" theme button (visible at desktop width)
    const dimButton = page.getByRole('button', { name: 'Dim' });
    const dimVisible = await dimButton.isVisible().catch(() => false);

    if (dimVisible) {
      await dimButton.click();
      await expect
        .poll(() => getTheme())
        .toBe('dim');
    } else {
      // Compact theme button — click to cycle
      const themeButton = page.locator(
        'button[aria-label*="theme"]',
      );
      if ((await themeButton.count()) > 0) {
        const before = await getTheme();
        await themeButton.click();
        await expect
          .poll(() => getTheme())
          .not.toBe(before);
      }
    }
  });
});
