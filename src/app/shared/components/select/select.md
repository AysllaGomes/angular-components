<p align="right"><a href="./select.en.md">English</a></p>

# Select — Componente de seleção acessível (Angular, standalone)

> Textos padrão em **inglês**, trocáveis num lugar só com [`provideUiLabels`](../../labels/labels.md) (`labels.*` nas tabelas abaixo); o input de cada instância vence.

Componente de **select** leve, acessível e tematizável por **CSS Variables**. Suporta **filtro** no painel, navegação por teclado, validação de obrigatório e integração simples com i18n. Mantém compatibilidade com os tokens globais de tema/acentos.

---

## Por que existe

O `<select>` nativo é acessível, mas difícil de estilizar e não tem busca, grupos visuais nem botão de limpar. Recriar um select do zero costuma quebrar o teclado e o leitor de tela. Este componente segue o padrão de listbox: setas, Home/End, escolha por digitação, grupos, limpar, validação de obrigatório, formulários e um painel que vira folha no celular.

## Quando usar

### Use quando

- A pessoa escolhe uma opção entre várias, mais do que cabem confortavelmente na tela.
- As opções têm grupos, ou a lista é longa e vale ter busca.
- O campo faz parte de um formulário (Reactive Forms ou `ngModel`).

### Prefira outro

- Poucas opções que cabem na tela: use o [Radio group](../radio/radio-group.md), que mostra tudo sem abrir nada.
- Opções em árvore (categorias e subcategorias): use o [TreeSelect](../tree-select/tree-select.md).
- Ligar ou desligar uma configuração: use o [Switch](../switch/switch.md).

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar o Select em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/select/` |
| Arquivos auxiliares | `a11y/modal-session.ts` |
| Textos padrão | `labels/` ([Textos dos componentes](../../labels/labels.md)) |

Depende só de `@angular/common`, `@angular/core`, `@angular/forms`. Ao todo: 7 arquivos, ~1227 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

## Recursos
- Standalone (`@Component({ standalone: true })`), sem dependências de UI externas.
- **Filtro (search)** opcional no painel, acento/maiúsculas-insensível.
- **Acessibilidade**: `role="listbox"`/`role="option"`, `aria-expanded`, `aria-selected`, `aria-invalid`, fecha em *Escape* e clique externo, foco gerenciado.
- **Teclado**: setas ↑/↓, Home/End, Enter, Escape, Tab/Shift+Tab.
- **Busca por digitação (typeahead)**: digitar letras escolhe a opção (fechado) ou move o destaque (aberto).
- **Grupos**: opções com `group` aparecem juntas sob um título.
- **Temas**: herda tokens globais (`--accent`, `--surface`, `--fg` etc.) e permite overrides via `--sel-*`.
- **Validação**: erro externo (`error`) tem prioridade; erro interno de obrigatório quando `required` e `autoValidate`.
- **Novo:** **Clearable** — opcional (×) dentro do controle para limpar a seleção.
- **Novo:** **Auto-responsivo (mobile)** — sem props: o painel e os itens se adaptam a telas pequenas (alvos de toque confortáveis, filtro “grudado” no topo do painel, rolagem suave e sem “jank”).

---

## Uso básico

```html
<app-select
  label="Categoria"
  placeholder="Selecione"
  [required]="true"
  [options]="options"
  [value]="categoria()"
  (valueChange)="categoria.set($event)"
  hint="Usada para organizar os relatórios.">
</app-select>
```

```ts
categoria = signal<string | null>(null);

