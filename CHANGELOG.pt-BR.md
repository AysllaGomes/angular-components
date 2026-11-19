# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [2.1.0](https://github.com/AysllaGomes/angular-components/compare/v2.0.0...v2.1.0) (2026-11-19)
### Features
- **dialog:** novo input `describedBy`, ligado ao `aria-describedby` (um id ou
  vários separados por espaço); leitores de tela leem esse texto junto com o
  título ao abrir. Vazio/`null` não gera o atributo.
- **select:** **typeahead**: com o campo focado e fechado, digitar escolhe a
  opção sem abrir o painel (como no `<select>` nativo); com o painel aberto, move
  o destaque. Repetir a letra alterna entre as opções com essa inicial; ignora
  acentos e maiúsculas, pula opções desabilitadas e recomeça após 500 ms.
- **select:** **grupos de opções**: campo opcional `group` em `SelectOption`;
  opções do mesmo grupo aparecem juntas sob um título (`role="group"`), na ordem
  em que o grupo aparece primeiro. Opções desabilitadas agora têm `aria-disabled`.
- **pagination:** **modo compacto**: o input `compact` mostra "Página X de Y"
  entre as setas no lugar dos números; `compact="auto"` faz isso só em telas de
  até 420px (só CSS, funciona com SSR). O texto usa `aria-live="polite"`.
- **stepper:** variáveis CSS `--stepper-label-size`, `--stepper-caption-size` e
  `--stepper-color-label-active` para tema local.
- **theme:** token `--accent-text` (destaque usado como texto/borda, mais claro
  no tema escuro) e `color-scheme` por tema, para checkboxes e barras de rolagem
  nativas acompanharem.

### Bug Fixes
- **stepper:** sem barra de rolagem dentro do componente; os conectores ligam o
  centro dos círculos; rótulos longos quebram linha em vez de vazar; em telas de
  até 560px aparecem só os círculos e o rótulo da etapa ativa (os demais
  continuam disponíveis para leitores de tela); as legendas somem de fato até 720px.
- **theme:** contraste no tema escuro: Button (fantasma/contornado/link), rótulos
  do Stepper, linhas/chips/skeleton/ações da Tabela e Paginação não usam mais
  cores claras fixas.
- **table:** o ícone padrão da ação `edit` (caixa com caneta) segue a cor de
  destaque (`currentColor`), sem precisar de SVG externo.
- **table:** nos cards do mobile, rótulo e valor ficam sempre alinhados à
  esquerda, independentemente do alinhamento da coluna.
- **dialog, actionbar:** o elemento não ocupa espaço no layout quando fechado.
- **select:** o botão de limpar (×) não reserva espaço quando está oculto.

### Demo
- Layout responsivo que cabe em telas de 390px, cards e espaçamentos iguais em
  todas as seções, fonte **Inter** carregada de fato e controles de formulário
  herdando a fonte da página.
- Novos exemplos: Select com grupos e typeahead, Paginação compacta; exemplo
  "Compacto" do Stepper e botão "Avançar" corrigidos.
- Textos e rótulos corrigidos, ícones coerentes com as ações, rodapé, botões do
  Toast no tema escuro e linha da Paginação no mobile.

### Documentation
- Roadmaps do Dialog e da Tabela alinhados ao código (itens marcados como feitos
  que não existiam foram desmarcados); padrão do `size` do Dialog documentado
  como `'md'`, incluindo `'xl'`.

## [2.0.0](https://github.com/AysllaGomes/angular-components/compare/v1.8.0...v2.0.0) (2026-11-18)
### ⚠ Breaking Changes
- **Angular 22 passa a ser obrigatório** (antes Angular 20). Os componentes usam
  APIs e a semântica de templates da v22.
- **Node 24 é o runtime suportado** (`.nvmrc`); o Node 20 está fora de suporte.

