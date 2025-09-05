# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
