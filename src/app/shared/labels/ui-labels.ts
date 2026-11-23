import { InjectionToken, Provider, Signal, computed, inject, isSignal } from '@angular/core';

/** mensagem de erro de formulário: texto (com `{{param}}`) ou função com os dados do erro */
export type ErrorMessage = string | ((error: any) => string);

/**
 * Todos os textos que os componentes mostram ou anunciam por conta própria.
 * Sem provider, valem os de `UI_LABELS_EN`. Os inputs de cada componente
 * (`emptyMessage`, `closeAriaLabel`...) continuam vencendo, por instância.
 */
export interface UiLabels {
  /** botão de fechar (Dialog, ActionBar, Toast, folha do Select/TreeSelect) */
  close: string;
  /** marcador de campo obrigatório ao lado do rótulo */
  required: string;
  /** erro automático de campo obrigatório (Select, TreeSelect) */
  requiredError: string;
  /** botão que limpa a seleção (Select, TreeSelect, barra de ações em massa) */
  clearSelection: string;
  /** campo de busca dentro do Select */
  filterOptions: string;
  /** título da folha do Select no celular, quando não há `panelTitle` nem `label` */
  selectTitle: string;
  /** caixa "marcar todas" do CheckboxGroup (`selectAll`) */
  selectAll: string;
  /** nome da pilha de notificações (Toast) */
  notifications: string;

  stepper: { label: string; done: string };
  treeSelect: { loading: string; loadError: string; empty: string };
  pagination: {
    nav: string; first: string; prev: string; next: string; last: string;
    status: (page: number, total: number) => string;
  };
  table: {
    empty: string;
    retry: string;
    selectAll: string;
    selectRow: string;
    actions: string;
    /** nomes padrão das ações declarativas sem `label`/`ariaLabel` */
    action: { edit: string; delete: string; view: string; download: string };
    details: string;
    expand: string;
    bulkActions: string;
    noSelection: string;
    selectedCount: (n: number) => string;
    pageSize: string;
    pagination: string;
    range: (start: number, end: number, total: number) => string;
  };
  /** mensagens por tipo de erro (`required`, `minlength`...); `invalid` é o fallback */
  formErrors: Record<string, ErrorMessage>;
}

/** textos parciais: só o que você quer trocar (grupos também podem vir pela metade) */
export type UiLabelsInput = Partial<Omit<UiLabels, 'stepper' | 'treeSelect' | 'pagination' | 'table' | 'formErrors'>> & {
  stepper?: Partial<UiLabels['stepper']>;
  treeSelect?: Partial<UiLabels['treeSelect']>;
  pagination?: Partial<UiLabels['pagination']>;
  table?: Partial<Omit<UiLabels['table'], 'action'>> & { action?: Partial<UiLabels['table']['action']> };
  formErrors?: Record<string, ErrorMessage>;
};

export const UI_LABELS_EN: UiLabels = {
  close: 'Close',
  required: 'required',
  requiredError: 'This field is required',
  clearSelection: 'Clear selection',
  filterOptions: 'Filter options',
  selectTitle: 'Select an option',
  selectAll: 'Select all',
  notifications: 'Notifications',
  stepper: { label: 'Steps', done: 'completed' },
  treeSelect: {
    loading: 'Loading…',
    loadError: 'Could not load. Open it again to retry.',
    empty: 'No items found',
  },
  pagination: {
    nav: 'Pagination', first: 'First', prev: 'Previous', next: 'Next', last: 'Last',
    status: (page, total) => `Page ${page} of ${total}`,
  },
  table: {
    empty: 'No records found',
    retry: 'Try again',
    selectAll: 'Select all',
    selectRow: 'Select row',
    actions: 'Actions',
    action: { edit: 'Edit', delete: 'Delete', view: 'View', download: 'Download' },
    details: 'Details',
    expand: 'Show details',
    bulkActions: 'Bulk actions',
    noSelection: 'No rows selected',
    selectedCount: n => `${n} selected`,
    pageSize: 'Rows per page',
    pagination: 'Table pagination',
    range: (s, e, t) => `Showing ${s}–${e} of ${t}`,
  },
  formErrors: {
    required: 'This field is required',
    email: 'Invalid email',
    minlength: 'At least {{requiredLength}} characters',
    maxlength: 'At most {{requiredLength}} characters',
    min: 'The minimum is {{min}}',
    max: 'The maximum is {{max}}',
    pattern: 'Invalid format',
    cpf: 'Invalid CPF',
    cnpj: 'Invalid CNPJ',
    cpfCnpj: 'Invalid CPF or CNPJ',
    invalid: 'Invalid value',
  },
};

