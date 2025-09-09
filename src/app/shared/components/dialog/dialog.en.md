# Dialog

Accessible, lightweight modal for confirmations and small forms. Built with **Angular Standalone + HTML/Sass**, no UI frameworks.

- **File:** `src/app/shared/components/dialog/dialog.component.ts`  
- **Styles:** `src/app/shared/components/dialog/dialog.component.sass`  
- **Theme:** uses CSS custom properties and inherits the global `--accent`.

---

## API

### Inputs

| Prop              | Type                             | Default      | Description                                                    |
|-------------------|----------------------------------|--------------|----------------------------------------------------------------|
| `title`           | `string`                         | `'Dialog'`   | Header title.                                                  |
| `size`            | `'sm' \| 'md' \| 'lg' \| 'auto'` | `'auto'`     | Dialog width. `auto` adapts to content (via `ResizeObserver`). |
| `opened`          | `boolean`                        | `false`      | Controls visibility. Supports two‑way as `[(opened)]`.         |
| `closeOnBackdrop` | `boolean`                        | `true`       | Close when clicking the backdrop.                              |
| `primaryLabel`    | `string \| null`                 | `null`       | Default primary button label. If `null`, it’s hidden.          |
| `secondaryLabel`  | `string \| null`                 | `null`       | Default secondary button label. If `null`, it’s hidden.        |

### Outputs

| Event            | Payload     | When                                   |
|------------------|-------------|----------------------------------------|
| `openedChange`   | `boolean`   | Mirrors `opened` changes (two‑way).    |
| `primary`        | `void`      | Click on the default primary button.   |
| `secondary`      | `void`      | Click on the default secondary button. |

### Slots / Projections

| Selector | Description |
|---|---|
| **default content** | Dialog body. |
| `[dialog-actions]` | Optional slot for **custom actions**. If present, default buttons are not rendered. |

---

## Accessibility

- `role="dialog"` and `aria-modal="true"` on the sheet.
- `aria-labelledby` points to the title element ID.
- **Initial focus** goes to the close button. **Focus trap** keeps tabbing inside.
- **Keys:** `Esc` closes; `Tab`/`Shift+Tab` cycles focus.
- **Backdrop:** enabled by default; can be disabled with `closeOnBackdrop=false`.

---

## Theme tokens (CSS Custom Properties)

```css
:root {
  --dlg-bg: var(--surface);
  --dlg-fg: var(--fg);
  --dlg-border: var(--border);
  --dlg-title: var(--fg);
  --dlg-close: var(--muted);
  --dlg-shadow: 0 24px 60px rgba(0,0,0,.18);
  --dlg-backdrop: color-mix(in srgb, #000 38%, transparent);
}
:root[data-theme="dark"] {
  --dlg-bg: #0f141d;
  --dlg-fg: var(--fg);
  --dlg-border: #2a2f3c;
  --dlg-title: var(--fg);
  --dlg-close: #9aa3af;
  --dlg-shadow: 0 24px 60px rgba(0,0,0,.35);
  --dlg-backdrop: color-mix(in srgb, #000 55%, transparent);
}
```

> Buttons reuse **`.btn`** and **`.btn--ghost`** classes from the ActionBar.

---

## Examples

### 1) Basic (with i18n)

```html
<article class="card" style="display:grid;gap:.5rem;">
  <button class="pill" type="button" (click)="openDlg=true">
    {{ 'dialog.open' | t }}
  </button>
</article>

<app-dialog
  [title]="'dialog.title.delete' | t"
  size="auto"
  [(opened)]="openDlg"
  [primaryLabel]="'dialog.primary.confirm' | t"
  [secondaryLabel]="'dialog.secondary.cancel' | t"
  (primary)="confirmDelete()">
  <p>{{ 'dialog.body.delete' | t }}</p>
</app-dialog>
```

Suggested keys:
```ts
'dialog.open':             { pt: 'Abrir diálogo',   en: 'Open dialog' },
'dialog.title.delete':     { pt: 'Confirmar exclusão', en: 'Confirm delete' },
'dialog.body.delete':      { pt: 'Tem certeza? Esta ação não pode ser desfeita.', en: 'Are you sure? This action cannot be undone.' },
'dialog.primary.confirm':  { pt: 'Confirmar',       en: 'Confirm' },
'dialog.secondary.cancel': { pt: 'Cancelar',        en: 'Cancel' },
```

### 2) Custom actions

```html
<app-dialog
  [title]="'dialog.title.delete' | t"
  size="md"
  [(opened)]="openDlg">
  <p>{{ 'dialog.body.delete' | t }}</p>

  <div dialog-actions>
    <button class="btn--ghost btn" type="button" (click)="openDlg=false">
      {{ 'dialog.secondary.cancel' | t }}
    </button>
    <button class="btn" type="button" (click)="confirmDelete()">
      {{ 'dialog.primary.confirm' | t }}
    </button>
  </div>
</app-dialog>
```

### 3) Sizes

```html
<app-dialog title="SM" size="sm" [(opened)]="o1"><p>Content…</p></app-dialog>
<app-dialog title="MD" size="md" [(opened)]="o2"><p>Content…</p></app-dialog>
<app-dialog title="LG" size="lg" [(opened)]="o3"><p>Content…</p></app-dialog>
<app-dialog title="Auto" size="auto" [(opened)]="o4"><p style="width:48ch">Adapts to content.</p></app-dialog>
```

---

## Tips

- Keep titles and labels short and clear.
- For forms, shift the initial focus to the first field after opening.
- Avoid overly tall content; the body supports vertical scrolling.
- On mobile (≤ 480px) the dialog stretches to full width and respects safe areas (already handled in Sass).

---

## Troubleshooting

- **“ResizeObserver is not defined”** under SSR: guard the access with a `window`/`ResizeObserver` check. The component already guards, but ensure it only runs in the browser.
- **Focus not trapped:** verify no inner element has `tabindex="-1"` unexpectedly or an `autofocus` stealing focus.
