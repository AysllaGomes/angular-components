<p align="right"><a href="./select.md">Português (BR)</a></p>

# Select — Accessible dropdown (Angular, standalone)

A lightweight, accessible **select** themed with **CSS Variables**. Supports optional **filtering**, keyboard navigation, required validation and simple i18n. Compatible with your global theme/accent tokens.

> This doc describes the current API you shipped. I added optional improvement ideas at the end.

---

## Features
- Standalone component, no external UI deps.
- Optional **filter** in the panel, diacritics/case-insensitive.
- **A11y**: `role="listbox"`/`role="option"`, `aria-expanded`, `aria-selected`, `aria-invalid`, closes on *Escape* and outside click, managed focus.
- **Keyboard**: arrows ↑/↓, Home/End, Enter, Escape, Tab/Shift+Tab.
- **Type-to-select (typeahead)**: typing letters picks the option (closed) or moves the highlight (open).
- **Groups**: options sharing a `group` are shown together under a heading.
- **Theming**: inherits global tokens (`--accent`, `--surface`, `--fg`) and exposes `--sel-*` overrides.
- **Validation**: external `error` takes precedence; built-in required check when `required` + `autoValidate`.
- **New:** **Clearable** — optional (×) button inside the control to clear the selection.
- **New:** **Auto-responsive (mobile)** — no props: panel/items adapt to small screens (touch-friendly targets, sticky filter, smooth scrolling, no layout jank).

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
options = computed<SelectOption<string>[]>(() => [
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

### New: Clearable
```html
<app-select
  [label]="'select.label' | t"
  [placeholder]="'select.placeholder' | t"
  [clearable]="true"
  [options]="options()"
  [value]="categoryClear()"
  (valueChange)="categoryClear.set($event)">
</app-select>
```
> Tip: localize the clear button with the `select.clear` key.

### Groups and typeahead

```ts
foods: SelectOption<string>[] = [
  { label: 'Banana',    value: 'banana',    group: 'Fruits' },
  { label: 'Carrot',    value: 'carrot',    group: 'Vegetables' },
  { label: 'Pineapple', value: 'pineapple', group: 'Fruits' }, // shown together with "Fruits"
  { label: 'Potato',    value: 'potato',    group: 'Vegetables', disabled: true },
];
```

```html
<app-select label="Food" [options]="foods" [(value)]="food" />
```

Groups appear in the order they first show up in the list; options without `group` are not under any heading. Typeahead is always on, no setup: with the field focused, type `c` to pick "Carrot".

### Forms (Reactive Forms and `ngModel`)
The component implements `ControlValueAccessor`, so it works with `formControl`, `formControlName` and `[(ngModel)]`:

```ts
category = new FormControl<string | null>(null, Validators.required);

categoryError(): string | null {
  const c = this.category;
  return c.touched && c.hasError('required') ? 'Required field' : null;
}
```

```html
<app-select
  label="Category"
  [required]="true"
  [autoValidate]="false"
  [options]="options()"
  [formControl]="category"
  [error]="categoryError()">
</app-select>

<!-- or template-driven -->
<app-select label="Category" [options]="options()" [(ngModel)]="category"></app-select>
```

- Selecting or clearing updates the control (`dirty`); closing the panel or leaving the field marks it `touched`.
- The control's `disable()`/`enable()` disable the field and close the panel.
- Validation belongs to the form (`Validators.required`). `[required]` only shows the “required” badge; use `[autoValidate]="false"` and pass the message via `[error]` to avoid duplicating the built-in validation.
- Don't combine `[value]`/`(valueChange)` with `formControl`/`ngModel` on the same field.

---

## API

### Inputs
| Prop                | Type                |               Default | Description                                             |
| ------------------- | ------------------- | --------------------: | ------------------------------------------------------- |
| `label`             | `string`            |                  `''` | Field label.                                            |
| `required`          | `boolean`           |               `false` | Shows “required” badge and enables required validation. |
| `placeholder`       | `string`            |                  `''` | Text when no selection.                                 |
| `disabled`          | `boolean`           |               `false` | Disables the control. With forms, prefer `control.disable()`. |
| `filterable`        | `boolean`           |               `false` | Shows a filter input inside the panel.                  |
| `filterPlaceholder` | `string`            |                  `''` | Filter placeholder.                                     |
| `clearable`         | `boolean`           |               `false` | Shows a small (×) **clear** button.                     |
| `error`             | `string \| null`    |                `null` | External error message (takes precedence).              |
| `requiredLabel`     | `string`            |         `'requerido'` | Text near the label when `required`.                    |
| `requiredError`     | `string`            | `'Campo obrigatório'` | Built-in required message.                              |
| `autoValidate`      | `boolean`           |                `true` | Validate on blur/close.                                 |
| `hint`              | `string \| null`    |                `null` | Helper text (when no error).                            |
| `options`           | `SelectOption<T>[]` |                     — | Options `{ label, value, disabled?, group? }`.                |
| `value`             | `T \| null`         |                `null` | Selected value (without forms).                         |

### Outputs
| Event         | Payload     | When                                                        |
| ------------- | ----------- | ----------------------------------------------------------- |
| `valueChange` | `T \| null` | Emitted after selecting an option (or `null` when cleared). |

---

## Accessibility

- **Button** control: `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`, `aria-invalid` when error.
- **List**: `role="listbox"`, items with `role="option"` and `aria-selected`.
- **Label**: `label` names the button (together with the value: "Food, Banana") and the list (`aria-labelledby`). On open, focus moves to the search or the list.
- Closes on **Escape**, outside click and after selection.
- **Keyboard**: `Enter`/`Space` to open; inside the panel use `↑/↓`, `Home/End`, `Enter` to select.
- **Typeahead**: with the field focused and closed, typing picks the first option whose label starts with the text (accent/case-insensitive) without opening; repeating the same letter cycles through options with that initial. With the panel open, typing only moves the highlight (`Enter` confirms). Disabled options are skipped; the search resets after 500 ms of no typing. With `filterable`, text goes to the filter.
- **Focus** returns to the button after selection.
- **New (clearable)**: the clear button is focusable with `aria-label="{{ 'select.clear' | t }}"`. On keyboard, **Enter/Space** clears and returns focus to the control button.

> 💡 Optional upgrade: set `aria-activedescendant` on the listbox pointing to the highlighted option id for better SR support.
>
> ```html
> <div role="listbox"
>      [attr.aria-activedescendant]="highlighted()>=0 ? optionId(highlighted()) : null">
> </div>
> ```

---
## Mobile / Responsiveness

No extra props: on small screens the panel uses a viewport-friendly max height, the filter input is sticky at the top of the panel, and options have comfortable touch targets. You can further tweak via CSS (e.g. @media (max-width: 480px) to increase option padding or constrain panel height).

---

## Theming (CSS Vars)

The Select uses these variables (safe to override per scope):

| Var                     | Purpose          | Light suggestion                                     | Dark suggestion                                      |
| ----------------------- | ---------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| `--sel-bg`              | control bg       | `var(--surface)`                                     | `var(--surface)`                                     |
| `--sel-fg`              | control text     | `var(--fg)`                                          | `var(--fg)`                                          |
| `--sel-border`          | control border   | `var(--border)`                                      | `var(--border)`                                      |
| `--sel-placeholder`     | placeholder text | `color-mix(in srgb, var(--fg) 55%, transparent)`     | same                                                 |
| `--sel-caret`           | caret ▾          | `var(--muted)`                                       | `var(--muted)`                                       |
| `--sel-disabled-bg`     | disabled bg      | `var(--surface-2)`                                   | `#0f1720`                                            |
| `--sel-disabled-border` | disabled border  | `var(--border)`                                      | `var(--border)`                                      |
| `--sel-error`           | error color      | `#e11d48`                                            | `#fb7185`                                            |
| `--sel-focus-ring`      | focus ring       | `color-mix(in srgb, var(--accent) 35%, transparent)` | `color-mix(in srgb, var(--accent) 55%, transparent)` |
| `--sel-menu-bg`         | panel bg         | `var(--surface)`                                     | `var(--surface)`                                     |
| `--sel-menu-border`     | panel border     | `var(--border)`                                      | `var(--border)`                                      |
| `--sel-scrollbar-thumb` | scrollbar thumb  | `color-mix(in srgb, var(--accent) 35%, #cbd5e1)`     | `color-mix(in srgb, var(--accent) 35%, #334155)`     |
| `--sel-option-hover`    | option hover     | `color-mix(in srgb, var(--accent) 12%, transparent)` | `color-mix(in srgb, var(--accent) 18%, transparent)` |
| `--sel-option-active`   | selected option  | `color-mix(in srgb, var(--accent) 20%, white)`       | `color-mix(in srgb, var(--accent) 22%, #0b1220)`     |

---

## i18n keys
- `section.select.title`, `section.select.lead`
- `select.demo.*.title`
- `select.label`, `select.placeholder`, `select.filter.placeholder`
- `form.required.label`, `form.required.error`, `form.hint`
- `select.option.*`
- **New**: `select.clear`

---

## QA checklist
- Accent/theme switch doesn’t shift the layout.
- Contrast ≥ 4.5:1 for control text, selected item and panel header.
- Must close on Escape/outside click.
- Keyboard behavior consistent with `role="listbox"`.
- Screen readers announce selection (NVDA/JAWS/VoiceOver).
- **Clearable**: clear button visible when there’s value, focusable, with `aria-label`; clearing emits `null`. 
- **Mobile**: touch-friendly targets; panel stays within the viewport; filter remains sticky at the top.

---

## Roadmap / ideas
- [x] **ControlValueAccessor** for `formControlName`/`ngModel`.
- [x] **Clear button** (×) inside the control.
- [x] **Typeahead**: typing selects (closed) or highlights (open) the option.
- [x] **Groups** (`group` field, with `role="group"`).
- [ ] **Async** data + skeleton in panel.
- [ ] **Virtual scroll** for large lists.
- [ ] Optional **Portal/Overlay** to escape clipping containers.

---

## Licença

MIT — use e adapte à vontade dentro do projeto.

