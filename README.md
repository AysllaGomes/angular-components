<p align="right"><a href="./README.pt-BR.md">Português (BR)</a></p>

# Angular Components (Standalone, HTML + Sass)

> **Purpose:** build **reusable UI components** (e.g., Stepper, Table, Pagination) using **Angular Standalone** with plain **HTML + Sass**, **without UI frameworks**. Lightweight, accessible, and easy to extract/“decapsulate” when needed.

- **Local demo:** `http://localhost:4200/demo`
- **Stack:** Angular 20 (standalone, SSR), Sass (`.sass`), CSS Custom Properties (theming).

---

## Components

| Component | Description | Documentation | Demo |
|---------:|-------------|---------------|------|
| **Stepper** | Horizontal, clickable stepper with states (active, done, disabled) and theme tokens. | `src/app/shared/components/stepper/stepper.md` | `/demo#stepper` |
| **Table** | Flexible table with row checkboxes, actions (declarative via `[actions]` or `appActions` slot), chips, and custom cells. | `src/app/shared/components/table/table.md` | `/demo#table` |
| **Pagination** | Standalone pagination (numeric bubbles + arrows), controlled by `total`, `pageSize`, and `pageIndex`. | `src/app/shared/components/pagination/pagination.md` | `/demo#pagination` |

> Each component should live under `src/app/shared/components/<name>/` with its own **README/MD** covering **API**, **examples**, **theme tokens**, and **best practices**.

---

## Suggested structure

```
src/
  app/
    demo/                     # demo page (header/footer/sections)
      demo-page.component.*
      sections/
        stepper-demo.component.*
        table-demo.component.*
        pagination-demo.component.*
    shared/
      components/
        stepper/
          stepper.component.ts
          stepper.component.html
          stepper.component.sass
          stepper.md
        table/
          table.component.ts
          table.component.html
          table.component.sass
          table.directives.ts   # appCell / appActions
          table.md
        pagination/
          pagination.component.ts
          pagination.component.html
          pagination.component.sass
          pagination.md
    app.routes.ts
  styles.sass                  # global tokens/variables
```

---

## How to run

### Dev server
```bash
ng serve
```
Open `http://localhost:4200/demo`. Live reload on save.

### Build
```bash
ng build
```
Artifacts in `dist/` (server/SSR per `angular.json`).

### Tests
```bash
ng test
```

---

## Pattern for new components

1. **Standalone:** set `standalone: true` and, when feasible, `ChangeDetectionStrategy.OnPush`.
2. **Files:** keep `*.component.ts/html/sass` + a per-component `README.md` in the same folder.
3. **Theming:** use **CSS Custom Properties** with fallbacks, e.g. `var(--badge-fg, #1f2937)`.
4. **Accessibility:** semantic markup and proper `role`/`aria-*`/focus where applicable.
5. **Demo:** add a section to the demo page and a header link.

### Blueprint
```ts
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-name',
  standalone: true,
  templateUrl: './name.component.html',
  styleUrl: './name.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NameComponent {
  @Input() disabled = false;
  @Output() action = new EventEmitter<void>();
}
```

```html
<section class="name" [class.is-disabled]="disabled">
  <!-- markup -->
</section>
```

```sass
/* name.component.sass */
.name
  color: var(--name-text, #1f2937)
```

---

## Global theming

Define global tokens in `styles.sass` (Stepper, Table, Pagination) and override per page as needed:

```sass
:root
  /* Stepper */
  --stepper-color-active:   #00a39b
  --stepper-color-done:     #2fbf71
  --stepper-color-default:  #c8ccd2
  --stepper-color-disabled: #dcdfe4
  --stepper-text:           #1f2937
  --stepper-caption:        #6b7280
  --stepper-connector:      #e6e9ed
  --stepper-bullet-bg:      #ffffff
  --stepper-color-number-active: #ffffff

  /* Table */
  --tbl-header-bg: #07363c
  --tbl-header-fg: #ffffff
  --tbl-row-bg: #f2f5f7
  --tbl-row-gray-medium: #ffffff
  --tbl-row-border: #e6e9ed
  --tbl-fg: #0f1720
  --tbl-muted: #6b7280
  --tbl-action: #058075

  /* Pagination */
  --pg-active-bg: var(--tbl-action, #058075)
  --pg-active-fg: #ffffff
  --pg-page-bg: #eef6f4
  --pg-ghost-bg: #eeeeee
  --pg-hover: color-mix(in oklab, var(--pg-active-bg) 12%, white)
  --pg-fg: #0f1720
```

---

## SSR notes

For services/utilities touching `window`, `document`, or `localStorage`, guard with `isPlatformBrowser`. The current `ThemeService` is **SSR-safe** and can serve as an example.

---

## Roadmap

- [ ] New demo sections per component
- [ ] Stepper: vertical / icons / keyboard navigation
- [ ] Table: sorting, empty/loading/error states, pagination, bulk actions
- [ ] Pagination: first/last buttons, keyboard shortcuts, compact variant
- [ ] Additional components (Badge, Toast, page-size selector)

---

## License

MIT — feel free to use, adapt, and contribute.
