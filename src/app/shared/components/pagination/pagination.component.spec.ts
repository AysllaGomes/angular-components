import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let cmp: PaginationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    cmp = TestBed.createComponent(PaginationComponent).componentInstance;
  });

  it('computes the page count (minimum 1)', () => {
    cmp.pageSize = 10;
    cmp.total = 0;
    expect(cmp.pageCount).toBe(1);
    cmp.total = 95;
    expect(cmp.pageCount).toBe(10);
  });

  it('shows every page when they fit in maxVisible', () => {
    cmp.total = 30;
    cmp.pageSize = 10;
    cmp.maxVisible = 5;
    expect(cmp.pages()).toEqual([0, 1, 2]);
  });

  it('centers the window on the current page', () => {
    cmp.total = 200;
    cmp.pageSize = 10;
    cmp.maxVisible = 5;

    cmp.pageIndex = 0;
    expect(cmp.pages()).toEqual([0, 1, 2, 3, 4]);

    cmp.pageIndex = 10;
    expect(cmp.pages()).toEqual([8, 9, 10, 11, 12]);

    cmp.pageIndex = 19;
    expect(cmp.pages()).toEqual([15, 16, 17, 18, 19]);
  });

  it('emits pageChange only for valid moves', () => {
    const emitted: number[] = [];
    cmp.pageChange.subscribe(i => emitted.push(i));
    cmp.total = 30;
    cmp.pageSize = 10;

    cmp.pageIndex = 0;
    cmp.prev();       // bloqueado
    cmp.goTo(0);      // mesma página
    cmp.next();       // → 1

    cmp.pageIndex = 2;
    cmp.next();       // bloqueado
    cmp.goTo(1);      // → 1

    expect(emitted).toEqual([1, 1]);
  });
});
