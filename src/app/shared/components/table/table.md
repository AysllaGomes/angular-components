# Table (HTML + Sass, Standalone Angular)

Uma **tabela personalizável** com seleção por checkbox, coluna de ações, _chips_ e células customizáveis — tudo em **HTML + Sass**, exposta como componente **standalone** (sem framework de UI).

---

## Recursos

- **Colunas declarativas** via `ColumnDef` (texto, chip ou custom);
- **Seleção**: checkbox por linha + “selecionar tudo”;
- **Ações**: coluna de ações com *slot* (`appActions`) para seus botões/ícones;
- **Células custom**: *slot* por coluna (`appCell="chave"`) com contexto (`value`, `row`, `index`);
- **Chips**: mapeamento valor → rótulo + variante de cor (`chipMap`);
- **Theming** por **CSS Custom Properties** (fácil de casar com seu DS);
- **Acessibilidade**: tabela semântica, `aria-label` nos checkboxes/ações, _header_ “sticky”.

---

## Arquivos

```
src/app/shared/components/table/
  ├─ table.component.ts
  ├─ table.component.html
  ├─ table.component.sass
  └─ table.directives.ts   # appCell e appActions (standalone)
```

---

## Uso básico

### 1) Template
```html
<app-table
  [columns]="columns"
  [data]="rows"
  [selectable]="true"
  [showActions]="true"
  [selected]="selected()"
  (selectedChange)="selected.set($event)"
  (action)="onEdit($event.row, $event.index)">

  <!-- célula custom (opcional) -->
  <!-- <ng-template appCell="documento" let-value>{{ value }}</ng-template> -->

  <!-- ações custom (substitui o padrão) -->
  <ng-template appActions let-row let-index="index">
    <button class="icon-btn icon-btn--ghost"
            type="button"
            (click)="onEdit(row, index)"
            aria-label="Editar">
      <img src="/icons/svg/pen-box.svg" width="18" height="18" alt="Editar" />
    </button>
  </ng-template>
</app-table>
```

### 2) Componente
```ts
type Tipo = 'Correntista' | 'Não correntista';

interface AdicionalRow {
  nome: string;
  tipo: Tipo;
  documento: string;
  limite: string;
  nomeImpresso: string;
}

columns: ColumnDef<AdicionalRow>[] = [
  { key: 'nome', header: 'Nome do adicional' },
  {
    key: 'tipo', header: 'Tipo de adicional', type: 'chip', align: 'center', width: '180px',
    chipMap: {
      'Correntista':     { label: 'Correntista',     variant: 'orange' },
      'Não correntista': { label: 'Não correntista', variant: 'teal'   },
    }
  },
  { key: 'documento',   header: 'Documento',         width: '160px' },
  { key: 'limite',      header: 'Limite atribuído',  width: '220px' },
  { key: 'nomeImpresso',header: 'Nome impresso',     width: '180px' },
];
```
> Dica: `rows` é um array de qualquer tipo; `key` das colunas deve bater com as chaves do objeto. Para célula custom, use `<ng-template appCell="nomeDaChave" ...>`.

---

## API

### Types
```ts
export type Align = 'left' | 'center' | 'right';
export type CellType = 'text' | 'chip' | 'custom';

export interface ChipMapEntry {
  label: string;
  variant?: string; // 'teal' | 'orange' | etc. (defina no CSS)
}

export interface ColumnDef<T = any> {
  key: keyof T | string;
  header: string;
  type?: CellType;
  width?: string;
  align?: Align;
  chipMap?: Record<string, ChipMapEntry>; // para type='chip'
}
```

### Inputs
| Propriedade   | Tipo              | Padrão | Descrição |
|---------------|-------------------|:------:|-----------|
| `data`        | `T[]`             |   —    | Linhas da tabela. |
| `columns`     | `ColumnDef<T>[]`  |   —    | Colunas declarativas. |
| `selectable`  | `boolean`         | `false`| Mostra checkbox por linha e “selecionar tudo”. |
| `showActions` | `boolean`         | `false`| Mostra coluna de ações. |
| `selected`    | `number[]`        | `[]`   | Índices selecionados (controlado). |

