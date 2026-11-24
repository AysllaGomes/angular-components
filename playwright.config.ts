import { defineConfig, devices } from '@playwright/test';

/**
 * Testes de navegador (npm run e2e): o site publicado de verdade, servido como no
 * GitHub Pages (com o base href /angular-components/). Cobrem o que jsdom não vê:
 * navegação entre páginas, foco real, `inert` e layout. Rode depois do `npm run build`.
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['list'], ['github']] : 'list',
  use: {
    baseURL: 'http://localhost:4321/angular-components/',
    locale: 'pt-BR',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node scripts/serve-dist.mjs',
    url: 'http://localhost:4321/angular-components/',
    reuseExistingServer: !process.env['CI'],
  },
});
