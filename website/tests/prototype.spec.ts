import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

async function capture(page: Page, info: TestInfo, name: string) {
  await page.evaluate(() => document.fonts.ready);
  await mkdir('docs/qa/screenshots', { recursive: true });
  await page.screenshot({ path: `docs/qa/screenshots/${info.project.name}-${name}.png`, fullPage: true, animations: 'disabled', scale: 'css' });
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}
async function pdfReady(page: Page) {
  await expect(page.locator('.pdf-page[data-render-state="ready"]').first()).toBeVisible();
  await expect(page.locator('.pdf-page[data-render-state="loading"]')).toHaveCount(0);
}

test('equal-content art directions and responsive home', async ({ page }, info) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173') && !request.url().startsWith('blob:') && !request.url().startsWith('data:')) external.push(request.url()); });
  await page.goto('/');
  const heading = await page.locator('h1').innerText();
  const titles = await page.locator('.publication-copy h3').allTextContents();
  for (const [theme, name] of [['hybrid', 'Sunlit Archive'], ['library', 'Grand Library'], ['conservatory', 'Sunlit Conservatory'], ['editorial', 'Scholarly Editorial']]) {
    await page.getByRole('button', { name, exact: true }).click();
    await expect(page.locator('[data-theme]')).toHaveAttribute('data-theme', theme);
    expect(await page.locator('h1').innerText()).toBe(heading);
    expect(await page.locator('.publication-copy h3').allTextContents()).toEqual(titles);
    await expect(page.getByRole('link', { name: 'Explore publications', exact: true })).toBeVisible();
    await noOverflow(page);
    await capture(page, info, `home-${theme}`);
  }
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test('catalogue discovery, detail, real PDF text and page-preserving reading', async ({ page }, info) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', request => { if (!/^(http:\/\/127\.0\.0\.1:4173|blob:|data:)/.test(request.url())) external.push(request.url()); });
  await page.goto('/publications');
  await expect(page.locator('.publication-row')).toHaveCount(3);
  await page.getByRole('searchbox', { name: 'Search demo catalogue' }).fill('dao dong');
  await expect(page.locator('.publication-row')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'The quiet geometry of motion', exact: true })).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search demo catalogue' }).fill('no such sample');
  await expect(page.getByRole('heading', { name: 'No samples found.' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear search & filters' }).click();
  await page.getByLabel('Subject', { exact: true }).selectOption('Mathematics');
  await expect(page.locator('.publication-row')).toHaveCount(1);
  await page.getByLabel('Subject', { exact: true }).selectOption('All subjects');
  await page.getByLabel('Sort by').selectOption('title');
  await expect(page.locator('.publication-copy h3').first()).toHaveText('A language for change');
  await page.getByLabel('Sort by').selectOption('sequence');
  await noOverflow(page);
  await capture(page, info, 'catalogue');
  await page.getByRole('link', { name: 'The quiet geometry of motion', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'The quiet geometry of motion' })).toBeVisible();
  await expect(page.getByText('UNVERIFIED SAMPLE', { exact: true })).toBeVisible();
  await noOverflow(page);
  await capture(page, info, 'detail');
  await page.getByRole('link', { name: 'Read demo PDF' }).click();
  await pdfReady(page);
  await expect(page.getByRole('button', { name: 'Previous', exact: true })).toBeDisabled();
  await expect(page.locator('.pdf-page')).toHaveCount(1);
  await page.getByRole('searchbox', { name: 'Find in demo PDF' }).fill('angular frequency');
  await page.getByRole('button', { name: 'Find', exact: true }).click();
  await expect(page.locator('.page-announcement')).toContainText('PDF page 3 of 6');
  await pdfReady(page);
  await expect(page.locator('.textLayer')).toContainText('angular frequency');
  const selected = await page.locator('.textLayer span').first().evaluate(element => { const range = document.createRange(); range.selectNodeContents(element); const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(range); return selection?.toString(); });
  expect(selected?.length).toBeGreaterThan(0);
  await page.evaluate(() => window.getSelection()?.removeAllRanges());
  await capture(page, info, 'reader-study');
  await page.getByRole('button', { name: 'Book Experimental layout', exact: true }).click();
  await pdfReady(page);
  await expect(page.locator('.page-announcement')).toContainText('PDF page 3 of 6');
  await expect(page.getByRole('button', { name: 'Animated page curl · unavailable', exact: true })).toBeDisabled();
  await expect(page.locator('.pdf-page')).toHaveCount(info.project.name.startsWith('desktop') ? 2 : 1);
  await capture(page, info, 'reader-book');
  await page.getByRole('button', { name: 'Study PDF + text', exact: true }).click();
  await pdfReady(page);
  await expect(page.locator('.page-announcement')).toContainText('PDF page 3 of 6');
  await page.getByLabel('Zoom', { exact: true }).selectOption('200');
  await pdfReady(page);
  await noOverflow(page);
  await page.getByLabel('Zoom', { exact: true }).selectOption('100');
  await page.getByLabel('PDF page number').fill('6');
  await page.getByRole('button', { name: 'Go', exact: true }).click();
  await pdfReady(page);
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled();
  const original = page.getByRole('link', { name: 'Open demo PDF', exact: true });
  await expect(original).toHaveAttribute('href', /#page=6$/);
  const response = await page.request.get('/assets/anaveld-reader-demo.pdf');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('application/pdf');
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
  await page.reload();
  await pdfReady(page);
  await expect(page.locator('.page-announcement')).toContainText('PDF page 6 of 6');
  await page.getByRole('link', { name: 'Publication details', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'The quiet geometry of motion' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to publications' }).click();
  await expect(page.locator('.publication-row')).toHaveCount(3);
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test('reflow, orientation, reduced motion and PDF failure recovery', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/publications/demo-01/read?page=4&mode=book');
  await pdfReady(page);
  await expect(page.locator('.page-announcement')).toContainText('PDF page 4 of 6');
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await page.setViewportSize({ width: 320, height: 640 });
  await pdfReady(page);
  await noOverflow(page);
  await expect(page.locator('.pdf-page')).toHaveCount(1);
  await page.setViewportSize({ width: 800, height: 360 });
  await pdfReady(page);
  await noOverflow(page);
  await expect(page.locator('.page-announcement')).toContainText('PDF page 4 of 6');
  await page.setViewportSize({ width: 320, height: 640 });
  await page.getByRole('button', { name: 'Study PDF + text', exact: true }).click();
  await pdfReady(page);
  const targets = await page.locator('.page-navigation button,.mode-switch button,.menu-toggle').evaluateAll(elements => elements.filter(element => getComputedStyle(element).display !== 'none').map(element => { const box = element.getBoundingClientRect(); return { text: element.textContent, width: box.width, height: box.height }; }));
  for (const target of targets) { expect(target.width, target.text ?? '').toBeGreaterThanOrEqual(44); expect(target.height, target.text ?? '').toBeGreaterThanOrEqual(44); }
  await capture(page, info, 'reader-reflow-320');
  await page.route('**/assets/anaveld-reader-demo.pdf', route => route.abort('failed'));
  await page.reload();
  await expect(page.getByRole('heading', { name: 'The demo PDF could not open.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open demo PDF', exact: true })).toBeVisible();
  await page.unroute('**/assets/anaveld-reader-demo.pdf');
  await page.getByRole('button', { name: 'Retry PDF', exact: true }).click();
  await pdfReady(page);
  await expect(page.locator('.page-announcement')).toContainText('PDF page 4 of 6');
});

test('keyboard navigation, page arrows, and mobile menu Escape', async ({ page }, info) => {
  async function tabTo(selector: string) {
    for (let index = 0; index < 60; index++) {
      await page.keyboard.press('Tab');
      if (await page.locator(selector).evaluateAll(elements => elements.includes(document.activeElement!))) return;
    }
    throw new Error(`Keyboard could not reach ${selector}`);
  }
  await page.goto('/');
  await expect(page.locator('h1')).toBeFocused();
  await tabTo('.hero-actions a[href="/publications"]');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Follow your curiosity.' })).toBeFocused();
  await tabTo('#catalogue-search');
  await page.keyboard.type('motion');
  await expect(page.locator('.publication-row')).toHaveCount(1);
  await tabTo('.publication-copy h3 a');
  await page.keyboard.press('Enter');
  await tabTo('a[href$="/read"]');
  await page.keyboard.press('Enter');
  await pdfReady(page);
  await tabTo('.mode-switch button:nth-child(2)');
  await page.keyboard.press('Space');
  await expect(page.locator('.reader-stage')).toHaveAttribute('data-mode', 'book');
  await tabTo('.reader-stage');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.page-announcement')).toContainText('PDF page 2 of 6');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('.page-announcement')).toContainText('PDF page 1 of 6');
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('.reader-stage')).not.toBeFocused();
  await page.getByRole('link', { name: 'Publication details', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('h1')).toBeFocused();
  await page.getByRole('link', { name: 'Back to publications' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('searchbox', { name: 'Search demo catalogue' })).toHaveValue('motion');
  if (info.project.name.startsWith('mobile')) {
    const menu = page.getByRole('button', { name: 'Open navigation', exact: true });
    await menu.focus(); await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Close navigation', exact: true })).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  }
});
