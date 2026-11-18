import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnDef } from '../../model/interface/column-def.interface';

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

      expect(headerBox().checked).toBeFalse();
      expect(headerBox().indeterminate).toBeFalse();

      await click(headerBox());
      expect(host.selected()).toEqual(['a', 'c', 'd']);
      expect(headerBox().checked).toBeTrue();

      await click(headerBox());
      expect(host.selected()).toEqual(['a']);
    });

    it('shows indeterminate when only some visible rows are selected', async () => {
      await click(rowBoxes()[0]);
      expect(headerBox().indeterminate).toBeTrue();
      expect(headerBox().checked).toBeFalse();
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
});