### Changed
- Angular atualizado 20.2 → 20.3 → 21 → 22.3, com TypeScript 6.
- Migrações da v22: componentes da demo e dos testes declaram
  `ChangeDetectionStrategy.Eager` (os da biblioteca já eram `OnPush`); a
  hidratação mantém `withNoIncrementalHydration()`.
- Testes unitários rodam no **Vitest** (jsdom) em vez de Karma/Jasmine: mais
  rápidos e o CI não precisa mais de navegador.
- Ferramenta de release: `standard-version` (descontinuado) substituído por
  `commit-and-tag-version`, com os mesmos comandos.

### Security
- **SSR:** validação de host ativada (`security.allowedHosts`: `localhost`,
  `127.0.0.1`); requisições com cabeçalho `Host` desconhecido recebem `400`
  (proteção contra SSRF do Angular 22).
- **SSR:** cabeçalhos `X-Forwarded-*` não são confiáveis (sem `trustProxyHeaders`);
  veja o comentário em `src/server.ts` antes de publicar atrás de um proxy.
- `path-to-regexp` (alta, usado pelo Express) corrigido; a remoção do Karma e do
  `standard-version` eliminou os alertas restantes: `npm audit` com
  **0 vulnerabilidades**.

### Migration Notes
- Atualize sua aplicação para o Angular 22 (`ng update @angular/core@22 @angular/cli@22`,
  uma versão principal por vez) antes de usar a 2.0.0.
- As APIs dos componentes não mudaram desde a 1.8.0: inputs, outputs e two-way
  bindings funcionam igual.
- Para rodar o servidor SSR num host público: adicione-o em `security.allowedHosts`
  no `angular.json` ou defina `NG_ALLOWED_HOSTS`.
- Testes: `npm test` / `npm run test:ci` agora usam o Vitest; matchers exclusivos do
  Jasmine (`toBeTrue`, `jasmine.createSpy`, …) não existem mais.

## [1.8.0](https://github.com/AysllaGomes/angular-components/compare/v1.7.0...v1.8.0) (2026-11-18)
### Added
- **Select** integrado ao Angular Forms via `ControlValueAccessor`: funciona com
  `formControl`, `formControlName` e `[(ngModel)]` (valor, `dirty`, `touched`,
  `disable()`/`enable()`); nova demo com Reactive Forms e seção nos docs.
- `<html lang>` acompanha o idioma atual.

### Changed
- Todos os componentes usam as APIs de signals: `input()`, `model()`, `output()`,
  `viewChild()`/`contentChild()`; `linkedSignal` para estados que seguem um input
  mas mudam internamente (valor do Select, seleção/ordenação da Tabela).
- Templates migrados para o control flow nativo (`@if`/`@for`/`@switch`) com
  chaves de `track` explícitas (linhas da Tabela usam o `rowKey`).
- `size="auto"` do Dialog/ActionBar agora é um `effect` que desliga o
  `ResizeObserver` automaticamente.
- `index.html`: título, `lang="pt-BR"` e meta description.
- CI e deploy rodam no Node 24 (lido do `.nvmrc`) com cache do npm.

### Fixed
- Tema: sem “piscada” do tema claro ao carregar com SSR; tema, cor de destaque e
  idioma salvos são aplicados antes da primeira pintura.
- Select: `[error]` passa a atualizar após a primeira renderização; fechar o
  painel pelo botão marca o campo como tocado e valida.
- Select: estilos de volta abaixo do limite de 4 kB (build sem avisos).
- Tabela: skeleton sem chaves de `track` duplicadas; botões de ação não são mais
  recriados a cada detecção de mudanças.

### Migration Notes
- Templates não precisam de mudanças: `[(opened)]`, `[(value)]`, `(selectedChange)`,
  `(sortChange)` etc. continuam funcionando.
