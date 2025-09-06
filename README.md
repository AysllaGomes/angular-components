<p align="right"><a href="./README.pt-BR.md">Português (BR)</a></p>

[![Deploy](https://github.com/AysllaGomes/angular-components/actions/workflows/deploy.yml/badge.svg)](.github/workflows/deploy.yml)
### **[Demo](https://aysllagomes.github.io/angular-components.github.io/demo)**

- **[CHANGELOG.md](./CHANGELOG.md):**
---

# Angular Components (Standalone, HTML + Sass)

> **Purpose:** build **reusable UI components** (e.g., ActionBar, Select, Stepper, Table, Pagination, Toast) using **Angular Standalone** with plain **HTML + Sass**, **without UI frameworks**. Lightweight, accessible, and easy to extract/“decapsulate” when needed.

- **Local demo:** `http://localhost:4200/demo`
- **Stack:** Angular 20 (standalone, SSR), Sass (`.sass`), CSS Custom Properties (theming).

---

## Components

| Component      | Description                                                                                                                                      | Docs                                                                                                                      | Demo               |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|--------------------|
| **ActionBar**  | Slide-over side sheet with title, content and footer actions. Sizes `sm`/`md`/`lg`/`auto`, accent-aware theming, focus trap, ESC/backdrop close. | [EN](src/app/shared/components/actionbar/actionbar.en.md) · [PT-BR](src/app/shared/components/actionbar/actionbar.md)     | `/demo#actionbar`  |
| **Stepper**    | Horizontal, clickable stepper with states (active, done, disabled) and theme tokens.                                                             | [EN](src/app/shared/components/stepper/stepper.en.md) · [PT-BR](src/app/shared/components/stepper/stepper.md)             | `/demo#stepper`    |
| **Table**      | Flexible table with row checkboxes, actions (declarative via `[actions]` or `appActions` slot), chips, and custom cells.                         | [EN](src/app/shared/components/table/table.en.md) · [PT-BR](src/app/shared/components/table/table.md)                     | `/demo#table`      |
| **Pagination** | Standalone pagination (numeric bubbles + arrows), controlled by `total`, `pageSize`, and `pageIndex`.                                            | [EN](src/app/shared/components/pagination/pagination.en.md) · [PT-BR](src/app/shared/components/pagination/pagination.md) | `/demo#pagination` |
| **Toast**      | Lightweight toast (service + container), accessible and themeable.                                                                               | [EN](src/app/shared/components/toast/toast.en.md) · [PT-BR](src/app/shared/components/toast/toast.md)                     | `/demo#toast`      |
| **Select**     | Lightweight, accessible and themeable select.                                                                                                    | [EN](src/app/shared/components/select/select.en.md) · [PT-BR](src/app/shared/components/select/select.md)                 | `/demo#select`     |

---

## License

MIT — feel free to use, adapt, and contribute.
