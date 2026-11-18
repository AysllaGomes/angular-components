# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
