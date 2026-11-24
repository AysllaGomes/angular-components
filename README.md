<p align="right"><a href="./README.pt-BR.md">Português (BR)</a></p>

[![Deploy](https://github.com/AysllaGomes/angular-components/actions/workflows/deploy.yml/badge.svg)](.github/workflows/deploy.yml)
### **[Site](https://aysllagomes.github.io/angular-components/)** · **[Demo](https://aysllagomes.github.io/angular-components/demo)**

- **[CHANGELOG.md](./CHANGELOG.md):**
---

# Angular Components (Standalone, HTML + Sass)

> **Purpose:** build **reusable UI components** (e.g., **ActionBar**, **Dialog**, Select, Checkbox, Radio, Switch, TreeSelect, Stepper, Tabs, Table, Pagination, Toast, Tooltip) using **Angular Standalone** with plain **HTML + Sass**, **without UI frameworks**. Lightweight, accessible, and easy to extract/“decapsulate” when needed.

- **Local:** `http://localhost:4200/` (presentation) and `http://localhost:4200/demo` (every component, live)
- **Stack:** Angular 22 (standalone, signals, zoneless, SSR), Sass (`.sass`), CSS Custom Properties (theming), Vitest. Node 24 (`.nvmrc`).

---

## Components

| Component                | Description                                                                                                                                      | Docs                                                                                                                      | Demo               |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|--------------------|
| **ActionBar**            | Slide-over side sheet with title, content and footer actions. Sizes `sm`/`md`/`lg`/`auto`, accent-aware theming, focus trap, ESC/backdrop close. | [EN](src/app/shared/components/actionbar/actionbar.en.md) · [PT-BR](src/app/shared/components/actionbar/actionbar.md)     | `/demo#actionbar`  |
| **Button (`appButton`)** | Directive for styling buttons/links (solid/outline/ghost/link; accent/neutral/danger; xs–lg).                                                    | [EN](src/app/shared/components/button/button.en.md) · [PT-BR](src/app/shared/components/button/button.md)                 | `/demo#button`     |
| **Checkbox**             | Accessible checkbox with partial (indeterminate) state, forms integration (`formControl`/`ngModel`), hint/error. The visual box (`app-checkbox-mark`) is reusable on its own. | [EN](src/app/shared/components/checkbox/checkbox.en.md) · [PT-BR](src/app/shared/components/checkbox/checkbox.md) | `/demo#checkbox` |
| **Checkbox group**       | Multiple choice with a list value (in the order of the options): native `fieldset`/`legend` + checkboxes, optional "Select all" with a partial state, option descriptions, vertical/horizontal, forms (`Validators.required` = at least one), hint/error. | [EN](src/app/shared/components/checkbox-group/checkbox-group.en.md) · [PT-BR](src/app/shared/components/checkbox-group/checkbox-group.md) | `/demo#checkboxgroup` |
| **Radio group**          | Single choice among few visible options: native `fieldset`/`legend` + radios (arrow keys), option descriptions, vertical/horizontal, forms, hint/error. | [EN](src/app/shared/components/radio/radio-group.en.md) · [PT-BR](src/app/shared/components/radio/radio-group.md) | `/demo#radio` |
| **Switch**               | On/off for settings that apply immediately: native checkbox with `role="switch"`, label-first layout for settings lists, forms, hint. | [EN](src/app/shared/components/switch/switch.en.md) · [PT-BR](src/app/shared/components/switch/switch.md) | `/demo#switch` |
| **Dialog**               | Accessible modal dialog with title, content, and primary/secondary actions. Sizes `sm`/`md`/`lg`/`auto`, focus trap, ESC/backdrop close, slots.  | [EN](src/app/shared/components/dialog/dialog.en.md) · [PT-BR](src/app/shared/components/dialog/dialog.md)                 | `/demo#dialog`     |
| **Stepper**              | Horizontal, clickable stepper with states (active, done, disabled) and theme tokens.                                                             | [EN](src/app/shared/components/stepper/stepper.en.md) · [PT-BR](src/app/shared/components/stepper/stepper.md)             | `/demo#stepper`    |
| **Tabs**                 | WAI-ARIA tabs: arrows/Home/End, automatic or manual activation, badge, custom label (icon), disabled tabs, on-demand content (`appTabContent`, `keepAlive`), horizontal scrolling that keeps the open tab visible. | [EN](src/app/shared/components/tabs/tabs.en.md) · [PT-BR](src/app/shared/components/tabs/tabs.md) | `/demo#tabs` |
| **Table**                | Flexible table with row checkboxes, actions (declarative via `[actions]` or `appActions` slot) with tooltips and unavailable-with-reason, chips, custom cells, loading/empty/error states (`error` + `retry`), bulk actions on the selection (`bulkActions`), built-in client or server pagination (`paginate`), columns that collapse into a details row when space runs out (`priority`).                         | [EN](src/app/shared/components/table/table.en.md) · [PT-BR](src/app/shared/components/table/table.md)                     | `/demo#table`      |
| **Pagination**           | Standalone pagination (numeric bubbles + arrows), controlled by `total`, `pageSize`, and `pageIndex`.                                            | [EN](src/app/shared/components/pagination/pagination.en.md) · [PT-BR](src/app/shared/components/pagination/pagination.md) | `/demo#pagination` |
| **Toast**                | Lightweight toast (service + container), accessible and themeable.                                                                               | [EN](src/app/shared/components/toast/toast.en.md) · [PT-BR](src/app/shared/components/toast/toast.md)                     | `/demo#toast`      |
| **Tooltip (`appTooltip`)** | Hint on hover/keyboard focus: as the name of icon-only buttons (`tooltipAsLabel`) or as a description, flips side and stays inside the window, WCAG 1.4.13 (Esc closes, hoverable, persistent). | [EN](src/app/shared/components/tooltip/tooltip.en.md) · [PT-BR](src/app/shared/components/tooltip/tooltip.md) | `/demo#tooltip` |
| **Select**               | Accessible select with optional filter bar and inline clear (“×”), mobile-friendly panel, and i18n-ready labels/errors.                          | [EN](src/app/shared/components/select/select.en.md) · [PT-BR](src/app/shared/components/select/select.md)                 | `/demo#select`     |
| **TreeSelect**           | Select whose options form a tree: single (shows the path, optional `leafOnly`) or checkbox mode (group/partial selection, value = leaf keys or summarized groups), children loaded on demand (`loadChildren`), filter, WAI-ARIA tree keyboard, forms. | [EN](src/app/shared/components/tree-select/tree-select.en.md) · [PT-BR](src/app/shared/components/tree-select/tree-select.md) | `/demo#treeselect` |
| **Forms (validation & masks)** | `AppValidators` (CPF, CNPJ incl. alphanumeric), centralized error messages (`fieldError` pipe, `provideFormErrorMessages`), `appFormValidation` (focus first error on submit), `appMask` input masks and `app-form-field`. | [EN](src/app/shared/forms/forms.en.md) · [PT-BR](src/app/shared/forms/forms.md) | `/demo#validation` |

---

## Texts and languages

The components depend on nothing but Angular, not even an i18n library. Their own texts ("Close", "Select all", pagination arrows, form error messages...) are **English by default** and change in one place:

```ts
// app.config.ts
provideUiLabels(UI_LABELS_PT)                            // everything in Portuguese
provideUiLabels({ table: { empty: 'Nothing here yet' } })  // or only some texts
```

It also accepts a function returning a signal, to follow your app language live. Each component's inputs still win per instance. See [Component texts](src/app/shared/labels/labels.en.md).

## Quality

- `npm run lint` ([angular-eslint](https://github.com/angular-eslint/angular-eslint) + typescript-eslint): TypeScript, Angular templates and **template accessibility** (clickable elements reachable by keyboard, labels, alt text...). The library (`shared/`) must be OnPush; exceptions are written next to the code, with the reason (`eslint-disable-next-line ... -- why`), and an exception that no longer applies is an error. CI runs it first.
- `npm run test:ci` runs the unit tests (Vitest) **and automated accessibility checks** ([axe-core](https://github.com/dequelabs/axe-core)) on every component, in the states that matter (open, with error, disabled...). See `src/app/shared/components/a11y.spec.ts`.
- `npm run test:shuffle` runs the same suite with the spec files in random order, one at a time. Specs share one environment, so a test that leaves something behind (fake timers, listeners, elements in `<body>`) only breaks another one in some orders — as can happen in CI. The seed is printed at the start; repeat a failing order with `SEED=1234 npm run test:shuffle` (PowerShell: `$env:SEED=1234; npm run test:shuffle`).
- CI runs them on every push and pull request; the deploy only publishes when they pass.
- Color contrast is checked by a matrix in the browser (`e2e/contrast.spec.ts`): light and dark themes × the 5 accent colors × every text that uses the accent (solid/outline/ghost/link buttons, Dialog actions, current page, current step, primary buttons), hover included, at ≥ 4.5:1. jsdom does not render colors, so this runs with `npm run e2e`.
- `npm run check:css` makes sure every CSS variable the components use has a default (`var(--x, value)`), so a component copied into another project keeps its look without this project's `styles.sass`; CI runs it before the tests. The global theme still overrides those defaults (light/dark, accent colors).
- Each component's docs have a **What to copy** section generated from the real imports (`npm run docs:copy`): its folder (types included), the components and helper files it uses, and any global style. `npm run check:copy` fails in CI if a section gets out of date, and `npm run check:copy-compile` copies only what each section lists into an empty folder and compiles it (strict TypeScript), so the list is proven to be enough. `npm run check:api` fails if a public input, model or output is missing from a component's docs (PT or EN).
- `npm run check:links` (after `npm run build`) reads the prerendered site and resolves every internal link the way the browser does, from the `<base href>` (`/angular-components/` on GitHub Pages): it fails if a link leaves the site, points to a page that does not exist, or to an anchor (`#id`) missing from the target page. CI runs it before publishing.
- `npm run e2e` (after `npm run build`) runs the main flows in a real browser ([Playwright](https://playwright.dev), Chromium), on the site served the way GitHub Pages serves it (`scripts/serve-dist.mjs`: under `/angular-components/`, with HTTP 404 inside and outside the site): navigation between pages, Select search with no match, Dialog focus and a Dialog over an ActionBar. It covers what jsdom cannot see (real focus, `inert`, base href). CI runs it before publishing; first time locally: `npx playwright install chromium`.

## License

MIT — feel free to use, adapt, and contribute.
