# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [3.6.0](https://github.com/AysllaGomes/angular-components/compare/v3.5.0...v3.6.0) (2026-11-23)

### ⚠ Changed paths (if you copied components before)

* the public types now live next to each component, in `<x>.types.ts` (e.g. `components/table/table.types.ts` with `ColumnDef`, `TableAction`, `TableBulkAction`...); `shared/model/` no longer exists ([2f6172c](https://github.com/AysllaGomes/angular-components/commit/2f6172c))
* `ToastService` moved to `components/toast/toast.service.ts` ([2f6172c](https://github.com/AysllaGomes/angular-components/commit/2f6172c))

### Features

* **copy:** copying a component is now simpler: each folder carries its own types, so the "What to copy" lists got shorter (Table: from 33 to 24 files; Toast: from 13 to 10), and TreeSelect still copies without Select ([2f6172c](https://github.com/AysllaGomes/angular-components/commit/2f6172c))

### Bug Fixes

* **copy:** the Dialog and ActionBar lists now show `a11y/modal-session.ts` under "Helper files"; it was counted in the totals but missing from the list, and without it the Dialog does not compile ([2f6172c](https://github.com/AysllaGomes/angular-components/commit/2f6172c))
* **site:** the component page styles are back under the 5 kB budget (they went 6 bytes over in 3.5.0) ([2f6172c](https://github.com/AysllaGomes/angular-components/commit/2f6172c))

### Internal

* `src/app/shared/` is the library only (components, forms, labels, a11y); the site's translations, services and header/footer moved to `src/app/site/`, and the demo table's sample data types to `demo/sections/table/` ([2f6172c](https://github.com/AysllaGomes/angular-components/commit/2f6172c))
* verified: the Table, TreeSelect, Dialog, Toast and Forms copy lists compile on their own in an empty folder

## [3.5.0](https://github.com/AysllaGomes/angular-components/compare/v3.4.0...v3.5.0) (2026-11-23)

### Features

* **docs:** the other 12 components got "Why it exists" and "When to use", so all 15 component pages are complete in both languages ([426050e](https://github.com/AysllaGomes/angular-components/commit/426050e))
  * **Button:** docs rewritten with Usage, Accessibility and the full API, including `block`, `iconOnly`, `busy` and `disabled`, which the directive had but the docs did not; fixes `variante=` in the PT docs
  * **Dialog:** the example no longer uses the demo's `| t` pipe and works in any project
  * **Pagination:** the EN docs got the standalone usage example
  * **Forms:** new API and Accessibility sections; **Toast:** service methods in a table; **Tooltip:** inputs table under `### Inputs`
* **site:** header, footer and every page share the same width (up to 1600px) and side margin (24px; 16px on phones); on wide screens there is less empty space at the sides, and the header lines up with the side menu ([c77339b](https://github.com/AysllaGomes/angular-components/commit/c77339b))
* **site:** on desktop the top menu sits right next to "Angular Components", and language, theme and colors stay on the right ([e2b1b4e](https://github.com/AysllaGomes/angular-components/commit/e2b1b4e))

### Internal

* the page generator takes the example from "Examples" when there is no "Usage", finds "accessibility" anywhere in a heading, accepts `## API — <name>`, and the summary no longer skips paragraphs that start in bold ([426050e](https://github.com/AysllaGomes/angular-components/commit/426050e))

## [3.4.0](https://github.com/AysllaGomes/angular-components/compare/v3.3.0...v3.4.0) (2026-11-23)

### Features

* **site:** each component has its own page at `/componentes/<id>` (all 15, prerendered): summary, example, why it exists, when to use it, API, accessibility, what to copy and theme tokens, with previous/next ([7cb6a24](https://github.com/AysllaGomes/angular-components/commit/7cb6a24))
  * Tabs, Table and Select are complete, with a live example and its code side by side (the same code as the docs, in the page's language); the other 12 show the code and link to the demo, and fill in on their own when their docs get "Why it exists" and "When to use"
  * the API tables are shown in the library's own Tabs
  * side menu by group (collapsed on phones), breadcrumb and "On this page"; an unknown component shows the 404 page
* **a11y:** real axe report per component and state, written by the accessibility tests on every deploy and published with the site (axe version, date, commit and a link to the GitHub run) ([aa7fea9](https://github.com/AysllaGomes/angular-components/commit/aa7fea9))
  * each component page shows "0 violations in N checked states", one bar per state (the numbers are in a real table; the bars only draw them), and explains each item axe could not decide on its own
  * new [Accessibility](https://aysllagomes.github.io/angular-components/acessibilidade) page: today **15 components, 25 states, 0 violations**, with how it is checked, the rules turned off in the tests and why, and what axe does not see
  * when the report is missing, the pages say so instead of showing numbers
* **docs:** the component pages are generated from the `.md` files (PT and EN), so the docs stay the single source; `npm run docs:pages` regenerates them and `npm run check:pages` fails in CI and deploy when they are out of date ([82dffbd](https://github.com/AysllaGomes/angular-components/commit/82dffbd))
* **site:** the top menu now reflects the site: **Components ▾** (the 4 groups side by side, each item leading to its page), **Demo** and **Accessibility**, with the current page marked ([d956e68](https://github.com/AysllaGomes/angular-components/commit/d956e68))
  * the menu no longer jumps straight to demo sections; each component page has "See in the demo", and links like `/demo#table` keep working
* **site:** the home catalog ("Explore Table") and the 404 suggestions now lead to the component pages, and the footer links to the Accessibility page ([7cb6a24](https://github.com/AysllaGomes/angular-components/commit/7cb6a24))
* **labels:** new `selectTitle` label for the Select sheet title on phones (was a fixed `'Selecionar'`); optional in `provideUiLabels` ([7cb6a24](https://github.com/AysllaGomes/angular-components/commit/7cb6a24))

### Bug Fixes

* **actionbar:** the sheet is a `<div role="dialog">` instead of an `<aside>`, which does not accept that role ([aa7fea9](https://github.com/AysllaGomes/angular-components/commit/aa7fea9))
* **select, treeselect:** `aria-controls` only points to the list while it is open (closed, the list does not exist) ([aa7fea9](https://github.com/AysllaGomes/angular-components/commit/aa7fea9))

### Internal

* deploy fails if the component pages or the Accessibility page are not prerendered ([7cb6a24](https://github.com/AysllaGomes/angular-components/commit/7cb6a24))

## [3.3.0](https://github.com/AysllaGomes/angular-components/compare/v3.2.0...v3.3.0) (2026-11-23)

### Features

* **components:** they now work when copied into another project, without this project's `styles.sass`: every CSS variable they use has a default (`var(--x, value)`, the resolved light-theme value), 268 uses in 18 files ([a19f2ca](https://github.com/AysllaGomes/angular-components/commit/a19f2ca))
  * the global theme still overrides the defaults (light/dark, the 5 accents); without it, components keep their look in the default teal
  * checked in the browser with the global stylesheet disabled: Switch, Radio, Table, Pagination and Stepper keep their look
  * `npm run check:css` fails if a component uses a variable without a default, and runs in CI and deploy before the tests
* **docs:** each component's docs have a **What to copy** section generated from the real imports: its folder, the components it uses (including indirect ones, e.g. Table → Button via Pagination), the types file by file, `labels/`, services, the global styles to add (Button, Tooltip), and the total ([93b3a37](https://github.com/AysllaGomes/angular-components/commit/93b3a37))
  * `npm run docs:copy` regenerates the sections; `npm run check:copy` fails in CI and deploy when one is out of date
  * checked: the 33 files listed for the Table compile on their own in an isolated folder, and removing any one fails
* **site:** the home's "Copy the component" step now points to that list instead of claiming every component lives in its own folder ([93b3a37](https://github.com/AysllaGomes/angular-components/commit/93b3a37))

### Internal

* Table chips moved to an internal `app-table-chip` (same `chip` / `chip--<variant>` classes), and the Table styles were trimmed (private `:host` tokens, dead breakpoint widths removed) to stay within the 5 kB budget with the new defaults ([a19f2ca](https://github.com/AysllaGomes/angular-components/commit/a19f2ca))

## [3.2.0](https://github.com/AysllaGomes/angular-components/compare/v3.1.0...v3.2.0) (2026-11-23)

### Features

* **site:** a real 404 page: unknown addresses no longer land silently on the home; the page says what happened, shows the address as typed and offers ways out (home, demo) ([d58d707](https://github.com/AysllaGomes/angular-components/commit/d58d707))
  * "Did you mean…?": when the address looks like a component, it links to its demo section; it understands English and Portuguese names and small typos (`/tabla` → Table, `/dialgo` → Dialog), and stays quiet for unrelated addresses
  * component search by name or alias ("dica" finds Tooltip), with the result count announced to screen readers and an empty state
  * one filled button at a time: with a suggestion, "Go to the home page" becomes secondary
  * the tab title follows the language, and the page asks search engines not to index it (`noindex`, removed when leaving); the HTTP 404 status already comes from GitHub Pages
  * checked with axe (no violations), with and without a suggestion
* **site:** the components list (ids and aliases) lives in one place, `src/app/site/site-components.ts`, shared by the home catalog and the 404 page ([d58d707](https://github.com/AysllaGomes/angular-components/commit/d58d707))

## [3.1.0](https://github.com/AysllaGomes/angular-components/compare/v3.0.0...v3.1.0) (2026-11-23)

### Features

* **site:** presentation home at the [site root](https://aysllagomes.github.io/angular-components/): what the project is, why use it and how to start; the full demo stays at `/demo` (links like `/demo#table` keep working) ([b8f3864](https://github.com/AysllaGomes/angular-components/commit/b8f3864))
  * the home uses the library itself: the showcase is the real Table (selection, bulk actions, collapsible columns, pagination) and the two views ("For developers" / "How it was built") are the library Tabs
  * "By the numbers" only states what the repository proves (no dependency besides Angular, axe on every component, PT·EN, 2 themes × 5 accents), and avoids an exact test count that would get stale
  * catalog of the 15 components, each link naming its component for screen readers; English and Portuguese, live with the rest of the texts
  * checked with axe (no violations) in a new test, light/dark, and at phone width
* **demo:** the header is shared by both pages; the brand leads to the home, and section links clicked outside the demo navigate to `/demo#section` without reloading ([b8f3864](https://github.com/AysllaGomes/angular-components/commit/b8f3864))

### Bug Fixes

* **demo:** following a `/demo#section` link no longer hides the section title behind the sticky header (the router scroll now discounts the header height) ([b8f3864](https://github.com/AysllaGomes/angular-components/commit/b8f3864))
* **demo:** the table wrapper's scroll shadow painted its whole background, showing a gray band in the space kept for the bulk actions bar; the shadows now only cover the edges ([b8f3864](https://github.com/AysllaGomes/angular-components/commit/b8f3864))

### CI

* The deploy no longer writes a root page redirecting to `/demo/`: the root is the prerendered home, `404.html` is the client-only shell, and the job fails if either page was not prerendered ([b8f3864](https://github.com/AysllaGomes/angular-components/commit/b8f3864))

## [3.0.0](https://github.com/AysllaGomes/angular-components/compare/v2.11.0...v3.0.0) (2026-11-23)

### ⚠ BREAKING CHANGES

* **The components' default texts are now English.** To keep everything as in 2.x, add one line to your app config: `provideUiLabels(UI_LABELS_PT)` ([b3d298d](https://github.com/AysllaGomes/angular-components/commit/b3d298d))
* `provideFormErrorMessages` no longer accepts the demo's i18n keys (e.g. `'form.error.cnpj'`); pass the text (with `{{param}}`) or a function ([b3d298d](https://github.com/AysllaGomes/angular-components/commit/b3d298d))

### Features

* **labels:** components depend on nothing but Angular, not even an i18n library: their own texts come from one dependency-free place, `src/app/shared/labels` ([b3d298d](https://github.com/AysllaGomes/angular-components/commit/b3d298d))
  * `UI_LABELS_EN` (default) and `UI_LABELS_PT` presets; `provideUiLabels({...})` changes only what it names (groups can be partial)
  * `provideUiLabels(() => ...)` runs in the injection context and may return a signal, so the texts follow your app language live
  * each component's text inputs (`emptyMessage`, `closeAriaLabel`, `rangeLabel`...) keep their names and still win per instance
  * texts that were hard-coded in templates are now changeable too: "Close" (Dialog, ActionBar, Toast), "Select all"/"Select row" (Table), "Filter options" (Select), "Notifications" (Toast)
  * form error messages (`fieldError`, `FormErrorsService`) come from `labels.formErrors`, still overridable with `provideFormErrorMessages`
* **pagination:** no longer depends on the project i18n (`TPipe`), so it can be copied on its own ([b3d298d](https://github.com/AysllaGomes/angular-components/commit/b3d298d))

### Docs

* New [Component texts](https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared/labels/labels.en.md) page (PT/EN) with every text, precedence and how to migrate from 2.x; each component's "Default" column now points to `labels.*`; READMEs gain a "Texts and languages" section ([b3d298d](https://github.com/AysllaGomes/angular-components/commit/b3d298d))

### Demo

* Stays bilingual by wiring its own i18n to `provideUiLabels` with a signal (`src/app/app.config.ts`); unused `form.error.*` and pagination keys removed from its dictionary ([b3d298d](https://github.com/AysllaGomes/angular-components/commit/b3d298d))

## [2.11.0](https://github.com/AysllaGomes/angular-components/compare/v2.10.0...v2.11.0) (2026-11-23)

### Features

* **table:** collapsible columns: when the table gets wider than the available space, it hides columns by `ColumnDef.priority` instead of scrolling horizontally, and a "Mostrar detalhes" button on each row opens the hidden values ([8328d3e](https://github.com/AysllaGomes/angular-components/commit/8328d3e))
  * `priority` 1 (default) never hides; higher hides first (ties: the rightmost), and columns come back in reverse order when there is room again
  * measured by the table width (its wrapper), not the screen, so it also works inside a narrow card; tables without `priority` are unchanged, and the ≤ 640px card mode still shows every field
  * the details row shows "Label: value" for the hidden columns, aligned with the first data column; chips and `appCell` custom cells render as in the column
  * the button has `aria-expanded` and `aria-controls` (pointing to the details row), and its column has a screen-reader name; texts: `detailsLabel`, `expandLabel`
  * on the server (SSR) every column renders; collapsing starts in the browser after the first measurement
  * row stripes now come from a class, so a details row keeps the color of its row

### Demo

* Table columns with priorities: "Limite atribuído" hides first, then "Nome impresso" and "Tipo"; "Nome" and "Documento" always stay ([8328d3e](https://github.com/AysllaGomes/angular-components/commit/8328d3e))

### Internal

* The details list is an internal `app-table-detail` component, and the Table styles were trimmed (the expand button reuses `.icon-btn`, merged focus rules, removed no-op declarations) to stay within the 5 kB per-component budget ([8328d3e](https://github.com/AysllaGomes/angular-components/commit/8328d3e))

## [2.10.0](https://github.com/AysllaGomes/angular-components/compare/v2.9.0...v2.10.0) (2026-11-23)

### Features

* **table:** built-in pagination with `paginate`: a footer with the range ("Mostrando 1–5 de 6"), an optional rows-per-page selector and the pages ([e3244d0](https://github.com/AysllaGomes/angular-components/commit/e3244d0))
  * `'client'`: pass all rows in `data` and the table shows the page slice; sorting goes back to the first page, and if `data` shrinks (e.g. a delete on the last page) the table fixes `pageIndex` (not while `loading`)
  * `'server'`: `data` is the current page and the total comes from `totalItems`; the table only emits `pageIndexChange`/`pageSizeChange`
  * `[(pageIndex)]` and `[(pageSize)]` two-way bindings; `pageSizeOptions` shows a native `<select>` and keeps the first visible row on screen when the size changes
  * the footer is hidden on error and without rows, the range is announced to screen readers, and it stays fully in view when the table scrolls horizontally (the table measures the wrapper width)
  * with `paginate="client"`, the `index` in `(action)`, `appCell`/`appActions` and the index-based selection is the position in `data`, not on the page; tables without `paginate` are unchanged
  * texts: `rangeLabel`, `pageSizeLabel`, `paginationLabel`

### Demo

* The table section uses the built-in pagination (2/5/10 per page) instead of slicing and building the footer by hand ([e3244d0](https://github.com/AysllaGomes/angular-components/commit/e3244d0))

### CI

* Site deploy split into `build` and `deploy` jobs: in a single job, `deploy-pages` sometimes looked for the artifact right after the upload and found none (actions/deploy-pages#451), which broke the v2.9.0 deploy ([f75d436](https://github.com/AysllaGomes/angular-components/commit/f75d436))
* Actions updated to their Node 24 versions (checkout v7, setup-node v7, configure-pages v6, upload-pages-artifact v5, deploy-pages v5, action-gh-release v3), removing the Node 20 deprecation warning ([73d49e4](https://github.com/AysllaGomes/angular-components/commit/73d49e4))

## [2.9.0](https://github.com/AysllaGomes/angular-components/compare/v2.8.0...v2.9.0) (2026-11-23)

### Features

* **table:** bulk actions on the selection: with `selectable` and `[bulkActions]`, a bar above the table shows the counter ("3 selecionados"), "Limpar seleção" and the buttons; a click emits `(bulkAction)` with `{ type, keys }` ([54dd651](https://github.com/AysllaGomes/angular-components/commit/54dd651)), ([b32aee9](https://github.com/AysllaGomes/angular-components/commit/b32aee9))
  * the keys include rows selected on other pages (selection already spans pages with `rowKey`); without `rowKey`, indices into `data`
  * `TableBulkAction`: `type`, `label`, `danger` (red), `disabled`/`disabledReason` (stays focusable with `aria-disabled`, reason in the tooltip)
  * `appBulkActions` slot (`keys`, `count`, `clear()`) replaces the buttons; the counter and "Limpar seleção" stay
  * the counter is announced to screen readers on every change; when the buttons go away (cleared selection), focus moves to "select all" instead of `<body>`
  * the bar stays in view when the wrapper scrolls horizontally (`position: sticky`, the table host now follows the table width with `min-width: min-content`)
  * texts: `bulkActionsLabel`, `selectedCountLabel`, `noSelectionLabel`, `clearSelectionLabel`
* **table:** `bulkBarIdle` sets what the bar shows without a selection: `'space'` (default) shows nothing but keeps its space, so the table does not jump when the first row is checked; `'hint'` shows `noSelectionLabel`; `'hidden'` only appears with a selection ([9327b35](https://github.com/AysllaGomes/angular-components/commit/9327b35))

### Demo

* "Exportar" and "Excluir selecionados" bulk actions (delete unavailable when the selection has account holders, and actually removes rows), "Restaurar linhas (n)" and a button cycling the three `bulkBarIdle` modes ([54dd651](https://github.com/AysllaGomes/angular-components/commit/54dd651)), ([9327b35](https://github.com/AysllaGomes/angular-components/commit/9327b35))

### Internal

* The bar is an internal `app-table-bulk-bar` component with its own styles, which keeps the Table under the 5 kB per-component style budget ([54dd651](https://github.com/AysllaGomes/angular-components/commit/54dd651))

## [2.8.0](https://github.com/AysllaGomes/angular-components/compare/v2.7.0...v2.8.0) (2026-11-23)

### Features

* **table:** error state: with `error`, the table shows the message instead of the rows and the empty message, with an icon, announced to screen readers (`role="alert"`) ([f2074b3](https://github.com/AysllaGomes/angular-components/commit/f2074b3))
  * precedence: loading > error > data > empty; no need to clear `error` before retrying, the message only comes back if it is still set when `loading` ends
  * `retryLabel` (default "Tentar novamente") sets the button that emits `retry`; `null` hides it, for errors that retrying won't fix
  * focus is not lost on retry: it moves to the table while loading (`tabindex="-1"`, visible outline only from the keyboard) and back to the button if it fails again
  * `aria-busy` on the table while loading; "select all" is disabled without visible rows (loading, error or empty); in the mobile card mode the message takes the whole card

### Demo

* "Simulate error" button in the table section: the fetch fails, "Tentar novamente" fetches again and succeeds; the pagination is hidden while there is an error ([f2074b3](https://github.com/AysllaGomes/angular-components/commit/f2074b3))

### Tests

* `npm run test:shuffle` runs the specs in random order (they share one environment and CI uses another order); the seed is printed and `SEED=<n>` repeats it ([6c8a49c](https://github.com/AysllaGomes/angular-components/commit/6c8a49c))
* **tooltip:** fake timers only for `setTimeout`, so they no longer freeze other specs ([2beed9f](https://github.com/AysllaGomes/angular-components/commit/2beed9f))

## [2.7.0](https://github.com/AysllaGomes/angular-components/compare/v2.6.0...v2.7.0) (2026-11-23)

### Features

* **tooltip:** new `appTooltip` directive: short hint on hover or keyboard focus ([8c210d0](https://github.com/AysllaGomes/angular-components/commit/8c210d0))
  * as the name of icon-only buttons (`tooltipAsLabel` → `aria-labelledby`) or as a description (`aria-describedby`, keeping existing ids); the bubble exists from the start (hidden), so it is read on focus
  * bubble in `<body>` with `position: fixed`: not clipped by `overflow`, flips to the opposite side without room, never leaves the window, the arrow keeps pointing at the element; follows scrolling/resizing
  * WCAG 1.4.13: Esc closes it without moving focus (and does not close a Dialog behind it), the pointer can move onto the bubble, it stays open while hovered or focused
  * click focus and touch do not open it; clicking the element closes it; one open at a time, moving between hints skips the delay
  * `tooltipPosition`, `tooltipDisabled`, `tooltipShowDelay`, `tooltipHideDelay`; `--tip-*` tokens, inverted in the dark theme, High Contrast and reduced motion support
* **table:** action buttons show their name in a tooltip; without `label`/`ariaLabel` the default name is now Portuguese (Editar, Excluir...) instead of the `kind` ([ea07fb7](https://github.com/AysllaGomes/angular-components/commit/ea07fb7))
* **table:** `disabledReason`: a disabled action uses `aria-disabled` (stays focusable, ignores the click, no `action` event) and the tooltip explains why, e.g. "Excluir (…)" ([ea07fb7](https://github.com/AysllaGomes/angular-components/commit/ea07fb7))

### Bug Fixes

* **table:** `visible()` on declarative actions was ignored and the action always showed ([ea07fb7](https://github.com/AysllaGomes/angular-components/commit/ea07fb7))
* **table:** the actions column header had no name for screen readers; new `actionsLabel` input (default "Ações") ([ea07fb7](https://github.com/AysllaGomes/angular-components/commit/ea07fb7))

### Demo

* New Tooltip section (icon-only toolbar, four positions, help next to a text, unavailable action with `aria-disabled`) and a Delete action in the table, unavailable for account holders with the reason in the tooltip ([8c210d0](https://github.com/AysllaGomes/angular-components/commit/8c210d0)), ([ea07fb7](https://github.com/AysllaGomes/angular-components/commit/ea07fb7))

### Build

* Per-component style budget warning raised from 4 kB to 5 kB (error stays at 8 kB): the Table, the largest component with its mobile card mode, went just over it ([ea07fb7](https://github.com/AysllaGomes/angular-components/commit/ea07fb7))

## [2.6.0](https://github.com/AysllaGomes/angular-components/compare/v2.5.0...v2.6.0) (2026-11-19)


### Features

* **tabs:** new `app-tabs` / `app-tab`: WAI-ARIA tabs (tablist/tab/tabpanel) ([985bf11](https://github.com/AysllaGomes/angular-components/commit/985bf11))
  * keyboard: Tab enters the open tab and moves on to the panel; arrows switch tabs (skipping disabled ones, wrapping), Home/End
  * `activation="manual"`: arrows only move focus, Enter/Space open the tab (for expensive content)
  * `[(selected)]` by key, `badge` counter (read as "Orders (3)"), custom label with icon (`appTabLabel`), disabled tabs
  * direct content is kept hidden (state survives); `<ng-template appTabContent>` is created only when opened, and `keepAlive` keeps it after the first visit
  * many tabs: the list scrolls horizontally without scrolling the page and keeps the open tab in view (also after fonts load or the phone rotates); `--tabs-*` tokens
* **tree-select:** `loadChildren`: nodes with `leaf: false` fetch their children when opened (Promise or Observable); spinner with `aria-busy` and screen-reader announcement while loading; on error the message shows on the row and opening again retries; a group can be checked before it is loaded ([e5c7bcf](https://github.com/AysllaGomes/angular-components/commit/e5c7bcf))
* **tree-select:** `valueMode="summary"`: in checkbox mode a group with all leaves checked becomes the group key (at any level), with one chip per group; a group key coming from outside checks the whole group ([e5c7bcf](https://github.com/AysllaGomes/angular-components/commit/e5c7bcf))


### Bug Fixes

* **theme:** error messages and borders (Select, TreeSelect, form-field, Checkbox, Radio) had 3.8:1 contrast in the light theme; now 6.5:1 (WCAG AA) ([0564ed8](https://github.com/AysllaGomes/angular-components/commit/0564ed8))


### Demo

* New Tabs section (badge, icon, disabled tab, manual activation with on-demand content, 12 scrolling months) and two TreeSelect examples: loading from a simulated API (Bahia fails the first time) and summarized value ([985bf11](https://github.com/AysllaGomes/angular-components/commit/985bf11)), ([e5c7bcf](https://github.com/AysllaGomes/angular-components/commit/e5c7bcf))

## [2.5.0](https://github.com/AysllaGomes/angular-components/compare/v2.4.0...v2.5.0) (2026-11-19)


### Features

* **forms:** centralized validation for reactive forms, documented in `src/app/shared/forms/forms.md` ([fc51561](https://github.com/AysllaGomes/angular-components/commit/fc51561))
  * `AppValidators.cpf()`, `cnpj()` and `cpfOrCnpj()`: accept masked or raw values and ignore empty ones (combine with `Validators.required`); CNPJ supports the **alphanumeric** format (IN RFB 2.229/2024), e.g. `12.ABC.345/01DE-35`
  * `FormErrorsService` + `fieldError` pipe: one translated message per error type (`required` first), shown after the field is touched; override or add messages in one place with `provideFormErrorMessages()` (text, i18n key or function)
  * `appFormValidation` directive: on an invalid submit it shows every error and moves focus to the first invalid field in screen order, including inside components (Select, Radio...); a valid submit emits `validSubmit` with `getRawValue()`. No toast: toasts are for back-end errors
* **forms:** `appMask` input mask directive: `cpf`, `cnpj`, `cpfCnpj` (switches to CNPJ automatically), `phone`, `cep`, `date` or a custom pattern (`0` digit, `A` letter, `*` alphanumeric); the form receives the unmasked value, the caret stays in place when editing in the middle, numeric keyboard on phones ([fc51561](https://github.com/AysllaGomes/angular-components/commit/fc51561))
* **form-field:** new `app-form-field`: label, hint, error and "required" around a native `<input>`/`<textarea>`/`<select>`, wired with `for`/`id`, `aria-describedby`, `aria-invalid` and `aria-required`; same look as the Select ([fc51561](https://github.com/AysllaGomes/angular-components/commit/fc51561))
* **select:** `required`, `disabled`, `filterable` and `clearable` accept the bare attribute (`<app-select required>`) ([fc51561](https://github.com/AysllaGomes/angular-components/commit/fc51561))


### Bug Fixes

* **theme:** placeholder text (inputs, Select, TreeSelect) had 3:1 contrast in the light theme; now 5.5:1 (WCAG AA) ([1c74b3e](https://github.com/AysllaGomes/angular-components/commit/1c74b3e))


### Demo

* New "Form validation" section: a full sign-up form (name, CPF/CNPJ, phone, ZIP code, Select, Radio, Checkbox) with masks, format placeholders and the payload the back-end receives ([fc51561](https://github.com/AysllaGomes/angular-components/commit/fc51561), [1c74b3e](https://github.com/AysllaGomes/angular-components/commit/1c74b3e))

## [2.4.0](https://github.com/AysllaGomes/angular-components/compare/v2.3.0...v2.4.0) (2026-11-19)


### Features

* **radio:** new `app-radio-group`: single choice built on a native `<fieldset>`/`<legend>` and radios (Tab enters/leaves the group, arrows change the option, skipping disabled ones); per-option `description`, vertical/horizontal `orientation`, required/hint/error (`aria-invalid`), `formControl`/`ngModel` ([cfae0b4](https://github.com/AysllaGomes/angular-components/commit/cfae0b4))
* **switch:** new `app-switch`: native checkbox with `role="switch"` (announced as on/off); `labelFirst` layout for settings lists, hint, forms; respects reduced motion ([cfae0b4](https://github.com/AysllaGomes/angular-components/commit/cfae0b4))
* **stepper:** `ariaLabel` (navigation name) and `doneLabel` (screen-reader text for completed steps) inputs ([8cf9c12](https://github.com/AysllaGomes/angular-components/commit/8cf9c12))
* **pagination:** `ariaLabel` input; the default name now comes from i18n ("Paginação"/"Pagination") ([8cf9c12](https://github.com/AysllaGomes/angular-components/commit/8cf9c12))


### Bug Fixes (accessibility)

Found by the new automated checks (axe-core):

* **stepper:** it pretended to be tabs (`tablist`/`tab`, `aria-selected`) with roles in the wrong places and `aria-valuenow` on a `<nav>`. Now a named navigation with an ordered list; the current step has `aria-current="step"` ([8cf9c12](https://github.com/AysllaGomes/angular-components/commit/8cf9c12))
* **table:** sortable headers were `<th role="button">` with `aria-sort` (invalid). The `<th>` stays a column header with `aria-sort` and a real `<button>` inside sorts ([8cf9c12](https://github.com/AysllaGomes/angular-components/commit/8cf9c12))
* **select:** the option list had no accessible name and the label was not read with the field ("Banana, button" → "Food, Banana") ([8cf9c12](https://github.com/AysllaGomes/angular-components/commit/8cf9c12))
* **pagination:** `role="list"` wrapping buttons removed; the name was hard-coded in English and identical for every pagination on the page ([8cf9c12](https://github.com/AysllaGomes/angular-components/commit/8cf9c12))


### Tests

* Automated accessibility checks with axe-core for every component, in the states that matter (open, with error, disabled...), run by `npm run test:ci` and CI ([8cf9c12](https://github.com/AysllaGomes/angular-components/commit/8cf9c12))


### Demo

* Header menu grouped by category (Forms, Data, Overlays, Navigation & actions) using the WAI-ARIA disclosure navigation pattern; compact (☰) menu below 1024px, without the horizontal scroll it used to cause ([58e842b](https://github.com/AysllaGomes/angular-components/commit/58e842b), [cfae0b4](https://github.com/AysllaGomes/angular-components/commit/cfae0b4))
* New Radio group and Switch sections; README demo link fixed (it pointed to an old site) and a Quality section ([cfae0b4](https://github.com/AysllaGomes/angular-components/commit/cfae0b4), [8cf9c12](https://github.com/AysllaGomes/angular-components/commit/8cf9c12))
* CI runs get readable titles ("Deploy do site · …", "Release v…", "CI · branch") ([63832f6](https://github.com/AysllaGomes/angular-components/commit/63832f6))

## [2.3.0](https://github.com/AysllaGomes/angular-components/compare/v2.2.0...v2.3.0) (2026-11-19)


### Features

* **checkbox:** new `app-checkbox`: accessible checkbox with a **partial** (indeterminate) state, built on a native `<input type="checkbox">` (keyboard, label click and "partially checked" announcement for free). `[(checked)]`/`[(indeterminate)]`, `formControl`/`ngModel` (use `Validators.requiredTrue`), `hint`/`error` with `aria-describedby`/`aria-invalid`; `--cb-*` theme tokens for light/dark ([e8a6394](https://github.com/AysllaGomes/angular-components/commit/e8a6394))
* **checkbox:** new `app-checkbox-mark`: just the visual box (unchecked/checked/partial), decorative (`aria-hidden`), for drawing checkboxes inside other components ([e8a6394](https://github.com/AysllaGomes/angular-components/commit/e8a6394))
* **tree-select:** new `app-tree-select`: a select whose options form a tree ([75ffb17](https://github.com/AysllaGomes/angular-components/commit/75ffb17))
  * `single` mode: value = the node key; the field shows the path ("Brasil › São Paulo › Campinas"); any node can be picked, or only leaves with `leafOnly`
  * `checkbox` mode: value = the checked **leaf** keys in tree order; checking a group checks its enabled leaves, partial groups show "−" (`aria-checked="mixed"`) and clicking them completes the group; with an active search, only visible leaves are affected; chips with "+N" in the field
  * accent/case-insensitive filter, WAI-ARIA tree keyboard (arrows, Home/End, Enter/Space, type-ahead, Esc, Tab), `expandedKeys`, clear, required/error/hint, mobile sheet, forms


### Bug Fixes

* **select:** opening the panel now focuses the filter input or the option list. Before, focus fell to `<body>`: the filter had to be clicked, and without a filter the keyboard could not navigate the list at all (`↓`/`Enter` only worked with the mouse) ([1ce9ad0](https://github.com/AysllaGomes/angular-components/commit/1ce9ad0))
* **demo:** header links no longer reload the page on GitHub Pages: with `<base href>`, `#section` resolved to another page; links now scroll in place, update the hash and move focus. "Skip to content" and the brand link now have targets ([781c86d](https://github.com/AysllaGomes/angular-components/commit/781c86d))


### Demo

* New Checkbox and TreeSelect sections (PT/EN); header links tightened, and the compact (☰) menu is used below 1120px so the links fit in one row ([e8a6394](https://github.com/AysllaGomes/angular-components/commit/e8a6394), [75ffb17](https://github.com/AysllaGomes/angular-components/commit/75ffb17))

## [2.2.0](https://github.com/AysllaGomes/angular-components/compare/v2.1.0...v2.2.0) (2026-11-19)


### Features

* **dialog:** **focus restore**: on close (button, `Esc`, backdrop or `opened=false`), focus returns to the element that was focused before opening, usually the opener ([fa3a58f](https://github.com/AysllaGomes/angular-components/commit/fa3a58f))
* **dialog:** **inert background**: while open, the rest of the page gets `inert` (no focus, clicks or screen reader access); on close only what the dialog marked is released ([fa3a58f](https://github.com/AysllaGomes/angular-components/commit/fa3a58f))
* **actionbar:** the same modal behavior as the Dialog: focus restore, inert background and, new for the ActionBar, body scroll lock while open ([52d88c6](https://github.com/AysllaGomes/angular-components/commit/52d88c6))
* **toast:** `app-toast-container` carries `data-dialog-keep-active`, so notifications stay announced and dismissable while a Dialog/ActionBar is open. Any element can opt out of the inert background with this attribute ([fa3a58f](https://github.com/AysllaGomes/angular-components/commit/fa3a58f))
* **pagination:** `showFirstLast` input adds « First / Last » buttons, disabled at the ends ([d2e5af9](https://github.com/AysllaGomes/angular-components/commit/d2e5af9))
* **pagination:** keyboard shortcuts: `←`/`→` previous/next page, `Home`/`End` first/last. Focus follows the current page button (in compact mode, the nearest enabled arrow), so it is not lost when the number window slides or an arrow gets disabled ([d2e5af9](https://github.com/AysllaGomes/angular-components/commit/d2e5af9))


### Changed

* Dialog and ActionBar share the modal logic in `src/app/shared/a11y/modal-session.ts` ([52d88c6](https://github.com/AysllaGomes/angular-components/commit/52d88c6))


### Documentation

* Dialog, ActionBar and Pagination docs describe the new behaviors; roadmap items checked. Fixed: ActionBar `auto` size threshold (436px) and the Pagination note that claimed it only renders with more than one page ([fa3a58f](https://github.com/AysllaGomes/angular-components/commit/fa3a58f), [d2e5af9](https://github.com/AysllaGomes/angular-components/commit/d2e5af9), [52d88c6](https://github.com/AysllaGomes/angular-components/commit/52d88c6))

## [2.1.0](https://github.com/AysllaGomes/angular-components/compare/v2.0.0...v2.1.0) (2026-11-19)


### Features

* **dialog:** new `describedBy` input wired to `aria-describedby` (one id or space-separated ids); screen readers read that text together with the title on open. Empty/`null` renders no attribute ([cbde09a](https://github.com/AysllaGomes/angular-components/commit/cbde09a))
* **select:** **typeahead**: with the field focused and closed, typing picks the matching option without opening (like a native `<select>`); with the panel open it moves the highlight. Repeating a letter cycles through matches; accents/case are ignored, disabled options are skipped, the search resets after 500 ms ([21aeaa9](https://github.com/AysllaGomes/angular-components/commit/21aeaa9))
* **select:** **option groups**: optional `group` field on `SelectOption`; options of the same group are shown together under a heading (`role="group"`), in first-appearance order. Disabled options now expose `aria-disabled` ([21aeaa9](https://github.com/AysllaGomes/angular-components/commit/21aeaa9))
* **pagination:** **compact mode**: `compact` input shows "Page X of Y" between the arrows instead of page numbers; `compact="auto"` does it only on screens ≤ 420px (pure CSS, SSR-safe). The status text uses `aria-live="polite"` ([f459fac](https://github.com/AysllaGomes/angular-components/commit/f459fac))
* **stepper:** `--stepper-label-size`, `--stepper-caption-size` and `--stepper-color-label-active` CSS variables for local theming ([d32923d](https://github.com/AysllaGomes/angular-components/commit/d32923d), [6acfcef](https://github.com/AysllaGomes/angular-components/commit/6acfcef))
* **theme:** `--accent-text` token (accent used as text/border; lighter in dark mode) and `color-scheme` per theme, so native checkboxes and scrollbars follow it ([6acfcef](https://github.com/AysllaGomes/angular-components/commit/6acfcef))


### Bug Fixes

* **stepper:** no more scrollbar inside the component; connectors now link bullet centers; long labels wrap instead of overflowing; on screens ≤ 560px only the bullets and the active label are shown (other labels stay available to screen readers); captions really hide on ≤ 720px ([d32923d](https://github.com/AysllaGomes/angular-components/commit/d32923d))
* **theme:** dark mode contrast: Button ghost/outline/link, Stepper labels, Table rows/chips/skeleton/actions and Pagination no longer use hard-coded light colors ([fbb000d](https://github.com/AysllaGomes/angular-components/commit/fbb000d), [6acfcef](https://github.com/AysllaGomes/angular-components/commit/6acfcef))
* **table:** the built-in `edit` action icon (box + pen) follows the accent color (`currentColor`); no external SVG needed ([6acfcef](https://github.com/AysllaGomes/angular-components/commit/6acfcef))
* **table:** on mobile cards, labels and values are always start-aligned, regardless of the column alignment ([14ab049](https://github.com/AysllaGomes/angular-components/commit/14ab049))
* **dialog, actionbar:** the host element takes no space in the layout while closed ([14ab049](https://github.com/AysllaGomes/angular-components/commit/14ab049))
* **select:** the clear (×) button no longer reserves space when hidden ([14ab049](https://github.com/AysllaGomes/angular-components/commit/14ab049))


### Demo

* Responsive layout that fits 390px screens, consistent cards and spacing across sections, real **Inter** font, form controls inherit the page font ([14ab049](https://github.com/AysllaGomes/angular-components/commit/14ab049), [d32923d](https://github.com/AysllaGomes/angular-components/commit/d32923d))
* New examples: Select with groups and typeahead, compact Pagination; Stepper "Compact" example and "Next" button fixed ([21aeaa9](https://github.com/AysllaGomes/angular-components/commit/21aeaa9), [f459fac](https://github.com/AysllaGomes/angular-components/commit/f459fac), [d32923d](https://github.com/AysllaGomes/angular-components/commit/d32923d))
* Fixed labels/texts, icons that match their actions, footer, Toast buttons in dark mode, Pagination toolbar on mobile ([14ab049](https://github.com/AysllaGomes/angular-components/commit/14ab049), [6319e4f](https://github.com/AysllaGomes/angular-components/commit/6319e4f), [6acfcef](https://github.com/AysllaGomes/angular-components/commit/6acfcef), [73184f3](https://github.com/AysllaGomes/angular-components/commit/73184f3))


### Documentation

* Dialog and Table roadmaps aligned with the code (items marked as done that did not exist were unchecked); Dialog `size` default documented as `'md'`, with `'xl'` ([ee2bcaf](https://github.com/AysllaGomes/angular-components/commit/ee2bcaf))

## [2.0.0](https://github.com/AysllaGomes/angular-components/compare/v1.8.0...v2.0.0) (2026-11-18)


### ⚠ BREAKING CHANGES

* **Angular 22 is now required** (was Angular 20). The components use Angular 22 APIs and the v22 template semantics.
* **Node 24 is the supported runtime** (`.nvmrc`); Node 20 is out of support.


### Changed

* Angular upgraded 20.2 → 20.3 → 21 → 22.3, with TypeScript 6 ([598a0ed](https://github.com/AysllaGomes/angular-components/commit/598a0ed), [55b15c7](https://github.com/AysllaGomes/angular-components/commit/55b15c7), [4e94f95](https://github.com/AysllaGomes/angular-components/commit/4e94f95))
* v22 migrations: demo/spec components declare `ChangeDetectionStrategy.Eager` (library components were already `OnPush`); hydration keeps `withNoIncrementalHydration()` ([4e94f95](https://github.com/AysllaGomes/angular-components/commit/4e94f95))
* Unit tests run on **Vitest** (jsdom) instead of Karma/Jasmine: faster, and CI no longer needs a browser ([6301dad](https://github.com/AysllaGomes/angular-components/commit/6301dad))
* Release tooling: `standard-version` (deprecated) replaced by `commit-and-tag-version`, same commands ([f79a510](https://github.com/AysllaGomes/angular-components/commit/f79a510))


### Security

* **SSR:** host validation enabled (`security.allowedHosts`: `localhost`, `127.0.0.1`) — requests with an unknown `Host` header get `400` (SSRF protection introduced in Angular 22) ([4e94f95](https://github.com/AysllaGomes/angular-components/commit/4e94f95))
* **SSR:** `X-Forwarded-*` headers are not trusted (no `trustProxyHeaders`); see the comment in `src/server.ts` before deploying behind a proxy ([4e94f95](https://github.com/AysllaGomes/angular-components/commit/4e94f95))
* `path-to-regexp` (high, used by Express) fixed; removing Karma and `standard-version` eliminated the remaining dev-tool advisories — `npm audit` reports **0 vulnerabilities** ([598a0ed](https://github.com/AysllaGomes/angular-components/commit/598a0ed), [f79a510](https://github.com/AysllaGomes/angular-components/commit/f79a510), [6301dad](https://github.com/AysllaGomes/angular-components/commit/6301dad))


### Migration Notes

* Update your app to Angular 22 (`ng update @angular/core@22 @angular/cli@22`, one major at a time) before using 2.0.0.
* Component APIs are unchanged from 1.8.0: inputs, outputs and two-way bindings work the same.
* Running the SSR server on a public host: add it to `security.allowedHosts` in `angular.json` or set `NG_ALLOWED_HOSTS`.
* Tests: `npm test` / `npm run test:ci` now run Vitest; Jasmine-only matchers (`toBeTrue`, `jasmine.createSpy`, …) are no longer available.

## [1.8.0](https://github.com/AysllaGomes/angular-components/compare/v1.7.0...v1.8.0) (2026-11-18)


### Features

* **select:** Angular Forms integration via `ControlValueAccessor`: works with `formControl`, `formControlName` and `[(ngModel)]` (value, `dirty`, `touched`, `disable()`/`enable()`); new Reactive Forms demo and docs section ([9c9a731](https://github.com/AysllaGomes/angular-components/commit/9c9a731205970f674d01ea0d307e63b83b25363c))
* **i18n:** `<html lang>` follows the current language ([92d51bb](https://github.com/AysllaGomes/angular-components/commit/92d51bbf3948755fce0f93c25ac34134c5545c94))


### Changed

* All components use signal APIs: `input()`, `model()`, `output()`, `viewChild()`/`contentChild()`; `linkedSignal` for state that follows an input but can change internally (Select value, Table selection/sorting) ([e142995](https://github.com/AysllaGomes/angular-components/commit/e142995))
* Templates migrated to built-in control flow (`@if`/`@for`/`@switch`) with explicit `track` keys (Table rows use `rowKey`) ([36c72a2](https://github.com/AysllaGomes/angular-components/commit/36c72a2))
* Dialog/ActionBar `size="auto"` handled by an `effect` that disconnects its `ResizeObserver` automatically ([e142995](https://github.com/AysllaGomes/angular-components/commit/e142995))
* `index.html`: proper title, `lang="pt-BR"` and meta description ([92d51bb](https://github.com/AysllaGomes/angular-components/commit/92d51bbf3948755fce0f93c25ac34134c5545c94))
* CI and deploy run on Node 24 (from `.nvmrc`) with npm cache ([9ee6f9b](https://github.com/AysllaGomes/angular-components/commit/9ee6f9b))


### Bug Fixes

* **theme:** no more light-theme flash on load with SSR: saved theme, accent and language are applied before first paint ([92d51bb](https://github.com/AysllaGomes/angular-components/commit/92d51bbf3948755fce0f93c25ac34134c5545c94))
* **select:** `[error]` now updates after the first render; closing the panel with the button marks the field as touched and validates ([9c9a731](https://github.com/AysllaGomes/angular-components/commit/9c9a731205970f674d01ea0d307e63b83b25363c))
* **select:** component styles back under the 4 kB budget (build without warnings) ([92d51bb](https://github.com/AysllaGomes/angular-components/commit/92d51bbf3948755fce0f93c25ac34134c5545c94))
* **table:** skeleton rows no longer produce duplicate `track` keys; action buttons are not recreated on every change detection ([36c72a2](https://github.com/AysllaGomes/angular-components/commit/36c72a2))


### Migration Notes

* Templates need no changes: `[(opened)]`, `[(value)]`, `(selectedChange)`, `(sortChange)` etc. keep working.
* Code that reached into component instances (e.g. via `#ref` or `viewChild`) may need updates: Dialog/ActionBar `open` is now `opened` (a `model()` signal), `appButton`'s `variant` is now a signal (`variant()`), and internal element refs became private.
* `valueChange` of the Select is typed `T | null` (clearing already emitted `null`).

## [1.7.0](https://github.com/AysllaGomes/angular-components/compare/v1.6.0...v1.7.0) (2026-11-18)


### Features

* **dialog:** new accessible modal dialog with title, content and primary/secondary actions; sizes `sm`/`md`/`lg`/`xl`/`auto`, focus trap, ESC/backdrop close, `[dialog-actions]` slot; PT/EN docs ([198bceb](https://github.com/AysllaGomes/angular-components/commit/198bceb), [1296e57](https://github.com/AysllaGomes/angular-components/commit/1296e57), [79187d5](https://github.com/AysllaGomes/angular-components/commit/79187d5))
* **button:** reusable `appButton` directive with variants `solid|outline|ghost|link`, tones `accent|neutral|danger` and sizes `xs|sm|md|lg`; global tokens `--neutral`/`--danger` ([cedd13a](https://github.com/AysllaGomes/angular-components/commit/cedd13af32cd309eb3570dd1e5cfc094b807039d), [48326b3](https://github.com/AysllaGomes/angular-components/commit/48326b3e0867ac49ac1480aa42356385000a1c21))
* **toast:** container actions use `appButton` ([de36eea](https://github.com/AysllaGomes/angular-components/commit/de36eeafcd2e5dda608ea18e58188460af7cee1e))
* **actionbar:** `auto` size control ([a36d77f](https://github.com/AysllaGomes/angular-components/commit/a36d77f294b3fa2958d15f803727778a0c1aad1c))
* **table:** stable row selection via `rowKey`: selection survives sorting, pagination and filtering; "select all" only affects visible rows ([7db76a9](https://github.com/AysllaGomes/angular-components/commit/7db76a90e904fcae65d87e037ed9a36f5c00d338))


### Changed

* Dialog, Stepper, ActionBar, Pagination and Header now use `appButton` ([cedd13a](https://github.com/AysllaGomes/angular-components/commit/cedd13af32cd309eb3570dd1e5cfc094b807039d))
* Responsive mobile stack for the table and the header ([85c3dd6](https://github.com/AysllaGomes/angular-components/commit/85c3dd6), [26ce64d](https://github.com/AysllaGomes/angular-components/commit/26ce64d))
* Dialog and ActionBar only emit `openedChange` when the state actually changes (no emission on init) ([7db76a9](https://github.com/AysllaGomes/angular-components/commit/7db76a90e904fcae65d87e037ed9a36f5c00d338))


### Bug Fixes

* **dialog / actionbar:** `size="auto"` now measures the content every time it opens (it never ran before because the content is rendered with `*ngIf`); `size` changes after creation are applied ([1ad79dc](https://github.com/AysllaGomes/angular-components/commit/1ad79dc4ad58a2503dcda0e7e791b2087d4bd8b4))
* **dialog:** only restores the body `overflow` if the instance locked it (it used to clear it on init) ([7db76a9](https://github.com/AysllaGomes/angular-components/commit/7db76a90e904fcae65d87e037ed9a36f5c00d338))
* **select:** the option list updates when `options` changes after the first render ([1ad79dc](https://github.com/AysllaGomes/angular-components/commit/1ad79dc4ad58a2503dcda0e7e791b2087d4bd8b4))
* **pagination:** invalid `pageSize` (0, negative, NaN) no longer produces `Infinity`; `pageIndex` is clamped to the valid range ([7db76a9](https://github.com/AysllaGomes/angular-components/commit/7db76a90e904fcae65d87e037ed9a36f5c00d338))
* **theme / i18n:** values read from `localStorage` are validated against known lists ([7db76a9](https://github.com/AysllaGomes/angular-components/commit/7db76a90e904fcae65d87e037ed9a36f5c00d338))
* **header:** full-width mobile menu with iOS safe-area ([cedd13a](https://github.com/AysllaGomes/angular-components/commit/cedd13af32cd309eb3570dd1e5cfc094b807039d))
* **deploy:** root redirect script generated invalid JavaScript ([1ad79dc](https://github.com/AysllaGomes/angular-components/commit/1ad79dc4ad58a2503dcda0e7e791b2087d4bd8b4))


### Tests & CI

* Unit tests for Dialog, ActionBar, Select, Pagination, Table and stored preferences (29 specs); `npm run test:ci` script ([0cce600](https://github.com/AysllaGomes/angular-components/commit/0cce600), [7db76a9](https://github.com/AysllaGomes/angular-components/commit/7db76a90e904fcae65d87e037ed9a36f5c00d338))
* Deploy runs the tests before publishing; `ci` workflow limited to PRs and non-main branches ([4f2c451](https://github.com/AysllaGomes/angular-components/commit/4f2c451))

## [1.6.0](https://github.com/AysllaGomes/angular-components/compare/v1.5.0...v1.6.0) (2025-09-07)
### Features
* **header:** make header responsive with mobile menu + collapsible nav ([b18ba1b](https://github.com/AysllaGomes/angular-components/commit/b18ba1ba5310bde606f154c5ccbc9eda51f260df))
* **table:** responsive wrap + mobile “stack”; selectable column width; a11y sort polish ([1ed907e](https://github.com/AysllaGomes/angular-components/commit/1ed907ea3609e41245fcd907e829f472bf2d69d5))
  * **Responsive table**
    * **Horizontal wrap** with `.tbl-wrap` + “umbrellas” on the sides.
    * **Mobile stack (≤640px)**: each row becomes a “card” with labels via `data-label`; selection column rendered at the top and actions in the footer.
  * **Selectable width**: --tbl-select-w token (e.g., 48px) and local adjustment support.

### Changed
* Sortable header: visible focus and `aria-sort` maintained; **Enter/Space** support in `<th>`.

### Fixed
* Removed global reset of `button` that affected other components; styles now scoped to `.icon-btn`.
* **header:** make header responsive with mobile menu + collapsible nav ([b18ba1b](https://github.com/AysllaGomes/angular-components/commit/b18ba1ba5310bde606f154c5ccbc9eda51f260df))
* **table:** responsive wrap + mobile “stack”; selectable column width; a11y sort polish ([1ed907e](https://github.com/AysllaGomes/angular-components/commit/1ed907ea3609e41245fcd907e829f472bf2d69d5))

## [1.5.0](https://github.com/AysllaGomes/angular-components/compare/v1.4.0...v1.5.0) (2025-09-06)
### Features
* **actionbar:** add right-side sheet with sm/md/lg/auto, accent-aware UI and a11y ([d20e461](https://github.com/AysllaGomes/angular-components/commit/d20e46172b9830f0b036816de7d12c01fd4a2ce5))
* **select:** clearable (×), mobile bottom-sheet, a11y polish & docs ([a288e57](https://github.com/AysllaGomes/angular-components/commit/a288e57ecc663011f8dbb99e9b2ea5c61bf9ca9d))

## [1.4.0](https://github.com/AysllaGomes/angular-components/compare/v1.3.0...v1.4.0) (2025-09-05)
### Features
* **select:** accessible select with optional filter + themeable via CSS vars ([843203e](https://github.com/AysllaGomes/angular-components/commit/843203e4a48f438ce5eea58630c7767ba9290636))
* **theme:** add 'rose' accent preset ([9ba5b70](https://github.com/AysllaGomes/angular-components/commit/9ba5b70f4572968ad908bf0d4c8f6afa2cf59330)), closes [#e11d48](https://github.com/AysllaGomes/angular-components/issues/e11d48)

## [1.3.0](https://github.com/AysllaGomes/angular-components/compare/v1.2.0...v1.3.0) (2025-09-05)
### Features
* **theme:** add 'blue' accent preset ([11fd39e](https://github.com/AysllaGomes/angular-components/commit/11fd39eeec0e0c65e9afcc0de7314cead771007f)), closes [#2563](https://github.com/AysllaGomes/angular-components/issues/2563)

## [1.2.0](https://github.com/AysllaGomes/angular-components/compare/v1.1.0...v1.2.0) (2025-09-05)
### Features
* **theme:** add runtime accent presets (teal|orange|violet) ([7b44bae](https://github.com/AysllaGomes/angular-components/commit/7b44baed72c512c609071c6e00a4c0f30a7315d3))

## [1.1.0](https://github.com/AysllaGomes/angular-components/compare/v0.0.1...v1.1.0) (2025-09-04)
### Features
* added utils to convert asset ([f620713](https://github.com/AysllaGomes/angular-components/commit/f62071313788e9606402eb1481f8e8e7d8a90770))

### 0.0.1 (2025-09-04)
### Features
* changelog. ci/deploy/release icons ([9c12e3a](https://github.com/AysllaGomes/angular-components/commit/9c12e3aaa2c40239663d8a11bd2e9f8273e6e898))
* **demo-table:** add Loading & Empty toolbar + bind to [loading] and dataset ([3d68dbf](https://github.com/AysllaGomes/angular-components/commit/3d68dbfd2a56b3632d41911165ff09bece736c2a))
* **demo:** lightweight i18n (PT/EN) with service + pipe ([d93fb4a](https://github.com/AysllaGomes/angular-components/commit/d93fb4a527fc2894dc944e46e50ce7e0aee284a0))
* **demo:** new sticky header with nav and theme toggle ([a6dd96a](https://github.com/AysllaGomes/angular-components/commit/a6dd96a85f11e1480af85c3c0a4d33321b935dd5))
* **stepper:** steps computed, next and prev button ([d9dd686](https://github.com/AysllaGomes/angular-components/commit/d9dd6863f026a71f74bfe8b3c662d53483a61f7b))
* **table:** ações declarativas via [actions] com ícones padrão; mantém slot appActions como override ([7633d72](https://github.com/AysllaGomes/angular-components/commit/7633d723643d23253660b9d9cce6cda32ed2e325))
* **table:** add Loading & Empty states ([d31f5b2](https://github.com/AysllaGomes/angular-components/commit/d31f5b245ec1efefd2bd39aa777e8ce246e8b083))
* **table:** sorting and loading/empty ([69503d1](https://github.com/AysllaGomes/angular-components/commit/69503d14c56270fd3fdfc69bc9dfb7e954d51f76))
* **table:** UX/A11y in table ([80a5311](https://github.com/AysllaGomes/angular-components/commit/80a53115b91f1ee5fdf8af5026e5b3dfc6ab9d8b))
* update readme ([c48e7af](https://github.com/AysllaGomes/angular-components/commit/c48e7af9dd717c655f19812c8addc5ccf1f3bcbe))

## [0.1.0] - 04/09/2025
### Added
- **Stepper**: states (active/done/disabled), optional click, theming via CSS vars, compact mode.
- **Table**: declarative columns, checkbox selection, actions (`appActions` and/or `[actions]` slot), *chips*, custom cells, empty+loading (skeleton), **sort** by header.
- **Pagination**: standalone component (number bubbles + arrows), controlled by `total`, `pageSize`, `pageIndex`. - **Toast**: service + container, variants (success/info/warn/error), optional action, configurable duration.
- **Demo**: header with theme (light/dark) and language (PT/EN) switching, `#stepper`, `#table`, `#pagination`, `#toast` jars.
- **Docs**: README PT/EN; docs per component (PT/EN).
- **Deploy**: GitHub Pages (SPA routing with `404.html` fallback), redirect to `/demo`.

### Changed
- Global style adjustments (tokens for header, table, etc.).

### Fixed
- SPA base href and 404 for deep links in GitHub Pages.
