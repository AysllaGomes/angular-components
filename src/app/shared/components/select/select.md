<p align="right"><a href="./select.en.md">English</a></p>

# Select — Componente de seleção acessível (Angular, standalone)

Componente de **select** leve, acessível e tematizável por **CSS Variables**. Suporta **filtro** no painel, navegação por teclado, validação de obrigatório e integração simples com i18n. Mantém compatibilidade com os tokens globais de tema/acentos.

> Esta doc descreve a API atual do componente enviado por você. Onde coube, deixei sugestões de melhorias opcionais no final.

---

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

### Novo: Clearable (limpar seleção)
```html
<app-select
  [label]="'select.label' | t"
  [placeholder]="'select.placeholder' | t"
  [clearable]="true"
  [options]="options()"
  [value]="categoriaClear()"
  (valueChange)="categoriaClear.set($event)">
</app-select>
```

> Dica: para tradução do rótulo do botão de limpar, use a chave `select.clear`.

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
| `requiredLabel`     | `string`            |         `'requerido'` | Texto ao lado do label quando `required`.                  |
| `requiredError`     | `string`            | `'Campo obrigatório'` | Mensagem interna de obrigatório.                           |
| `autoValidate`      | `boolean`           |                `true` | Valida ao desfocar/fechar o painel.                        |
| `hint`              | `string \| null`    |                `null` | Texto auxiliar abaixo do campo (quando não há erro).       |
| `options`           | `SelectOption<T>[]` |                     — | Lista de opções `{ label, value, disabled?, group? }`.           |
| `value`             | `T \| null`         |                `null` | Valor selecionado (sem formulários).                       |

### Outputs
| Evento        | Payload     | Quando dispara                                                     |
| ------------- |-------------| ------------------------------------------------------------------ |
| `valueChange` | `T \| null` | Ao selecionar uma opção (ou ao limpar, o componente emite `null`). |

---

## Acessibilidade

- **Botão** control: `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`, `aria-invalid` quando há erro.
- **Lista**: `role="listbox"`, itens com `role="option"` e `aria-selected`.
- **Rótulo**: o `label` nomeia o botão (junto com o valor: "Comida, Banana") e a lista (`aria-labelledby`). Ao abrir, o foco vai para a busca ou para a lista.
- Fecha com **Escape**, clique fora e ao selecionar.
- **Teclado**: `Enter`/`Space` abre; no painel use `↑/↓` para navegar, `Home/End` para extremos e `Enter` para escolher.
- **Typeahead**: com o campo focado e fechado, digitar escolhe a primeira opção cujo rótulo começa com o texto (sem acento/caixa), sem abrir o painel; repetir a mesma letra alterna entre as opções com essa inicial. Com o painel aberto, digitar só move o destaque (`Enter` confirma). Opções desabilitadas são puladas; a busca recomeça após 500 ms sem digitar. Com `filterable`, o texto vai para o filtro.
- **Foco**: ao selecionar, o foco retorna ao botão.
- **Novo (clearable)**: o botão de limpar é focável e tem `aria-label="{{ 'select.clear' | t }}"`. Em teclado, **Enter/Space** limpa e retorna o foco ao botão do controle.

> 💡 *Upgrade opcional*: adicionar `aria-activedescendant` no listbox apontando para o item destacado melhora a leitura por leitores de tela.
>
> ```html
> <div
>   role="listbox"
>   [attr.aria-activedescendant]="highlighted()>=0 ? optionId(highlighted()) : null">
> </div>
> ```

---

## Mobile / Responsividade

Sem props adicionais: no mobile o painel usa altura amigável à viewport e o campo de filtro fica “grudado” no topo do painel. Os itens têm área de toque confortável e rolagem suave. Se necessário, você pode ajustar via CSS (ex.: @media (max-width: 480px) aumentando o padding das opções ou limitando a altura do painel).

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

## i18n (chaves usadas)
- `section.select.title`, `section.select.lead`
- `select.demo.*.title`
- `select.label`, `select.placeholder`, `select.filter.placeholder`
- `form.required.label`, `form.required.error`, `form.hint`
- `select.option.*` (labels das opções)
- Novo: `select.clear`

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

## Ideias de evolução

- [x] **ControlValueAccessor** (`formControlName`/`ngModel`) e estados `touched/dirty` do Angular Forms.
- [x] **Clear button** opcional (×) dentro do controle.
- [x] **Typeahead**: digitar seleciona (fechado) ou destaca (aberto) a opção.
- [x] **Grupos** (campo `group`, com `role="group"`).
- [ ] **Async** (carregamento remoto) + esqueleto dentro do painel.
- [ ] **Virtual scroll** para listas grandes.
- [ ] **Portal/Overlay** opcional para flutuar fora do fluxo (evitar `overflow: hidden` do container).

---

## Licença

MIT — use e adapte à vontade dentro do projeto.