### Outputs
| Evento             | Payload     | Quando dispara |
|--------------------|-------------|----------------|
| `selectedChange`   | `number[]`  | Alterou seleção (linha ou “selecionar tudo”). |
| `action`           | `{ type: string; row: T; index: number }` | Clique em ação **padrão** (se você optar por usá-la). |

### Templates projetáveis
- **Célula custom (`appCell`)**  
  Contexto: `$implicit` (valor), `row` (linha), `index` (índice).
  ```html
  <ng-template appCell="documento" let-value let-row="row" let-index="index">
    {{ value }}
  </ng-template>
  ```

- **Ações (`appActions`)**  
  Contexto: `row`, `index`. Substitui a ação padrão.
  ```html
  <ng-template appActions let-row let-index="index">
    <button class="icon-btn icon-btn--ghost" (click)="onEdit(row, index)">✏️</button>
  </ng-template>
  ```

---

## Theming (CSS Custom Properties)

Defina/ajuste tokens no seu `styles.sass` ou wrapper da página:

```sass
:root
  --tbl-header-bg: #07363c
  --tbl-header-fg: #ffffff
  --tbl-row-bg: #f2f5f7
  --tbl-row-gray-medium: #ffffff
  --tbl-row-border: #e6e9ed
  --tbl-fg: #0f1720
  --tbl-muted: #6b7280
  --tbl-action: #058075     // cor dos ícones de ação

  // chips
  --chip-radius: 9999px
  --chip-h: 24px
  --chip-pad-x: .6rem
  --chip-fs: .8rem

  // variações de chip (exemplos)
  --chip-teal-border: #087a6a
  --chip-teal-bg: #e8f6f3
  --chip-teal-fg: #0b5f54

  --chip-orange-border: #d17b30
  --chip-orange-bg: #fff2e8
  --chip-orange-fg: #9f5313
```

No Sass do componente (`table.component.sass`) essas variáveis já são usadas para header, linhas alternadas, bordas, chips e botões.

---

## Estilos dos botões de ação

Para evitar borda/fundo nativos e deixar “ghost”:
```sass
.icon-btn
  appearance: none
  -webkit-appearance: none
  border: 0
  background: none
  box-shadow: none
  padding: 0
  width: 32px
  height: 32px
  display: inline-grid
  place-items: center
  border-radius: .5rem
  cursor: pointer
  color: var(--tbl-action, #058075)

.icon-btn--ghost
  border: 0
  background: transparent
  &:hover
    background: color-mix(in oklab, var(--tbl-action, #058075) 12%, transparent)
  &:focus-visible
    outline: 2px solid color-mix(in oklab, var(--tbl-action, #058075) 40%, white)
    outline-offset: 2px
```
> **Evite** o reset global `button { border: none !important; background: transparent; }` — ele afeta o projeto inteiro (ex.: botões do Stepper). Prefira escopar no componente (`.icon-btn`) ou por container (`.tbl .icon-btn`).

---

## Dicas & Solução de problemas

- **Asset 404**: se usa `public/` como assets no `angular.json`, coloque o SVG em `public/icons/svg/pen-box.svg` e referencie com caminho **absoluto** `/icons/svg/pen-box.svg`. Se preferir `src/assets`, inclua essa pasta na seção de `assets` do `angular.json` e use `/assets/...`.
- **Cor do ícone**: se usar `<img>`, a cor vem do próprio arquivo. Para herdar do CSS, use **SVG inline** com `fill="currentColor"` ou use máscara CSS.
- **Types no template**: use `$any(...)` em vez de casts TypeScript (ex.: `$any(row)[$any(col).key]`).

---

## Acessibilidade

- `aria-label` em **todos** os checkboxes e botões de ação;
- Cabeçalho `<thead>` claro, `th` com texto curto;
- Foco visível no botão (`:focus-visible`);
- Evite usar `pointer-events: none` em célula desabilitada — prefira desabilitar o controle em si.

---

## Roadmap

- [ ] Ordenação por coluna;
- [ ] Empty/Loading/Error states;
- [ ] Paginação;
- [ ] Ações em massa (com as linhas selecionadas);
- [ ] Responsivo com colunas colapsáveis.

---

## Licença

MIT — use e adapte à vontade dentro do projeto.
