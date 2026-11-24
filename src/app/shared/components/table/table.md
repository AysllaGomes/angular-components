<p align="right"><a href="./table.en.md">English</a></p>

# Table (HTML + Sass, Standalone Angular)

> Textos padrão em **inglês**, trocáveis num lugar só com [`provideUiLabels`](../../labels/labels.md) (`labels.*` nas tabelas abaixo); o input de cada instância vence.

Uma **tabela personalizável** com seleção por checkbox, coluna de ações, _chips_ e células customizáveis — tudo em **HTML + Sass**, exposta como componente **standalone** (sem framework de UI).

---

## Por que existe

Tabelas de dados juntam muitas necessidades de uma vez: selecionar linhas (inclusive entre páginas), agir sobre uma ou várias, ordenar, paginar, avisar quando está carregando, vazia ou com erro, e continuar legível em telas estreitas. Feito à mão, isso costuma deixar o teclado, o leitor de tela e o foco para depois. Esta tabela reúne esses recursos sobre um `<table>` de verdade, sem biblioteca, e cada um é opcional.

## Quando usar

### Use quando

- Os dados têm linhas e colunas que a pessoa compara ou percorre.
- É preciso selecionar linhas e agir sobre elas, uma a uma ou em massa.
- A lista é longa: pagine no navegador ou no servidor.

### Prefira outro

- Poucos itens, sem colunas para comparar: uma lista simples (`<ul>`) é mais leve.
- Escolher um item para preencher um campo: use o [Select](../select/select.md).
- Escolher em dados hierárquicos: use o [TreeSelect](../tree-select/tree-select.md).

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar a Tabela em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/table/` |
| Componentes que ele usa | `components/button/`, `components/pagination/`, `components/tooltip/` |
| Textos padrão | `labels/` ([Textos dos componentes](../../labels/labels.md)) |

Estilos globais: acrescente no `styles.sass` (ou `styles.scss`) do seu projeto:

```sass
@use '<sua-pasta>/shared/components/button/button' as *
@use '<sua-pasta>/shared/components/tooltip/tooltip'
```

Depende só de `@angular/common`, `@angular/core`. Ao todo: 24 arquivos, ~2866 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

## Recursos

- **Colunas declarativas** via `ColumnDef` (texto, chip ou custom).
- **Seleção**: checkbox por linha + “selecionar tudo”.
- **Paginação integrada**: local ou no servidor, com intervalo, “Itens por página” e páginas (`paginate`).
- **Colunas que se recolhem**: sem espaço, somem as de `priority` mais alta e os valores vão para “Mostrar detalhes”.
- **Ações em massa**: barra acima da tabela (“3 selecionados”, Limpar seleção e botões; sem seleção, `bulkBarIdle` decide: espaço guardado, texto ou escondida), via `[bulkActions]` ou *slot* `appBulkActions`.
- **Ações**:
  - **Declarativas** via `[actions]` (ex.: `['edit', 'delete']`) com ícones padrão.
  - **Customizadas** via *slot* `appActions` quando você precisa de controle total do markup.
  - `appActions` **sobrepõe** `[actions]` quando ambos forem usados.
- **Células custom**: *slot* por coluna (`appCell="chave"`) com contexto (`value`, `row`, `index`).
- **Chips**: mapeamento valor → rótulo + variante de cor (`chipMap`).
- **Theming** por **CSS Custom Properties** (fácil de casar com seu DS).
- **Acessibilidade**: tabela semântica, `aria-label` nos checkboxes/ações, _header_ “sticky”.

---

## Arquivos

```
src/app/shared/components/table/
  ├─ table.component.ts
  ├─ table.component.html
  ├─ table.component.sass
  ├─ table-bulk-bar.component.*   # barra de ações em massa (uso interno)
  ├─ table-footer.component.*     # rodapé paginado (uso interno)
  ├─ table-detail.component.ts    # linha de detalhes das colunas recolhidas (uso interno)
  └─ table.directives.ts   # appCell, appActions e appBulkActions (standalone)
