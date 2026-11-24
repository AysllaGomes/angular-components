import { Locator, Page, expect, test } from '@playwright/test';

// Matriz de contraste: tema (claro/escuro) × cor de destaque × textos que usam a cor de
// destaque (como fundo com texto branco, ou como cor do texto). Lê as cores calculadas
// pelo navegador (color-mix incluso) e exige 4,5:1 (WCAG 1.4.3, texto normal), também
// no hover. Antes era conferência manual: o laranja passou com 3,21:1.

const THEMES = ['light', 'dark'] as const;
const ACCENTS = ['teal', 'orange', 'violet', 'blue', 'rose'] as const;
const MIN = 4.5;

/** o que conferir: seletor do texto (o primeiro visível) e se tem hover que muda a cor */
interface Target { name: string; selector: string; hover?: boolean; }

const DEMO: Target[] = [
  { name: 'Button solid', selector: '#button .btn.btn--solid.btn--accent', hover: true },
  { name: 'Button outline', selector: '#button .btn.btn--outline.btn--accent', hover: true },
  { name: 'Button ghost', selector: '#button .btn.btn--ghost.btn--accent', hover: true },
  { name: 'Button link', selector: '#button .btn.btn--link.btn--accent' },
  { name: 'Button solid neutral', selector: '#button .btn.btn--solid.btn--neutral', hover: true },
  { name: 'Button solid danger', selector: '#button .btn.btn--solid.btn--danger', hover: true },
  { name: 'Pagination: página atual', selector: '#pagination .pg-btn[aria-current="page"]' },
  { name: 'Stepper: etapa atual', selector: '#stepper .stepper-button[aria-current="step"]' },
];
const DIALOG: Target[] = [
  { name: 'Dialog: ação principal', selector: '[role="dialog"] .dlg__auto-actions .btn:not(.btn--ghost)', hover: true },
  { name: 'Dialog: ação secundária', selector: '[role="dialog"] .dlg__auto-actions .btn--ghost', hover: true },
];
const HOME: Target[] = [
  { name: 'Home: botão principal', selector: '.btn.btn--primary', hover: true },
];

async function setLook(page: Page, theme: string, accent: string) {
  await page.evaluate(([t, a]) => {
    document.documentElement.dataset['theme'] = t;
    document.documentElement.dataset['accent'] = a;
  }, [theme, accent]);
  // as cores têm transição: medir no meio dela daria um valor entre a cor antiga e a nova
  await page.waitForTimeout(400);
}

/**
 * Cor do texto e do fundo efetivo (sobe pelos ancestrais compondo fundos translúcidos),
 * normalizadas pelo canvas: color-mix, oklab, color(srgb) viram RGBA de verdade.
 */
async function ratio(el: Locator): Promise<number> {
  return el.evaluate(node => {
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
    const rgba = (css: string) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000'; ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b, a / 255];
    };
    const over = (top: number[], below: number[]) =>
      [0, 1, 2].map(i => top[i] * top[3] + below[i] * (1 - top[3])).concat(1);

    const layers: number[][] = [];
    for (let n: Element | null = node; n; n = n.parentElement) {
      const c = rgba(getComputedStyle(n).backgroundColor);
      if (c[3] > 0) layers.push(c);
      if (c[3] >= 1) break;
    }
    let bg = [255, 255, 255, 1];
    for (const l of layers.reverse()) bg = over(l, bg);
    const fg = over(rgba(getComputedStyle(node).color), bg);

    const lum = (c: number[]) => {
      const [r, g, b] = c.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const [hi, lo] = [lum(fg), lum(bg)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  });
}

async function check(page: Page, targets: Target[], failures: string[], look: string) {
  for (const t of targets) {
    const el = page.locator(t.selector).first();
    if (!(await el.count())) { failures.push(`${look} · ${t.name}: não encontrado (${t.selector})`); continue; }
    await el.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const normal = await ratio(el);
    if (normal < MIN) failures.push(`${look} · ${t.name}: ${normal.toFixed(2)}:1`);
    if (t.hover) {
      await el.hover();
      await page.waitForTimeout(250); // transições de cor
      const hovered = await ratio(el);
      if (hovered < MIN) failures.push(`${look} · ${t.name} (hover): ${hovered.toFixed(2)}:1`);
      await page.mouse.move(0, 0);
    }
  }
}

for (const theme of THEMES) {
  for (const accent of ACCENTS) {
    test(`contraste ≥ ${MIN}:1 · tema ${theme} · ${accent}`, async ({ page }) => {
      const look = `${theme}/${accent}`;
      const failures: string[] = [];

      await page.goto('demo/');
      await setLook(page, theme, accent);
      await check(page, DEMO, failures, look);

      await page.getByRole('button', { name: 'Abrir (padrão)' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await check(page, DIALOG, failures, look);
      await page.keyboard.press('Escape');

      await page.goto('./');
      await setLook(page, theme, accent);
      await check(page, HOME, failures, look);

      expect(failures, failures.join('\n')).toEqual([]);
    });
  }
}
