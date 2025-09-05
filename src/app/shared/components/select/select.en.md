<p align="right"><a href="./select.md">Português (BR)</a></p>

# Select — Accessible dropdown (Angular, standalone)

A lightweight, accessible **select** component themed via **CSS Variables**. Supports optional **filtering**, keyboard navigation, simple i18n integration and required validation.

> This doc describes the current API you shipped. I added optional improvement ideas at the end.

---

## Features
- Standalone component, no external UI deps.
- Optional **filter** in the panel, diacritics/case-insensitive.
- **A11y**: `role="listbox"`/`role="option"`, `aria-expanded`, `aria-selected`, `aria-invalid`, closes on *Escape* and outside click, managed focus.
- **Keyboard**: arrows ↑/↓, Home/End, Enter, Escape, Tab/Shift+Tab.
- **Theming**: inherits global tokens (`--accent`, `--surface`, `--fg`) and exposes `--sel-*` overrides.
- **Validation**: external `error` takes precedence; built-in required check when `required` + `autoValidate`.

---

## Basic usage

```html
<app-select
  [label]="'select.label' | t"
  [placeholder]="'select.placeholder' | t"
  [required]="true"
  [requiredLabel]="'form.required.label' | t"
  [requiredError]="'form.required.error' | t"
  [options]="options()"
  [value]="category()"
  (valueChange)="category.set($event)"
  [hint]="'form.hint' | t">
</app-select>
```

```ts
options = computed<SelectOption<string>>(() => [
  { label: i18n.t('select.option.hover'), value: 'hover' },
  { label: i18n.t('select.option.o1'),    value: 'o1' },
  { label: i18n.t('select.option.o2'),    value: 'o2' },
]);
```

---

## Examples

### With filter
```html
<app-select
  [label]="'select.label' | t"
  [placeholder]="'select.placeholder' | t"
  [filterable]="true"
  [filterPlaceholder]="'select.filter.placeholder' | t"
  [options]="options()"
  [value]="categoryFilter()"
  (valueChange)="categoryFilter.set($event)">
</app-select>
```

### Disabled
```html
<app-select
  [label]="'select.label' | t"
  [disabled]="true"
  [options]="options()"
  [value]="'o1'">
</app-select>
```

### No placeholder
```html
<app-select
  [label]="'select.label' | t"
  [required]="true"
  [requiredLabel]="'form.required.label' | t"
  [requiredError]="'form.required.error' | t"
  [options]="options()"
  [value]="category()"
  (valueChange)="category.set($event)">
</app-select>
```

### Not required
```html
<app-select
  [label]="'select.label' | t"
  [options]="options()"
  [placeholder]="'select.placeholder' | t"
  [value]="categoryNoReq()"
  (valueChange)="categoryNoReq.set($event)">
</app-select>
```

---

## API

### Inputs
| Prop | Type | Default | Description |
|---|---|---:|---|
| `label` | `string` | `''` | Field label. |
| `required` | `boolean` | `false` | Shows “required” badge and enables required validation. |
| `placeholder` | `string` | `''` | Text when no selection. |
| `disabled` | `boolean` | `false` | Disables the control. |
| `filterable` | `boolean` | `false` | Shows a filter input inside the panel. |
| `filterPlaceholder` | `string` | `''` | Filter placeholder. |
| `error` | `string \| null` | `null` | External error message (takes precedence). |
| `requiredLabel` | `string` | `'requerido'` | Text near the label when `required`. |
| `requiredError` | `string` | `'Campo obrigatório'` | Built-in required message. |
| `autoValidate` | `boolean` | `true` | Validate on blur/close. |
| `hint` | `string \| null` | `null` | Helper text (when no error). |
| `options` | `SelectOption<T>[]` | — | Options list `{ label, value, disabled? }`. |
| `value` | `T \| null` | `null` | Selected value. |

### Outputs
| Event | Payload | When |
|---|---|---|
| `valueChange` | `T` | Emitted after selecting an option. |

---

## Accessibility

- **Button** control: `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`, `aria-invalid` when error.
- **List**: `role="listbox"`, items with `role="option"` and `aria-selected`.
- Closes on **Escape**, outside click and after selection.
- **Keyboard**: `Enter`/`Space` to open; inside the panel use `↑/↓`, `Home/End`, `Enter` to select.
- **Focus** returns to the button after selection.

> 💡 Optional upgrade: set `aria-activedescendant` on the listbox pointing to the highlighted option id for better SR support.
>
> ```html
> <div role="listbox"
>      [attr.aria-activedescendant]="highlighted()>=0 ? optionId(highlighted()) : null">
> </div>
> ```

---

## Theming (CSS Vars)

The Select uses these variables (safe to override per scope):

| Var | Purpose | Light suggestion | Dark suggestion |
|---|---|---|---|
| `--sel-bg` | control bg | `var(--surface)` | `var(--surface)` |
| `--sel-fg` | control text | `var(--fg)` | `var(--fg)` |
| `--sel-border` | control border | `var(--border)` | `var(--border)` |
| `--sel-placeholder` | placeholder text | `color-mix(in srgb, var(--fg) 55%, transparent)` | same |
| `--sel-caret` | caret ▾ | `var(--muted)` | `var(--muted)` |
| `--sel-disabled-bg` | disabled bg | `var(--surface-2)` | `#0f1720` |
| `--sel-disabled-border` | disabled border | `var(--border)` | `var(--border)` |
| `--sel-error` | error color | `#e11d48` | `#fb7185` |
| `--sel-focus-ring` | focus ring | `color-mix(in srgb, var(--accent) 35%, transparent)` | `color-mix(in srgb, var(--accent) 55%, transparent)` |
| `--sel-menu-bg` | panel bg | `var(--surface)` | `var(--surface)` |
| `--sel-menu-border` | panel border | `var(--border)` | `var(--border)` |
| `--sel-scrollbar-thumb` | scrollbar thumb | `color-mix(in srgb, var(--accent) 35%, #cbd5e1)` | `color-mix(in srgb, var(--accent) 35%, #334155)` |
| `--sel-option-hover` | option hover | `color-mix(in srgb, var(--accent) 12%, transparent)` | `color-mix(in srgb, var(--accent) 18%, transparent)` |
| `--sel-option-active` | selected option | `color-mix(in srgb, var(--accent) 20%, white)` | `color-mix(in srgb, var(--accent) 22%, #0b1220)` |

Example (global):
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

## i18n keys
- `section.select.title`, `section.select.lead`
- `select.demo.*.title`
- `select.label`, `select.placeholder`, `select.filter.placeholder`
- `form.required.label`, `form.required.error`, `form.hint`
- `select.option.*`

---

## QA checklist
- Accent/theme switch doesn’t shift the layout.
- Contrast ≥ 4.5:1 for control text, selected item and panel header.
- Must close on Escape/outside click.
- Keyboard behavior consistent with `role="listbox"`.
- Screen readers announce selection (NVDA/JAWS/VoiceOver).

---

## Roadmap / ideas
- [ ] **ControlValueAccessor** for `formControlName`/`ngModel`.
- [ ] **Clear button** (×) inside the control.
- [ ] **Typeahead while closed**: typing moves selection.
- [ ] **Groups** (optgroup) and separators.
- [ ] **Async** data + skeleton in panel.
- [ ] **Virtual scroll** for large lists.
- [ ] Optional **Portal/Overlay** to escape clipping containers.

---

## Licença

MIT — use e adapte à vontade dentro do projeto.