```

---

## Uso

### Opção A — Ações **declarativas** (recomendado para casos simples)
```html
<app-table
  [columns]="columns"
  [data]="rows"
  [selectable]="true"
  [actions]="['edit']"
  [selected]="selected()"
  (selectedChange)="selected.set($event)"
  (action)="onAction($event)">
</app-table>
```

```ts
// evento único para todas as ações declarativas
onAction(e: { type: 'edit' | 'delete' | 'view' | 'download'; row: AdicionalRow; index: number }) {
  if (e.type === 'edit') this.onEdit(e.row, e.index);
}
```

> Quer usar um **asset** específico para um ícone?  
> Passe um objeto em vez da string:
```ts
actions = [{ kind: 'edit', ariaLabel: 'Editar', iconUrl: '/icons/svg/pen-box.svg' }];
```

#### Dica e ação indisponível

Cada botão de ação mostra o nome numa dica ([`appTooltip`](../tooltip/tooltip.md)), então quem usa mouse também vê o que o ícone faz. O nome é o `ariaLabel`, senão o `label`, senão o padrão do `kind` (`Editar`, `Excluir`, `Visualizar`, `Baixar`).

Ação desabilitada usa `aria-disabled` em vez de `disabled`: continua focável, o clique é ignorado (não emite `action`) e, com `disabledReason`, a dica explica o motivo:

```ts
actions: TableAction<Row>[] = [
  { kind: 'edit' },
  {
    kind: 'delete',
    disabled: row => row.tipo === 'Correntista',
    disabledReason: () => 'correntistas só podem ser removidos pela agência',
  }, // → "Excluir (correntistas só podem ser removidos pela agência)"
  { kind: 'download', visible: row => row.temContrato },
];
```

### Opção B — Ações **custom** (controle total)
```html
<app-table [columns]="columns" [data]="rows" [selectable]="true">
  <ng-template appActions let-row let-index="index">
    <button class="icon-btn icon-btn--ghost" type="button"
            (click)="onEdit(row, index)" aria-label="Editar">
      <img src="/icons/svg/pen-box.svg" width="18" height="18" alt="" />
    </button>
  </ng-template>
</app-table>
```

> Quando `appActions` é fornecido, `[actions]` é ignorado (o template **sempre** vence).

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
  priority?: number;  // sem espaço: 1 (padrão) nunca some; maiores somem primeiro
}

// Ações declarativas
export type ActionKind = 'edit' | 'delete' | 'view' | 'download';

export interface TableAction<T = any> {
  kind: ActionKind;
  label?: string;               // nome curto (dica e leitor de tela); padrão: labels.table.action[kind]
  ariaLabel?: string;           // nome mais específico (ex.: "Editar Ana"); vence o label
  visible?: (row: T, index: number) => boolean;
  disabled?: (row: T, index: number) => boolean;   // continua focável (aria-disabled)
  disabledReason?: (row: T, index: number) => string | null | undefined; // motivo, na dica
  iconUrl?: string;             // se fornecido, usa <img>; senão, ícone inline (currentColor)
}
```

