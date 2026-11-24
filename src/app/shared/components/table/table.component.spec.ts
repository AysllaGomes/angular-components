import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
// os testes conferem os textos em português (o padrão dos componentes é inglês)
import { UI_LABELS_PT, provideUiLabels } from '../../labels';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ColumnDef, TableAction, TableBulkAction, TableBulkBarIdle, TableKey } from './table.types';

import { TableComponent } from './table.component';
import { TableBulkActionsTemplateDirective } from './table.directives';

interface Row { id: string; nome: string; }

const ALL: Row[] = [
  { id: 'a', nome: 'Ana' },
  { id: 'b', nome: 'Bruno' },
  { id: 'c', nome: 'Carla' },
  { id: 'd', nome: 'Diego' }
];

@Component({
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-table
      [columns]="columns"
      [data]="data()"
      [selectable]="true"
      [rowKey]="useKey ? 'id' : undefined"
      [selected]="selected()"
      (selectedChange)="selected.set($event)" />
  `
})
class HostComponent {
  columns: ColumnDef<Row>[] = [{ key: 'nome', header: 'Nome' }];
  data = signal<Row[]>(ALL.slice(0, 2));
  selected = signal<any[]>([]);
  useKey = true;
}

describe('TableComponent selection', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;

  const rowBoxes = () =>
    Array.from(el.querySelectorAll<HTMLInputElement>('tbody input[type=checkbox]'));
  const headerBox = () => el.querySelector<HTMLInputElement>('thead input[type=checkbox]')!;

  async function create(useKey: boolean) {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    host.useKey = useKey;
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  async function click(box: HTMLInputElement) {
    box.click();
    await fixture.whenStable();
  }

  describe('with rowKey', () => {
    beforeEach(() => create(true));

    it('emits row keys instead of indices', async () => {
      await click(rowBoxes()[1]);
      expect(host.selected()).toEqual(['b']);
    });

    it('keeps the selection attached to the row when data is reordered', async () => {
      await click(rowBoxes()[0]); // Ana
      host.data.set([ALL[1], ALL[0]]); // Bruno, Ana
      await fixture.whenStable();

      expect(rowBoxes().map(b => b.checked)).toEqual([false, true]);
    });

    it('select all affects only visible rows and keeps other pages', async () => {
      await click(rowBoxes()[0]); // página 1: Ana
      host.data.set(ALL.slice(2)); // página 2: Carla, Diego
      await fixture.whenStable();

      expect(headerBox().checked).toBe(false);
      expect(headerBox().indeterminate).toBe(false);

      await click(headerBox());
      expect(host.selected()).toEqual(['a', 'c', 'd']);
      expect(headerBox().checked).toBe(true);

      await click(headerBox());
      expect(host.selected()).toEqual(['a']);
    });

    it('shows indeterminate when only some visible rows are selected', async () => {
      await click(rowBoxes()[0]);
      expect(headerBox().indeterminate).toBe(true);
      expect(headerBox().checked).toBe(false);
    });
  });

  describe('without rowKey (index mode, backwards compatible)', () => {
    beforeEach(() => create(false));

    it('emits sorted row indices', async () => {
      await click(rowBoxes()[1]);
      await click(rowBoxes()[0]);
      expect(host.selected()).toEqual([0, 1]);
    });

    it('select all toggles every index', async () => {
      await click(headerBox());
      expect(host.selected()).toEqual([0, 1]);
      await click(headerBox());
      expect(host.selected()).toEqual([]);
    });
  });

  it('sorting: the header stays a column header with aria-sort; a button inside sorts', async () => {
    await create(true);
    const th = el.querySelector<HTMLElement>('thead th.is-sortable')!;
    const btn = th.querySelector<HTMLButtonElement>('button.th-sort')!;
    expect(th.getAttribute('role')).toBeNull();
    expect(th.getAttribute('aria-sort')).toBe('none');

    btn.click();
    await fixture.whenStable();
    expect(th.getAttribute('aria-sort')).toBe('ascending');

    btn.click();
    await fixture.whenStable();
    expect(th.getAttribute('aria-sort')).toBe('descending');
  });
});

@Component({
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-table [columns]="columns" [data]="rows" [actions]="actions" (action)="events.push($event.type + ':' + $event.row.nome)" />
  `
})
class ActionsHostComponent {
  columns: ColumnDef<Row>[] = [{ key: 'nome', header: 'Nome' }];
  rows: Row[] = ALL.slice(0, 2);
  events: string[] = [];
  actions: TableAction<Row>[] = [
    { kind: 'edit' },
    {
      kind: 'delete',
      disabled: r => r.id === 'a',
      disabledReason: r => `${r.nome} é o titular`,
    },
    { kind: 'download', ariaLabel: 'Baixar contrato', visible: r => r.id === 'b' },
  ];
}

