<p align="right"><a href="./tabs.md">Português (BR)</a></p>

# Tabs

**WAI-ARIA** tabs (`tablist` / `tab` / `tabpanel`) to switch between sections of the same screen.

- **Files:** `src/app/shared/components/tabs/` (`app-tabs`, `app-tab`, `appTabLabel`, `appTabContent`)

```ts
import { TABS_IMPORTS } from 'src/app/shared/components/tabs';

@Component({ imports: [...TABS_IMPORTS] })
```

> **Tabs or Stepper?** Tabs are independent sections, opened in any order. For a flow with steps in sequence, use `app-stepper`.

## Usage

```html
<app-tabs ariaLabel="Account" [(selected)]="tab">
  <app-tab key="profile" label="Profile">…</app-tab>
  <app-tab key="orders" label="Orders" [badge]="pending()">…</app-tab>
  <app-tab key="archive" label="Archive" disabled>…</app-tab>
</app-tabs>
```

### Label with an icon

```html
<app-tab key="settings">
  <ng-template appTabLabel let-active>
    <svg aria-hidden="true">…</svg> Settings
  </ng-template>
  …
</app-tab>
```

`let-active` tells whether the tab is open (e.g. to swap the icon). Decorative icons get `aria-hidden="true"`.

### On-demand content

The direct content of `app-tab` is created with the page and only hidden: its state (typed fields, scroll) is still there when you come back.

For heavy content, or content that fetches data on init, use `<ng-template appTabContent>`: it is only created when the tab opens and destroyed when it closes. With `keepAlive` on `app-tabs`, it is kept after the first visit.

```html
<app-tabs ariaLabel="Reports" keepAlive>
  <app-tab key="sales" label="Sales">
    <ng-template appTabContent><app-sales-report /></ng-template>
  </app-tab>
</app-tabs>
```

### Many tabs

The list scrolls horizontally (touch, trackpad, Shift+wheel) without scrolling the page, and the open tab is brought into view — also when opened through `[(selected)]` or when the phone is rotated.

## API

### `app-tabs`

| Input        | Type                 | Default  | Description |
|--------------|----------------------|----------|-------------|
| `selected`   | `string \| null`     | `null`   | Key of the open tab. Two-way via `[(selected)]`. Empty, unknown or disabled → first enabled tab. |
| `activation` | `'auto' \| 'manual'` | `'auto'` | `auto`: arrows open the tab right away. `manual`: arrows only move focus; Enter/Space open it (use when opening a tab is expensive). |
| `keepAlive`  | `boolean`            | `false`  | Keeps `appTabContent` content after the first visit. |
| `ariaLabel`  | `string \| null`     | `null`   | Screen-reader name of the tab list (e.g. "Account sections"). |

| Output           | Payload  | When |
|------------------|----------|------|
| `selectedChange` | `string` | The user opened another tab. |

### `app-tab`

| Input      | Type                       | Default | Description |
|------------|----------------------------|---------|-------------|
| `key`      | `string \| null`           | `null`  | Identifier used by `selected`. Without it, the position is used (`"0"`, `"1"`...). |
| `label`    | `string`                   | `''`    | Tab text (or use `appTabLabel`). |
| `badge`    | `string \| number \| null` | `null`  | Counter next to the label; read as "Orders (3)". |
| `disabled` | `boolean`                  | `false` | Cannot be opened; arrows skip it. |

### Tokens

`--tabs-border`, `--tabs-fg`, `--tabs-fg-hover`, `--tabs-active` (open tab text), `--tabs-indicator` (underline), `--tabs-hover-bg`, `--tabs-badge-bg`, `--tabs-badge-fg`, `--tabs-badge-border`. By default they follow the theme accent.

## Accessibility

- **Tab** enters the open tab and the next **Tab** moves to the panel (only one tab is in the Tab order).
- **← →** switch tabs, skipping disabled ones and wrapping; **Home/End** go to the first/last.
- Each tab points to its panel (`aria-controls`) and the panel is named by its tab (`aria-labelledby`); the open tab has `aria-selected="true"`.
- The badge does not become "Orders3": the visible number is hidden from screen readers, which hear "Orders (3)".
- In Windows high contrast mode, the open tab's underline uses the system color.
