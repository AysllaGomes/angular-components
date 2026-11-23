import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
// os testes conferem os textos em português (o padrão dos componentes é inglês)
import { UI_LABELS_PT, provideUiLabels } from '../../labels';
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
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
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
    expect(cmp.canNext).toBe(false);
    expect(cmp.pages()).toEqual([0, 1, 2]);

    set('pageIndex', -3);
    expect(cmp.current).toBe(0);
    expect(cmp.canPrev).toBe(false);
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

  describe('compact mode', () => {
    const nav = () => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('nav.pg')!;
    const status = () => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.pg-status')!;

    beforeEach(() => {
      set('total', 100);
      set('pageSize', 10);
      set('pageIndex', 2);
    });

    it('is off by default (no compact classes)', async () => {
      await fixture.whenStable();
      expect(nav().classList).not.toContain('pg--compact');
      expect(nav().classList).not.toContain('pg--auto');
    });

    it('compact=true marks the nav and shows "page X of Y" for the current page', async () => {
      set('compact', true);
      await fixture.whenStable();
      expect(nav().classList).toContain('pg--compact');
      expect(status().textContent).toMatch(/\b3\b.*\b10\b/);
      expect(status().getAttribute('aria-live')).toBe('polite');
    });

    it('the status follows page changes', async () => {
      set('compact', true);
      set('pageIndex', 9);
      await fixture.whenStable();
      expect(status().textContent).toMatch(/\b10\b.*\b10\b/);
    });

    it("compact='auto' uses the responsive class instead", async () => {
      set('compact', 'auto');
      await fixture.whenStable();
      expect(nav().classList).toContain('pg--auto');
      expect(nav().classList).not.toContain('pg--compact');
    });

    it('accepts the bare attribute (empty string) as true', async () => {
      set('compact', '');
      await fixture.whenStable();
      expect(cmp.compact()).toBe(true);
      expect(nav().classList).toContain('pg--compact');
    });
  });
});

// ===== Primeira/Última e teclado (com um pai que aplica a página emitida) =====

@Component({
  imports: [PaginationComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-pagination [total]="100" [pageSize]="10" [maxVisible]="3"
                    [pageIndex]="page()" [showFirstLast]="firstLast()" [compact]="compact()"
                    (pageChange)="page.set($event)" />
  `
})
class PagerHostComponent {
  page = signal(0);
  firstLast = signal(true);
  compact = signal<boolean | 'auto'>(false);
}

describe('PaginationComponent first/last and keyboard', () => {
  let fixture: ComponentFixture<PagerHostComponent>;
  let host: PagerHostComponent;
  let el: HTMLElement;

  const btn = (label: string) => el.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);
  const nav = () => el.querySelector<HTMLElement>('nav.pg')!;
  const currentBtn = () => el.querySelector<HTMLButtonElement>('.pg-btn[aria-current="page"]')!;
  const press = async (target: HTMLElement, key: string, init: KeyboardEventInit = {}) => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagerHostComponent],
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
    }).compileComponents();
    fixture = TestBed.createComponent(PagerHostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('first/last buttons only render with showFirstLast', async () => {
    expect(btn('Primeira')).not.toBeNull();
    expect(btn('Última')).not.toBeNull();

    host.firstLast.set(false);
    await fixture.whenStable();
    expect(btn('Primeira')).toBeNull();
    expect(btn('Última')).toBeNull();
  });

  it('first/last jump to the ends and are disabled at them', async () => {
    expect(btn('Primeira')!.disabled).toBe(true);

    btn('Última')!.click();
    await fixture.whenStable();
    expect(host.page()).toBe(9);
    expect(btn('Última')!.disabled).toBe(true);

    btn('Primeira')!.click();
    await fixture.whenStable();
    expect(host.page()).toBe(0);
  });

  it('←/→ go to the previous/next page and Home/End to the ends', async () => {
    currentBtn().focus();
    await press(currentBtn(), 'ArrowRight');
    expect(host.page()).toBe(1);
    await press(currentBtn(), 'ArrowRight');
    expect(host.page()).toBe(2);
    await press(currentBtn(), 'ArrowLeft');
    expect(host.page()).toBe(1);
    await press(currentBtn(), 'End');
    expect(host.page()).toBe(9);
    await press(currentBtn(), 'Home');
    expect(host.page()).toBe(0);
  });

  it('stays put at the ends and ignores keys with modifiers', async () => {
    await press(currentBtn(), 'ArrowLeft');
    expect(host.page()).toBe(0);

    await press(currentBtn(), 'ArrowRight', { ctrlKey: true });
    expect(host.page()).toBe(0);
  });

  it('keeps focus on the current page button when the number window slides', async () => {
    // maxVisible=3: indo de 1 para 5, o botão "1" sai da janela
    currentBtn().focus();
    for (let i = 0; i < 4; i++) await press(document.activeElement as HTMLElement, 'ArrowRight');
    expect(host.page()).toBe(4);
    expect(document.activeElement).toBe(currentBtn());
    expect(document.activeElement?.textContent?.trim()).toBe('5');
  });

  it('moves focus off a button that became disabled (prev at the first page)', async () => {
    host.page.set(1);
    await fixture.whenStable();
    const prev = btn('Anterior')!;
    prev.focus();

    await press(prev, 'ArrowLeft');
    expect(host.page()).toBe(0);
    expect(prev.disabled).toBe(true);
    expect(document.activeElement).not.toBe(prev);
    expect(nav().contains(document.activeElement)).toBe(true);
  });

  it('the nav is the keyboard target (works from any button inside it)', async () => {
    await press(btn('Próxima')!, 'ArrowRight');
    expect(host.page()).toBe(1);
  });
});