describe('TableComponent declarative actions', () => {
  let fixture: ComponentFixture<ActionsHostComponent>;
  let el: HTMLElement;
  const rowButtons = (i: number) =>
    Array.from(el.querySelectorAll('tbody tr')[i].querySelectorAll<HTMLButtonElement>('.action-list button'));
  const tipText = (b: HTMLElement) => document.getElementById(b.getAttribute('aria-labelledby')!)?.textContent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsHostComponent],
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
    }).compileComponents();
    fixture = TestBed.createComponent(ActionsHostComponent);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('names icon-only actions from the labels (here, Portuguese) and shows the name as a tooltip', () => {
    const [edit] = rowButtons(1);
    expect(edit.getAttribute('aria-label')).toBe('Editar');
    expect(tipText(edit)).toBe('Editar');
  });

  it('honors visible() per row', () => {
    expect(rowButtons(0).map(b => b.getAttribute('aria-label'))).toEqual(['Editar', 'Excluir (Ana é o titular)']);
    expect(rowButtons(1).map(b => b.getAttribute('aria-label'))).toEqual(['Editar', 'Excluir', 'Baixar contrato']);
  });

  it('a disabled action stays focusable (aria-disabled), explains why and does not emit', async () => {
    const del = rowButtons(0)[1];
    expect(del.disabled).toBe(false);
    expect(del.getAttribute('aria-disabled')).toBe('true');
    expect(tipText(del)).toBe('Excluir (Ana é o titular)');

    del.click();
    rowButtons(1)[1].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.events).toEqual(['delete:Bruno']);
  });
});

