import { expect, test } from '@playwright/test';

// Fluxos principais no navegador, com o site servido como no GitHub Pages
// (/angular-components/). O que os testes unitários (jsdom) não veem: navegação
// entre páginas com base href, foco real e `inert`.

test.describe('navegação entre páginas (base href)', () => {
  test('link da documentação leva à página do outro componente, sem 404', async ({ page }) => {
    await page.goto('componentes/select/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Select');

    await page.locator('#quando-usar').getByRole('link', { name: 'Radio group' }).click();
    await expect(page).toHaveURL(/\/angular-components\/componentes\/radio$/);
    await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Esta página não existe');
    await expect(page.locator('#quando-usar')).toBeVisible();
  });

  test('cada página de componente abre direto pelo endereço (pré-renderizada)', async ({ page }) => {
    const res = await page.goto('componentes/table/');
    expect(res?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tabela');
  });

  test('endereço desconhecido: HTTP 404 e a página "não existe"', async ({ page }) => {
    const res = await page.goto('nao-existe-isso');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Esta página não existe' })).toBeVisible();
  });
});

test.describe('Select', () => {
  test('busca sem resultado avisa, sem tirar o foco do filtro', async ({ page }) => {
    await page.goto('demo/');
    const card = page.locator('#select article', { has: page.getByRole('heading', { name: 'Com filtro' }) });
    await card.locator('button.control').click();

    const filter = card.getByRole('textbox');
    await expect(filter).toBeFocused();
    await filter.fill('zzzz');

    await expect(card.getByRole('option')).toHaveCount(0);
    await expect(card.locator('.panel .empty')).toHaveText('Nenhuma opção encontrada');
    await expect(card.getByRole('status')).toHaveText('Nenhuma opção encontrada');
    await expect(filter).toBeFocused();

    // Esc fecha o painel e devolve o foco ao campo
    await page.keyboard.press('Escape');
    await expect(card.getByRole('listbox')).toHaveCount(0);
    await expect(card.locator('button.control')).toBeFocused();
  });
});

test.describe('Dialog', () => {
  test('foco entra, fica preso, o fundo fica inerte e o foco volta ao fechar', async ({ page }) => {
    await page.goto('demo/');
    const opener = page.getByRole('button', { name: 'Abrir (padrão)' });
    await opener.click();

    const dialog = page.getByRole('dialog', { name: 'Confirmar exclusão' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Fechar' })).toBeFocused();
    // o resto da página não recebe foco nem clique
    await expect(page.locator('[inert]').first()).toBeAttached();
    await expect(opener).not.toBeFocused();

    // Tab e Shift+Tab várias vezes: o foco nunca sai do dialog
    for (const key of ['Tab', 'Tab', 'Tab', 'Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab']) {
      await page.keyboard.press(key);
      expect(await dialog.evaluate(d => d.contains(document.activeElement))).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();
    await expect(page.locator('[inert]')).toHaveCount(0);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  });
});

test.describe('modal sobre modal (ActionBar + Dialog)', () => {
  test('o Dialog por cima é usável; cada Esc fecha um, de cima para baixo', async ({ page }) => {
    await page.goto('demo/');
    const opener = page.getByRole('button', { name: 'Ver pedido #1042' });
    await opener.click();
    const panel = page.getByRole('dialog', { name: 'Pedido #1042' });
    await expect(panel).toBeVisible();

    const del = panel.getByRole('button', { name: 'Excluir pedido' });
    await del.click();
    const confirm = page.getByRole('dialog', { name: 'Excluir o pedido #1042?' });
    await expect(confirm).toBeVisible();
    // o de cima não pode estar inerte (o de baixo marcou tudo fora dele): foco e Tab funcionam
    await expect(confirm.getByRole('button', { name: 'Fechar' })).toBeFocused();
    expect(await confirm.evaluate(d => !!d.closest('[inert]'))).toBe(false);
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Tab');
      expect(await confirm.evaluate(d => d.contains(document.activeElement))).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(confirm).toHaveCount(0);
    await expect(panel).toBeVisible();
    await expect(del).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(panel).toHaveCount(0);
    await expect(opener).toBeFocused();
    await expect(page.locator('[inert]')).toHaveCount(0);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  });

  test('confirmar no Dialog fecha os dois, avisa e devolve a página como estava', async ({ page }) => {
    await page.goto('demo/');
    const opener = page.getByRole('button', { name: 'Ver pedido #1042' });
    await opener.click();
    await page.getByRole('button', { name: 'Excluir pedido' }).click();
    await page.getByRole('dialog', { name: 'Excluir o pedido #1042?' }).getByRole('button', { name: 'Excluir', exact: true }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('.toast-stack')).toContainText('Pedido #1042 excluído.');
    await expect(page.locator('[inert]')).toHaveCount(0);
    // os dois fecham na mesma atualização: a rolagem volta e o foco termina em quem começou
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
    await expect(opener).toBeFocused();
  });
});

test.describe('Select e TreeSelect: foco ao fechar', () => {
  const selectCard = (page: import('@playwright/test').Page) =>
    page.locator('#select article', { has: page.getByRole('heading', { name: 'Com filtro' }) });

  test('menu (desktop): Tab sai do componente, o painel fecha e o foco segue', async ({ page }) => {
    await page.goto('demo/');
    const card = selectCard(page);
    await card.locator('button.control').click();
    await expect(card.getByRole('listbox')).toBeVisible();

    await page.keyboard.press('Tab'); // do filtro para a lista
    await page.keyboard.press('Tab'); // da lista para fora do componente
    await expect(card.getByRole('listbox')).toHaveCount(0);
    expect(await card.evaluate(c => c.querySelector('app-select')!.contains(document.activeElement))).toBe(false);
    expect(await page.evaluate(() => document.activeElement === document.body)).toBe(false);
  });

  test('TreeSelect menu: Tab fecha e o foco segue para o próximo campo', async ({ page }) => {
    await page.goto('demo/');
    const card = page.locator('#treeselect article', { has: page.getByRole('heading', { name: 'Seleção única (caminho no campo)' }) });
    await card.locator('button.control').click();
    await expect(card.getByRole('tree')).toBeVisible();

    await page.keyboard.press('Tab');
    await expect(card.getByRole('tree')).toHaveCount(0);
    expect(await page.evaluate(() => document.activeElement === document.body)).toBe(false);
  });

  test.describe('folha (celular)', () => {
    test.use({ viewport: { width: 390, height: 780 } });

    test('é modal: Tab fica nela; × devolve o foco ao campo e libera a página', async ({ page }) => {
      await page.goto('demo/');
      const card = selectCard(page);
      const control = card.locator('button.control');
      await control.click();
      const sheet = card.locator('.panel.is-sheet');
      await expect(sheet).toBeVisible();
      expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');

      for (let i = 0; i < 6; i++) {
        await page.keyboard.press('Tab');
        expect(await sheet.evaluate(s => s.contains(document.activeElement))).toBe(true);
      }

      await sheet.getByRole('button', { name: 'Fechar' }).click();
      await expect(sheet).toHaveCount(0);
      await expect(control).toBeFocused();
      expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
      await expect(page.locator('[inert]')).toHaveCount(0);
    });

    test('tocar no fundo escurecido também devolve o foco ao campo', async ({ page }) => {
      await page.goto('demo/');
      const card = selectCard(page);
      const control = card.locator('button.control');
      await control.click();
      await expect(card.locator('.panel.is-sheet')).toBeVisible();

      await card.locator('.backdrop').click({ position: { x: 20, y: 20 } });
      await expect(card.locator('.panel')).toHaveCount(0);
      await expect(control).toBeFocused();
    });
  });
});
