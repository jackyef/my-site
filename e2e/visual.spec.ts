import { test, expect } from '@playwright/test';

const pages = [
  { name: 'homepage', path: '/' },
  { name: 'blog', path: '/blog' },
  { name: 'about', path: '/about' },
];

for (const { name, path } of pages) {
  test.describe(`Visual regression: ${name}`, () => {
    test(`desktop`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(path);
      // Wait for fonts and layout to settle
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot(`${name}-desktop.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      });
    });

    test(`mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot(`${name}-mobile.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      });
    });
  });
}