@Component({
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button id="before" type="button">Antes</button>
    <app-table [columns]="columns" [data]="data()" [selectable]="true" [loading]="loading()"
               [error]="error()" [retryLabel]="retryLabel()" (retry)="retries = retries + 1" />
  `
})
class ErrorHostComponent {
  columns: ColumnDef<Row>[] = [{ key: 'nome', header: 'Nome' }];
  data = signal<Row[]>(ALL.slice(0, 2));
  loading = signal(false);
  error = signal<string | null>('Não foi possível carregar os adicionais.');
  retryLabel = signal<string | null>('Tentar novamente');
  retries = 0;
}

describe('TableComponent error state', () => {
  let fixture: ComponentFixture<ErrorHostComponent>;
  let host: ErrorHostComponent;
  let el: HTMLElement;
  const retryBtn = () => el.querySelector<HTMLButtonElement>('.state-error__retry');
  const bodyText = () => el.querySelector('tbody')?.textContent?.trim() ?? '';
  const settle = async () => { fixture.detectChanges(); await fixture.whenStable(); };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorHostComponent],
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
    }).compileComponents();
    fixture = TestBed.createComponent(ErrorHostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('replaces the rows with an announced message and a retry button', () => {
    expect(el.querySelectorAll('tbody tr').length).toBe(1);
    const msg = el.querySelector('.state-error__msg')!;
    expect(msg.getAttribute('role')).toBe('alert');
    expect(msg.textContent).toContain('Não foi possível carregar');
    expect(retryBtn()!.textContent).toContain('Tentar novamente');
    expect(el.querySelector<HTMLInputElement>('thead input')!.disabled).toBe(true);
  });

  it('wins over the empty message, but loading wins over it (aria-busy)', async () => {
    host.data.set([]);
    await settle();
    expect(bodyText()).toContain('Não foi possível carregar');
    expect(bodyText()).not.toContain('Nenhum registro');

    host.loading.set(true);
    await settle();
    expect(el.querySelector('.state-error')).toBeNull();
    expect(el.querySelector('table')!.getAttribute('aria-busy')).toBe('true');
  });

  it('without an error shows the rows again; blank text is not an error', async () => {
    host.error.set('   ');
    await settle();
    expect(el.querySelector('.state-error')).toBeNull();
    expect(el.querySelectorAll('tbody tr').length).toBe(2);
    expect(el.querySelector<HTMLInputElement>('thead input')!.disabled).toBe(false);
    expect(el.querySelector('table')!.hasAttribute('aria-busy')).toBe(false);
  });

  it('retryLabel null hides the button', async () => {
    host.retryLabel.set(null);
    await settle();
    expect(retryBtn()).toBeNull();
    expect(el.querySelector('.state-error__msg')).not.toBeNull();
  });

  it('retry: emits, keeps focus on the table while loading and returns it to the button if it fails again', async () => {
    retryBtn()!.focus();
    retryBtn()!.click();
    expect(host.retries).toBe(1);

    host.loading.set(true);
    await settle();
    const table = el.querySelector('table')!;
    expect(document.activeElement).toBe(table);

    host.loading.set(false);
    await settle();
    expect(document.activeElement).toBe(retryBtn());
  });

  it('retry that does not start loading does not move focus later', async () => {
    retryBtn()!.focus();
    retryBtn()!.click();
    await settle();
    expect(document.activeElement).toBe(retryBtn());

    retryBtn()!.blur();
    host.error.set(null);
    await settle();
    expect(el.querySelectorAll('tbody tr').length).toBe(2);
    expect(document.activeElement).toBe(document.body);
  });

  it('retry that succeeds leaves focus on the table', async () => {
    retryBtn()!.focus();
    retryBtn()!.click();
    host.loading.set(true);
    await settle();
    host.error.set(null);
    host.loading.set(false);
    await settle();
    expect(el.querySelectorAll('tbody tr').length).toBe(2);
    expect(document.activeElement).toBe(el.querySelector('table'));
  });
});

@Component({
  imports: [TableComponent, TableBulkActionsTemplateDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button id="outside" type="button">Fora</button>
    <app-table [columns]="columns" [data]="data()" [selectable]="true" rowKey="id"
               [selected]="selected()" (selectedChange)="selected.set($event)"
               [bulkActions]="bulk" [bulkBarIdle]="idle()" (bulkAction)="events.push($event)" />
    @if (withSlot) {
      <app-table id="slot" [columns]="columns" [data]="data()" [selectable]="true" rowKey="id"
                 [selected]="selected()" (selectedChange)="selected.set($event)">
        <ng-template appBulkActions let-keys let-count="count" let-clear="clear">
          <button type="button" class="mine" (click)="slotKeys = keys; clear()">Arquivar {{ count }}</button>
        </ng-template>
      </app-table>
    }
  `
})
class BulkHostComponent {
  columns: ColumnDef<Row>[] = [{ key: 'nome', header: 'Nome' }];
  data = signal<Row[]>(ALL.slice(0, 2));
  selected = signal<any[]>([]);
  bulk: TableBulkAction[] = [
    { type: 'export', label: 'Exportar' },
    {
      type: 'delete',
      label: 'Excluir',
      danger: true,
      disabled: keys => keys.includes('a'),
      disabledReason: () => 'Ana não pode ser excluída'
    }
  ];
  events: { type: string; keys: any[] }[] = [];
  idle = signal<TableBulkBarIdle>('space');
  withSlot = false;
  slotKeys: any[] = [];
}

