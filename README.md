<p align="right"><a href="./README.pt-BR.md">Português (BR)</a></p>

[![Deploy](https://github.com/AysllaGomes/angular-components/actions/workflows/deploy.yml/badge.svg)](.github/workflows/deploy.yml)
### **[Demo](https://aysllagomes.github.io/angular-components/demo)**

- **[CHANGELOG.md](./CHANGELOG.md):**
---

# Angular Components (Standalone, HTML + Sass)

> **Purpose:** build **reusable UI components** (e.g., **ActionBar**, **Dialog**, Select, Checkbox, Radio, Switch, TreeSelect, Stepper, Table, Pagination, Toast) using **Angular Standalone** with plain **HTML + Sass**, **without UI frameworks**. Lightweight, accessible, and easy to extract/“decapsulate” when needed.

- **Local demo:** `http://localhost:4200/demo`
- **Stack:** Angular 22 (standalone, signals, zoneless, SSR), Sass (`.sass`), CSS Custom Properties (theming), Vitest. Node 24 (`.nvmrc`).

---

## Components

| Component                | Description                                                                                                                                      | Docs                                                                                                                      | Demo               |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|--------------------|
| **ActionBar**            | Slide-over side sheet with title, content and footer actions. Sizes `sm`/`md`/`lg`/`auto`, accent-aware theming, focus trap, ESC/backdrop close. | [EN](src/app/shared/components/actionbar/actionbar.en.md) · [PT-BR](src/app/shared/components/actionbar/actionbar.md)     | `/demo#actionbar`  |
| **Button (`appButton`)** | Directive for styling buttons/links (solid/outline/ghost/link; accent/neutral/danger; xs–lg).                                                    | [EN](src/app/shared/components/button/button.en.md) · [PT-BR](src/app/shared/components/button/button.md)                 | `/demo#button`     |
| **Checkbox**             | Accessible checkbox with partial (indeterminate) state, forms integration (`formControl`/`ngModel`), hint/error. The visual box (`app-checkbox-mark`) is reusable on its own. | [EN](src/app/shared/components/checkbox/checkbox.en.md) · [PT-BR](src/app/shared/components/checkbox/checkbox.md) | `/demo#checkbox` |
| **Radio group**          | Single choice among few visible options: native `fieldset`/`legend` + radios (arrow keys), option descriptions, vertical/horizontal, forms, hint/error. | [EN](src/app/shared/components/radio/radio-group.en.md) · [PT-BR](src/app/shared/components/radio/radio-group.md) | `/demo#radio` |
| **Switch**               | On/off for settings that apply immediately: native checkbox with `role="switch"`, label-first layout for settings lists, forms, hint. | [EN](src/app/shared/components/switch/switch.en.md) · [PT-BR](src/app/shared/components/switch/switch.md) | `/demo#switch` |
| **Dialog**               | Accessible modal dialog with title, content, and primary/secondary actions. Sizes `sm`/`md`/`lg`/`auto`, focus trap, ESC/backdrop close, slots.  | [EN](src/app/shared/components/dialog/dialog.en.md) · [PT-BR](src/app/shared/components/dialog/dialog.md)                 | `/demo#dialog`     |
| **Stepper**              | Horizontal, clickable stepper with states (active, done, disabled) and theme tokens.                                                             | [EN](src/app/shared/components/stepper/stepper.en.md) · [PT-BR](src/app/shared/components/stepper/stepper.md)             | `/demo#stepper`    |
| **Table**                | Flexible table with row checkboxes, actions (declarative via `[actions]` or `appActions` slot), chips, and custom cells.                         | [EN](src/app/shared/components/table/table.en.md) · [PT-BR](src/app/shared/components/table/table.md)                     | `/demo#table`      |
| **Pagination**           | Standalone pagination (numeric bubbles + arrows), controlled by `total`, `pageSize`, and `pageIndex`.                                            | [EN](src/app/shared/components/pagination/pagination.en.md) · [PT-BR](src/app/shared/components/pagination/pagination.md) | `/demo#pagination` |
| **Toast**                | Lightweight toast (service + container), accessible and themeable.                                                                               | [EN](src/app/shared/components/toast/toast.en.md) · [PT-BR](src/app/shared/components/toast/toast.md)                     | `/demo#toast`      |
| **Select**               | Accessible select with optional filter bar and inline clear (“×”), mobile-friendly panel, and i18n-ready labels/errors.                          | [EN](src/app/shared/components/select/select.en.md) · [PT-BR](src/app/shared/components/select/select.md)                 | `/demo#select`     |
| **TreeSelect**           | Select whose options form a tree: single (shows the path, optional `leafOnly`) or checkbox mode (group/partial selection, value = leaf keys), filter, WAI-ARIA tree keyboard, forms. | [EN](src/app/shared/components/tree-select/tree-select.en.md) · [PT-BR](src/app/shared/components/tree-select/tree-select.md) | `/demo#treeselect` |

---

## Quality

- `npm run test:ci` runs the unit tests (Vitest) **and automated accessibility checks** ([axe-core](https://github.com/dequelabs/axe-core)) on every component, in the states that matter (open, with error, disabled...). See `src/app/shared/components/a11y.spec.ts`.
- CI runs them on every push and pull request; the deploy only publishes when they pass.
- Color contrast is checked in the browser, in both themes (jsdom does not render colors).

## License

MIT — feel free to use, adapt, and contribute.