- Código que acessava a instância dos componentes (via `#ref` ou `viewChild`) pode
  precisar de ajuste: `open` do Dialog/ActionBar agora é `opened` (um `model()`),
  o `variant` do `appButton` virou signal (`variant()`) e as referências internas
  de elementos ficaram privadas.
- `valueChange` do Select é tipado como `T | null` (limpar já emitia `null`).

## [1.7.0](https://github.com/AysllaGomes/angular-components/compare/v1.6.0...v1.7.0) (2026-11-18)
### Added
- **Dialog**: modal acessível com título, conteúdo e ações primária/secundária;
  tamanhos `sm`/`md`/`lg`/`xl`/`auto`, focus trap, fechamento por ESC/backdrop,
  slot `[dialog-actions]`; docs PT/EN.
- `appButton` (ButtonDirective) com variantes `solid|outline|ghost|link`,
  tons `accent|neutral|danger` e tamanhos `xs|sm|md|lg`.
- Tokens globais de botão: `--neutral`, `--danger`.
- Paginação: prev/next com `variant="ghost"`.
- ActionBar: controle do tamanho `auto`.
- **Tabela**: seleção por chave estável via `rowKey`; a seleção sobrevive a
  ordenação, paginação e filtros, e “selecionar tudo” age só nas linhas visíveis.
- Testes unitários de Dialog, ActionBar, Select, Pagination, Tabela e preferências
  (29 specs) e script `npm run test:ci`.

### Changed
- Dialog, Stepper, ActionBar, Pagination, Toast e Header passaram a usar `appButton`
  onde fazia sentido (consistência visual e acessibilidade).
- `styles.sass` agora usa `@use './app/shared/components/button/button' as *`.
- Tabela e header com layout empilhado no mobile.
- Dialog e ActionBar só emitem `openedChange` quando o estado muda de fato
  (não emitem mais na inicialização).
- CI: o deploy roda os testes antes de publicar; o workflow `ci` passou a rodar
  só em PRs e branches que não sejam a `main`.

### Fixed
- Dialog/ActionBar: `size="auto"` agora mede o conteúdo sempre que abre (antes
  nunca rodava, porque o conteúdo é renderizado com `*ngIf`); mudanças em `size`
  após a criação são aplicadas.
- Dialog: só restaura o `overflow` do body se a própria instância o travou
  (antes zerava o valor na inicialização).
- Select: a lista de opções atualiza quando `options` muda após a primeira renderização.
- Paginação: `pageSize` inválido (0, negativo, NaN) não gera mais `Infinity`;
  `pageIndex` é limitado ao intervalo válido.
- Tema/idioma: valores lidos do `localStorage` são validados.
- Deploy: o script de redirect da raiz gerava JavaScript inválido.
- Header mobile ocupa 100% da largura útil com **safe-area** em iOS.
- Pequenos ajustes de foco/aria e responsividade.

### Migration Notes
- Onde havia `.btn`/`.pill` “ad hoc”, prefira o `appButton`:
  `<button appButton variant="outline" tone="neutral" size="sm">…</button>`.

## [1.6.0](https://github.com/AysllaGomes/angular-components/compare/v1.5.0...v1.6.0) (2025-09-07)
### Added
- **Responsive table** 
  - **Horizontal wrap** com `.tbl-wrap` + “sombrinhas” nas laterais. 
  - **Mobile stack (≤640px)**: cada linha vira “card” com rótulos via `data-label`; coluna de seleção renderizada no topo e ações no rodapé. 
- **Largura do selecionável**: token --tbl-select-w (ex.: 48px) e suporte a ajuste local.

### Changed
- Cabeçalho ordenável: foco visível e `aria-sort` mantidos; suporte a **Enter/Espaço** no `<th>`.

### Fixed
- Removido reset global de `button` que afetava outros componentes; estilos agora escopados em `.icon-btn`.

