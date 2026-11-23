import { Dict } from '../i18n.types';

/** textos da página de componente (/componentes/:id) e da página de acessibilidade */
export const COMPONENT_PAGE: Dict = {
  // cabeçalho do site
  'header.nav': { pt: 'Principal', en: 'Main' },
  'header.demo': { pt: 'Demo', en: 'Demo' },

  'cp.title': { pt: '{{name}} · Angular Components', en: '{{name}} · Angular Components' },
  'cp.home': { pt: 'Início', en: 'Home' },
  'cp.components': { pt: 'Componentes', en: 'Components' },
  'cp.youAreHere': { pt: 'Você está em', en: 'You are here' },
  'cp.traits': { pt: 'Características', en: 'Traits' },
  'cp.trait.standalone': { pt: 'Standalone', en: 'Standalone' },
  'cp.trait.nodeps': { pt: 'Sem dependências além do Angular', en: 'No dependencies besides Angular' },
  'cp.trait.axe': { pt: 'Testado com axe', en: 'Tested with axe' },
  'cp.demo': { pt: 'Ver na demo', en: 'See in the demo' },
  'cp.source': { pt: 'Documentação no GitHub', en: 'Docs on GitHub' },

  'cp.example': { pt: 'Exemplo', en: 'Example' },
  'cp.example.show': { pt: 'Mostrar', en: 'Show' },
  'cp.example.preview': { pt: 'Exemplo', en: 'Example' },
  'cp.example.code': { pt: 'Código', en: 'Code' },
  'cp.example.onlyCode': {
    pt: 'O exemplo ao vivo deste componente está na demo.',
    en: 'The live example of this component is in the demo.'
  },
  'cp.why': { pt: 'Por que existe', en: 'Why it exists' },
  'cp.when': { pt: 'Quando usar', en: 'When to use' },
  'cp.use': { pt: 'Use quando', en: 'Use when' },
  'cp.other': { pt: 'Prefira outro', en: 'Prefer another' },
  'cp.api': { pt: 'API', en: 'API' },
  'cp.api.parts': { pt: 'Partes da API', en: 'API parts' },
  'cp.a11y': { pt: 'Acessibilidade', en: 'Accessibility' },
  'cp.a11y.guarantees': { pt: 'O que o componente garante', en: 'What the component guarantees' },
  'cp.copy': { pt: 'O que copiar', en: 'What to copy' },
  'cp.copy.lead': {
    pt: 'Gerado a partir dos imports. Copie para uma pasta shared/ mantendo a estrutura de pastas (os imports são relativos).',
    en: 'Generated from the imports. Copy into a shared/ folder keeping the folder structure (imports are relative).'
  },
  'cp.copy.button': { pt: 'Copiar o caminho', en: 'Copy the path' },
  'cp.copy.done': { pt: 'Caminho copiado:', en: 'Path copied:' },
  'cp.copy.globals': { pt: 'Estilos globais, no seu styles.sass:', en: 'Global styles, in your styles.sass:' },
  'cp.theme': { pt: 'Tema', en: 'Theme' },
  'cp.theme.lead': {
    pt: 'Variáveis CSS que você pode sobrescrever. Todas têm valor padrão.',
    en: 'CSS variables you can override. All of them have defaults.'
  },
  'cp.others': { pt: 'Outros componentes', en: 'Other components' },
  'cp.prev': { pt: 'Anterior', en: 'Previous' },
  'cp.next': { pt: 'Próximo', en: 'Next' },
  'cp.onPage': { pt: 'Nesta página', en: 'On this page' },

  // relatório do axe (bloco na página e /acessibilidade)
  'a11y.report.title': { pt: 'Verificação automática (axe)', en: 'Automated check (axe)' },
  'a11y.report.loading': { pt: 'Carregando o relatório…', en: 'Loading the report…' },
  'a11y.report.unavailable': {
    pt: 'O relatório ainda não foi gerado. Ele sai dos testes de acessibilidade, a cada deploy.',
    en: 'The report has not been generated yet. It comes from the accessibility tests, on every deploy.'
  },
  'a11y.report.none': {
    pt: 'Este componente ainda não tem estados no relatório.',
    en: 'This component has no states in the report yet.'
  },
  'a11y.report.summary': {
    pt: '{{violations}} violações em {{states}} estados verificados',
    en: '{{violations}} violations in {{states}} checked states'
  },
  'a11y.report.summary.one': {
    pt: '{{violations}} violações em 1 estado verificado',
    en: '{{violations}} violations in 1 checked state'
  },
  'a11y.report.state': { pt: 'Estado', en: 'State' },
  'a11y.report.passes': { pt: 'Regras ok', en: 'Rules passed' },
  'a11y.report.review': { pt: 'Para revisar', en: 'To review' },
  'a11y.report.violations': { pt: 'Violações', en: 'Violations' },
  'a11y.report.chart': { pt: 'Resultado por estado', en: 'Result per state' },
  'a11y.report.meta': { pt: 'axe {{version}} · gerado em {{date}}', en: 'axe {{version}} · generated on {{date}}' },
  'a11y.report.run': { pt: 'Ver o run no GitHub', en: 'See the run on GitHub' },
  'a11y.report.full': { pt: 'Relatório completo de acessibilidade', en: 'Full accessibility report' },
  'a11y.report.reviewTitle': { pt: 'O que ficou para revisar, e por quê', en: 'What is left to review, and why' },
  'a11y.review.label-content-name-mismatch': {
    pt: 'Nome visível dentro do nome acessível (WCAG 2.5.3): o axe não consegue avaliar no ambiente de teste. Conferido à mão: o rótulo visível está no nome, e símbolos como ‹ e × são exceção do critério.',
    en: 'Visible name inside the accessible name (WCAG 2.5.3): axe cannot evaluate it in the test environment. Checked by hand: the visible label is in the name, and symbols like ‹ and × are exempt.'
  },
  'a11y.review.aria-valid-attr-value': {
    pt: 'aria-controls com aria-haspopup: o axe não confirma a referência por heurística. Conferido: com o painel aberto, a lista existe e está visível; fechado, o atributo não é usado.',
    en: 'aria-controls with aria-haspopup: axe does not confirm the reference by heuristic. Checked: with the panel open, the list exists and is visible; closed, the attribute is not used.'
  },
  'a11y.review.default': {
    pt: 'O axe não conseguiu decidir sozinho; conferido à mão.',
    en: 'axe could not decide on its own; checked by hand.'
  },
  'a11y.report.honest': {
    pt: 'Ferramentas automáticas pegam só uma parte dos problemas de acessibilidade. O que o axe não vê (teclado, leitor de tela, alto contraste) está em “O que o componente garante” e é conferido à mão.',
    en: 'Automated tools catch only part of accessibility problems. What axe does not see (keyboard, screen reader, high contrast) is in “What the component guarantees” and is checked by hand.'
  },

  // página /acessibilidade
  'a11y.page.title': { pt: 'Acessibilidade · Angular Components', en: 'Accessibility · Angular Components' },
  'a11y.page.heading': { pt: 'Acessibilidade, com prova', en: 'Accessibility, with proof' },
  'a11y.page.lead': {
    pt: 'Cada componente é verificado com o axe nos estados que importam, a cada deploy. Os números abaixo vêm desse relatório, não de uma afirmação.',
    en: 'Every component is checked with axe in the states that matter, on every deploy. The numbers below come from that report, not from a claim.'
  },
  'a11y.page.components': { pt: 'componentes', en: 'components' },
  'a11y.page.states': { pt: 'estados verificados', en: 'checked states' },
  'a11y.page.violations': { pt: 'violações', en: 'violations' },
  'a11y.page.review': { pt: 'itens para revisar', en: 'items to review' },
  'a11y.page.table': { pt: 'Resultado por componente', en: 'Result per component' },
  'a11y.page.component': { pt: 'Componente', en: 'Component' },
  'a11y.page.statesCol': { pt: 'Estados', en: 'States' },
  'a11y.page.how': { pt: 'Como é verificado', en: 'How it is checked' },
  'a11y.page.how.1': {
    pt: 'Os testes montam cada componente nos estados que importam (aberto, com erro, desabilitado, com seleção…) e rodam o axe-core em cada um.',
    en: 'The tests render each component in the states that matter (open, with an error, disabled, with a selection…) and run axe-core on each.'
  },
  'a11y.page.how.2': {
    pt: 'Uma violação faz o teste falhar, e o deploy só publica com os testes passando.',
    en: 'A violation fails the test, and the deploy only publishes when the tests pass.'
  },
  'a11y.page.how.3': {
    pt: 'O relatório é gravado nessa mesma execução e publicado junto com o site.',
    en: 'The report is written in that same run and published with the site.'
  },
  'a11y.page.disabled': { pt: 'Regras desligadas nos testes', en: 'Rules turned off in the tests' },
  'a11y.page.disabled.color-contrast': {
    pt: 'color-contrast: o ambiente de teste não calcula cores. O contraste é conferido no navegador, nos dois temas.',
    en: 'color-contrast: the test environment does not compute colors. Contrast is checked in the browser, in both themes.'
  },
  'a11y.page.disabled.region': {
    pt: 'region: pede que todo conteúdo esteja dentro de regiões da página, o que só faz sentido na página inteira, não num componente isolado.',
    en: 'region: asks for all content to be inside page landmarks, which only makes sense for a whole page, not an isolated component.'
  },
  'a11y.page.manual': { pt: 'O que o axe não vê', en: 'What axe does not see' },
  'a11y.page.manual.text': {
    pt: 'Teclado, leitor de tela, foco e alto contraste. Cada página de componente descreve o que ele garante, e isso é conferido à mão.',
    en: 'Keyboard, screen reader, focus and high contrast. Each component page describes what it guarantees, and that is checked by hand.'
  },
};
