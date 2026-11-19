import axe from 'axe-core';

/**
 * Roda as regras de acessibilidade do axe-core sobre um elemento e falha com a
 * lista de problemas (regra, explicação e onde ocorreu).
 *
 * Desligadas por limitação do jsdom (ambiente dos testes), não por escolha:
 * - `color-contrast`: o jsdom não calcula cores renderizadas (o contraste é
 *   conferido no navegador, nos dois temas);
 * - `region`: pede que todo conteúdo esteja dentro de landmarks, o que só faz
 *   sentido na página inteira, não num componente isolado.
 */
export async function expectNoA11yViolations(context: Element): Promise<void> {
  const results = await axe.run(context, {
    resultTypes: ['violations'],
    rules: {
      'color-contrast': { enabled: false },
      region: { enabled: false },
    },
  });

  const report = results.violations.map(v =>
    `${v.id} (${v.impact}): ${v.help}\n` +
    v.nodes.map(n => `    ${n.target.join(' ')}\n      ${n.failureSummary?.replace(/\n/g, '\n      ')}`).join('\n')
  );
  expect(report, report.join('\n\n')).toEqual([]);
}