options: SelectOption<string>[] = [
  { label: 'Vendas', value: 'vendas' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Suporte', value: 'suporte' },
];
```

O marcador de obrigatório e a mensagem de erro vêm de [`provideUiLabels`](../../labels/labels.md) (`labels.required`, `labels.requiredError`); use `requiredLabel`/`requiredError` só para trocar numa instância.

---

## Variações de exemplo

### Com filtro
```html
<app-select
  label="Categoria"
  placeholder="Selecione"
  [filterable]="true"
  filterPlaceholder="Filtrar categorias"
  [options]="options()"
  [value]="categoriaFilter()"
  (valueChange)="categoriaFilter.set($event)">
</app-select>
```

### Desabilitado
```html
<app-select
  label="Categoria"
  [disabled]="true"
  [options]="options()"
  [value]="'o1'">
</app-select>
```

### Sem placeholder
```html
<!-- o marcador "obrigatório" e a mensagem de erro vêm de provideUiLabels -->
<app-select
  label="Categoria"
  [required]="true"
  [options]="options()"
  [value]="categoria()"
  (valueChange)="categoria.set($event)">
</app-select>
```

### Não obrigatório
```html
<app-select
  label="Categoria"
  [options]="options()"
  placeholder="Selecione"
  [value]="categoriaNoReq()"
  (valueChange)="categoriaNoReq.set($event)">
</app-select>
```

### Clearable (limpar seleção)
```html
<app-select
  label="Categoria"
  placeholder="Selecione"
  [clearable]="true"
  [options]="options()"
  [value]="categoriaClear()"
  (valueChange)="categoriaClear.set($event)">
</app-select>
```

> O nome do botão de limpar vem de `labels.clearSelection` ([`provideUiLabels`](../../labels/labels.md)); `clearAriaLabel` troca numa instância.

### Grupos e typeahead

```ts
foods: SelectOption<string>[] = [
  { label: 'Banana',  value: 'banana',  group: 'Frutas' },
  { label: 'Cenoura', value: 'carrot',  group: 'Legumes' },
  { label: 'Abacaxi', value: 'pineapple', group: 'Frutas' }, // vai para junto de "Frutas"
  { label: 'Batata',  value: 'potato',  group: 'Legumes', disabled: true },
];
```

```html
<app-select label="Alimento" [options]="foods" [(value)]="alimento" />
```

Os grupos aparecem na ordem em que surgem na lista; opções sem `group` ficam fora de qualquer título. O typeahead já vem ligado, sem configuração: com o campo focado, digite `c` para escolher "Cenoura".

### Formulários (Reactive Forms e `ngModel`)
O componente implementa `ControlValueAccessor`, então funciona com `formControl`, `formControlName` e `[(ngModel)]`:

```ts
categoria = new FormControl<string | null>(null, Validators.required);

erroCategoria(): string | null {
  const c = this.categoria;
  return c.touched && c.hasError('required') ? 'Campo obrigatório' : null;
}
```

```html
<app-select
  label="Categoria"
  [required]="true"
  [autoValidate]="false"
  [options]="options()"
  [formControl]="categoria"
  [error]="erroCategoria()">
</app-select>

<!-- ou template-driven -->
<app-select label="Categoria" [options]="options()" [(ngModel)]="categoria"></app-select>
```

- Selecionar ou limpar atualiza o controle (`dirty`); fechar o painel ou sair do campo marca como `touched`.
- `disable()`/`enable()` do controle desabilitam o campo e fecham o painel.
- A validação fica no formulário (`Validators.required`). `[required]` só exibe o selo “requerido”; use `[autoValidate]="false"` e passe a mensagem em `[error]` para não duplicar a validação interna.
- Não combine `[value]`/`(valueChange)` com `formControl`/`ngModel` no mesmo campo.

---

## API

### Inputs
| Propriedade         | Tipo                |                Padrão | Descrição                                                  |
| ------------------- | ------------------- | --------------------: | ---------------------------------------------------------- |
| `label`             | `string`            |                  `''` | Rótulo acima do campo.                                     |
| `required`          | `boolean`           |               `false` | Exibe o selo “requerido” e ativa validação de obrigatório. |
| `placeholder`       | `string`            |                  `''` | Texto quando nada selecionado.                             |
| `disabled`          | `boolean`           |               `false` | Desabilita interação. Com formulários, prefira `control.disable()`. |
| `filterable`        | `boolean`           |               `false` | Mostra campo de filtro no painel.                          |
| `filterPlaceholder` | `string`            |                  `''` | Placeholder do filtro (quando `filterable`).               |
| `clearable`         | `boolean`           |               `false` | Mostra um botão (×) para limpar a seleção.                 |
| `error`             | `string \| null`    |                `null` | Mensagem de erro externa (prioritária).                    |
| `requiredLabel`     | `string`            | `labels.required` | Texto ao lado do label quando `required`.                  |
| `requiredError`     | `string`            | `labels.requiredError` | Mensagem interna de obrigatório.                           |
| `autoValidate`      | `boolean`           |                `true` | Valida ao desfocar/fechar o painel.                        |
| `responsive`        | `'auto' \| 'menu' \| 'sheet'` |              `'auto'` | `auto`: vira *sheet* (painel de baixo) até `sheetBreakpoint` px; `menu`/`sheet` fixam um dos dois. |
| `sheetBreakpoint`   | `number`            |                 `560` | Largura máxima (px) da janela para o modo *sheet* em `auto`. |
| `hint`              | `string \| null`    |                `null` | Texto auxiliar abaixo do campo (quando não há erro).       |
| `emptyMessage`      | `string`            | `labels.noOptions` | Mensagem do painel sem opções (ex.: busca sem resultado), mostrada e anunciada. |
| `options`           | `SelectOption<T>[]` |                     — | Lista de opções `{ label, value, disabled?, group? }`.           |
| `value`             | `T \| null`         |                `null` | Valor selecionado (sem formulários).                       |

### Outputs
| Evento        | Payload     | Quando dispara                                                     |
| ------------- |-------------| ------------------------------------------------------------------ |
| `valueChange` | `T \| null` | Ao selecionar uma opção (ou ao limpar, o componente emite `null`). |

---

## Acessibilidade

- **Botão** control: `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` (só com a lista aberta, quando ela existe) e `aria-invalid` quando há erro.
- **Dica e erro**: o botão aponta para a mensagem que está na tela (`aria-describedby`): o erro, quando há, senão a dica. Ao focar, o leitor de tela lê o motivo do erro, não só "inválido".
- **Lista**: `role="listbox"`, itens com `role="option"` e `aria-selected`; a opção destacada é anunciada (`aria-activedescendant`). O filtro e o cabeçalho da folha ficam fora da lista (um listbox só contém opções e grupos); o filtro aponta para ela (`aria-controls`).
- **Busca sem resultado**: o painel mostra `emptyMessage` (`labels.noOptions`, "No options found" por padrão) e a mensagem é anunciada numa região `role="status"`, sem tirar o foco do filtro.
- **Rótulo**: o `label` nomeia o botão (junto com o valor: "Comida, Banana") e a lista (`aria-labelledby`). Ao abrir, o foco vai para a busca ou para a lista.
- Fecha com **Escape**, clique fora e ao selecionar.
- **Menu e folha se comportam diferente**, de propósito:
  - **menu** (popup sob o campo): fecha quando o foco sai do Select (`Tab`, clique em outro campo), sem roubar o foco de onde ele foi;
  - **folha** (celular, com fundo escurecido): é um **modal**. O resto da página fica inerte e sem rolagem, o `Tab` circula só dentro dela, e **toda** forma de fechar (×, tocar no fundo, `Esc`, escolher) devolve o foco ao campo. Se a janela mudar de tamanho com o painel aberto (menu ↔ folha), o comportamento acompanha.
- **Teclado**: `Enter`/`Space` abre; no painel use `↑/↓` para navegar, `Home/End` para extremos e `Enter` para escolher.
- **Typeahead**: com o campo focado e fechado, digitar escolhe a primeira opção cujo rótulo começa com o texto (sem acento/caixa), sem abrir o painel; repetir a mesma letra alterna entre as opções com essa inicial. Com o painel aberto, digitar só move o destaque (`Enter` confirma). Opções desabilitadas são puladas; a busca recomeça após 500 ms sem digitar. Com `filterable`, o texto vai para o filtro.
- **Foco**: ao selecionar, o foco retorna ao botão.
- **Limpar** (`clearable`): o botão é focável e tem nome (`labels.clearSelection`, "Clear selection" por padrão). **Enter/Space** limpa e devolve o foco ao botão do controle.


---

## Mobile / Responsividade

Com `responsive="auto"` (padrão), em janelas de até `sheetBreakpoint` px (560) o painel vira uma **sheet** (painel de baixo), com título (`panelTitle`, ou o `label`) e botão de fechar; acima disso, é a lista suspensa. `responsive="menu"` ou `"sheet"` fixam um dos dois. O campo de filtro fica “grudado” no topo do painel, os itens têm área de toque confortável e rolagem suave.

---

## Theming (CSS Vars)

O Select usa estas variáveis (podem ser sobrescritas por escopo):

| Var                     | Uso                   | Sugerido (claro)                                     | Sugerido (escuro)                                    |
| ----------------------- | --------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| `--sel-bg`              | fundo do controle     | `var(--surface)`                                     | `var(--surface)`                                     |
| `--sel-fg`              | texto do controle     | `var(--fg)`                                          | `var(--fg)`                                          |
| `--sel-border`          | borda do controle     | `var(--border)`                                      | `var(--border)`                                      |
| `--sel-placeholder`     | texto placeholder     | `color-mix(in srgb, var(--fg) 55%, transparent)`     | idem                                                 |
| `--sel-caret`           | setinha ▾             | `var(--muted)`                                       | `var(--muted)`                                       |
| `--sel-disabled-bg`     | fundo desabilitado    | `var(--surface-2)`                                   | `#0f1720`                                            |
| `--sel-disabled-border` | borda desabilitado    | `var(--border)`                                      | `var(--border)`                                      |
| `--sel-error`           | cor de erro           | `#e11d48`                                            | `#fb7185`                                            |
| `--sel-focus-ring`      | anel de foco          | `color-mix(in srgb, var(--accent) 35%, transparent)` | `color-mix(in srgb, var(--accent) 55%, transparent)` |
| `--sel-menu-bg`         | fundo do painel       | `var(--surface)`                                     | `var(--surface)`                                     |
| `--sel-menu-border`     | borda do painel       | `var(--border)`                                      | `var(--border)`                                      |
| `--sel-scrollbar-thumb` | trilho do scrollbar   | `color-mix(in srgb, var(--accent) 35%, #cbd5e1)`     | `color-mix(in srgb, var(--accent) 35%, #334155)`     |
| `--sel-option-hover`    | hover/active de opção | `color-mix(in srgb, var(--accent) 12%, transparent)` | `color-mix(in srgb, var(--accent) 18%, transparent)` |
| `--sel-option-active`   | item selecionado      | `color-mix(in srgb, var(--accent) 20%, white)`       | `color-mix(in srgb, var(--accent) 22%, #0b1220)`     |

---

## Textos
O Select não depende de nenhuma biblioteca de tradução. Os textos que você passa (`label`, `placeholder`, `hint`, `filterPlaceholder`, `panelTitle`, as opções) já vêm no idioma da sua app. Os textos internos vêm de [`provideUiLabels`](../../labels/labels.md), em inglês por padrão, e cada um tem um input para trocar numa instância:

| Texto | Label | Input |
|---|---|---|
| Marcador ao lado do rótulo quando `required` | `labels.required` | `requiredLabel` |
| Mensagem de obrigatório | `labels.requiredError` | `requiredError` |
| Nome do botão de limpar (×) | `labels.clearSelection` | `clearAriaLabel` |
| Nome do botão de fechar a folha (celular) | `labels.close` | `closeAriaLabel` |
| Título da folha, sem `panelTitle` nem `label` | `labels.selectTitle` | `panelTitle` |
| Nome do campo de filtro | `labels.filterOptions` | — |
| Painel sem opções (busca sem resultado) | `labels.noOptions` | `emptyMessage` |

---

## Checklist de QA
- Alternar accents/temas não muda layout (sem *jank*).
- Contraste ≥ 4.5:1 no texto do controle, itens selecionados e cabeçalho do painel.
- Fechar com `Escape`/clique externo sempre.
- Navegação por teclado coerente com `role="listbox"`.
- Leitores de tela anunciam item selecionado (testar NVDA/JAWS/VoiceOver).
- **Clearable**: botão de limpar visível com valor, focável e com `aria-label`; limpar emite `null`. 
- **Mobile**: alvos de toque confortáveis; painel não “estoura” a viewport; filtro permanece visível no topo.

---

## Limitações conhecidas

- **Sem carregamento remoto**: as opções chegam prontas em `options` (para filhos sob demanda, veja o [TreeSelect](../tree-select/tree-select.md)).
- **Sem virtual scroll**: listas muito grandes renderizam todas as opções.
- **Painel no fluxo da página**: um container com `overflow: hidden` pode cortá-lo (não há portal/overlay).

---

## Licença

MIT — use e adapte à vontade dentro do projeto.
