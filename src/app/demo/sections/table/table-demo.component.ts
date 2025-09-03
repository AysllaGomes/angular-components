import { NgIf } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

import { TableComponent } from '../../../shared/components/table/table.component';

import { ColumnDef } from '../../../shared/model/interface/column-def.interface';
import { TableAction } from '../../../shared/model/interface/table-action.interface';
import { AdicionalRow } from '../../../shared/model/interface/adicional-row.interface';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [NgIf, TableComponent, PaginationComponent],
  templateUrl: './table-demo.component.html',
  styleUrl: './table-demo.component.sass'
})
export class TableDemoComponent {

  actions: TableAction[] = [
    { kind: 'edit', ariaLabel: 'Editar', iconUrl: '/icons/svg/pen-box.svg' }
  ];

  rows: AdicionalRow[] = [
    { nome: 'Nome Colaborador',   tipo: 'Correntista',     documento: '111.222.333-44', limite: 'Limite máximo atribuído', nomeImpresso: 'NOME IMPRESSO' },
    { nome: 'Nome Colaborador - Não correntista', tipo: 'Não correntista', documento: '555.666.777-88', limite: 'Limite máximo atribuído', nomeImpresso: 'NOME IMPRESSO 2' },
    { nome: 'Nome Colaborador - Correntista 2',tipo: 'Correntista', documento: '012.345.678-90', limite: 'Limite máximo atribuído', nomeImpresso: 'NOME IMPRESSO 3' },
    { nome: 'Nome Colaborador - Não correntista 3',tipo: 'Não correntista', documento: '098.765.432-10', limite: 'Limite máximo atribuído', nomeImpresso: 'NOME IMPRESSO 4' },
    { nome: 'Nome Colaborador - Correntista 3',tipo: 'Correntista', documento: '111.111.111-11', limite: 'Limite máximo atribuído', nomeImpresso: 'NOME IMPRESSO 5' },
    { nome: 'Nome Colaborador - Não correntista 5',tipo: 'Não correntista', documento: '999.000.111-22', limite: 'Limite máximo atribuído', nomeImpresso: 'NOME IMPRESSO 6' },
  ];

  loading = signal(false);
  empty = signal(false);

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

  pageSize = 5;

  pageIndex = signal(0);

  pagedRows = computed(() => {
    const source = this.empty() ? [] : this.rows;
    const start = this.pageIndex() * this.pageSize;
    return source.slice(start, start + this.pageSize);
  });

  onEdit(row: AdicionalRow, index: number) {
    console.log('editar', index, row);
  }

  onAction(e: { type: string; row: AdicionalRow; index: number }) {
    if (e.type === 'edit') this.onEdit(e.row, e.index);
  }

  simulateLoad() {
    if (this.loading()) return;
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 1500);
  }

  toggleEmpty() {
    this.empty.update(v => !v);
    // opcional: voltar para a primeira página ao esvaziar
    this.pageIndex.set(0);
  }
}
