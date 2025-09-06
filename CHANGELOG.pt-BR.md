# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.3.0] - 2025-09-05
### Adicionado
- New accent preset blue (`#2563eb`).
- Nova predefinição de destaque azul (`#2563eb`).
- feat(select): accessible select with optional filter + themeable via CSS vars
  - Keyboard nav (↑/↓, Home/End, Enter, Esc), focus management, outside click
  - Validation: external error + required auto-validate (blur/close)
  - Theming: --sel-* CSS vars; hover/active derive from --accent
  - Filter: diacritics-insensitive, sticky input at panel top
- **ActionBar** — adicionado componente de sheet lateral: tamanhos `sm`/`md`/`lg`/`auto`, foco visível, `Esc`, trap de foco, `closeOnBackdrop`, two-way `[(opened)]`, botões integrados ao accent e abertura da direita.

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
