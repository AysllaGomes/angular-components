<p align="right"><a href="./pagination.md">Português (BR)</a></p>

# Pagination (Standalone, HTML + Sass)

> Default texts in **English**, changeable in one place with [`provideUiLabels`](../../labels/labels.en.md) (`labels.*` in the tables below); each instance's input wins.

A **standalone pagination** component (numeric bubbles + arrows). It **doesn’t** slice data; the **container** controls `pageIndex/pageSize` and passes the sliced array to whatever view (e.g., the Table).

---

## Files
```
src/app/shared/components/pagination/
  ├─ pagination.component.ts
  ├─ pagination.component.html
  └─ pagination.component.sass
```

---

## API

### Inputs
| Input        | Type      | Default | Description |
|--------------|-----------|:------:|-------------|
| `total`      | `number`  |   —    | Total item count. |
| `pageSize`   | `number`  | `10`   | Items per page. |
| `pageIndex`  | `number`  | `0`    | Zero‑based page index. |
| `maxVisible` | `number`  | `5`    | Maximum visible numeric buttons. |
| `compact`    | `boolean \| 'auto'` | `false` | `true`: shows "Page X of Y" between the arrows instead of numbers. `'auto'`: only on screens ≤ 420px (CSS). Accepts the bare attribute (`compact`). |
| `showFirstLast` | `boolean` | `false` | Shows the « First / Last » buttons at the ends (disabled when already there). Accepts the bare attribute. |
| `ariaLabel` | `string \| null` | `null` | Navigation name (default: `labels.pagination.nav`). Use different names when there is more than one on the page. |

### Output
| Output      | Payload  | When |
|-------------|----------|------|
| `pageChange`| `number` | Emits the new `pageIndex` (0‑based). |

Behavior:
- Always rendered; to hide it when there is a single page, wrap it in `@if` in the container (see the Table example).
- Prev/Next disabled at bounds.
- Sliding window for numeric buttons up to `maxVisible`.
- In compact mode, the "Page X of Y" text has `aria-live="polite"`, so screen readers announce page changes.
- **Keyboard**: with focus on any pagination button, `←`/`→` go to the previous/next page and `Home`/`End` to the first/last. After the change, focus moves to the current page button (in compact mode, to the nearest enabled arrow), so it is not lost when the number window slides or an arrow gets disabled.
- Accessible labels and `aria-current="page"` on the active button.

---

## Usage with the Table

```ts
pageSize = 5;
pageIndex = signal(0);
pagedRows = computed(() => {
  const start = this.pageIndex() * this.pageSize;
  return this.rows.slice(start, start + this.pageSize);
});
```

```html
<app-table [columns]="columns" [data]="pagedRows()" (action)="onAction($event)"></app-table>

@if (rows.length > pageSize) {
  <div class="tbl-footer">
    <span class="total">Total: {{ rows.length }}</span>
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

## Theming

```sass
:root
  --pg-active-bg: var(--tbl-action, #058075)
  --pg-active-fg: #ffffff
  --pg-page-bg: #eef6f4
  --pg-ghost-bg: #eeeeee
  --pg-hover: color-mix(in oklab, var(--pg-active-bg) 12%, white)
  --pg-fg: #0f1720
```

---

## Accessibility & tips
- `<nav>` named by `ariaLabel` (default `labels.pagination.nav`); give each pagination its own name if there is more than one on the page.
- Visible focus and proper labels on the arrows.
- When `pageSize` changes, ensure `pageIndex` is still valid (often reset to `0`).

---

## Roadmap
- [x] First/Last buttons (`showFirstLast`)
- [x] Keyboard shortcuts (←/→, Home/End)
- [x] Compact mode (`compact` = `true` / `'auto'`)
