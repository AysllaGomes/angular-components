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

/** Template da coluna de ações (última coluna) */
@Directive({
  selector: 'ng-template[appActions]',
  standalone: true
})
export class TableActionsTemplateDirective {
  constructor(public tpl: TemplateRef<any>) {}
}
