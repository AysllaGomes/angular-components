# Changelog

All notable changes to this project will be documented in this file. See [standard version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
