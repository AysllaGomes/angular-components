# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