### Inputs
| Propriedade     | Tipo                            |                                                               Padrão                                                                | Descrição                                                                                                    |
|-----------------|---------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------:|--------------------------------------------------------------------------------------------------------------|
| `data`          | `T[]`                           |                                                                  —                                                                  | Linhas da tabela.                                                                                            |
| `columns`       | `ColumnDef<T>[]`                |                                                                  —                                                                  | Colunas declarativas.                                                                                        |
| `selectable`    | `boolean`                       |                                                               `false`                                                               | Mostra checkbox por linha e “selecionar tudo”.                                                               |
| `rowKey`        | `keyof T \| (row, i) => unknown` |                                                                  —                                                                  | Identificador estável da linha. Com ele, `selected` guarda **chaves** e a seleção sobrevive a ordenação/paginação. |
| `selected`      | `any[]`                         |                                                                `[]`                                                                 | Seleção controlada: chaves (com `rowKey`) ou índices em `data` (sem `rowKey`).                               |
| `showActions`   | `boolean`                       |                                                               `false`                                                               | (Opcional) força a coluna de ações. Normalmente **não precisa** quando você usa `[actions]` ou `appActions`. |
| `actions`       | `(TableAction \| ActionKind)[]` |                                                                `[]`                                                                 | Define ações **declarativas** com ícones padrão ou por `iconUrl`.                                            |
| `actionsLabel`  | `string`                        | `labels.table.actions` | Nome da coluna de ações para leitor de tela (o cabeçalho é visualmente vazio).                               |
| `actionsColWidth` | `string \| number`           |                                                                `44`                                                                 | Largura da coluna de ações (número = px).                                                                    |
| `selectColWidth` | `string \| number`           | `36` | Largura da coluna de seleção (checkbox); número = px. |
| `loading`       | `boolean`                       |                                                               `false`                                                               | Mostra estado de carregamento com skeleton.                                                                  |
| `loadingRows`   | `number`                        |                                                                 `5`                                                                 | Quantidade de linhas do skeleton.                                                                            |
| `emptyMessage`  | `string`                        | `labels.table.empty` | Mensagem para o estado vazio.                                                                                |
| `error`         | `string \| null`               |                                                                `null`                                                               | Mensagem de falha ao buscar os dados: mostra o erro no lugar das linhas (anunciado). `loading` vence.        |
| `retryLabel`    | `string \| null`               | `labels.table.retry` | Texto do botão que emite `retry`; `null` esconde o botão.                                                    |
| `bulkActions`   | `TableBulkAction[]`             |                                                                `[]`                                                                 | Botões da barra de ações em massa (exige `selectable`).                                                      |
| `bulkActionsLabel` | `string`                     | `labels.table.bulkActions` | Nome do grupo da barra para leitor de tela.                                                                  |
| `selectedCountLabel` | `(n: number) => string`    | `labels.table.selectedCount` | Texto do contador (também anunciado a cada mudança).                                                         |
| `clearSelectionLabel` | `string`                  | `labels.clearSelection` | Texto do botão que limpa a seleção.                                                                          |
| `noSelectionLabel` | `string`                     | `labels.table.noSelection` | Texto sem seleção: visível com `bulkBarIdle="hint"`, senão só anunciado.                                                                                  |
| `bulkBarIdle`   | `'space' \| 'hint' \| 'hidden'` |                                                              `'space'`                                                               | O que a barra mostra sem seleção (ver Ações em massa).                                                       |
| `sortKey`       | `string`                        |                                                                  —                                                                  | Chave da coluna ordenada (controlado).                                                                       |
| `sortDir`       | `'asc' \| 'desc'`               |                                                               `'asc'`                                                               | Direção da ordenação (controlado).                                                                           |
| `paginate`      | `'client' \| 'server' \| null`  |                                                               `null`                                                                | Liga a paginação integrada (ver Paginação). Sem ela, mostra `data` inteiro.                                  |
| `pageIndex`     | `number`                        |                                                                 `0`                                                                 | Página atual (0-based); aceita `[(pageIndex)]`.                                                              |
| `pageSize`      | `number`                        |                                                                `10`                                                                 | Linhas por página; aceita `[(pageSize)]`.                                                                    |
| `totalItems`    | `number \| null`                |                                                               `null`                                                                | Total no servidor (`paginate="server"`).                                                                     |
| `pageSizeOptions` | `number[]`                    |                                                                `[]`                                                                 | Opções de "Itens por página"; vazio esconde o seletor.                                                       |
| `rangeLabel`    | `(start, end, total) => string` | `labels.table.range` | Texto do intervalo no rodapé (anunciado ao trocar de página).                                                |
| `pageSizeLabel` | `string`                        | `labels.table.pageSize` | Rótulo do seletor.                                                                                           |
| `paginationLabel` | `string`                      | `labels.table.pagination` | Nome da navegação de páginas.                                                                                |
| `detailsLabel`  | `string`                        | `labels.table.details` | Nome (para leitor de tela) da coluna do botão de detalhes.                                                   |
| `expandLabel`   | `string`                        | `labels.table.expand` | Nome do botão que abre a linha de detalhes.                                                                  |

