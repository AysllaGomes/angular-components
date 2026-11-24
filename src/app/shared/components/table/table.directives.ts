import { Directive, TemplateRef, input } from '@angular/core';

/** Célula custom de uma coluna específica */
@Directive({
  selector: 'ng-template[appCell]',
  standalone: true
})
export class TableCellTemplateDirective {
  /** nome da coluna (mesmo 'key' do ColumnDef) */
  readonly name = input.required<string>({ alias: "appCell" });
  constructor(public tpl: TemplateRef<any>) {}
}

/**
 * contexto do `appBulkActions`: chaves selecionadas, quantidade e como limpar. O template
 * não enxerga os tipos da tabela: `keys` chega como `any[]` (tipe no método que o recebe).
 */
export interface TableBulkActionsContext<K = any> {
  $implicit: K[];
  keys: K[];
  count: number;
  clear: () => void;
}

/**
 * Botões da barra de ações em massa (no lugar de `[bulkActions]`).
 * O contador e "Limpar seleção" continuam sendo da tabela.
 */
@Directive({
  selector: 'ng-template[appBulkActions]',
  standalone: true
})
export class TableBulkActionsTemplateDirective {
  constructor(public tpl: TemplateRef<TableBulkActionsContext>) {}

  static ngTemplateContextGuard(_d: TableBulkActionsTemplateDirective, ctx: unknown): ctx is TableBulkActionsContext {
    return true;
  }
}

/** Template da coluna de ações (última coluna) */
@Directive({
  selector: 'ng-template[appActions]',
  standalone: true
})
export class TableActionsTemplateDirective {
  constructor(public tpl: TemplateRef<any>) {}
}
