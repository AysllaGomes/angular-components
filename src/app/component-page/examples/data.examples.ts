import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { injectIsEn } from './lang';
import { TableComponent } from '../../shared/components/table/table.component';
import { ColumnDef } from '../../shared/components/table/table.types';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

/*
 * Exemplos ao vivo do grupo Dados. Cada um reproduz o exemplo de "Uso" do .md
 * (o que a aba "Código" mostra), no idioma da página.
 */

const STATUS = `
.status
  margin: .75rem 0 0
  min-height: 1.5em
  color: var(--muted, #5f6a75)
  font-size: .9375rem
`;

interface Person { id: string; nome: string; tipo: string; }

/** table.md → ## Uso (ações declarativas) */
@Component({
  selector: 'app-table-example',
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-table
      [columns]="columns()"
      [data]="rows"
      [selectable]="true"
      rowKey="id"
      [actions]="['edit']"
      [selected]="selected()"
      (selectedChange)="selected.set($event)"
      (action)="onAction($event)" />
    <p class="status" role="status">{{ last() }}</p>
  `,
  styles: STATUS
})
export class TableExampleComponent {
  private readonly isEn = injectIsEn();
  readonly rows: Person[] = [
    { id: 'a', nome: 'Ana Souza', tipo: 'Titular' },
    { id: 'b', nome: 'Bruno Lima', tipo: 'Adicional' },
    { id: 'c', nome: 'Carla Dias', tipo: 'Adicional' },
  ];
  readonly columns = computed<ColumnDef<Person>[]>(() => {
    const en = this.isEn();
    return [
      { key: 'nome', header: en ? 'Name' : 'Nome' },
      { key: 'tipo', header: en ? 'Type' : 'Tipo' },
    ];
  });
  readonly selected = signal<string[]>([]);
  readonly last = signal('');

  onAction(e: { type: string; row: Person }) {
    this.last.set(this.isEn() ? `Action "${e.type}" on ${e.row.nome}` : `Ação "${e.type}" em ${e.row.nome}`);
  }
}

/** pagination.md → ## Uso */
@Component({
  selector: 'app-pagination-example',
  imports: [PaginationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-pagination
      [total]="42"
      [pageSize]="10"
      [pageIndex]="pageIndex()"
      [maxVisible]="5"
      (pageChange)="pageIndex.set($event)">
    </app-pagination>
    <p class="status">{{ isEn() ? 'Items' : 'Itens' }} {{ pageIndex() * 10 + 1 }}–{{ min(pageIndex() * 10 + 10, 42) }} {{ isEn() ? 'of' : 'de' }} 42</p>
  `,
  styles: STATUS
})
export class PaginationExampleComponent {
  readonly isEn = injectIsEn();
  readonly pageIndex = signal(0);
  readonly min = Math.min;
}
