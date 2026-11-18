import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { TPipe } from '../../i18n/t.pipe';

import { ButtonDirective } from '../button/button.directive';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.sass',
  imports: [
    NgFor,
    TPipe,
    ButtonDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  /** total de itens */
  @Input({ required: true }) total = 0;
  /** itens por página */
  @Input() pageSize = 10;
  /** índice da página (0-based) */
  @Input() pageIndex = 0;
  /** máx. de botões numéricos visíveis */
  @Input() maxVisible = 5;

  /** emite o novo índice (0-based) */
  @Output() pageChange = new EventEmitter<number>();

  /** inteiro positivo, ou o fallback para valores inválidos (0, negativo, NaN) */
  private static positiveInt(v: number, fallback: number): number {
    const n = Math.floor(Number(v));
    return Number.isFinite(n) && n > 0 ? n : fallback;
  }

  get pageCount(): number {
    const total = Math.max(0, Number(this.total) || 0);
    const size = PaginationComponent.positiveInt(this.pageSize, 1);
    return Math.max(1, Math.ceil(total / size));
  }

  /** `pageIndex` limitado ao intervalo válido [0, pageCount - 1] */
  get current(): number {
    const i = Math.floor(Number(this.pageIndex) || 0);
    return Math.min(Math.max(0, i), this.pageCount - 1);
  }

  get canPrev() { return this.current > 0; }
  get canNext() { return this.current < this.pageCount - 1; }

  pages(): number[] {
    const count = this.pageCount;
    const visible = PaginationComponent.positiveInt(this.maxVisible, 1);
    if (count <= visible) return Array.from({ length: count }, (_, i) => i);

    const half = Math.floor((visible - 1) / 2);
    let start = Math.max(0, this.current - half);
    let end = start + visible;

    if (end > count) {
      end = count;
      start = Math.max(0, end - visible);
    }
    return Array.from({ length: end - start }, (_, i) => start + i);
  }

  goTo(i: number) {
    if (i === this.current || i < 0 || i >= this.pageCount) return;
    this.pageChange.emit(i);
  }
  prev() { if (this.canPrev) this.pageChange.emit(this.current - 1); }
  next() { if (this.canNext) this.pageChange.emit(this.current + 1); }
}