describe('TableComponent bulk actions', () => {
  let fixture: ComponentFixture<BulkHostComponent>;
  let host: BulkHostComponent;
  let el: HTMLElement;
  const first = () => el.querySelector('app-table')!;
  const bar = () => first().querySelector<HTMLElement>('.bulk-bar');
  const live = () => first().querySelector('[aria-live]')!;
  const btn = (label: string) =>
    Array.from(first().querySelectorAll<HTMLButtonElement>('.bulk-bar button')).find(b => b.textContent!.includes(label))!;

  const rowBoxes = () => Array.from(first().querySelectorAll<HTMLInputElement>('tbody input[type=checkbox]'));
  const selectAll = () => first().querySelector<HTMLInputElement>('thead input[type=checkbox]')!;
  const settle = async () => { fixture.detectChanges(); await fixture.whenStable(); };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkHostComponent],
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
    }).compileComponents();
    fixture = TestBed.createComponent(BulkHostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('keeps the bar in the page (idle without a selection), with a count announced on every change', async () => {
    expect(bar()!.getAttribute('role')).toBe('group');
    expect(bar()!.getAttribute('aria-label')).toBe('Ações em massa');
    expect(live().textContent!.trim()).toBe('Nenhuma linha selecionada');
    // padrão 'space': nada visível, "Limpar" e ações guardam o espaço (CSS por data-idle)
    expect(bar()!.classList).toContain('is-idle');
    expect(bar()!.getAttribute('data-idle')).toBe('space');

    rowBoxes()[1].click();
    await settle();
    expect(bar()!.classList).not.toContain('is-idle');
    expect(live().textContent!.trim()).toBe('1 selecionado');

    selectAll().click();
    await settle();
    expect(live().textContent!.trim()).toBe('2 selecionados');
  });

  it('emits the selected keys, including the ones from other pages', async () => {
    host.selected.set(['c', 'b']); // "c" está em outra página
    await settle();
    expect(bar()!.textContent).toContain('2 selecionados');
    btn('Exportar').click();
    expect(host.events).toEqual([{ type: 'export', keys: ['c', 'b'] }]);
  });

  it('unavailable action: aria-disabled, reason in the tooltip and no event', async () => {
    host.selected.set(['a']);
    await settle();
    const del = btn('Excluir');
    expect(del.getAttribute('aria-disabled')).toBe('true');
    expect(del.classList).toContain('bulk-btn--danger');
    expect(del.getAttribute('aria-describedby')).toBeTruthy();
    del.click();
    expect(host.events).toEqual([]);

    host.selected.set(['b']);
    await settle();
    expect(del.hasAttribute('aria-disabled')).toBe(false);
    del.click();
    expect(host.events).toEqual([{ type: 'delete', keys: ['b'] }]);
  });

  it('"Limpar seleção" clears it and moves focus to "select all"', async () => {
    host.selected.set(['a', 'b']);
    await settle();
    const clear = btn('Limpar seleção');
    clear.focus();
    clear.click();
    await settle();
    expect(host.selected()).toEqual([]);
    expect(bar()!.classList).toContain('is-idle');
    expect(document.activeElement).toBe(selectAll());
  });

  it('when the container clears the selection after an action, focus does not get lost', async () => {
    host.selected.set(['b']);
    await settle();
    btn('Exportar').focus();
    host.selected.set([]);
    await settle();
    expect(document.activeElement).toBe(selectAll());
  });

  it('does not take focus back if it already moved elsewhere', async () => {
    host.selected.set(['b']);
    await settle();
    btn('Exportar').focus();
    const outside = el.querySelector<HTMLButtonElement>('#outside')!;
    outside.focus();
    host.selected.set([]);
    await settle();
    expect(document.activeElement).toBe(outside);
  });

  it('bulkBarIdle reaches the bar; "hidden" still keeps the live region and returns focus', async () => {
    host.idle.set('hint');
    await settle();
    expect(bar()!.getAttribute('data-idle')).toBe('hint');

    host.idle.set('hidden');
    host.selected.set(['b']);
    await settle();
    expect(bar()!.getAttribute('data-idle')).toBe('hidden');
    btn('Exportar').focus();
    host.selected.set([]);
    await settle();
    expect(live().textContent!.trim()).toBe('Nenhuma linha selecionada');
    expect(document.activeElement).toBe(selectAll());
  });

  it('without bulk actions there is no bar nor live region', async () => {
    host.bulk = [];
    host.selected.set(['a']);
    await settle();
    expect(bar()).toBeNull();
    expect(first().querySelector('[aria-live]')).toBeNull();
  });

  it('appBulkActions slot receives keys, count and clear', async () => {
    host.withSlot = true;
    host.selected.set(['a', 'b']);
    await settle();
    const slotTable = el.querySelector('#slot')!;
    const mine = slotTable.querySelector<HTMLButtonElement>('.bulk-bar .mine')!;
    expect(mine.textContent).toContain('Arquivar 2');
    expect(slotTable.querySelector('.bulk-bar__clear')).not.toBeNull();
    mine.click();
    await settle();
    expect(host.slotKeys).toEqual(['a', 'b']);
    expect(host.selected()).toEqual([]);
  });
});

