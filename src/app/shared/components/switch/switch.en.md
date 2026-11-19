<p align="right"><a href="./switch.md">Português (BR)</a></p>

# Switch

On/off for **settings that apply immediately** (e.g. "Notifications"). Built on a **native** `<input type="checkbox" role="switch">`, using the Checkbox color tokens (`--cb-*`).

- **File:** `src/app/shared/components/switch/switch.component.ts`

> **Switch or Checkbox?** A switch changes something right away. To accept terms, check items in a list or make choices that only apply when a form is submitted, use `app-checkbox`.

## Usage

```html
<app-switch [(checked)]="notifications">Email notifications</app-switch>

<!-- settings list: label on the left, switch on the right -->
<app-switch labelFirst [formControl]="compactMode">Compact mode</app-switch>
```

The **label is the content**. With no visible text, use `ariaLabel`.

## API

### Inputs

| Input        | Type             | Default | Description |
|--------------|------------------|---------|-------------|
| `checked`    | `boolean`        | `false` | On. Two-way via `[(checked)]`; with forms, use `formControl`/`ngModel`. |
| `disabled`   | `boolean`        | `false` | Disables it (the form can too). |
| `labelFirst` | `boolean`        | `false` | Label on the left and switch on the right, full width. |
| `hint`       | `string \| null` | `null`  | Helper text, linked via `aria-describedby`. |
| `ariaLabel`  | `string \| null` | `null`  | Screen reader label with no visible text. |
| `name`       | `string \| null` | `null`  | Native input `name`. |

### Outputs

| Output          | Payload   | When |
|-----------------|-----------|------|
| `checkedChange` | `boolean` | The user turned it on/off. |

### Tokens

Uses `--cb-border`, `--cb-checked-bg`, `--cb-mark`, `--cb-disabled-*` and the `--cb-hover-ring`/`--cb-focus-ring` rings. Size on the component itself: `--sw-w` (40px), `--sw-h` (22px), `--sw-pad` (3px).

## Accessibility

- `role="switch"` on a native checkbox: screen readers announce "on"/"off"; `Space` toggles; clicking the label too.
- Keyboard focus shows a ring on the track. With "reduce motion", the thumb does not animate.
