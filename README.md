<p align="right"><a href="./README.pt-BR.md">Português (BR)</a></p>

[![Deploy](https://github.com/AysllaGomes/angular-components/actions/workflows/deploy.yml/badge.svg)](.github/workflows/deploy.yml)
### **[Demo](https://aysllagomes.github.io/angular-components.github.io/demo)**

- **[CHANGELOG.md](./CHANGELOG.md):**
---

# Angular Components (Standalone, HTML + Sass)

> **Purpose:** build **reusable UI components** (e.g., Stepper, Table, Pagination, Toast) using **Angular Standalone** with plain **HTML + Sass**, **without UI frameworks**. Lightweight, accessible, and easy to extract/“decapsulate” when needed.

- **Local demo:** `http://localhost:4200/demo`
- **Stack:** Angular 20 (standalone, SSR), Sass (`.sass`), CSS Custom Properties (theming).

---

## Components

| Component | Description | Docs | Demo |
|---------:|-------------|------|------|
| **Stepper** | Horizontal, clickable stepper with states (active, done, disabled) and theme tokens. | [EN](src/app/shared/components/stepper/stepper.en.md) · [PT-BR](src/app/shared/components/stepper/stepper.md) | `/demo#stepper` |
| **Table** | Flexible table with row checkboxes, actions (declarative via `[actions]` or `appActions` slot), chips, and custom cells. | [EN](src/app/shared/components/table/table.en.md) · [PT-BR](src/app/shared/components/table/table.md) | `/demo#table` |
| **Pagination** | Standalone pagination (numeric bubbles + arrows), controlled by `total`, `pageSize`, and `pageIndex`. | [EN](src/app/shared/components/pagination/pagination.en.md) · [PT-BR](src/app/shared/components/pagination/pagination.md) | `/demo#pagination` |
| **Toast** | Lightweight toast (service + container), accessible and themeable. | [EN](src/app/shared/components/toast/toast.en.md) · [PT-BR](src/app/shared/components/toast/toast.md) | `/demo#toast` |

---

## Global theming

```sass
/* Global theming (runtime) */
:root
  /* Accent (default = teal) */
  --accent: #058075

  /* Stepper */
  --stepper-color-active: var(--accent)
  --stepper-color-done:   var(--accent)
  --stepper-color-default: #c8ccd2
  --stepper-color-disabled: #dcdfe4
  --stepper-text: var(--fg)
  --stepper-caption: var(--muted)
  --stepper-connector: #e6e9ed
  --stepper-bullet-bg: #ffffff
  --stepper-color-number-active: #ffffff

  /* Table (header derives from accent) */
  --tbl-header-bg: color-mix(in srgb, var(--accent) 28%, #0f1720)
  --tbl-header-fg: #ffffff
  --tbl-row-bg: #ffffff
  --tbl-row-border: #e6e9ed
  --tbl-fg: #0f1720
  --tbl-muted: #6b7280
  --tbl-action: var(--accent)
  --tbl-header-hover: color-mix(in srgb, var(--accent) 36%, #0f1720)

  /* Pagination */
  --pg-active-bg: var(--accent)
  --pg-active-fg: #ffffff
  --pg-page-bg: #f2f4f7
  --pg-ghost-bg: #eeeeee
  --pg-hover: color-mix(in srgb, var(--accent) 12%, white)
  --pg-fg: #0f1720

  /* Toast */
  --toast-radius: .75rem
  --toast-shadow: 0 6px 20px rgba(0,0,0,.12)

/* Dark overrides */
:root[data-theme="dark"]
  --bg: #0c0d10
  --fg: #e7eaf0
  --tbl-header-bg: color-mix(in srgb, var(--accent) 44%, #0b1220)
  --tbl-header-fg: #e7eaf0
  --pg-page-bg: #1f2937
  --pg-ghost-bg: #111827
  --pg-active-fg: #0b1220

/* Accent presets */
:root[data-accent="teal"]
  --accent: #058075
:root[data-accent="orange"]
  --accent: #D17A30
:root[data-accent="violet"]
  --accent: #6D5BD0
```

---

## License

MIT — feel free to use, adapt, and contribute.