const FIVE: Row[] = [...ALL, { id: 'e', nome: 'Elisa' }];

@Component({
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-table
      [columns]="columns"
      [data]="data()"
      [paginate]="mode()"
      [(pageIndex)]="page"
      [(pageSize)]="size"
      [totalItems]="total()"
      [pageSizeOptions]="options()"
      [loading]="loading()"
      [error]="error()"
      [selectable]="true"
      [rowKey]="useKey() ? 'id' : undefined"
      [selected]="selected()"
      (selectedChange)="selected.set($event)"
      [actions]="['edit']"
      (action)="events.push($event.index)" />
  `
})
class PagedHostComponent {
  columns: ColumnDef<Row>[] = [{ key: 'nome', header: 'Nome' }];
  data = signal<Row[]>(FIVE);
  mode = signal<'client' | 'server' | null>('client');
  page = signal(0);
  size = signal(2);
  total = signal<number | null>(null);
  options = signal<number[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  useKey = signal(true);
  selected = signal<any[]>([]);
  events: number[] = [];
}

describe('TableComponent pagination', () => {
  let fixture: ComponentFixture<PagedHostComponent>;
  let host: PagedHostComponent;
  let el: HTMLElement;
  const settle = async () => { fixture.detectChanges(); await fixture.whenStable(); };
  const names = () => Array.from(el.querySelectorAll('tbody tr')).map(tr => tr.textContent!.replace(/\s+/g, ' ').trim());
  const range = () => el.querySelector('.tbl-footer__range')?.textContent!.trim();
  const pageBtn = (n: string) =>
    Array.from(el.querySelectorAll<HTMLButtonElement>('app-pagination .pg-btn')).find(b => b.textContent!.trim() === n)!;
  const rowBoxes = () => Array.from(el.querySelectorAll<HTMLInputElement>('tbody input[type=checkbox]'));
  const selectAll = () => el.querySelector<HTMLInputElement>('thead input[type=checkbox]')!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagedHostComponent],
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
    }).compileComponents();
    fixture = TestBed.createComponent(PagedHostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('client: shows the page slice, the range and the pages; navigating updates [(pageIndex)]', async () => {
    expect(names()).toEqual(['Ana', 'Bruno']);
    expect(range()).toBe('Mostrando 1–2 de 5');
    expect(el.querySelectorAll('app-pagination .pg-btn').length).toBe(3);

    pageBtn('2').click();
    await settle();
    expect(host.page()).toBe(1);
    expect(names()).toEqual(['Carla', 'Diego']);
    expect(range()).toBe('Mostrando 3–4 de 5');

    pageBtn('3').click();
    await settle();
    expect(names()).toEqual(['Elisa']);
    expect(range()).toBe('Mostrando 5–5 de 5');
  });

  it('client: index in events is the position in data, not on the page', async () => {
    host.page.set(1);
    await settle();
    el.querySelector<HTMLButtonElement>('tbody .icon-btn')!.click();
    expect(host.events).toEqual([2]);
  });

  it('client: when data shrinks, an out-of-range page is corrected (and reported)', async () => {
    host.page.set(2);
    await settle();
    host.data.set(FIVE.slice(0, 3));
    await settle();
    expect(host.page()).toBe(1);
    expect(names()).toEqual(['Carla']);
  });

  it('does not correct the page while loading (data may be empty until it arrives)', async () => {
    host.page.set(2);
    host.loading.set(true);
    host.data.set([]);
    await settle();
    expect(host.page()).toBe(2);
  });

  it('sorting goes back to the first page', async () => {
    host.page.set(2);
    await settle();
    el.querySelector<HTMLButtonElement>('thead .th-sort')!.click();
    await settle();
    expect(host.page()).toBe(0);
  });

  it('"select all" selects the page and keeps the other pages (with or without rowKey)', async () => {
    rowBoxes()[0].click();
    await settle();
    host.page.set(1);
    await settle();
    selectAll().click();
    await settle();
    expect(host.selected()).toEqual(['a', 'c', 'd']);

    host.useKey.set(false);
    host.selected.set([]);
    host.page.set(0);
    await settle();
    selectAll().click();
    await settle();
    host.page.set(1);
    await settle();
    selectAll().click();
    await settle();
    expect(host.selected()).toEqual([0, 1, 2, 3]); // posições em data
    expect(rowBoxes().every(b => b.checked)).toBe(true);
  });

  it('page size selector keeps the first visible row on screen', async () => {
    host.options.set([2, 3]);
    host.page.set(1); // Carla, Diego (posição 2)
    await settle();
    const select = el.querySelector<HTMLSelectElement>('.tbl-footer select')!;
    expect(el.querySelector('.tbl-footer label')!.textContent).toContain('Itens por página');
    select.value = '3';
    select.dispatchEvent(new Event('change'));
    await settle();
    expect(host.size()).toBe(3);
    expect(host.page()).toBe(0);
    expect(names()).toEqual(['Ana', 'Bruno', 'Carla']);
    expect(range()).toBe('Mostrando 1–3 de 5');
  });

  it('server: does not slice data; total comes from totalItems', async () => {
    host.mode.set('server');
    host.total.set(9);
    host.data.set(FIVE.slice(2, 4)); // página 2 vinda do servidor
    host.page.set(1);
    await settle();
    expect(names()).toEqual(['Carla', 'Diego']);
    expect(range()).toBe('Mostrando 3–4 de 9');
    expect(el.querySelectorAll('app-pagination .pg-btn').length).toBe(5);

    pageBtn('3').click();
    await settle();
    expect(host.page()).toBe(2);
    expect(names()).toEqual(['Carla', 'Diego']); // até o container trazer a próxima página
  });

  it('footer: hidden with an error or without rows; one page shows only the range', async () => {
    host.error.set('Falhou');
    await settle();
    expect(el.querySelector('app-table-footer')).toBeNull();

    host.error.set(null);
    host.data.set([]);
    await settle();
    expect(el.querySelector('app-table-footer')).toBeNull();

    host.data.set(FIVE.slice(0, 2));
    await settle();
    expect(range()).toBe('Mostrando 1–2 de 2');
    expect(el.querySelector('app-pagination')).toBeNull();
  });

  it('without paginate: all rows and no footer (as before)', async () => {
    host.mode.set(null);
    await settle();
    expect(names().length).toBe(5);
    expect(el.querySelector('app-table-footer')).toBeNull();
  });
});

interface Wide { id: string; nome: string; tipo: string; doc: string; cidade: string; }
const WIDE: Wide[] = [
  { id: 'a', nome: 'Ana', tipo: 'Titular', doc: '111', cidade: 'Recife' },
  { id: 'b', nome: 'Bruno', tipo: 'Adicional', doc: '222', cidade: 'Natal' }
];

@Component({
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<app-table [columns]="columns()" [data]="rows" [selectable]="true" rowKey="id" />`
})
class CollapseHostComponent {
  columns = signal<ColumnDef<Wide>[]>([
    { key: 'nome', header: 'Nome' },
    { key: 'tipo', header: 'Tipo', type: 'chip', chipMap: { Titular: { label: 'Titular', variant: 'teal' } }, priority: 2 },
    { key: 'doc', header: 'Documento', priority: 3 },
    { key: 'cidade', header: 'Cidade', priority: 2 }
  ]);
  rows = WIDE;
}

