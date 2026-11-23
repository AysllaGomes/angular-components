import axe from 'axe-core';

/** um estado verificado, para o relatório público (/componentes/:id e /acessibilidade) */
export interface A11yCheck {
  /** id do componente no site (`table`, `select`...) */
  component: string;
  /** o que estava na tela, nos dois idiomas */
  state: { pt: string; en: string };
}

interface A11yResult extends A11yCheck {
  passes: number;
  violations: number;
  incomplete: number;
  /** regras que o axe não conseguiu decidir sozinho (ficam para revisão manual) */
  needsReview: string[];
  nodes: number;
}

const results: A11yResult[] = [];

/**
 * Roda as regras de acessibilidade do axe-core sobre um elemento e falha com a
 * lista de problemas (regra, explicação e onde ocorreu). Com `check`, o resultado
 * entra no relatório gravado por `writeA11yReport`.
 *
 * Desligadas por limitação do jsdom (ambiente dos testes), não por escolha:
 * - `color-contrast`: o jsdom não calcula cores renderizadas (o contraste é
 *   conferido no navegador, nos dois temas);
 * - `region`: pede que todo conteúdo esteja dentro de landmarks, o que só faz
 *   sentido na página inteira, não num componente isolado.
 */
export async function expectNoA11yViolations(context: Element, check?: A11yCheck): Promise<void> {
  const res = await axe.run(context, {
    // no relatório, todos os elementos de cada regra (senão o axe traz um por regra que passa)
    ...(check ? {} : { resultTypes: ['violations'] as axe.resultGroups[] }),
    rules: {
      'color-contrast': { enabled: false },
      region: { enabled: false },
    },
  });

  if (check) {
    const nodes = new Set<string>();
    for (const group of [res.passes, res.violations, res.incomplete]) {
      for (const rule of group) for (const n of rule.nodes) nodes.add(n.target.join(' '));
    }
    results.push({
      ...check,
      passes: res.passes.length,
      violations: res.violations.length,
      incomplete: res.incomplete.length,
      needsReview: res.incomplete.map(r => r.id),
      nodes: nodes.size,
    });
  }

  const report = res.violations.map(v =>
    `${v.id} (${v.impact}): ${v.help}\n` +
    v.nodes.map(n => `    ${n.target.join(' ')}\n      ${n.failureSummary?.replace(/\n/g, '\n      ')}`).join('\n')
  );
  expect(report, report.join('\n\n')).toEqual([]);
}

/**
 * Grava o relatório (public/a11y-report.json), que o site publica: por componente,
 * os estados verificados e quantas regras passaram. No CI, leva o commit e o link
 * do run, para quem lê conferir de onde veio.
 */
export async function writeA11yReport(file = 'public/a11y-report.json'): Promise<void> {
  if (!results.length) return;
  const fs = await import('node:fs');
  const path = await import('node:path');
  const env = process.env;
  const components: Record<string, { states: Omit<A11yResult, 'component'>[] }> = {};
  for (const { component, ...rest } of results) {
    (components[component] ??= { states: [] }).states.push(rest);
  }
  const report = {
    generatedAt: new Date().toISOString(),
    axeVersion: axe.version,
    commit: env['GITHUB_SHA'] ?? null,
    runUrl: env['GITHUB_RUN_ID'] ? `${env['GITHUB_SERVER_URL']}/${env['GITHUB_REPOSITORY']}/actions/runs/${env['GITHUB_RUN_ID']}` : null,
    // regras desligadas e por quê (o relatório não esconde o que não verifica)
    disabledRules: ['color-contrast', 'region'],
    components,
  };
  const out = path.resolve(process.cwd(), file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
}
