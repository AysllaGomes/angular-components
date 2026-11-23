<p align="right"><a href="./radio-group.md">Português (BR)</a></p>

# Radio group

> Default texts in **English**, changeable in one place with [`provideUiLabels`](../../labels/labels.en.md) (`labels.*` in the tables below); each instance's input wins.

**Single** choice among a few visible options. Built on a **native** `<fieldset>` + `<legend>` and `<input type="radio">`, using the Checkbox color tokens (`--cb-*`).

- **File:** `src/app/shared/components/radio/radio-group.component.ts`
- **Model:** `src/app/shared/model/interface/radio/radio-option.interface.ts`

| When to use | Component |
|---|---|
| Few options (up to ~5), all visible | **`app-radio-group`** |
| Many options, or little space | `app-select` |
| Turn a setting on/off | `app-switch` |

## Usage

```ts
plans: RadioOption<string>[] = [
  { label: 'Basic', value: 'basic', description: 'Up to 3 projects, free' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise', disabled: true },
];
```

```html
<app-radio-group label="Plan" [options]="plans" [(value)]="plan" />

<app-radio-group label="Shipping" orientation="horizontal" required
  [options]="methods" [formControl]="shipping"
  [error]="shipping.touched && shipping.invalid ? 'Choose a shipping method.' : null" />
```

## API

### Inputs

| Input           | Type                         | Default       | Description |
|-----------------|------------------------------|---------------|-------------|
| `options`       | `RadioOption<T>[]`           | —             | `{ label, value, disabled?, description? }`. |
| `label`         | `string`                     | `''`          | Group name (becomes the `<legend>`). |
| `value`         | `T \| null`                  | `null`        | Two-way via `[(value)]`; with forms, use `formControl`/`ngModel`. |
| `orientation`   | `'vertical' \| 'horizontal'` | `'vertical'`  | Options layout (horizontal wraps when space runs out). |
| `name`          | `string \| null`             | generated     | Inputs `name` (unique per group by default). |
| `disabled`      | `boolean`                    | `false`       | Disables the whole group (the form can too). |
| `required`      | `boolean`                    | `false`       | Shows "required" and passes `required`. To validate, use `Validators.required`. |
| `hint` / `error`| `string \| null`             | `null`        | Helper text / error (error sets `aria-invalid`). |
| `requiredLabel` | `string`                     | `labels.required` | Indicator text (i18n). |

### Outputs

| Output        | Payload     | When |
|---------------|-------------|------|
| `valueChange` | `T \| null` | The user picked another option. |

## Accessibility and keyboard

- `<fieldset>` + `<legend>`: screen readers announce the group name when entering it.
- **Native** radios sharing a `name`: `Tab` enters the group (on the checked option) and leaves it; **arrows** change the option, skipping disabled ones; `Space` checks the focused one.
- Each option `description`, the hint and the error are linked via `aria-describedby`.