describe('TableComponent collapsible columns', () => {
  let fixture: ComponentFixture<CollapseHostComponent>;
  let el: HTMLElement;
  let table: any;
  const settle = async () => { fixture.detectChanges(); await fixture.whenStable(); };
  const headers = () => Array.from(el.querySelectorAll('thead th')).map(th => th.textContent!.trim());
  const expandBtns = () => Array.from(el.querySelectorAll<HTMLButtonElement>('tbody .expand-btn'));
  /** sem layout no jsdom: cada coluna "mede" 100px, a de detalhes 40px e a de seleção 40px */
  const fakeLayout = () => {
    const tbl = el.querySelector('table')!;
    Object.defineProperty(tbl, 'offsetWidth', {
      configurable: true,
      get: () => Array.from(tbl.querySelectorAll('thead th'))
        .reduce((w, th) => w + (th.classList.contains('col-expand') || th.classList.contains('col-select') ? 40 : 100), 0)
    });
  };
  const setWidth = async (w: number) => { table.availWidth.set(w); await settle(); await settle(); };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollapseHostComponent],
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
    }).compileComponents();
    fixture = TestBed.createComponent(CollapseHostComponent);
    el = fixture.nativeElement;
    await fixture.whenStable();
    table = fixture.debugElement.query(By.directive(TableComponent)).componentInstance;
    fakeLayout();
  });

  afterEach(() => fixture.destroy());

  it('with room, every column shows and there is no details button', async () => {
    await setWidth(1000); // 40 + 4 × 100 = 440
    expect(headers()).toEqual(['', 'Nome', 'Tipo', 'Documento', 'Cidade']);
    expect(expandBtns().length).toBe(0);
  });

  it('hides the highest priority first, ties from the right; priority 1 never hides', async () => {
    await setWidth(400); // 440 → some "Documento" (3) → 40 + 40 + 300 = 380
    expect(headers()).toEqual(['', 'Detalhes', 'Nome', 'Tipo', 'Cidade']);

    await setWidth(300); // 380 → some "Cidade" (2, mais à direita) → 280
    expect(headers()).toEqual(['', 'Detalhes', 'Nome', 'Tipo']);

    await setWidth(100); // some "Tipo"; "Nome" (1) fica mesmo sem caber
    expect(headers()).toEqual(['', 'Detalhes', 'Nome']);
  });

  it('columns come back when there is room again (same order they left)', async () => {
    await setWidth(300);
    expect(headers()).toEqual(['', 'Detalhes', 'Nome', 'Tipo']);
    await setWidth(380); // precisava de 380 com "Cidade"
    expect(headers()).toEqual(['', 'Detalhes', 'Nome', 'Tipo', 'Cidade']);
    await setWidth(440);
    expect(headers()).toEqual(['', 'Nome', 'Tipo', 'Documento', 'Cidade']);
  });

  it('details row: aria-expanded/aria-controls and the hidden values (chip rendered as in the column)', async () => {
    await setWidth(200); // escondidas: Documento, Cidade, Tipo
    const btn = expandBtns()[0];
    expect(btn.getAttribute('aria-label')).toBe('Mostrar detalhes');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.hasAttribute('aria-controls')).toBe(false);

    btn.click();
    await settle();
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    const detail = el.querySelector<HTMLElement>(`#${btn.getAttribute('aria-controls')}`)!;
    expect(detail.classList).toContain('tbl-detail');
    expect(Array.from(detail.querySelectorAll('dt')).map(d => d.textContent!.trim())).toEqual(['Tipo', 'Documento', 'Cidade']);
    expect(detail.querySelector('dd .chip--teal')!.textContent!.trim()).toBe('Titular');
    expect(detail.textContent).toContain('111');
    // seleção e botão ficam vazios; os detalhes ocupam as colunas de dados (aqui só "Nome")
    expect(detail.querySelectorAll('td').length).toBe(3);
    expect(detail.querySelector('td[colspan]')!.getAttribute('colspan')).toBe('1');

    btn.click();
    await settle();
    expect(el.querySelector('.tbl-detail')).toBeNull();
  });

  it('card mode (≤ 640px) and tables without priority never hide columns', async () => {
    await setWidth(200);
    table.cardMode.set(true);
    await settle();
    await settle();
    expect(headers()).toEqual(['', 'Nome', 'Tipo', 'Documento', 'Cidade']);

    table.cardMode.set(false);
    fixture.componentInstance.columns.update(cols => cols.map(c => ({ ...c, priority: undefined })));
    await settle();
    await setWidth(150);
    expect(headers()).toEqual(['', 'Nome', 'Tipo', 'Documento', 'Cidade']);
  });
});

