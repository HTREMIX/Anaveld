import { expect, test, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

type Sample = { selector: string; foreground: string; background: string; ratio: number; kind: string; theme: string };

async function contrast(page: Page, selector: string, property: 'color' | 'outlineColor' = 'color') {
  return page.locator(selector).first().evaluate((element, cssProperty) => {
    const style = getComputedStyle(element);
    let parent: Element | null = cssProperty === 'outlineColor' ? element.parentElement : element;
    let background = 'rgb(246, 241, 230)';
    while (parent) {
      const candidate = getComputedStyle(parent).backgroundColor;
      const channels = candidate.match(/[\d.]+/g)?.map(Number) ?? [];
      if (channels.length === 3 || channels[3] === 1) { background = candidate; break; }
      parent = parent.parentElement;
    }
    const foreground = style[cssProperty];
    function luminance(value: string) {
      const channels = value.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(number => { const c = number / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; });
      return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
    }
    const a = luminance(foreground), b = luminance(background);
    return { foreground, background, ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) };
  }, property);
}

test('actual text tokens, hover, active controls and focus contrast in all art directions', async ({ page }, info) => {
  const samples: Sample[] = [];
  await page.goto('/');
  for (const theme of ['Sunlit Archive', 'Grand Library', 'Sunlit Conservatory', 'Scholarly Editorial']) {
    await page.getByRole('button', { name: theme, exact: true }).click();
    for (const selector of ['.prototype-banner', '.hero h1', '.hero h1 em', '.hero-intro', '.eyebrow', '.theme-options button[aria-pressed="true"]', '.theme-options button[aria-pressed="false"]', '.hero-actions .button-primary', '.publication-copy h3', '.publication-copy p', '.demo-label', '.approach-principles p', '.footer-bottom']) {
      const sample = await contrast(page, selector);
      samples.push({ theme, selector, kind: 'ordinary-text', ...sample });
      expect(sample.ratio, `${theme}: ${selector}`).toBeGreaterThanOrEqual(4.5);
    }
    await page.locator('.hero-actions .button-primary').hover();
    const hover = await contrast(page, '.hero-actions .button-primary');
    samples.push({ theme, selector: '.button-primary:hover', kind: 'ordinary-text', ...hover });
    expect(hover.ratio).toBeGreaterThanOrEqual(4.5);
    await page.keyboard.press('Tab');
    await page.locator('.hero-actions .button-primary').focus();
    expect(await page.locator('.hero-actions .button-primary').evaluate(element => element.matches(':focus-visible'))).toBe(true);
    const focus = await contrast(page, '.hero-actions .button-primary', 'outlineColor');
    samples.push({ theme, selector: '.button-primary:focus-visible outline', kind: 'essential-indicator', ...focus });
    expect(focus.ratio).toBeGreaterThanOrEqual(3);
  }
  await page.goto('/publications');
  for (const selector of ['.search-field input', '.select-field select', '.sample-notice p', '.results-caption']) {
    const sample = await contrast(page, selector);
    samples.push({ theme: 'Sunlit Archive', selector, kind: 'ordinary-text', ...sample });
    expect(sample.ratio, selector).toBeGreaterThanOrEqual(4.5);
  }
  await mkdir('docs/qa', { recursive: true });
  await writeFile(`docs/qa/contrast-${info.project.name}.json`, JSON.stringify({ method: 'WCAG sRGB luminance; computed opaque HTML colors and nearest opaque ancestor. Decorative artwork and PDF pixels excluded; sampled states only, not WCAG conformance.', samples }, null, 2));
});
