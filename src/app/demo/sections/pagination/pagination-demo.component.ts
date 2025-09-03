import { Component, signal, computed } from '@angular/core';
import { NgIf } from '@angular/common';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-pagination-demo',
  standalone: true,
  imports: [NgIf, PaginationComponent],
  templateUrl: './pagination-demo.component.html'
})
export class PaginationDemoComponent {
  total = signal(42);
  pageSize = signal(5);
  pageIndex = signal(0);

  // texto “Mostrando X–Y de Z”
  rangeText = computed(() => {
    const size = this.pageSize();
    const idx = this.pageIndex();
    const start = idx * size + 1;
    const end = Math.min(this.total(), start + size - 1);
    return `${start}–${end} de ${this.total()}`;
  });

  // se o usuário trocar o pageSize, garante que o índice continua válido
  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    const last = Math.max(0, Math.ceil(this.total() / size) - 1);
    if (this.pageIndex() > last) this.pageIndex.set(last);
  }
}