### Outputs
| Evento            | Payload                                         | Quando dispara                                            |
|-------------------|-------------------------------------------------|-----------------------------------------------------------|
| `selectedChange`  | `any[]` (chaves ou índices)                     | Alterou seleção (linha ou “selecionar tudo”).             |
| `action`          | `{ type: ActionKind; row: T; index: number }`   | Clique numa ação declarativa (quando usando `[actions]`). |
| `retry`           | `void`                                          | Clicou em "Tentar novamente" no estado de erro.           |
| `bulkAction`      | `{ type: string; keys: any[] }`                 | Clique numa ação em massa (chaves ou índices selecionados). |
| `pageIndexChange` | `number`                                        | Mudou de página (clique, ordenação ou correção após `data` encolher). |
| `pageSizeChange`  | `number`                                        | Trocou "Itens por página".                                |
| `sortChange`      | `{ key: string; dir: 'asc' \| 'desc' }`       | Usuário clicou no cabeçalho e mudou a ordenação. |
### Templates projetáveis
- **Célula custom (`appCell`)**  
  Contexto: `$implicit` (valor), `row` (linha), `index` (índice).
  ```html
  <ng-template appCell="documento" let-value let-row="row" let-index="index">
    {{ value }}
  </ng-template>
  ```

- **Ações (`appActions`)**  
  Contexto: `row`, `index`. Substitui **completamente** o render de `[actions]`.
  ```html
  <ng-template appActions let-row let-index="index">
    <button class="icon-btn icon-btn--ghost" (click)="onEdit(row, index)">✏️</button>
  </ng-template>
  ```

- **Ações em massa (`appBulkActions`)**  
  Contexto: `$implicit`/`keys` (chaves selecionadas), `count`, `clear()`. Substitui os botões de `[bulkActions]`; o contador e "Limpar seleção" continuam.
  ```html
  <ng-template appBulkActions let-keys let-clear="clear">
    <button type="button" (click)="arquivar(keys); clear()">Arquivar</button>
  </ng-template>
  ```

---

## Colunas que se recolhem

Quando a tabela fica mais larga que o espaço disponível, em vez de rolar na horizontal ela esconde colunas pela `priority` do `ColumnDef`, e um botão **Mostrar detalhes** em cada linha abre os valores escondidos.

```ts
columns: ColumnDef<Adicional>[] = [
  { key: 'nome',      header: 'Nome' },                     // priority 1 (padrão): nunca some
  { key: 'tipo',      header: 'Tipo', type: 'chip', priority: 2 },
  { key: 'documento', header: 'Documento' },
  { key: 'limite',    header: 'Limite', priority: 3 },      // some primeiro
];
```

- **Pela largura da tabela**, não da tela: a tabela mede o wrapper (o mesmo do rodapé paginado), então também funciona dentro de um card estreito. Some primeiro a de `priority` maior (empate: a mais à direita); quando há espaço de novo, elas voltam na ordem inversa.
- **Detalhes:** o botão (`aria-expanded`, `aria-controls`) abre uma linha logo abaixo com "Rótulo: valor" das colunas escondidas, alinhada com a primeira coluna de dados. Chips e células custom (`appCell`) aparecem como na coluna.
- Sem nenhuma coluna com `priority` maior que 1, nada muda (a tabela rola como antes). No modo cartão (≤ 640px) todos os campos aparecem, então nada se recolhe.
- No servidor (SSR) todas as colunas são renderizadas; o recolhimento começa no navegador, depois da primeira medida.
- Textos: `detailsLabel` (nome da coluna do botão, para leitor de tela) e `expandLabel`.

---

## Paginação

Com `paginate`, a tabela mostra um rodapé com o intervalo ("Mostrando 1–5 de 6"), o seletor de itens por página (com `pageSizeOptions`) e as páginas ([`app-pagination`](../pagination/pagination.md)).

### Local (`paginate="client"`)

Passe **todas** as linhas em `data`; a tabela mostra a fatia da página.

```html
<app-table [columns]="columns" [data]="linhasOrdenadas()"
           paginate="client" [(pageIndex)]="pagina" [(pageSize)]="porPagina"
           [pageSizeOptions]="[10, 25, 50]"
           [selectable]="true" rowKey="documento" />
```

