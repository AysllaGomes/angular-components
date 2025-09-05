<p align="right"><a href="./select.en.md">English</a></p>

# Select — Componente de seleção acessível (Angular, standalone)

Componente de **select** leve, acessível e tematizável por **CSS Variables**. Suporta **filtro** no painel, navegação por teclado, validação de obrigatório e integração simples com i18n.

> Esta doc descreve a API atual do componente enviado por você. Onde coube, deixei sugestões de melhorias opcionais no final.

---

## Recursos
- Standalone (`@Component({ standalone: true })`), sem dependências de UI externas.
- **Filtro (search)** opcional no painel, acento/maiúsculas-insensível.
- **Acessibilidade**: `role="listbox"`/`role="option"`, `aria-expanded`, `aria-selected`, `aria-invalid`, fecha em *Escape* e clique externo, foco gerenciado.
- **Teclado**: setas ↑/↓, Home/End, Enter, Escape, Tab/Shift+Tab.
- **Temas**: herda tokens globais (`--accent`, `--surface`, `--fg` etc.) e permite overrides via `--sel-*`.
- **Validação**: erro externo (`error`) tem prioridade; erro interno de obrigatório quando `required` e `autoValidate`.

---

## Uso básico

```html
<app-select
  [label]="'select.label' | t"
  [placeholder]="'select.placeholder' | t"
  [required]="true"
  [requiredLabel]="'form.required.label' | t"
  [requiredError]="'form.required.error' | t"
  [options]="options()"
  [value]="categoria()"
  (valueChange)="categoria.set($event)"
  [hint]="'form.hint' | t">
</app-select>
```

```ts
options = computed<SelectOption<string>[]>(() => [
  { label: i18n.t('select.option.hover'), value: 'hover' },
  { label: i18n.t('select.option.o1'),    value: 'o1' },
  { label: i18n.t('select.option.o2'),    value: 'o2' },
]);
```

---

## Variações de exemplo

### Com filtro
```html
<app-select
  [label]="'select.label' | t"
  [placeholder]="'select.placeholder' | t"
  [filterable]="true"
  [filterPlaceholder]="'select.filter.placeholder' | t"
  [options]="options()"
  [value]="categoriaFilter()"
  (valueChange)="categoriaFilter.set($event)">
</app-select>
```

### Desabilitado
```html
<app-select
  [label]="'select.label' | t"
  [disabled]="true"
  [options]="options()"
  [value]="'o1'">
</app-select>
```

### Sem placeholder
```html
<app-select
  [label]="'select.label' | t"
  [required]="true"
  [requiredLabel]="'form.required.label' | t"
  [requiredError]="'form.required.error' | t"
  [options]="options()"
  [value]="categoria()"
  (valueChange)="categoria.set($event)">
</app-select>
```

### Não obrigatório
```html
<app-select
  [label]="'select.label' | t"
  [options]="options()"
  [placeholder]="'select.placeholder' | t"
  [value]="categoriaNoReq()"
  (valueChange)="categoriaNoReq.set($event)">
</app-select>
```

---

## API

### Inputs
| Propriedade | Tipo | Padrão | Descrição |
|---|---|---:|---|
| `label` | `string` | `''` | Rótulo acima do campo. |
| `required` | `boolean` | `false` | Exibe o selo “requerido” e ativa validação de obrigatório. |
| `placeholder` | `string` | `''` | Texto quando nada selecionado. |
| `disabled` | `boolean` | `false` | Desabilita interação. |
| `filterable` | `boolean` | `false` | Mostra campo de filtro no painel. |
| `filterPlaceholder` | `string` | `''` | Placeholder do filtro (quando `filterable`). |
| `error` | `string \| null` | `null` | Mensagem de erro externa (prioritária). |
| `requiredLabel` | `string` | `'requerido'` | Texto ao lado do label quando `required`. |
| `requiredError` | `string` | `'Campo obrigatório'` | Mensagem interna de obrigatório. |
| `autoValidate` | `boolean` | `true` | Valida ao desfocar/fechar o painel. |
| `hint` | `string \| null` | `null` | Texto auxiliar abaixo do campo (quando não há erro). |
| `options` | `SelectOption<T>[]` | — | Lista de opções `{ label, value, disabled? }`. |
| `value` | `T \| null` | `null` | Valor selecionado. |

### Outputs
| Evento | Payload | Quando dispara |
|---|---|---|
| `valueChange` | `T` | Ao selecionar uma opção. |

---

## Acessibilidade

- **Botão** control: `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`, `aria-invalid` quando há erro.
- **Lista**: `role="listbox"`, itens com `role="option"` e `aria-selected`.
- Fecha com **Escape**, clique fora e ao selecionar.
- **Teclado**: `Enter`/`Space` abre; no painel use `↑/↓` para navegar, `Home/End` para extremos e `Enter` para escolher.
- **Foco**: ao selecionar, o foco retorna ao botão.

