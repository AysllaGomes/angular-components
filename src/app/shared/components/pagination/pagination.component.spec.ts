import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let fixture: ComponentFixture<PaginationComponent>;
  let cmp: PaginationComponent;

  /** inputs são signals: altera via setInput, como um componente pai faria */
  const set = (name: string, value: unknown) => fixture.componentRef.setInput(name, value);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    cmp = fixture.componentInstance;
  });

  it('computes the page count (minimum 1)', () => {
    set('pageSize', 10);
    set('total', 0);
    expect(cmp.pageCount).toBe(1);
    set('total', 95);
    expect(cmp.pageCount).toBe(10);
  });

  it('shows every page when they fit in maxVisible', () => {
    set('total', 30);
    set('pageSize', 10);
    set('maxVisible', 5);
    expect(cmp.pages()).toEqual([0, 1, 2]);
  });

  it('centers the window on the current page', () => {
    set('total', 200);
    set('pageSize', 10);
    set('maxVisible', 5);

    set('pageIndex', 0);
    expect(cmp.pages()).toEqual([0, 1, 2, 3, 4]);

    set('pageIndex', 10);
    expect(cmp.pages()).toEqual([8, 9, 10, 11, 12]);

    set('pageIndex', 19);
    expect(cmp.pages()).toEqual([15, 16, 17, 18, 19]);
  });

  it('treats invalid pageSize as 1 instead of producing Infinity/NaN', () => {
    set('total', 3);
    for (const size of [0, -5, NaN]) {
      set('pageSize', size);
      expect(cmp.pageCount).toBe(3);
    }
  });

  it('clamps pageIndex to the valid range', () => {
    set('total', 30);
    set('pageSize', 10);

    set('pageIndex', 99);
    expect(cmp.current).toBe(2);
    expect(cmp.canNext).toBeFalse();
    expect(cmp.pages()).toEqual([0, 1, 2]);

    set('pageIndex', -3);
    expect(cmp.current).toBe(0);
    expect(cmp.canPrev).toBeFalse();
  });

  it('ignores goTo outside the range', () => {
    const emitted: number[] = [];
    cmp.pageChange.subscribe(i => emitted.push(i));
    set('total', 30);
    set('pageSize', 10);

    cmp.goTo(-1);
    cmp.goTo(3);
    expect(emitted).toEqual([]);
  });

  it('emits pageChange only for valid moves', () => {
    const emitted: number[] = [];
    cmp.pageChange.subscribe(i => emitted.push(i));
    set('total', 30);
    set('pageSize', 10);

    set('pageIndex', 0);
    cmp.prev();       // bloqueado
    cmp.goTo(0);      // mesma página
    cmp.next();       // → 1

    set('pageIndex', 2);
    cmp.next();       // bloqueado
    cmp.goTo(1);      // → 1

    expect(emitted).toEqual([1, 1]);
  });
});
