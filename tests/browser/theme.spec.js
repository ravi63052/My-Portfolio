import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test('system theme, accessible toggle, persisted selection and themed WebGL', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('.world-layer canvas')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const toggle = page.getByRole('button', { name: 'Dark theme', exact: true });
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await page.evaluate(() => localStorage.getItem('portfolio-theme'))).toBe('light');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('link', { name: 'Hire Me' }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('.world-layer canvas')).toHaveAttribute('data-scene', 'contact');
  await toggle.click();
  await expect(page.locator('.world-layer canvas')).toHaveAttribute('data-theme', 'dark');
  expect(errors).toEqual([]);
});

test('both palettes across every section, responsive header and case studies', async ({ page }) => {
  test.setTimeout(180000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto('/');
  await mkdir('tmp/qa/themes', { recursive: true });
  const toggle = page.getByRole('button', { name: 'Dark theme', exact: true });
  for (const theme of ['dark', 'light']) {
    if (theme === 'light') await toggle.click();
    for (const id of ['home', 'about', 'skills', 'projects', 'journey', 'contact']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      if (id === 'skills') await expect(page.locator('.skills-canvas canvas')).toHaveAttribute('data-theme', theme);
      if (id === 'projects') await expect(page.locator('.project-preview canvas').first()).toHaveAttribute('data-theme', theme);
      await page.screenshot({ path: `tmp/qa/themes/${theme}-${id}.png` });
    }
    for (const [width, height] of [[320, 740], [390, 844], [844, 390], [768, 1024], [1024, 768], [1920, 1080], [3840, 2160]]) {
      await page.setViewportSize({ width, height });
      await expect(toggle).toBeVisible();
      const header = await page.locator('.nav-actions').boundingBox();
      const brand = await page.locator('.brand').boundingBox();
      expect(header.x).toBeGreaterThan(brand.x + brand.width);
      expect(header.x + header.width).toBeLessThanOrEqual(width);
      for (const id of ['home', 'about', 'skills', 'projects', 'journey', 'contact']) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
      if (width === 390) {
        await page.waitForTimeout(600);
        await page.screenshot({ path: `tmp/qa/themes/${theme}-mobile-contact.png` });
      }
    }
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.locator('.project-stage').nth(1).getByRole('link', { name: 'Explore case study' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Which assets need maintenance?', exact: true }).click();
    await page.getByRole('button', { name: 'Run sample', exact: true }).click();
    await expect(page.locator('.sql-output tbody tr')).toHaveCount(1);
    await expect(page.locator('.sql-output')).toContainText('Wind Turbine B');
    await page.screenshot({ path: `tmp/qa/themes/${theme}-case.png` });
    await page.keyboard.press('Escape');
  }
  await page.setViewportSize({ width: 320, height: 740 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('link', { name: 'Hire Me' }).click();
  await expect(page.locator('.navigation')).toBeHidden();
  await expect(page).toHaveURL(/#contact$/);
  expect(errors).toEqual([]);
});

test('theme remains usable when storage is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException('Blocked', 'SecurityError'); };
    Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'SecurityError'); };
  });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Dark theme', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