// ===== tipo das chaves: deduzido do rowKey (o spec só compila se a dedução estiver certa)
interface Pedido { numero: number; cliente: string; }

// checado pelo compilador ao rodar os testes (os templates não são: os valores ficam nos its abaixo)
type Same<A, B> = (<X>() => X extends A ? 1 : 2) extends (<X>() => X extends B ? 1 : 2) ? true : false;
type Expect<T extends true> = T;
type Emitted<C extends { selectedChange: { emit(v: never): void } }> = Parameters<C['selectedChange']['emit']>[0];
export type KeyTypeChecks = [
  Expect<Same<TableKey<Pedido, 'numero'>, number>>,
  Expect<Same<TableKey<Pedido, 'cliente'>, string>>,
  Expect<Same<TableKey<Pedido, (p: Pedido) => Date>, Date>>,
  Expect<Same<TableKey<Pedido, never>, number>>,
  // o componente: nada de any[] na saída
  Expect<Same<Emitted<TableComponent<Pedido, 'cliente'>>, string[]>>,
  Expect<Same<Emitted<TableComponent<Pedido>>, number[]>>,
];
const PEDIDOS: Pedido[] = [{ numero: 10, cliente: 'Ana' }, { numero: 20, cliente: 'Bruno' }];
const PEDIDO_COLS: ColumnDef<Pedido>[] = [{ key: 'cliente', header: 'Cliente' }];