- Ao **ordenar** pelo cabeçalho, volta para a primeira página.
- Se `data` **encolher** (ex.: exclusão na última página) e a página deixar de existir, a tabela corrige `pageIndex` (e emite `pageIndexChange`). Enquanto `loading`, não corrige.
- O `index` de `(action)` e dos templates (`appCell`, `appActions`) é a **posição em `data`**, não na página. Sem `rowKey`, a seleção também guarda posições em `data`, e "selecionar tudo" mantém as das outras páginas.

### Servidor (`paginate="server"`)

`data` já é a página atual; informe o total em `totalItems` e busque de novo quando a página mudar.

```html
<app-table [columns]="columns" [data]="pagina()" [loading]="carregando()"
           paginate="server" [totalItems]="total()"
           [pageIndex]="indice()" (pageIndexChange)="buscar($event)"
           [pageSize]="20" />
```

- A tabela não fatia nada: só emite `pageIndexChange`/`pageSizeChange`. Enquanto a página nova carrega, use `loading` (skeleton).
- Ordenar também volta para a primeira página (emite `pageIndexChange(0)`).

### Rodapé

- Some com **erro** (não há páginas para navegar) e quando não há linhas; com uma página só, mostra apenas o intervalo.
- Ao trocar "Itens por página", a primeira linha que estava na tela continua visível.
- O intervalo é anunciado ao leitor de tela (`aria-live="polite"`).
- Quando a tabela rola na horizontal, o rodapé continua inteiro à vista (a tabela mede a largura do wrapper).
- Textos: `rangeLabel`, `pageSizeLabel`, `paginationLabel`.

---

## Ações em massa

Com `selectable` e `[bulkActions]`, uma barra fica acima da tabela. Com linhas selecionadas, mostra o contador ("3 selecionados"), **Limpar seleção** e os botões. O clique emite `(bulkAction)` com as **chaves** selecionadas.

Sem seleção, `bulkBarIdle` decide o que aparece:

| `bulkBarIdle`       | Sem seleção                                   | Ao marcar a primeira linha |
|---------------------|-----------------------------------------------|----------------------------|
| `'space'` (padrão) | nada, mas o espaço da barra fica guardado     | a tabela não se mexe       |
| `'hint'`            | o texto `noSelectionLabel` ("Nenhuma linha selecionada") | a tabela não se mexe |
| `'hidden'`          | nada, e a barra não ocupa espaço              | a tabela desce             |

```ts
bulkActions: TableBulkAction<string>[] = [
  { type: 'export', label: 'Exportar' },
  {
    type: 'delete',
    label: 'Excluir selecionados',
    danger: true,
    disabled: docs => this.rows().some(r => docs.includes(r.documento) && r.tipo === 'Correntista'),
    disabledReason: () => 'a seleção tem correntistas, que só podem ser removidos pela agência',
  },
];

onBulk(e: { type: string; keys: string[] }) {
  if (e.type === 'delete') {
    this.api.excluir(e.keys).subscribe(() => this.selected.set([]));
  }
}
```

```html
<app-table [data]="pagedRows()" [selectable]="true" rowKey="documento"
           [selected]="selected()" (selectedChange)="selected.set($event)"
           [bulkActions]="bulkActions" (bulkAction)="onBulk($event)" />
```

```ts
export interface TableBulkAction<K = any> {
  type: string;                 // emitido em (bulkAction)
  label: string;                // texto do botão
  danger?: boolean;             // destrutiva (vermelho)
  disabled?: (keys: K[]) => boolean;                          // continua focável (aria-disabled)
  disabledReason?: (keys: K[]) => string | null | undefined;  // motivo, na dica
}
```

- **Use `rowKey`:** a seleção atravessa páginas, então o evento traz **chaves**, inclusive de linhas que não estão em `data`. Sem `rowKey`, vêm índices em `data`.
- **Limpe a seleção** (`selected`) depois de concluir a ação: os botões somem e o foco vai para "Selecionar tudo" (ou para a tabela), sem cair no `<body>`.
- Ação indisponível: `aria-disabled` (continua focável, o clique não emite) e o motivo aparece na dica.
- O contador é anunciado ao leitor de tela a cada mudança na seleção. Para outro idioma, passe `selectedCountLabel`, `noSelectionLabel`, `clearSelectionLabel` e `bulkActionsLabel`.
- A barra tem a largura do conteúdo e fica visível quando o wrapper rola na horizontal (`position: sticky`).

