# Textos dos componentes (`provideUiLabels`)

> [English](./labels.en.md)

Os componentes têm alguns textos próprios: o "Fechar" do Dialog, o "Selecionar tudo" da Tabela, as setas da Paginação, as mensagens de erro dos formulários... Todos vêm de um lugar só e **não dependem de biblioteca de i18n**.

- **Padrão: inglês** (`UI_LABELS_EN`). Sem configurar nada, os componentes falam inglês.
- **Português pronto:** `UI_LABELS_PT`.
- **Por instância:** os inputs de cada componente (`emptyMessage`, `closeAriaLabel`, `rangeLabel`...) continuam valendo e **vencem** o provider.

## Uso

```ts
// app.config.ts
import { provideUiLabels, UI_LABELS_PT } from './shared/labels';

export const appConfig: ApplicationConfig = {
  providers: [
    provideUiLabels(UI_LABELS_PT), // tudo em português
  ],
};
```

### Só alguns textos

Passe só o que quer trocar; o resto continua no padrão. Os grupos (`table`, `pagination`...) também podem vir pela metade.

```ts
provideUiLabels({
  close: 'Dispensar',
  table: { empty: 'Nada por aqui ainda' },
  formErrors: { required: 'Preencha este campo' },
});
```

### Acompanhando o idioma do app (troca ao vivo)

Passe uma **função**: ela roda no contexto de injeção (pode usar `inject`) e pode devolver um **signal**. Quando o signal muda, os textos de todos os componentes mudam junto.

```ts
provideUiLabels(() => {
  const lang = inject(MeuIdiomaService).lang; // Signal<'pt' | 'en'>
  return computed(() => (lang() === 'pt' ? UI_LABELS_PT : UI_LABELS_EN));
});
```

É assim que a demo deste projeto continua bilíngue, sem os componentes conhecerem o i18n dela (`src/app/app.config.ts`).

## Ordem de prioridade

1. **Input** do componente, naquela instância (ex.: `<app-table emptyMessage="...">`).
2. **`provideUiLabels`**.
3. **`UI_LABELS_EN`** (padrão).

Para as mensagens de erro de formulário, `provideFormErrorMessages` vem antes de `formErrors` (ver [Formulários](../forms/forms.md)).

## Textos disponíveis

| Chave | Onde aparece | Inglês (padrão) | `UI_LABELS_PT` |
|---|---|---|---|
| `close` | botão de fechar (Dialog, ActionBar, Toast, folha do Select/TreeSelect) | Close | Fechar |
| `required` | marcador ao lado do rótulo (FormField, RadioGroup, Select, TreeSelect) | required | requerido |
| `requiredError` | erro automático de obrigatório (Select, TreeSelect) | This field is required | Campo obrigatório |
| `clearSelection` | botão que limpa (Select, TreeSelect, ações em massa da Tabela) | Clear selection | Limpar seleção |
| `filterOptions` | campo de busca do Select | Filter options | Filtrar opções |
| `selectTitle` | título da folha do Select no celular, sem `panelTitle` nem `label` | Select an option | Selecionar |
| `notifications` | nome da pilha de Toasts | Notifications | Notificações |
| `stepper.label` / `stepper.done` | nome da navegação / etapa concluída (leitor de tela) | Steps / completed | Etapas do fluxo / concluída |
| `treeSelect.loading` / `loadError` / `empty` | carregamento sob demanda e busca vazia | Loading… / Could not load… / No items found | Carregando… / Não foi possível carregar… / Nenhum item encontrado |
| `pagination.nav` / `first` / `prev` / `next` / `last` | nome da navegação e botões | Pagination / First / Previous / Next / Last | Paginação / Primeira / Anterior / Próxima / Última |
| `pagination.status(page, total)` | modo compacto | Page 2 of 5 | Página 2 de 5 |
| `table.empty` / `retry` | estado vazio / botão do estado de erro | No records found / Try again | Nenhum registro encontrado / Tentar novamente |
| `table.selectAll` / `selectRow` | checkboxes (leitor de tela) | Select all / Select row | Selecionar tudo / Selecionar linha |
| `table.actions` / `table.action.*` | coluna de ações e nome padrão das ações (`edit`, `delete`, `view`, `download`) | Actions / Edit, Delete, View, Download | Ações / Editar, Excluir, Visualizar, Baixar |
| `table.details` / `expand` | colunas recolhidas | Details / Show details | Detalhes / Mostrar detalhes |
| `table.bulkActions` / `noSelection` / `selectedCount(n)` | barra de ações em massa | Bulk actions / No rows selected / 3 selected | Ações em massa / Nenhuma linha selecionada / 3 selecionados |
| `table.pageSize` / `pagination` / `range(start, end, total)` | rodapé paginado | Rows per page / Table pagination / Showing 1–5 of 6 | Itens por página / Paginação da tabela / Mostrando 1–5 de 6 |
| `formErrors.<tipo>` | mensagens de erro (`required`, `email`, `minlength`, `maxlength`, `min`, `max`, `pattern`, `cpf`, `cnpj`, `cpfCnpj`, `invalid`) | This field is required... | Campo obrigatório... |

Os textos com dados (`status`, `selectedCount`, `range`) são **funções**, para você montar a frase do jeito do seu idioma (plural, ordem das palavras). As mensagens de `formErrors` aceitam texto com `{{param}}` (os dados do erro) ou função.

## Migrando da 2.x

Até a 2.x os textos padrão eram em português. Para manter tudo como estava, uma linha:

```ts
provideUiLabels(UI_LABELS_PT)
```

Mudou também: `provideFormErrorMessages` não aceita mais **chaves do i18n** da demo (ex.: `'form.error.cnpj'`); use o texto ou uma função.
