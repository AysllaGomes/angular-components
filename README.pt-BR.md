<p align="right"><a href="./README.md">English</a></p>

[![Deploy](https://github.com/AysllaGomes/angular-components/actions/workflows/deploy.yml/badge.svg)](.github/workflows/deploy.yml)
### **[Demo](https://aysllagomes.github.io/angular-components/demo)**

- **[CHANGELOG.md](./CHANGELOG.pt-BR.md):**
---

# Angular Components (Standalone, HTML + Sass)

> **Propósito:** criar **componentes de UI reutilizáveis** (ex.: **ActionBar**, **Dialog**, Select, Checkbox, Radio, Switch, TreeSelect, Stepper, Tabs, Table, Pagination, Toast, Tooltip) com **Angular Standalone** em **HTML + Sass**, **sem depender de frameworks de UI**. Base leve, acessível e fácil de portar/“desencapsular”.

- **Demo local:** `http://localhost:4200/demo`
- **Stack:** Angular 22 (standalone, signals, zoneless, SSR), Sass (`.sass`), CSS Custom Properties (tematização), Vitest. Node 24 (`.nvmrc`).

---

## Componentes

| Componente               | Descrição                                                                                                                                         | Docs                                                                                                                      | Demo               |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|--------------------|
| **ActionBar**            | *Sheet* lateral com título, conteúdo e ações no rodapé. Tamanhos `sm`/`md`/`lg`/`auto`, integra ao accent, *focus trap*, fechar por ESC/backdrop. | [PT-BR](src/app/shared/components/actionbar/actionbar.md) · [EN](src/app/shared/components/actionbar/actionbar.en.md)     | `/demo#actionbar`  |
| **Button (`appButton`)** | Diretiva para estilizar botões/links (solid/outline/ghost/link; accent/neutral/danger; xs–lg).                                                    | [PT-BR](src/app/shared/components/button/button.md) · [EN](src/app/shared/components/button/button.en.md)                 | `/demo#button`     |
| **Checkbox**             | Checkbox acessível com estado parcial (indeterminado), integrado a formulários (`formControl`/`ngModel`), dica/erro. A caixa visual (`app-checkbox-mark`) pode ser usada sozinha. | [PT-BR](src/app/shared/components/checkbox/checkbox.md) · [EN](src/app/shared/components/checkbox/checkbox.en.md) | `/demo#checkbox` |
| **Radio group**          | Escolha única entre poucas opções visíveis: `fieldset`/`legend` e radios nativos (setas), descrição por opção, vertical/horizontal, formulários, dica/erro. | [PT-BR](src/app/shared/components/radio/radio-group.md) · [EN](src/app/shared/components/radio/radio-group.en.md) | `/demo#radio` |
| **Switch**               | Liga/desliga para configurações que valem na hora: checkbox nativo com `role="switch"`, layout de lista de configurações, formulários, dica. | [PT-BR](src/app/shared/components/switch/switch.md) · [EN](src/app/shared/components/switch/switch.en.md) | `/demo#switch` |
| **Dialog**               | Modal acessível com título, conteúdo e ações primária/secundária. Tamanhos `sm`/`md`/`lg`/`auto`, *focus trap*, fechar por ESC/backdrop, *slots*. | [PT-BR](src/app/shared/components/dialog/dialog.md) · [EN](src/app/shared/components/dialog/dialog.en.md)                 | `/demo#dialog`     |
| **Stepper**              | Stepper horizontal, clicável, com estados (ativo, feito, desabilitado) e tokens de tema.                                                          | [PT-BR](src/app/shared/components/stepper/stepper.md) · [EN](src/app/shared/components/stepper/stepper.en.md)             | `/demo#stepper`    |
| **Tabs**                 | Abas no padrão WAI-ARIA: setas/Home/End, ativação automática ou manual, contador, rótulo próprio (ícone), abas desabilitadas, conteúdo sob demanda (`appTabContent`, `keepAlive`), rolagem horizontal que mantém a aba aberta visível. | [PT-BR](src/app/shared/components/tabs/tabs.md) · [EN](src/app/shared/components/tabs/tabs.en.md) | `/demo#tabs` |
| **Table**                | Tabela flexível com checkbox por linha, coluna de ações (declarativa via `[actions]` ou *slot* `appActions`), *chips* e células custom.           | [PT-BR](src/app/shared/components/table/table.md) · [EN](src/app/shared/components/table/table.en.md)                     | `/demo#table`      |
| **Pagination**           | Paginação independente (bolhas numéricas + setas), controlada por `total`, `pageSize` e `pageIndex`.                                              | [PT-BR](src/app/shared/components/pagination/pagination.md) · [EN](src/app/shared/components/pagination/pagination.en.md) | `/demo#pagination` |
| **Toast**                | Toast leve (serviço + container), acessível e tematizável.                                                                                        | [PT-BR](src/app/shared/components/toast/toast.md) · [EN](src/app/shared/components/toast/toast.en.md)                     | `/demo#toast`      |
| **Tooltip (`appTooltip`)** | Dica ao passar o mouse/focar pelo teclado: como nome de botões só com ícone (`tooltipAsLabel`) ou como descrição, vira de lado e não sai da janela, WCAG 1.4.13 (Esc fecha, dá para passar o mouse no balão, persistente). | [PT-BR](src/app/shared/components/tooltip/tooltip.md) · [EN](src/app/shared/components/tooltip/tooltip.en.md) | `/demo#tooltip` |
| **Select**               | Select acessível com filtro opcional e botão de limpar (“×”), painel amigável no mobile e rótulos/erros prontos para i18n.                        | [PT-BR](src/app/shared/components/select/select.md) · [EN](src/app/shared/components/select/select.en.md)                 | `/demo#select`     |
| **TreeSelect**           | Select com opções em árvore: modo único (mostra o caminho, `leafOnly` opcional) ou checkbox (seleção de grupo/parcial, valor = keys das folhas ou grupos resumidos), filhos carregados sob demanda (`loadChildren`), filtro, teclado WAI-ARIA de árvore, formulários. | [PT-BR](src/app/shared/components/tree-select/tree-select.md) · [EN](src/app/shared/components/tree-select/tree-select.en.md) | `/demo#treeselect` |
| **Formulários (validação e máscaras)** | `AppValidators` (CPF, CNPJ inclusive alfanumérico), mensagens de erro centralizadas e traduzidas (pipe `fieldError`, `provideFormErrorMessages`), `appFormValidation` (foco no primeiro erro ao enviar), máscaras `appMask` e `app-form-field`. | [PT-BR](src/app/shared/forms/forms.md) · [EN](src/app/shared/forms/forms.en.md) | `/demo#validation` |

---

## Qualidade

- `npm run test:ci` roda os testes unitários (Vitest) **e checagens automáticas de acessibilidade** ([axe-core](https://github.com/dequelabs/axe-core)) em cada componente, nos estados que importam (aberto, com erro, desabilitado...). Veja `src/app/shared/components/a11y.spec.ts`.
- `npm run test:shuffle` roda a mesma suíte com os arquivos de teste em ordem aleatória, um de cada vez. Os specs compartilham o ambiente, então um teste que deixa algo para trás (timers falsos, listeners, elementos no `<body>`) só quebra outro em certas ordens, como pode acontecer no CI. A semente aparece no início; para repetir uma ordem que falhou: `SEED=1234 npm run test:shuffle` (PowerShell: `$env:SEED=1234; npm run test:shuffle`).
- O CI roda tudo em cada push e pull request; o deploy só publica se passar.
- O contraste de cores é conferido no navegador, nos dois temas (o jsdom não renderiza cores).

## Licença

MIT — use, adapte e contribua.
