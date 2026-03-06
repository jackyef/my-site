import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Jacky/i);
  });

  test('hero section renders with name', async ({ page }) => {
    await expect(page.getByText('Jacky Efendi')).toBeVisible();
  });

  test('hero section renders role text', async ({ page }) => {
    await expect(
      page.getByText('Product Engineer, Frontend & beyond.'),
    ).toBeVisible();
  });

  test('widget grid is visible', async ({ page }) => {
    const widgetGrid = page.locator('.widget-grid');
    await expect(widgetGrid).toBeVisible();
  });

  test('featured writings section renders', async ({ page }) => {
    await expect(page.getByText('Featured writings')).toBeVisible();
    await expect(page.getByText('All writings')).toBeVisible();
  });
});
