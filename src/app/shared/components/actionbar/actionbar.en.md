<p align="right"><a href="./actionbar.md">Português (BR)</a></p>

# ActionBar

Right‑side sheet with header, scrollable content and footer actions. It inherits the current theme and respects the **accent**.

> **When to use**
>
> - Short flows (review/confirm/edit) that don’t deserve a full page.
> - Auxiliary forms and summaries.
> - Avoid for very long content or full navigation.

---

## Anatomy
1. **Backdrop** (optional click‑to‑close)
2. **Header** with title and close button
3. **Scrollable content**
4. **Footer** with actions — responsive

---

## API

### Selector
```html
<app-actionbar></app-actionbar>
```

### Inputs
| Input | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'ActionBar'` | Header title. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'auto'` | `'auto'` | Sheet width. `auto` picks a size based on content width. |
| `closeOnBackdrop` | `boolean` | `true` | Close on backdrop click. |
| `primaryLabel` | `string \| null` | `null` | Primary button label (renders if set). |
| `secondaryLabel` | `string \| null` | `null` | Secondary button label (renders if set). |
| `opened` | `boolean` | `false` | Open state. Use `[(opened)]` for two‑way binding. |

### Outputs
| Output | Type | Fires |
|--------|------|-------|
| `primary` | `void` | When primary button is clicked. |
| `secondary` | `void` | When secondary button is clicked. |
| `openedChange` | `boolean` | When the panel opens/closes by itself (ESC, backdrop, ×, `openBar()`/`close()`). Part of `[(opened)]`; not fired when the parent changes `[opened]`. |

### Public methods
| Method | Description |
|--------|-------------|
| `openBar()` | Opens the ActionBar. |
| `close()` | Closes the ActionBar. |

---

## Accessibility
- `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` bound to the title.
- **Keyboard:** `Esc` closes; Tab keeps focus trapped inside.
- **Initial focus:** goes to the close button when opening.
- **Focus restore:** on close (button, `Esc`, backdrop or `opened=false`), focus returns to the element that was focused before opening (usually the opener), if it is still in the page.
- **Inert, non-scrolling background:** while open, page scrolling is locked and the rest of the page gets `inert` (no focus, clicks or screen reader access). On close, only what the sheet marked is released. Elements with `data-dialog-keep-active` stay active (`app-toast-container` already has it).
- Buttons have a high‑contrast **focus-visible** outline.

---

## Sizes
- `sm` — up to **360px**  
- `md` — up to **640px**  
- `lg` — up to **960px**  
- `auto` — measures content `scrollWidth` (via `ResizeObserver`) and chooses: `<436 → sm`, `<720 → md`, else `lg`.

> **Note:** if `ResizeObserver` isn’t available (SSR/older env), the component falls back to `md`.

---

## Theming
Relies on global tokens:

- Background / text / borders: `--surface`, `--fg`, `--border`  
- Accent & highlights: `--accent`

No ActionBar‑specific tokens are required; it integrates with the design system out of the box.

---

## Examples

### Basic
```html
<app-actionbar
  [title]="'Action bar title'"
  size="md"
  [(opened)]="open"
  primaryLabel="Confirm"
  secondaryLabel="Cancel"
  (primary)="onConfirm()"
  (secondary)="open=false">
  <!-- your content -->
</app-actionbar>
```

### Auto size (adapts to content)
```html
<app-actionbar
  [title]="'Review'"
  size="auto"
  [(opened)]="openAuto"
  primaryLabel="Ok">
  <div style="width:min(60ch,100%);height:36vh">...</div>
</app-actionbar>
```

### Disable backdrop close
```html
<app-actionbar
  [title]="'Terms'"
  [closeOnBackdrop]="false"
  [(opened)]="openTerms">
  ...
</app-actionbar>
```

### Custom actions
Skip `primaryLabel/secondaryLabel` (leave them `null`) and render your own action buttons inside the content/footer area.

---

## Best practices
- Keep titles short.
- Prefer at most **two** footer actions.
- Never hide content scrolling.
- Re‑confirm destructive operations inside the content.