> 💡 *Upgrade opcional*: adicionar `aria-activedescendant` no listbox apontando para o item destacado melhora a leitura por leitores de tela.
>
> ```html
> <div
>   role="listbox"
>   [attr.aria-activedescendant]="highlighted()>=0 ? optionId(highlighted()) : null">
> </div>
> ```

---

## Theming (CSS Vars)

O Select usa as seguintes variáveis (comportam overrides em escopos específicos):

| Var | Uso | Sugerido (claro) | Sugerido (escuro) |
|---|---|---|---|
| `--sel-bg` | fundo do controle | `var(--surface)` | `var(--surface)` |
| `--sel-fg` | texto do controle | `var(--fg)` | `var(--fg)` |
| `--sel-border` | borda do controle | `var(--border)` | `var(--border)` |
| `--sel-placeholder` | texto placeholder | `color-mix(in srgb, var(--fg) 55%, transparent)` | idem |
| `--sel-caret` | setinha ▾ | `var(--muted)` | `var(--muted)` |
| `--sel-disabled-bg` | fundo desabilitado | `var(--surface-2)` | `#0f1720` |
| `--sel-disabled-border` | borda desabilitado | `var(--border)` | `var(--border)` |
| `--sel-error` | cor de erro | `#e11d48` | `#fb7185` |
| `--sel-focus-ring` | anel de foco | `color-mix(in srgb, var(--accent) 35%, transparent)` | `color-mix(in srgb, var(--accent) 55%, transparent)` |
| `--sel-menu-bg` | fundo do painel | `var(--surface)` | `var(--surface)` |
| `--sel-menu-border` | borda do painel | `var(--border)` | `var(--border)` |
| `--sel-scrollbar-thumb` | trilho do scrollbar | `color-mix(in srgb, var(--accent) 35%, #cbd5e1)` | `color-mix(in srgb, var(--accent) 35%, #334155)` |
| `--sel-option-hover` | hover/active de opção | `color-mix(in srgb, var(--accent) 12%, transparent)` | `color-mix(in srgb, var(--accent) 18%, transparent)` |
| `--sel-option-active` | item selecionado | `color-mix(in srgb, var(--accent) 20%, white)` | `color-mix(in srgb, var(--accent) 22%, #0b1220)` |

Exemplo rápido (global):
```sass
:root
  --sel-bg: var(--surface)
  --sel-fg: var(--fg)
  --sel-border: var(--border)
  --sel-placeholder: color-mix(in srgb, var(--fg) 55%, transparent)
  --sel-caret: var(--muted)
  --sel-disabled-bg: var(--surface-2)
  --sel-disabled-border: var(--border)
  --sel-error: #e11d48
  --sel-focus-ring: color-mix(in srgb, var(--accent) 35%, transparent)
  --sel-menu-bg: var(--surface)
  --sel-menu-border: var(--border)
  --sel-scrollbar-thumb: color-mix(in srgb, var(--accent) 35%, #cbd5e1)
  --sel-option-hover: color-mix(in srgb, var(--accent) 12%, transparent)
  --sel-option-active: color-mix(in srgb, var(--accent) 20%, white)

:root[data-theme="dark"]
  --sel-focus-ring: color-mix(in srgb, var(--accent) 55%, transparent)
  --sel-scrollbar-thumb: color-mix(in srgb, var(--accent) 35%, #334155)
  --sel-option-hover: color-mix(in srgb, var(--accent) 18%, transparent)
  --sel-option-active: color-mix(in srgb, var(--accent) 22%, #0b1220)
```

---

## i18n (chaves usadas)
- `section.select.title`, `section.select.lead`
- `select.demo.*.title`
- `select.label`, `select.placeholder`, `select.filter.placeholder`
- `form.required.label`, `form.required.error`, `form.hint`
- `select.option.*` (labels das opções)

---

## Checklist de QA
- Alternar accents/temas não muda layout (sem *jank*).
- Contraste ≥ 4.5:1 no texto do controle, itens selecionados e cabeçalho do painel.
- Fechar com `Escape`/clique externo sempre.
- Navegação por teclado coerente com `role="listbox"`.
- Leitores de tela anunciam item selecionado (testar NVDA/JAWS/VoiceOver).

---

## Ideias de evolução
- [ ] **ControlValueAccessor** (`formControlName`/`ngModel`) e estados `touched/dirty` do Angular Forms.
- [ ] **Clear button** opcional (×) dentro do controle.
- [ ] **Typeahead “fechado”**: digitar com o painel fechado seleciona o primeiro match.
- [ ] **Groups** (optgroup) e separadores.
- [ ] **Async** (carregamento remoto) + esqueleto dentro do painel.
- [ ] **Virtual scroll** para listas grandes.
- [ ] **Portal/Overlay** opcional para flutuar fora do fluxo (evitar `overflow: hidden` do container).

---

## Licença

MIT — use e adapte à vontade dentro do projeto.

