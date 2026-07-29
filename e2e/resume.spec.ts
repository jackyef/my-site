import { test, expect, type Page } from '@playwright/test';

/**
 * The 3D room only renders where WebGL is available, and CI runners vary.
 * These specs assert what must hold either way, and only reach into the
 * room once we've confirmed it actually rendered.
 */
async function waitForResume(page: Page): Promise<'room' | 'text'> {
  await page.waitForFunction(
    () =>
      Boolean(document.querySelector('canvas')) ||
      Boolean(document.body.textContent?.includes('The quiet, readable')),
    undefined,
    { timeout: 20_000 },
  );
  return (await page.locator('canvas').count()) > 0 ? 'room' : 'text';
}

/** The chip row duplicates the in-scene labels; the chips come last. */
const chip = (page: Page, name: string) =>
  page.getByRole('button', { name, exact: true }).last();

test.describe('Resume page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/resume');
  });

  test('page loads with its heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /cozy little resume/i }),
    ).toBeVisible();
  });

  test('offers a readable resume with every section', async ({ page }) => {
    if ((await waitForResume(page)) === 'room') {
      await page.getByRole('button', { name: 'Prefer plain text?' }).click();
    }

    for (const section of ['About me', 'Career', 'Projects', 'Say hello']) {
      await expect(
        page.getByRole('heading', { name: section, exact: true }),
      ).toBeVisible();
    }
    // The content itself, not just the headings
    await expect(page.getByText('Sticker Mule').first()).toBeVisible();
  });

  test('every section is reachable and names itself', async ({ page }) => {
    test.skip((await waitForResume(page)) !== 'room', 'needs WebGL');

    for (const section of [
      'About me',
      'Career',
      'Projects',
      'Selected writing',
      'Say hello',
    ]) {
      await chip(page, section).click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('heading', { name: section })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
    }
  });

  test('sections are deep-linkable', async ({ page }) => {
    test.skip((await waitForResume(page)) !== 'room', 'needs WebGL');

    await page.goto('/resume#career');
    await waitForResume(page);
    await expect(
      page.getByRole('dialog').getByRole('heading', { name: 'Career' }),
    ).toBeVisible();

    // Opening a section records it in the URL, and back steps out
    await chip(page, 'Projects').click();
    await expect(page).toHaveURL(/#projects$/);
    await page.goBack();
    await expect(page).toHaveURL(/#career$/);
  });

  test('opening a section moves focus into it and returns it on close', async ({
    page,
  }) => {
    test.skip((await waitForResume(page)) !== 'room', 'needs WebGL');

    const career = chip(page, 'Career');
    await career.focus();
    await career.press('Enter');

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator(':focus')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(career).toBeFocused();
  });

  test('the room is reachable by keyboard', async ({ page }) => {
    test.skip((await waitForResume(page)) !== 'room', 'needs WebGL');

    const room = page.getByRole('group', { name: /Interactive 3D room/i });
    await room.focus();
    await expect(room).toBeFocused();
  });

  test('prints the resume rather than the room', async ({ page }) => {
    await waitForResume(page);
    await page.emulateMedia({ media: 'print' });

    // Identity block for paper, and no interactive chrome
    await expect(
      page.getByRole('heading', { name: 'Jacky Efendi' }),
    ).toBeVisible();
    await expect(page.locator('.sidebar')).toBeHidden();
    await expect(page.getByText('Sticker Mule').first()).toBeVisible();
  });
});
