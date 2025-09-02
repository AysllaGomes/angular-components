import { Component, signal } from '@angular/core';

// import { ActionKind } from '../../../shared/model/type/action-kind.type';

import { TableComponent } from '../../../shared/components/table/table.component';

import { ColumnDef } from '../../../shared/model/interface/column-def.interface';
import { TableAction } from '../../../shared/model/interface/table-action.interface';
import { AdicionalRow } from '../../../shared/model/interface/adicional-row.interface';

@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './table-demo.component.html'
})
export class TableDemoComponent {

  // actions: ActionKind[] = ['edit'];

  actions: TableAction[] = [
    { kind: 'edit', ariaLabel: 'Editar', iconUrl: '/icons/svg/pen-box.svg' }
  ];

  rows: AdicionalRow[] = [
    { nome: 'Nome Colaborador',   tipo: 'Correntista',     documento: '111.222.333-44', limite: 'Limite máximo atribuído', nomeImpresso: 'NOME IMPRESSO' },
    { nome: 'Nome Colaborador - Não correntista', tipo: 'Não correntista', documento: '555.666.777-88', limite: 'Limite máximo atribuído', nomeImpresso: 'NOME IMPRESSO 2' },
    { nome: 'Nome Colaborador - Não correntista 2',tipo: 'Não correntista', documento: '012.345.678-90', limite: 'Limite máximo atribuído', nomeImpresso: 'NOME IMPRESSO 3' },
  ];

  selected = signal<number[]>([]);

  columns: ColumnDef<AdicionalRow>[] = [
    { key: 'nome',        header: 'Nome do adicional' },
    {
      key: 'tipo',
      header: 'Tipo de adicional',
      type: 'chip',
      align: 'center',
      width: '180px',
      chipMap: {
        'Correntista':     { label: 'Correntista',     variant: 'orange' },
        'Não correntista': { label: 'Não correntista', variant: 'teal'   },
      }
    },
    { key: 'documento',   header: 'Documento',         width: '160px' },
    { key: 'limite',      header: 'Limite atribuído',  width: '220px' },
    { key: 'nomeImpresso',header: 'Nome impresso',     width: '180px' },
  ];

  onEdit(row: AdicionalRow, index: number) {
    console.log('editar', index, row);
  }

  onAction(e: { type: string; row: AdicionalRow; index: number }) {
    if (e.type === 'edit') this.onEdit(e.row, e.index);
  }
}
