import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnDef } from '../../model/interface/column-def.interface';
import { TableAction } from '../../model/interface/table-action.interface';
import { TableBulkAction } from '../../model/interface/table-bulk-action.interface';

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
      providers: [provideZonelessChangeDetection()]
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
               [bulkActions]="bulk" (bulkAction)="events.push($event)" />
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
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
    fixture = TestBed.createComponent(BulkHostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('shows the bar only with a selection, with a count announced on every change', async () => {
    expect(bar()).toBeNull();
    expect(live().textContent!.trim()).toBe('');

    rowBoxes()[1].click();
    await settle();
    expect(bar()!.getAttribute('role')).toBe('group');
    expect(bar()!.getAttribute('aria-label')).toBe('Ações em massa');
    expect(bar()!.textContent).toContain('1 selecionado');
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
    expect(bar()).toBeNull();
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
