import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test('desktop WebGL story, pins, skills, case studies, contact and resume', async ({ page, request }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.locator('h1')).toHaveAttribute('aria-label', 'Ravi Goud');
  await expect(page.locator('.world-layer.has-webgl canvas')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('.pin-spacer')).toHaveCount(1);
  await expect(page.locator('#home a[download]')).toHaveCount(0);
  await expect(page.locator('.motion-control')).toHaveCount(0);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await page.context().route('https://mail.google.com/**', route => route.fulfill({ contentType: 'text/html', body: 'Compose handoff verified' }));
  const composePopup = page.waitForEvent('popup');
  await page.locator('#home').getByRole('link', { name: 'Email Ravi Goud in Gmail' }).click();
  const compose = await composePopup;
  await compose.waitForLoadState();
  const composeUrl = new URL(compose.url());
  expect(composeUrl.origin).toBe('https://mail.google.com');
  expect(composeUrl.searchParams.get('to')).toBe('uduthalaravigoud4@gmail.com');
  expect(composeUrl.searchParams.get('view')).toBe('cm');
  await compose.close();
  await page.waitForTimeout(1800);
  await mkdir('tmp/qa', { recursive: true });
  await page.screenshot({ path: 'tmp/qa/desktop-home.png' });

  await page.locator('.navigation a[href="#about"]').click();
  await page.waitForTimeout(1300);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(1000);
  const pinned = await page.locator('.about-sticky').boundingBox();
  expect(Math.abs(pinned.y)).toBeLessThan(5);
  await expect(page.locator('.about-story .animated-line').first()).toBeVisible();
  await page.screenshot({ path: 'tmp/qa/desktop-about.png' });

  await page.locator('.navigation a[href="#skills"]').click();
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'Currently learning', exact: true }).click();
  await expect(page.locator('.skill-detail-title')).toContainText('CURRENTLY LEARNING');
  await expect(page.locator('.skill-tags')).toContainText('Spring Boot');
  await expect(page.locator('.skills-canvas canvas')).toHaveAttribute('data-scene', 'universe');
  const skillsCopy = await page.locator('.skills-copy').boundingBox();
  const skillsVisual = await page.locator('.skills-visual').boundingBox();
  expect(skillsCopy.x).toBeLessThan(skillsVisual.x);
  expect(skillsVisual.width).toBeGreaterThan(450);
  expect(Math.abs(skillsCopy.y + skillsCopy.height / 2 - skillsVisual.y - skillsVisual.height / 2)).toBeLessThan(10);
  await page.screenshot({ path: 'tmp/qa/desktop-skills.png' });

  await page.locator('.navigation a[href="#projects"]').click();
  await page.waitForTimeout(1300);
  await expect(page.locator('.project-preview canvas').first()).toBeVisible({ timeout: 30000 });
  const card = page.locator('.tilt-surface').first();
  await card.hover({ position: { x: 70, y: 90 } });
  expect(await card.evaluate(element => element.style.getPropertyValue('--tilt-y'))).not.toBe('0deg');
  await page.mouse.move(10, 100);
  await expect(card).toHaveCSS('--tilt-y', '0deg');
  await page.screenshot({ path: 'tmp/qa/desktop-projects.png' });
  await page.locator('.project-stage').first().getByRole('link', { name: 'Explore case study' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const discussHref = await page.getByRole('link', { name: 'Discuss this project' }).getAttribute('href');
  expect(new URL(discussHref).searchParams.get('su')).toContain('MediGuide');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement))).toBe(true);
  await page.getByRole('button', { name: 'Processing layer', exact: true }).click();
  await expect(page.locator('.architecture>p')).toContainText('Tesseract.js');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await page.locator('.project-stage').nth(1).getByRole('link', { name: 'Explore case study' }).click();
  await page.getByRole('button', { name: 'Which assets need maintenance?', exact: true }).click();
  await page.getByRole('button', { name: 'Run sample', exact: true }).click();
  await expect(page.locator('.sql-output tbody tr')).toHaveCount(1);
  await expect(page.locator('.sql-output')).toContainText('Wind Turbine B');
  await page.getByLabel('Your question').fill('DROP TABLE assets');
  await page.getByRole('button', { name: 'Run sample', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('local demonstration');
  await page.keyboard.press('Escape');

  await page.locator('.project-stage').nth(2).getByRole('link', { name: 'Explore case study' }).click();
  await page.getByRole('button', { name: 'Panel soiling', exact: true }).click();
  await expect(page.locator('.ticket-preview')).toContainText('Routine');
  await page.getByRole('button', { name: 'Close case study' }).click();

  await page.locator('.navigation a[href="#contact"]').click();
  await page.waitForTimeout(1500);
  await expect(page.locator('#contact a')).toHaveCount(4);
  await expect(page.locator('#contact a').filter({ hasText: 'GitHub' })).toHaveAttribute('href', 'https://github.com/ravi63052');
  await expect(page.locator('#contact a').filter({ hasText: 'LinkedIn' })).toHaveAttribute('rel', 'noopener noreferrer');
  const downloaded = page.waitForEvent('download');
  await page.locator('#contact a[download]').click();
  expect((await downloaded).suggestedFilename()).toBe('Ravi-Goud-Resume.pdf');
  const resume = await request.get('/resume/Ravi-Goud.pdf');
  expect(resume.status()).toBe(200);
  expect((await resume.body()).subarray(0, 5).toString()).toBe('%PDF-');
  await page.screenshot({ path: 'tmp/qa/desktop-contact.png' });
  await expect(page.locator('.pin-spacer')).toHaveCount(1);
  await page.locator('.navigation a[href="#home"]').click();
  await expect(page.locator('.world-layer canvas')).toHaveAttribute('data-scene', 'workspace');
  expect(errors).toEqual([]);
});