---
### Ordenação (controlada)

O componente emite `sortChange` e expõe `aria-sort` no `<th>`. Controle a ordenação no host:

```ts
type SortState = { key: string; dir: 'asc'|'desc' };

const sort = signal<SortState|null>(null);
const collator = new Intl.Collator(undefined, { numeric:true, sensitivity:'base' });

const sortedRows = computed(() => {
  const s = sort(); if (!s) return rows;
  const k = s.key as keyof Row;
  const dir = s.dir === 'asc' ? 1 : -1;
  return [...rows].sort((a,b) => {
    const av = a[k] as any, bv = b[k] as any;
    const cmp = (typeof av === 'number' && typeof bv === 'number')
      ? av - bv
      : collator.compare(String(av ?? ''), String(bv ?? ''));
    return cmp * dir;
  });
});
```

```html
<app-table
  [columns]="columns"
  [data]="sortedRows()"
  (sortChange)="sort.set($event)">
</app-table>
```

---
## Carregando, vazio e erro

```html
<app-table
  [columns]="columns"
  [data]="rows"
  [loading]="loading()"
  [loadingRows]="5"
  [emptyMessage]="'Sem registros para exibir'"
  [error]="erro()"
  (retry)="carregar()">
</app-table>
```

O corpo da tabela mostra um estado por vez, nesta ordem de precedência: **carregando** (skeleton) > **erro** > **dados** > **vazio**.

### Erro ao carregar

Quando a busca falha, passe a mensagem em `error`. Sem isso, a tabela mostraria "Sem registros", o que dá a entender que não há dados, quando na verdade houve um erro.

```ts
erro = signal<string | null>(null);

carregar() {
  this.loading.set(true);
  this.api.listar().subscribe({
    next: rows => { this.rows.set(rows); this.erro.set(null); this.loading.set(false); },
    error: () => { this.erro.set('Não foi possível carregar os adicionais.'); this.loading.set(false); },
  });
}
```

- A mensagem aparece no lugar das linhas, com ícone, e é anunciada ao leitor de tela (`role="alert"`).
- **"Tentar novamente"** emite `retry`; o texto vem de `retryLabel` (`null` esconde o botão, para erros que não adianta repetir).
- Não precisa limpar `error` antes de tentar de novo: `loading` vence, e a mensagem só volta se `error` continuar preenchido quando `loading` terminar.
- **Foco:** o botão some enquanto carrega, então o foco vai para a tabela; se falhar de novo, volta para "Tentar novamente". Para isso, ligue `loading` dentro do handler do `(retry)` (como no exemplo acima).
- "Selecionar tudo" fica desabilitado sem linhas visíveis (carregando, erro ou vazio). Esconda a paginação enquanto houver erro.
- Se o app também mostra um toast para erros de requisição, o estado da tabela continua necessário: o toast some e a tabela ficaria parecendo vazia.

---

## Theming (CSS Custom Properties)

Declare/ajuste tokens no `styles.sass` (ou no wrapper da página):

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

No Sass do componente essas variáveis já são usadas em header, linhas, bordas, chips e botões, **sempre com valor padrão**: copiada para outro projeto, a tabela mantém o visual mesmo sem elas. Os chips ficam no subcomponente interno `app-table-chip` (classes `chip` / `chip--<variante>`); `teal` e `orange` já vêm estilizadas, e outras variantes recebem a classe para você estilizar no app.


