<p align="right"><a href="./tree-select.md">Português (BR)</a></p>

# TreeSelect

A select whose options form a **tree**: pick one node (with its path in the field) or check whole groups with checkboxes. Built with **Angular Standalone + HTML/Sass**, no UI libraries.

- **Files:** `src/app/shared/components/tree-select/` (`tree-select.component.ts`, `tree-utils.ts`)
- **Model:** `src/app/shared/model/interface/tree-select/tree-node.interface.ts`
- **Look:** same tokens as the Select (`--sel-*`) and the Checkbox box (`app-checkbox-mark`, `--cb-*` tokens).

The component **only presents**: it receives a ready tree and returns **keys**. It calls no API and knows no business rules.

| Situation | Component |
|---|---|
| Flat list, pick one value | `app-select` |
| Options in levels (country → state → city), with group selection | **`app-tree-select`** |
| A single yes/no | `app-checkbox` |

---

## Data

```ts
interface TreeNode<T = unknown> {
  key: string;            // unique across the whole tree; this goes into the value
  label: string;
  value?: T;              // optional extra data (not part of the value)
  children?: TreeNode<T>[];
  disabled?: boolean;     // disables the node and its whole subtree
  selectable?: boolean;   // false: only groups (cannot be picked/checked)
}
```

---

## Usage

### Single selection

```html
<app-tree-select label="City" [nodes]="places" [(value)]="city" />
```

- The value is the node **key** (`string | null`).
- The field shows the **path**: "Brasil › São Paulo › Campinas" (`pathSeparator`).
- By default **any node** can be picked. With **`leafOnly`**, only leaves; clicking a group just expands/collapses it. `selectable: false` blocks a specific node.

### Multiple (checkbox)

```html
<app-tree-select selectionMode="checkbox" filterable label="Permissions"
  [nodes]="permissions" [formControl]="perms" />
```

- The value is the **list of checked leaf keys**, in tree order. A group key **never** goes in.
- **Checking a group** checks all its enabled leaves; disabled nodes are ignored.
- A **partial group** shows "−" (`aria-checked="mixed"`); clicking it checks the rest. Full group → clicking unchecks everything.
- **With an active search**, checking a group checks only the leaves it is showing.
- The field shows **chips** (up to `maxChips`) and "+N" for the rest.

---

## API

### Inputs

| Input               | Type                         | Default                    | Description |
|---------------------|------------------------------|----------------------------|-------------|
| `nodes`             | `TreeNode<T>[]`              | —                          | The tree (required). |
| `selectionMode`     | `'single' \| 'checkbox'`     | `'single'`                 | One node or several leaves. |
| `value`             | `string \| string[] \| null` | `null` / `[]`              | Value. Two-way via `[(value)]`; with forms, use `formControl`/`ngModel`. |
| `leafOnly`          | `boolean`                    | `false`                    | `single`: only leaves can be picked. |
| `expandedKeys`      | `string[]`                   | `[]`                       | Nodes open at start. |
| `filterable`        | `boolean`                    | `false`                    | Search box in the panel (accent/case-insensitive). |
| `filterPlaceholder` | `string`                     | `''`                       | Search placeholder. |
| `emptyMessage`      | `string`                     | `'Nenhum item encontrado'` | Text when the search finds nothing. |
| `label`             | `string`                     | `''`                       | Field label. |
| `placeholder`       | `string`                     | `''`                       | Text when empty. |
| `pathSeparator`     | `string`                     | `' › '`                    | Path separator (`single`). |
| `maxChips`          | `number`                     | `3`                        | Chips before "+N" (`checkbox`). |
| `clearable`         | `boolean`                    | `false`                    | "×" clear button. |
| `required`          | `boolean`                    | `false`                    | Shows "required" and validates on close/blur. |
| `error` / `hint`    | `string \| null`             | `null`                     | External error (wins) and helper text. |
| `disabled`          | `boolean`                    | `false`                    | Disables it (the form can too). |
| `responsive`        | `'auto' \| 'menu' \| 'sheet'`| `'auto'`                   | `auto`: becomes a bottom *sheet* up to `sheetBreakpoint` px. |
| `sheetBreakpoint`   | `number`                     | `560`                      | Max width for the *sheet* mode. |
| `panelTitle`        | `string \| null`             | `null`                     | *Sheet* title (default: `label`). |
| `requiredLabel`, `requiredError`, `clearAriaLabel`, `closeAriaLabel` | `string` | PT-BR | Texts for i18n. |

### Outputs

| Output        | Payload                      | When |
|---------------|------------------------------|------|
| `valueChange` | `string \| string[] \| null` | The user changed the selection. |

---

## Keyboard and accessibility

The panel follows the **WAI-ARIA tree pattern** (`role="tree"`, `treeitem` with `aria-level`, `aria-setsize`, `aria-posinset`, `aria-expanded`). Focus stays on the tree and the active item goes in `aria-activedescendant`.

| Key             | In the panel |
|-----------------|--------------|
| `↓` / `↑`       | Next / previous visible node |
| `→`             | Expands; if already open, moves to the first child |
| `←`             | Collapses; otherwise, moves to the parent |
| `Home` / `End`  | First / last node |
| `Enter` / `Space` | Picks (`single`) or checks/unchecks (`checkbox`) |
| Letters         | Jumps to the next visible node with that initial |
| `Esc`           | Closes and returns to the field |
| `Tab`           | Closes and moves on to the next field |

- With `filterable`, focus opens on the search; `↓` moves into the tree.
- `single`: the picked node has `aria-selected="true"`. `checkbox`: each node has `aria-checked` (`true`/`false`/`mixed`); the visual box is decoration only.
- Chips are read as a list ("View orders, Reports, +1").
- Clicking outside closes it.

---

## Limitations and next steps

- [ ] Load children on demand (`loadChildren`) for large trees from an API.
- [ ] Virtual scrolling (performance with thousands of nodes not measured yet).
- [ ] "Summarized" value in `checkbox` (a full parent becomes one key).
- Keys are `string`: convert numeric ids when building the tree.