test('mobile navigation, reduced motion, overflow and direct case-study refresh', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.locator('.motion-control')).toHaveCount(0);
  await page.screenshot({ path: 'tmp/qa/mobile-home.png' });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.locator('.navigation')).toBeVisible();
  await page.locator('.navigation a[href="#skills"]').click();
  await expect(page.locator('.navigation')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    for (const id of ['home', 'about', 'skills', 'projects', 'journey', 'contact']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#project/text-to-sql');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await expect(page.locator('.world-layer canvas')).toHaveAttribute('data-scene', 'contact');
  await page.screenshot({ path: 'tmp/qa/mobile-contact.png' });
  expect(errors).toEqual([]);
});

test('unavailable WebGL keeps navigation, content and case studies usable', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...options) {
      return type === 'webgl2' || type === 'webgl' ? null : original.call(this, type, ...options);
    };
  });
  await page.goto('/');
  await expect(page.locator('.static-workspace')).toBeVisible();
  await expect(page.locator('.world-layer canvas')).toHaveCount(0);
  await page.locator('.navigation a[href="#projects"]').click();
  await page.locator('.project-stage').first().getByRole('link', { name: 'Explore case study' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Close case study' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('3D skill objects remain selectable and aligned with reduced motion', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#skills');
  const canvas = page.locator('.skills-canvas canvas');
  await expect(canvas).toBeVisible();
  await page.getByRole('button', { name: 'Currently learning', exact: true }).click();
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  // Project the center of the stationary Java object through the scene camera.
  const height = 16 * Math.tan(22 * Math.PI / 180);
  const width = height * box.width / box.height;
  const scale = Math.min(1, width / 6.7, height / 5.7);
  const angle = 3 / 9 * Math.PI * 2;
  const z = Math.sin(angle * 2) * .45 * scale;
  const pixels = box.height / (2 * Math.tan(22 * Math.PI / 180) * (8 - z));
  const x = box.x + box.width / 2 + Math.cos(angle) * 2.35 * scale * pixels;
  const y = box.y + box.height / 2 - Math.sin(angle) * 1.95 * scale * pixels;
  await page.mouse.move(x, y);
  await expect(page.locator('.skill-tooltip')).toHaveText('Java');
  await page.mouse.click(x, y);
  await expect(page.locator('.skill-detail h3')).toHaveText('Languages & tools');
  await expect(page.getByRole('button', { name: 'Languages & tools', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.screenshot({ path: 'tmp/qa/skills-interaction.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.skills-visual').scrollIntoViewIfNeeded();
  const copy = await page.locator('.skills-copy').boundingBox();
  const visual = await page.locator('.skills-visual').boundingBox();
  expect(visual.y).toBeGreaterThanOrEqual(copy.y + copy.height);
  expect(visual.x).toBeGreaterThanOrEqual(0);
  expect(visual.x + visual.width).toBeLessThanOrEqual(390);
  await page.screenshot({ path: 'tmp/qa/mobile-skills.png' });
  expect(errors).toEqual([]);
});