## [1.5.0](https://github.com/AysllaGomes/angular-components/compare/v1.4.0...v1.5.0) (06/09/2025)
### Recursos
* **barra de ações:** adiciona planilha do lado direito com sm/md/lg/auto, interface com reconhecimento de acentos e a11y ([d20e461](https://github.com/AysllaGomes/angular-components/commit/d20e46172b9830f0b036816de7d12c01fd4a2ce5))
* **selecionar:** folha inferior removível (×), polimento e documentos do a11y ([a288e57](https://github.com/AysllaGomes/angular-components/commit/a288e57ecc663011f8dbb99e9b2ea5c61bf9ca9d))

## [1.4.0](https://github.com/AysllaGomes/angular-components/compare/v1.3.0...v1.4.0) (05/09/2025)
### Recursos
* **select:** seleção acessível com filtro opcional + tematizável via variáveis ​​CSS ([843203e](https://github.com/AysllaGomes/angular-components/commit/843203e4a48f438ce5eea58630c7767ba9290636))
* **tema:** adicionar Predefinição de acento 'rosa' ([9ba5b70](https://github.com/AysllaGomes/angular-components/commit/9ba5b70f4572968ad908bf0d4c8f6afa2cf59330)), fecha [#e11d48](https://github.com/AysllaGomes/angular-components/issues/e11d48)

## [1.3.0] - 2025-09-05
### Adicionado
* **tema:** adicionar predefinição de acento 'azul' ([11fd39e](https://github.com/AysllaGomes/angular-components/commit/11fd39eeec0e0c65e9afcc0de7314cead771007f)), fecha [#2563](https://github.com/AysllaGomes/angular-components/issues/2563)

### Docs
- Docs: accent picker supports 4 colors (teal, orange, violet, blue).
- Seletor de acentos suporta quatro cores (azul-petróleo, laranja, violeta, azul).

## [1.2.0] - 2025-09-05
### Adicionado
- **Presets de accent** em tempo de execução (`teal` | `orange` | `violet`) via CSS vars.
- Sinal de **accent** no `ThemeService` + persistência segura para SSR.
- **Picker** de accent no Header com a11y/tooltips.
- Tokens de **tema escuro** para paginação.

### Alterado
- **Tokens globais** agora mapeiam `--accent` para Stepper, Tabela (cabeçalho), Paginação e Toast.
- Cabeçalho da **Tabela** passa a derivar do accent.
- Rótulo **ativo do Stepper** usa o accent.
- Paginação: bolhas neutras no tema claro; hover/ativo usando accent.
- Demo da paginação: select “Itens por página” mais agradável (pill, foco).

### Notas de migração
- Troque hexcodes fixos de “destaque” por `var(--accent)` (ou variantes weak/strong se usar).
- Remova o bloco `:host` de tokens do `pagination.component.sass` para herdar os globais.
- Garanta que o app defina `data-accent="teal|orange|violet"` em `<html>` (ThemeService já faz).


## [0.1.0] - 2025-09-04
### Adicionado
- **Stepper**: estados (ativo/feito/desabilitado), clique opcional, theming por CSS vars, modo compacto.
- **Table**: colunas declarativas, seleção por checkbox, ações (slot `appActions` e/ou `[actions]`), *chips*, células custom, vazio+loading (skeleton), **ordenação** por cabeçalho.
- **Pagination**: componente standalone (bolhas numéricas + setas), controlado por `total`, `pageSize`, `pageIndex`.
- **Toast**: serviço + container, variantes (success/info/warn/error), ação opcional, duração configurável.
- **Demo**: header com troca de tema (light/dark) e idioma (PT/EN), seções `#stepper`, `#table`, `#pagination`, `#toast`.
- **Docs**: README PT/EN; docs por componente (PT/EN).
- **Deploy**: GitHub Pages (roteamento SPA com fallback `404.html`), redirect para `/demo`.

### Alterado
- Ajustes de estilo global (tokens para header, table, etc.).

### Corrigido
- Base href e 404 de SPA para deep links em GitHub Pages.
