import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnDef } from '../../model/interface/column-def.interface';
import { TableAction } from '../../model/interface/table-action.interface';

import { TableComponent } from './table.component';

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
      providers: [provideZonelessChangeDetection()]
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
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
    fixture = TestBed.createComponent(ActionsHostComponent);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('names icon-only actions in Portuguese by default and shows the name as a tooltip', () => {
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
