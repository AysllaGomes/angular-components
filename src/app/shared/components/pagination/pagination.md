<p align="right"><a href="./pagination.en.md">English</a></p>

# Pagination (Standalone, HTML + Sass)

> Textos padrão em **inglês**, trocáveis num lugar só com [`provideUiLabels`](../../labels/labels.md) (`labels.*` nas tabelas abaixo); o input de cada instância vence.

Componente de **paginação independente** (não acopla à Tabela), pensado para funcionar tanto com **fatiamento client-side** quanto **server-side**. Visual em “bolhas”, setas laterais e controles acessíveis.

---

## Por que existe

Paginar parece só uma fileira de números, mas é preciso decidir quais páginas mostrar sem estourar a largura, desabilitar as setas nas pontas, marcar a página atual para o leitor de tela e funcionar igual com dados no navegador ou no servidor. Este componente cuida só da navegação: quem decide quais itens mostrar é a sua tela.

## Quando usar

### Use quando

- Uma lista ou tabela longa demais para uma tela só.
- Os dados vêm do servidor em páginas.
- A pessoa precisa voltar a uma posição específica da lista.

### Prefira outro

- Listas curtas: mostre tudo, sem paginar.
- Dados em tabela: a [Table](../table/table.md) já traz a paginação no rodapé.

<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->
## O que copiar

Para usar a Paginação em outro projeto Angular, copie para dentro de uma pasta `shared/` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (`*.spec.ts`) e documentação são opcionais.

| O quê | Copiar |
|---|---|
| O componente | `components/pagination/` |
| Componentes que ele usa | `components/button/` |
| Textos padrão | `labels/` ([Textos dos componentes](../../labels/labels.md)) |

Estilos globais: acrescente no `styles.sass` (ou `styles.scss`) do seu projeto:

```sass
@use '<sua-pasta>/shared/components/button/button' as *
```

Depende só de `@angular/core`. Ao todo: 8 arquivos, ~775 linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.
<!-- copy:end -->

## Objetivo
- Exibir/alterar a **página atual** de uma lista maior.
- **Não** decide quais itens mostrar — isso fica por conta do container (componente/página) que fatia os dados e passa para a Tabela (ou qualquer outra view).

---

## Arquivos
```
src/app/shared/components/pagination/
  ├─ pagination.component.ts
  ├─ pagination.component.html
  └─ pagination.component.sass
```

---

## API

### Inputs
| Propriedade | Tipo        | Padrão | Descrição |
|-------------|-------------|:------:|-----------|
| `total`     | `number`    |   —    | **Total** de itens na coleção. |
| `pageSize`  | `number`    | `10`   | Itens por página. |
| `pageIndex` | `number`    | `0`    | Índice da página atual (**0‑based**). |
| `maxVisible`| `number`    | `5`    | Máximo de botões numéricos exibidos. |
| `compact`   | `boolean \| 'auto'` | `false` | `true`: mostra "Página X de Y" entre as setas no lugar dos números. `'auto'`: só em telas ≤ 420px (CSS). Aceita o atributo vazio (`compact`). |
| `showFirstLast` | `boolean` | `false` | Mostra os botões « Primeira / Última » nas pontas (desabilitados quando já está nela). Aceita o atributo vazio. |
| `ariaLabel` | `string \| null` | `null` | Nome da navegação (padrão: `labels.pagination.nav`). Use nomes diferentes se houver mais de uma paginação na página. |

### Outputs
| Evento       | Payload   | Quando dispara |
|--------------|-----------|----------------|
| `pageChange` | `number`  | Emite o **novo** `pageIndex` (0‑based). |

### Comportamento
- O componente é sempre renderizado; para escondê-lo quando há uma única página, envolva-o com `@if` no container (veja o exemplo com Tabela).
- `pageSize` inválido (0, negativo) é tratado como 1 e `pageIndex` fora do intervalo é ajustado.
- Botões “‹/›” são desativados no início/fim.
- Numeração exibida com janela deslizante até `maxVisible`.
- No modo compacto, o texto "Página X de Y" tem `aria-live="polite"`: leitores de tela anunciam a troca de página.
- **Teclado**: com o foco em qualquer botão da paginação, `←`/`→` vão para a página anterior/próxima e `Home`/`End` para a primeira/última. Depois da troca o foco vai para o botão da página atual (no modo compacto, para a seta habilitada mais próxima), então ele não se perde quando a janela de números desliza ou uma seta desabilita.
- Acessível: `aria-label`/`aria-current`, foco visível.

---

## Exemplo — uso **independente**
```html
<app-pagination
  [total]="42"
  [pageSize]="10"
  [pageIndex]="pageIndex"
  [maxVisible]="5"
  (pageChange)="pageIndex = $event">
</app-pagination>
```

---

## Exemplo — uso **com Tabela** (container controla os dados)

### TS (container)
```ts
// sinais apenas para exemplo; pode ser qualquer estado/serviço
pageSize = 5;
pageIndex = signal(0);
pagedRows = computed(() => {
  const start = this.pageIndex() * this.pageSize;
  return this.rows.slice(start, start + this.pageSize);
});
```

### HTML
```html
<app-table
  [columns]="columns"
  [data]="pagedRows()"
  [actions]="['edit']"
  (action)="onAction($event)">
</app-table>

@if (rows.length > pageSize) {
  <div class="tbl-footer">
    <span class="total">Total de {{ rows.length }} registro(s)</span>
    <app-pagination
      [total]="rows.length"
      [pageSize]="pageSize"
      [pageIndex]="pageIndex()"
      (pageChange)="pageIndex.set($event)">
    </app-pagination>
  </div>
}
```

---

## Theming (CSS Custom Properties)
Defina no wrapper (ou globalmente) — o componente já possui *fallbacks*:

```sass
:root
  --pg-active-bg: var(--tbl-action, #058075)
  --pg-active-fg: #ffffff
  --pg-page-bg: #eef6f4       // bolhas inativas
  --pg-ghost-bg: #eeeeee      // setas
  --pg-hover: color-mix(in oklab, var(--pg-active-bg) 12%, white)
  --pg-fg: #0f1720
```

---

## Acessibilidade
- Botões com `aria-label` (setas) e `aria-current="page"` (ativo).
- Suporte a navegação por Tab; foco visível.
- Títulos com `<nav aria-label="Paginação">` no HTML.

---

## Boas práticas
- Ao mudar `pageSize`, **garanta** que o `pageIndex` continua válido (ex.: resetar para `0` se necessário).
- Para paginação **server-side**, dispare `pageChange` → chame sua API → atualize a lista e `total`.

---

## Roadmap
- [x] Botões “Primeira/Última” (`showFirstLast`).
- [x] Atalhos de teclado (←/→, Home/End).
- [x] Versão compacta (`compact` = `true` / `'auto'`).