export const UI_LABELS_PT: UiLabels = {
  close: 'Fechar',
  required: 'requerido',
  requiredError: 'Campo obrigatório',
  clearSelection: 'Limpar seleção',
  filterOptions: 'Filtrar opções',
  selectTitle: 'Selecionar',
  selectAll: 'Selecionar todos',
  notifications: 'Notificações',
  stepper: { label: 'Etapas do fluxo', done: 'concluída' },
  treeSelect: {
    loading: 'Carregando…',
    loadError: 'Não foi possível carregar. Abra de novo para tentar.',
    empty: 'Nenhum item encontrado',
  },
  pagination: {
    nav: 'Paginação', first: 'Primeira', prev: 'Anterior', next: 'Próxima', last: 'Última',
    status: (page, total) => `Página ${page} de ${total}`,
  },
  table: {
    empty: 'Nenhum registro encontrado',
    retry: 'Tentar novamente',
    selectAll: 'Selecionar tudo',
    selectRow: 'Selecionar linha',
    actions: 'Ações',
    action: { edit: 'Editar', delete: 'Excluir', view: 'Visualizar', download: 'Baixar' },
    details: 'Detalhes',
    expand: 'Mostrar detalhes',
    bulkActions: 'Ações em massa',
    noSelection: 'Nenhuma linha selecionada',
    selectedCount: n => (n === 1 ? '1 selecionado' : `${n} selecionados`),
    pageSize: 'Itens por página',
    pagination: 'Paginação da tabela',
    range: (s, e, t) => `Mostrando ${s}–${e} de ${t}`,
  },
  formErrors: {
    required: 'Campo obrigatório',
    email: 'E-mail inválido',
    minlength: 'Mínimo de {{requiredLength}} caracteres',
    maxlength: 'Máximo de {{requiredLength}} caracteres',
    min: 'O mínimo é {{min}}',
    max: 'O máximo é {{max}}',
    pattern: 'Formato inválido',
    cpf: 'CPF inválido',
    cnpj: 'CNPJ inválido',
    cpfCnpj: 'CPF ou CNPJ inválido',
    invalid: 'Valor inválido',
  },
};

export const UI_LABELS = new InjectionToken<UiLabelsInput | Signal<UiLabelsInput>>('UI_LABELS');

/**
 * Troca os textos dos componentes num lugar só (ex.: em `app.config.ts`):
 *
 * ```ts
 * provideUiLabels(UI_LABELS_PT)                        // tudo em português
 * provideUiLabels({ close: 'Dismiss', table: { empty: 'Nada aqui' } })  // só alguns
 * provideUiLabels(() => {                               // acompanha o idioma do app
 *   const lang = inject(MyLangService).lang;            // roda no contexto de injeção
 *   return computed(() => (lang() === 'pt' ? UI_LABELS_PT : UI_LABELS_EN));
 * })
 * ```
 */
export function provideUiLabels(
  labels: UiLabelsInput | (() => UiLabelsInput | Signal<UiLabelsInput>)
): Provider {
  return {
    provide: UI_LABELS,
    useFactory: () => (typeof labels === 'function' ? labels() : labels),
  };
}

/** textos efetivos: `UI_LABELS_EN` + o que o provider trocou (acompanha um signal, se houver) */
export function injectUiLabels(): Signal<UiLabels> {
  const provided = inject(UI_LABELS, { optional: true });
  return computed(() => mergeLabels(UI_LABELS_EN, isSignal(provided) ? provided() : provided));
}

function mergeLabels(base: UiLabels, over: UiLabelsInput | null | undefined): UiLabels {
  if (!over) return base;
  return {
    ...base,
    ...over,
    stepper: { ...base.stepper, ...over.stepper },
    treeSelect: { ...base.treeSelect, ...over.treeSelect },
    pagination: { ...base.pagination, ...over.pagination },
    table: { ...base.table, ...over.table, action: { ...base.table.action, ...over.table?.action } },
    formErrors: { ...base.formErrors, ...over.formErrors },
  };
}