## Acessibilidade
- Cabeçalho clicável com `aria-sort="ascending|descending|none"` e foco visível no `th` (Enter/Espaço para alternar).
- Estado de erro: mensagem anunciada (`role="alert"`), `aria-busy` na tabela enquanto carrega e o foco não se perde ao tentar de novo.
- Colunas recolhidas: botão "Mostrar detalhes" com `aria-expanded` e `aria-controls` apontando para a linha de detalhes; a coluna do botão tem nome (`detailsLabel`).
- Ações em massa: barra com `role="group"` e nome (`bulkActionsLabel`), contador anunciado (`aria-live="polite"`) e o foco vai para "Selecionar tudo" quando os botões somem.
- Ações declarativas: o nome também aparece como dica; ações indisponíveis usam `aria-disabled` (focáveis, com o motivo) e o cabeçalho da coluna de ações tem nome para leitor de tela (`actionsLabel`).

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

> Evite um reset **global** `button { border: none !important; background: transparent; }`. Prefira escopar (`.tbl .icon-btn`), para não interferir em outros componentes (ex.: Stepper).

---

## Dicas & Solução de problemas

- **Asset 404**: usando `public/` em `angular.json`, coloque o SVG em `public/icons/svg/pen-box.svg` e referencie com `/icons/svg/pen-box.svg`. Se preferir `src/assets`, inclua a pasta nos `assets` do `angular.json` e use `/assets/...`.
- **Cor do ícone**: `<img>` usa a cor embutida no arquivo. Para herdar do CSS, use SVG **inline** com `fill="currentColor"`.
- **Types no template**: use `$any(...)` em vez de casts TS (ex.: `$any(row)[$any(col).key]`).
- **Seleção com ordenação/paginação**: sem `rowKey`, `selected` guarda índices de `data`, que mudam quando você ordena ou pagina fora da tabela. Passe `rowKey` para selecionar por chave:
  ```html
  <app-table [data]="pagedRows()" [selectable]="true" rowKey="documento"
             [selected]="selected()" (selectedChange)="selected.set($event)">
  </app-table>
  ```
  “Selecionar tudo” marca/desmarca só as linhas visíveis e preserva a seleção das outras páginas.

---

## Roadmap

- [x] Ordenação por coluna
- [x] Estados vazio e carregando (`emptyMessage`, `loading`)
- [x] Estado de erro (`error`, `retry`)
- [x] Paginação (`paginate` local/servidor, `pageSizeOptions`)
- [x] Ações em massa (`bulkActions`, `appBulkActions`)
- [x] Colunas que se recolhem (`priority`, "Mostrar detalhes")

---

## Licença

MIT — use e adapte à vontade dentro do projeto.

---

## Responsividade

### 1) Desktop / Wrap horizontal
Envolva a tabela com um contêiner `.tbl-wrap` para permitir rolagem horizontal quando as colunas extrapolarem a largura do viewport. Esse contêiner também aplica um **sombreamento nas bordas** indicando overflow:

```html
<div class="tbl-wrap">
  <app-table [columns]="columns" [data]="rows"></app-table>
</div>
```

O Sass da demo já inclui os gradientes e `border-radius` do contêiner.

Com `priority` nas colunas, a tabela esconde colunas em vez de rolar (ver **Colunas que se recolhem**).

### 2) Mobile / “Stack layout” (≤ 640px)
Abaixo de `640px` a tabela é transformada em cartões: cada `<tr>` vira um bloco e cada `<td>` usa `data-label` para exibir o rótulo da coluna.  
A coluna de **seleção** sobe para o topo do cartão e a de **ações** vai para o rodapé, alinhada à direita.

> Dica: garanta que cada célula receba `data-label` (o componente já faz isso automaticamente a partir de `ColumnDef.header`).

## Largura da coluna de seleção

A coluna de seleção tem **36px** por padrão. Para mudar, use `selectColWidth` (número = px, ou qualquer unidade CSS); a coluna de ações tem o equivalente `actionsColWidth` (padrão 44):

```html
<app-table [selectable]="true" [selectColWidth]="44" ... />
<app-table [selectable]="true" selectColWidth="2.75rem" ... />
```

## Acessibilidade (ordenar)
O cabeçalho clicável mantém `aria-sort="ascending|descending|none"` e aceita teclado (Enter/Espaço). Isso é emitido via `sortChange` e você controla a ordenação no host. Consulte a seção “Ordenação (controlada)”.