@Component({
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-table id="prop" [data]="pedidos" [columns]="cols" [selectable]="true" rowKey="numero"
      [selected]="numeros()" (selectedChange)="numeros.set($event)"
      [bulkActions]="porNumero" (bulkAction)="onNumeros($event.keys)" />
    <app-table id="fn" [data]="pedidos" [columns]="cols" [selectable]="true" [rowKey]="porCliente"
      (selectedChange)="onClientes($event)" />
    <app-table id="idx" [data]="pedidos" [columns]="cols" [selectable]="true"
      (selectedChange)="onIndices($event)" />
  `
})
class TypedKeysHostComponent {
  pedidos = PEDIDOS;
  cols = PEDIDO_COLS;
  numeros = signal<number[]>([]);
  /** `disabled` recebe as chaves já com o tipo da propriedade */
  porNumero: TableBulkAction<number>[] = [{ type: 'faturar', label: 'Faturar', disabled: keys => keys.some(n => n > 100) }];
  porCliente = (p: Pedido) => p.cliente.toUpperCase();
  bulk: number[] = [];
  clientes: string[] = [];
  indices: number[] = [];
  onNumeros(keys: number[]) { this.bulk = keys; }
  onClientes(keys: string[]) { this.clientes = keys; }
  onIndices(keys: number[]) { this.indices = keys; }
}

describe('TableComponent: key types follow rowKey', () => {
  let fixture: ComponentFixture<TypedKeysHostComponent>;
  let host: TypedKeysHostComponent;
  let el: HTMLElement;
  const firstRowBox = (id: string) => el.querySelector<HTMLInputElement>(`#${id} tbody input[type="checkbox"]`)!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypedKeysHostComponent],
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
    }).compileComponents();
    fixture = TestBed.createComponent(TypedKeysHostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('property name: the value of that property (number here), also in bulk actions', async () => {
    firstRowBox('prop').click();
    await fixture.whenStable();
    expect(host.numeros()).toEqual([10]);

    const faturar = Array.from(el.querySelectorAll<HTMLButtonElement>('#prop button')).find(b => b.textContent!.trim() === 'Faturar')!;
    faturar.click();
    expect(host.bulk).toEqual([10]);
  });

  it('function: what it returns (string here)', async () => {
    firstRowBox('fn').click();
    await fixture.whenStable();
    expect(host.clientes).toEqual(['ANA']);
  });

  it('no rowKey: indexes in data', async () => {
    firstRowBox('idx').click();
    await fixture.whenStable();
    expect(host.indices).toEqual([0]);
  });
});
