import { test, expect } from '@playwright/test';

const pages = [
  { name: 'homepage', path: '/' },
  { name: 'blog', path: '/blog' },
  { name: 'about', path: '/about' },
];

const themes = ['light', 'dim', 'dark'] as const;

for (const { name, path } of pages) {
  for (const theme of themes) {
    test.describe(`Visual regression: ${name} (${theme})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(path);
        await page.evaluate(
          (t) => document.documentElement.setAttribute('data-theme', t),
          theme,
        );
        // Let theme transition settle
        await page.waitForTimeout(300);
      });

      test(`desktop`, async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveScreenshot(`${name}-${theme}-desktop.png`, {
          fullPage: true,
          maxDiffPixelRatio: 0.01,
        });
      });

      test(`mobile`, async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveScreenshot(`${name}-${theme}-mobile.png`, {
          fullPage: true,
          maxDiffPixelRatio: 0.01,
        });
      });
    });
  }
}
