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

test.describe('Campo de texto', () => {
  test('textarea cresce com o texto até o máximo de linhas e depois rola', async ({ page }) => {
    await page.goto('demo/');
    const ta = page.locator('#textfield textarea');
    await ta.scrollIntoViewIfNeeded();
    const h0 = await ta.evaluate(e => e.getBoundingClientRect().height);

    await ta.fill('linha\n'.repeat(4));
    const h1 = await ta.evaluate(e => e.getBoundingClientRect().height);
    expect(h1).toBeGreaterThan(h0);
    expect(await ta.evaluate(e => getComputedStyle(e).overflowY)).toBe('hidden');

    await ta.fill('linha\n'.repeat(30)); // passa de 6 linhas (appAutosize="6"): para de crescer e rola
    const h2 = await ta.evaluate(e => e.getBoundingClientRect().height);
    await ta.fill('linha\n'.repeat(60));
    const h3 = await ta.evaluate(e => e.getBoundingClientRect().height);
    expect(h3).toBe(h2);
    expect(await ta.evaluate(e => getComputedStyle(e).overflowY)).toBe('auto');

    await ta.fill('curto'); // e encolhe
    expect(await ta.evaluate(e => e.getBoundingClientRect().height)).toBeLessThan(h2);
  });

  test('contador acompanha a digitação; senha alterna e mantém o foco no botão', async ({ page }) => {
    await page.goto('demo/');
    const section = page.locator('#textfield');
    await section.locator('textarea').fill('abc');
    await expect(section.locator('.ff__count [aria-hidden="true"]')).toHaveText('3/140');

    const pwd = section.locator('input[autocomplete="new-password"]');
    await pwd.fill('segredo');
    const toggle = section.getByRole('button', { name: 'Mostrar senha' });
    await toggle.click();
    await expect(pwd).toHaveAttribute('type', 'text');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(toggle).toBeFocused();
    await toggle.press('Enter');
    await expect(pwd).toHaveAttribute('type', 'password');
  });

  test('prefixo e sufixo ficam dentro da caixa, sem entrar no valor', async ({ page }) => {
    await page.goto('demo/');
    const field = page.locator('#textfield app-form-field', { has: page.getByText('Valor do pedido') });
    const box = await field.locator('.ff__control').boundingBox();
    const prefix = await field.locator('.ff__affix--prefix').boundingBox();
    expect(prefix!.x).toBeGreaterThanOrEqual(box!.x);
    expect(prefix!.x + prefix!.width).toBeLessThanOrEqual(box!.x + box!.width);
    await field.locator('input').fill('120,50');
    await expect(field.locator('input')).toHaveValue('120,50');
  });
});

test.describe('Menu', () => {
  test('teclado: abre no primeiro item, setas, Esc volta ao botão; item desabilitado não age', async ({ page }) => {
    await page.goto('demo/');
    const trigger = page.locator('#menu').getByRole('button', { name: 'Ações', exact: true });
    await trigger.focus();
    await page.keyboard.press('Enter');
    const menu = page.getByRole('menu', { name: 'Ações', exact: true });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Editar' })).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(menu.getByRole('menuitem', { name: 'Excluir' })).toBeFocused();
    await page.keyboard.press('ArrowUp');
    const move = menu.getByRole('menuitem', { name: 'Mover (sem permissão)' });
    await expect(move).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(menu).toBeVisible(); // desabilitado: nada acontece

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('escolher "Excluir" abre a confirmação, e ao fechá-la o foco volta ao botão do menu', async ({ page }) => {
    await page.goto('demo/');
    const trigger = page.locator('#menu').getByRole('button', { name: 'Ações', exact: true });
    await trigger.click();
    await page.getByRole('menuitem', { name: 'Excluir' }).click();
    const dialog = page.getByRole('dialog', { name: 'Excluir o pedido?' });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole('menu', { name: 'Ações', exact: true })).toBeHidden();

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  });

  test('o menu de uma linha não é cortado pela lista com rolagem e fica dentro da janela', async ({ page }) => {
    await page.goto('demo/');
    const list = page.locator('#menu .mn-rows');
    const trigger = list.getByRole('button', { name: 'Mais ações do pedido 1047' });
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    const menu = page.getByRole('menu', { name: 'Ações do pedido 1047' });
    await expect(menu).toBeVisible();

    const m = (await menu.boundingBox())!;
    const l = (await list.boundingBox())!;
    const vp = page.viewportSize()!;
    // sai da caixa da lista (seria cortado se fosse absolute dentro dela) e continua clicável
    expect(m.y + m.height > l.y + l.height || m.y < l.y).toBe(true);
    expect(m.x).toBeGreaterThanOrEqual(0);
    expect(m.x + m.width).toBeLessThanOrEqual(vp.width);
    await menu.getByRole('menuitem', { name: 'Copiar número' }).click();
    await expect(page.locator('#menu .mn-status')).toHaveText('Escolhido: Copiar número #1047');
    await expect(trigger).toBeFocused();
  });

  test('Tab fecha o menu e segue para o próximo elemento', async ({ page }) => {
    await page.goto('demo/');
    const trigger = page.locator('#menu').getByRole('button', { name: 'Ações', exact: true });
    await trigger.click();
    await expect(page.getByRole('menu', { name: 'Ações', exact: true })).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('menu', { name: 'Ações', exact: true })).toBeHidden();
    expect(await page.evaluate(() => document.activeElement === document.body)).toBe(false);
  });
});

test.describe('regressões da revisão da 3.12.0', () => {
  test('Menu: Shift+Tab no primeiro item fecha o menu e o foco fica no botão; Esc no botão não reabre nada', async ({ page }) => {
    await page.goto('demo/');
    const trigger = page.locator('#menu').getByRole('button', { name: 'Ações', exact: true });
    const menu = page.getByRole('menu', { name: 'Ações', exact: true });
    await trigger.click();
    await expect(menu.getByRole('menuitem', { name: 'Editar' })).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  for (const which of ['select', 'treeselect'] as const) {
    test(`${which}: aberto no desktop e a janela vira celular: a folha é modal`, async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 900 });
      await page.goto('demo/');
      const card = which === 'select'
        ? page.locator('#select article', { has: page.getByRole('heading', { name: 'Com filtro' }) })
        : page.locator('#treeselect article', { has: page.getByRole('heading', { name: 'Seleção única (caminho no campo)' }) });
      const control = card.locator('button.control');
      await control.click();
      const panel = card.locator('.panel');
      await expect(panel).toBeVisible();

      await page.setViewportSize({ width: 390, height: 800 });
      await expect(panel).toHaveClass(/is-sheet/);
      expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
      expect(await page.locator('[inert]').count()).toBeGreaterThan(0);
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press('Tab');
        expect(await panel.evaluate(p => p.contains(document.activeElement))).toBe(true);
      }

      await panel.getByRole('button', { name: 'Fechar' }).click();
      await expect(control).toBeFocused();
      expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
      await expect(page.locator('[inert]')).toHaveCount(0);
    });
  }
});
