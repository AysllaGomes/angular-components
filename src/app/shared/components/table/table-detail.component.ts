import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, input } from '@angular/core';

import { ColumnDef } from '../../model/interface/column-def.interface';

/**
 * Conteúdo da linha de detalhes da `app-table` (uso interno): as colunas recolhidas
 * como "Rótulo: valor". O valor usa o mesmo template de célula da tabela
 * (texto, chip ou custom), então aparece igual ao da coluna.
 */
@Component({
  selector: 'app-table-detail',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dl>
      @for (col of columns(); track col.key) {
        <div>
          <dt>{{ col.header }}</dt>
          <dd><ng-container [ngTemplateOutlet]="cell()" [ngTemplateOutletContext]="{ $implicit: col, row: row(), i: index() }" /></dd>
        </div>
      }
    </dl>
  `,
  // inlineStyleLanguage do projeto: sass (sintaxe indentada)
  styles: `
dl
  display: flex
  flex-wrap: wrap
  gap: .5rem 2rem
  margin: 0

dt
  color: var(--tbl-muted)
  font-size: .85em
  font-weight: 600

dd
  margin: .15rem 0 0
`
})
export class TableDetailComponent {
  readonly columns = input.required<ColumnDef[]>();
  readonly row = input.required<unknown>();
  readonly index = input.required<number>();
  readonly cell = input.required<TemplateRef<unknown>>();
}
