import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { PaginationComponent } from '../pagination/pagination.component';

let uid = 0;

/**
 * Rodapé da `app-table` paginada (uso interno): "Mostrando 1–5 de 6", seletor de
 * itens por página (opcional) e a paginação. A tabela calcula os números.
 */
@Component({
  selector: 'app-table-footer',
  imports: [PaginationComponent],
  templateUrl: './table-footer.component.html',
  styleUrl: './table-footer.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'tbl-footer' }
})
export class TableFooterComponent {
  readonly rangeText = input.required<string>();
  readonly total = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly pageIndex = input.required<number>();
  readonly pageCount = input.required<number>();
  readonly pageSizeOptions = input<number[]>([]);
  readonly pageSizeLabel = input.required<string>();
  readonly paginationLabel = input.required<string>();

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  readonly sizeId = `tbl-size-${++uid}`;

  onSize(value: string) {
    const n = Number(value);
    if (Number.isFinite(n) && n > 0) this.pageSizeChange.emit(n);
  }
}
