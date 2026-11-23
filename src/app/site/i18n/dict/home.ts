import { Dict } from '../i18n.types';

/** textos da home (apresentação); os números só citam o que dá para conferir no repositório */
export const HOME: Dict = {
  'home.title': { pt: 'Angular Components', en: 'Angular Components' },

  // destaque
  'home.hero.eyebrow': { pt: 'Angular 22 · standalone · signals · v3', en: 'Angular 22 · standalone · signals · v3' },
  'home.hero.title': {
    pt: 'Componentes Angular acessíveis, sem nenhuma dependência além do Angular.',
    en: 'Accessible Angular components, with no dependency but Angular itself.'
  },
  'home.hero.lead': {
    pt: '16 componentes para copiar para o seu projeto, tematizar com variáveis CSS e usar em português ou inglês. Testados com axe nos estados que importam.',
    en: '16 components to copy into your project, theme with CSS variables and use in English or Portuguese. Tested with axe in the states that matter.'
  },
  'home.hero.cta': { pt: 'Ver os componentes', en: 'See the components' },
  'home.hero.howto': { pt: 'Como usar', en: 'How to use' },
  'home.hero.demo': { pt: 'Abrir a demo', en: 'Open the demo' },

  // vitrine (a Tabela de verdade)
  'home.showcase.label': {
    pt: 'A Tabela em ação: selecione linhas, abra os detalhes e troque de página',
    en: 'The Table in action: select rows, open the details and change pages'
  },
  'home.showcase.caption': {
    pt: 'É a Tabela da biblioteca, não uma imagem: ações em massa, colunas que se recolhem em “Mostrar detalhes” e paginação.',
    en: 'This is the library Table, not a picture: bulk actions, columns that collapse into “Show details” and pagination.'
  },
  'home.showcase.col.name': { pt: 'Nome', en: 'Name' },
  'home.showcase.col.type': { pt: 'Tipo', en: 'Type' },
  'home.showcase.col.doc': { pt: 'Documento', en: 'Document' },
  'home.showcase.col.limit': { pt: 'Limite', en: 'Limit' },
  'home.showcase.holder': { pt: 'Titular', en: 'Holder' },
  'home.showcase.additional': { pt: 'Adicional', en: 'Additional' },
  'home.showcase.export': { pt: 'Exportar', en: 'Export' },
  'home.showcase.exported': {
    pt: '{{n}} registro(s) exportado(s) (exemplo)',
    en: '{{n}} record(s) exported (example)'
  },

  // provas
  'home.proof.label': { pt: 'Em números', en: 'By the numbers' },
  'home.proof.deps': { pt: 'dependências além do Angular', en: 'dependencies besides Angular' },
  'home.proof.tests': { pt: 'acessibilidade testada em cada componente', en: 'accessibility tested on every component' },
  'home.proof.langs': { pt: 'textos trocáveis numa linha', en: 'texts you switch in one line' },
  'home.proof.themes': { pt: 'temas claro/escuro e cores de destaque', en: 'light/dark themes and accent colors' },

  // duas visões
  'home.views.title': { pt: 'Duas formas de olhar o projeto', en: 'Two ways to look at the project' },
  'home.views.lead': {
    pt: 'Quem vai usar quer saber como começar. Quem avalia quer saber como foi feito. As duas respostas estão aqui.',
    en: 'If you will use it, you want to know how to start. If you are evaluating it, you want to know how it was built. Both answers are here.'
  },
  'home.views.tabs': { pt: 'Visões do projeto', en: 'Project views' },
  'home.views.dev': { pt: 'Para quem vai usar', en: 'For developers' },
  'home.views.about': { pt: 'Como foi feito', en: 'How it was built' },

  'home.dev.copy.title': { pt: 'Copie o componente', en: 'Copy the component' },
  'home.dev.copy.text': {
    pt: 'Sem pacote para instalar. A documentação de cada um lista exatamente o que copiar, inclusive os componentes e tipos que ele usa.',
    en: "No package to install. Each component's docs list exactly what to copy, including the components and types it uses."
  },
  'home.dev.theme.title': { pt: 'Ajuste o tema', en: 'Adjust the theme' },
  'home.dev.theme.text': {
    pt: 'Cores, raios e espaçamentos vêm de variáveis CSS. Troque a cor de destaque e tudo acompanha, no claro e no escuro.',
    en: 'Colors, radii and spacing come from CSS variables. Change the accent color and everything follows, in light and dark.'
  },
  'home.dev.lang.title': { pt: 'Escolha o idioma', en: 'Pick the language' },
  'home.dev.lang.text': {
    pt: 'Os textos dos componentes são em inglês por padrão. Português pronto numa linha, ou só os textos que quiser.',
    en: 'Component texts are English by default. Portuguese is one line away, or change only the texts you want.'
  },

  'home.about.a11y.title': { pt: 'Acessibilidade de verdade', en: 'Real accessibility' },
  'home.about.a11y.1': {
    pt: 'O foco nunca se perde: ao tentar de novo, limpar a seleção ou trocar de página.',
    en: 'Focus is never lost: when retrying, clearing the selection or changing pages.'
  },
  'home.about.a11y.2': {
    pt: 'O Tooltip segue a WCAG 1.4.13 (Esc fecha, dá para passar o mouse).',
    en: 'The Tooltip follows WCAG 1.4.13 (Esc closes it, it can be hovered).'
  },
  'home.about.a11y.3': { pt: 'Mudanças são anunciadas ao leitor de tela.', en: 'Changes are announced to screen readers.' },
  'home.about.ng.title': { pt: 'Angular atual', en: 'Current Angular' },
  'home.about.ng.1': { pt: 'Standalone, signals e zoneless.', en: 'Standalone, signals and zoneless.' },
  'home.about.ng.2': { pt: 'Renderiza no servidor (SSR).', en: 'Server-side rendering (SSR).' },
  'home.about.ng.3': {
    pt: 'Sem biblioteca de UI por baixo: HTML, Sass e TypeScript.',
    en: 'No UI library underneath: HTML, Sass and TypeScript.'
  },
  'home.about.quality.title': { pt: 'Qualidade no processo', en: 'Quality in the process' },
  // "mais de 240": continua verdade conforme os testes aumentam (um número exato ficaria velho)
  'home.about.quality.1': { pt: 'Mais de 240 testes, também em ordem aleatória.', en: 'Over 240 tests, also in random order.' },
  'home.about.quality.2': {
    pt: 'Changelog em português e inglês a cada versão.',
    en: 'Changelog in English and Portuguese for every version.'
  },
  'home.about.quality.3': { pt: 'Release e deploy automáticos a cada tag.', en: 'Automatic release and deploy on every tag.' },

  // catálogo
  'home.catalog.title': { pt: 'Os componentes', en: 'The components' },
  'home.catalog.lead': {
    pt: 'Cada um tem uma página com por que existe, quando usar, API, acessibilidade e o que copiar, além da demonstração ao vivo.',
    en: 'Each one has a page with why it exists, when to use it, API, accessibility and what to copy, plus the live demo.'
  },
  'home.catalog.all': { pt: 'Abrir a demo completa', en: 'Open the full demo' },
  'home.catalog.see': { pt: 'Conhecer {{name}}', en: 'Explore {{name}}' },
  'home.catalog.table': {
    pt: 'Seleção, ações em massa, paginação, estados de carregando/vazio/erro e colunas que se recolhem.',
    en: 'Selection, bulk actions, pagination, loading/empty/error states and collapsible columns.'
  },
  'home.catalog.select': {
    pt: 'Busca opcional, botão de limpar, grupos e painel que vira folha no celular.',
    en: 'Optional search, clear button, groups and a panel that becomes a sheet on phones.'
  },
  'home.catalog.treeselect': {
    pt: 'Opções em árvore, seleção única ou com caixas, filhos carregados sob demanda.',
    en: 'Tree options, single or checkbox selection, children loaded on demand.'
  },
  'home.catalog.tabs': {
    pt: 'Setas, Home/End, ativação manual ou automática e conteúdo sob demanda.',
    en: 'Arrows, Home/End, manual or automatic activation and on-demand content.'
  },
  'home.catalog.dialog': {
    pt: 'Modal com foco preso, Esc para fechar e ações primária e secundária.',
    en: 'Modal with a focus trap, Esc to close and primary/secondary actions.'
  },
  'home.catalog.actionbar': {
    pt: 'Painel lateral com título, conteúdo e ações no rodapé.',
    en: 'Side sheet with a title, content and footer actions.'
  },
  'home.catalog.tooltip': {
    pt: 'Dica no mouse ou no teclado, que vira de lado e não sai da janela.',
    en: 'Hint on hover or keyboard focus that flips sides and stays inside the window.'
  },
  'home.catalog.toast': {
    pt: 'Notificações leves, anunciadas ao leitor de tela.',
    en: 'Lightweight notifications, announced to screen readers.'
  },
  'home.catalog.stepper': {
    pt: 'Etapas clicáveis com estados ativo, concluído e desabilitado.',
    en: 'Clickable steps with active, done and disabled states.'
  },
  'home.catalog.pagination': {
    pt: 'Números e setas, modo compacto e atalhos de teclado.',
    en: 'Numbers and arrows, compact mode and keyboard shortcuts.'
  },
  'home.catalog.checkbox': {
    pt: 'Estado parcial, integração com formulários, dica e erro.',
    en: 'Partial state, forms integration, hint and error.'
  },
  'home.catalog.checkboxgroup': {
    pt: 'Escolha múltipla com fieldset nativo, valor em lista e "Selecionar todos".',
    en: 'Multiple choice with a native fieldset, list value and "Select all".'
  },
  'home.catalog.radio': {
    pt: 'Escolha única com fieldset nativo, setas e descrições.',
    en: 'Single choice with a native fieldset, arrow keys and descriptions.'
  },
  'home.catalog.switch': {
    pt: 'Liga/desliga para configurações que valem na hora.',
    en: 'On/off for settings that apply immediately.'
  },
  'home.catalog.button': {
    pt: 'Diretiva com variantes sólida, contorno, fantasma e link.',
    en: 'Directive with solid, outline, ghost and link variants.'
  },
  'home.catalog.validation': {
    pt: 'Validadores de CPF/CNPJ, máscaras e foco no primeiro erro ao enviar.',
    en: 'CPF/CNPJ validators, input masks and focus on the first error on submit.'
  },
};
