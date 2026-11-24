import { Directive, TemplateRef, inject, input } from '@angular/core';

/** Célula custom de uma coluna específica */
@Directive({
  selector: 'ng-template[appCell]',
  standalone: true
})
export class TableCellTemplateDirective {
  /** nome da coluna (mesmo 'key' do ColumnDef) */
  readonly name = input.required<string>({ alias: "appCell" });
  readonly tpl = inject<TemplateRef<unknown>>(TemplateRef);
}

/**
 * contexto do `appBulkActions`: chaves selecionadas, quantidade e como limpar. O template
 * não enxerga os tipos da tabela: `keys` chega como `any[]` (tipe no método que o recebe).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- o template não vê o tipo de chave da tabela; any deixa o método que recebe declarar o seu
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
  readonly tpl = inject<TemplateRef<TableBulkActionsContext>>(TemplateRef);

  static ngTemplateContextGuard(_d: TableBulkActionsTemplateDirective, _ctx: unknown): _ctx is TableBulkActionsContext {
    return true;
  }
}

/** Template da coluna de ações (última coluna) */
@Directive({
  selector: 'ng-template[appActions]',
  standalone: true
})
export class TableActionsTemplateDirective {
  readonly tpl = inject<TemplateRef<unknown>>(TemplateRef);
}
