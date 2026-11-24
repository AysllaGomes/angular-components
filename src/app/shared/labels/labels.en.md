# Component texts (`provideUiLabels`)

> [Português](./labels.md)

The components have a few texts of their own: the Dialog's "Close", the Table's "Select all", the Pagination arrows, the form error messages... They all come from one place and **depend on no i18n library**.

- **Default: English** (`UI_LABELS_EN`). With no setup, the components speak English.
- **Portuguese ready to use:** `UI_LABELS_PT`.
- **Per instance:** each component's inputs (`emptyMessage`, `closeAriaLabel`, `rangeLabel`...) still work and **win** over the provider.

## Usage

```ts
// app.config.ts
import { provideUiLabels, UI_LABELS_PT } from './shared/labels';

export const appConfig: ApplicationConfig = {
  providers: [
    provideUiLabels(UI_LABELS_PT), // everything in Portuguese
  ],
};
```

### Only some texts

Pass only what you want to change; the rest keeps the default. Groups (`table`, `pagination`...) can be partial too.

```ts
provideUiLabels({
  close: 'Dismiss',
  table: { empty: 'Nothing here yet' },
  formErrors: { required: 'Please fill in this field' },
});
```

### Following the app language (live switch)

Pass a **function**: it runs in the injection context (it can use `inject`) and can return a **signal**. When the signal changes, every component's texts change with it.

```ts
provideUiLabels(() => {
  const lang = inject(MyLanguageService).lang; // Signal<'pt' | 'en'>
  return computed(() => (lang() === 'pt' ? UI_LABELS_PT : UI_LABELS_EN));
});
```

That is how this project's demo stays bilingual without the components knowing its i18n (`src/app/app.config.ts`).

## Precedence

1. The component **input**, on that instance (e.g. `<app-table emptyMessage="...">`).
2. **`provideUiLabels`**.
3. **`UI_LABELS_EN`** (default).

For form error messages, `provideFormErrorMessages` comes before `formErrors` (see [Forms](../forms/forms.en.md)).

## Available texts

| Key | Where it shows | English (default) | `UI_LABELS_PT` |
|---|---|---|---|
| `close` | close button (Dialog, ActionBar, Toast, Select/TreeSelect sheet) | Close | Fechar |
| `required` | marker next to the label (FormField, RadioGroup, CheckboxGroup, Select, TreeSelect) | required | requerido |
| `requiredError` | built-in required error (Select, TreeSelect) | This field is required | Campo obrigatório |
| `clearSelection` | clear button (Select, TreeSelect, Table bulk actions) | Clear selection | Limpar seleção |
| `filterOptions` | Select search field | Filter options | Filtrar opções |
| `noOptions` | Select panel with no options (search with no match), shown and announced | No options found | Nenhuma opção encontrada |
| `selectTitle` | Select sheet title on phones, without `panelTitle` or `label` | Select an option | Selecionar |
| `selectAll` | CheckboxGroup "check all" box (`selectAll`) | Select all | Selecionar todos |
| `notifications` | name of the Toast stack | Notifications | Notificações |
| `stepper.label` / `stepper.done` | navigation name / completed step (screen reader) | Steps / completed | Etapas do fluxo / concluída |
| `treeSelect.loading` / `loadError` / `empty` | on-demand loading and empty search | Loading… / Could not load… / No items found | Carregando… / Não foi possível carregar… / Nenhum item encontrado |
| `pagination.nav` / `first` / `prev` / `next` / `last` | navigation name and buttons | Pagination / First / Previous / Next / Last | Paginação / Primeira / Anterior / Próxima / Última |
| `pagination.status(page, total)` | compact mode | Page 2 of 5 | Página 2 de 5 |
| `table.empty` / `retry` | empty state / error state button | No records found / Try again | Nenhum registro encontrado / Tentar novamente |
| `table.selectAll` / `selectRow` | checkboxes (screen reader) | Select all / Select row | Selecionar tudo / Selecionar linha |
| `table.actions` / `table.action.*` | actions column and default action names (`edit`, `delete`, `view`, `download`) | Actions / Edit, Delete, View, Download | Ações / Editar, Excluir, Visualizar, Baixar |
| `table.details` / `expand` | collapsed columns | Details / Show details | Detalhes / Mostrar detalhes |
| `table.bulkActions` / `noSelection` / `selectedCount(n)` | bulk actions bar | Bulk actions / No rows selected / 3 selected | Ações em massa / Nenhuma linha selecionada / 3 selecionados |
| `table.pageSize` / `pagination` / `range(start, end, total)` | paginated footer | Rows per page / Table pagination / Showing 1–5 of 6 | Itens por página / Paginação da tabela / Mostrando 1–5 de 6 |
| `formErrors.<type>` | error messages (`required`, `email`, `minlength`, `maxlength`, `min`, `max`, `pattern`, `cpf`, `cnpj`, `cpfCnpj`, `invalid`) | This field is required... | Campo obrigatório... |

Texts with data (`status`, `selectedCount`, `range`) are **functions**, so you can build the sentence your language's way (plurals, word order). `formErrors` messages accept text with `{{param}}` (the error data) or a function.

## Migrating from 2.x

Up to 2.x the default texts were Portuguese. To keep everything as it was, one line:

```ts
provideUiLabels(UI_LABELS_PT)
```

Also changed: `provideFormErrorMessages` no longer accepts the demo's **i18n keys** (e.g. `'form.error.cnpj'`); use the text or a function.
