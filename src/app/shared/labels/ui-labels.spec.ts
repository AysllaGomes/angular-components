import { ChangeDetectionStrategy, Component, Provider, computed, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UI_LABELS_EN, UI_LABELS_PT, provideUiLabels } from './ui-labels';
import { FormErrorsService } from '../forms/form-errors';
import { ColumnDef } from '../model/interface/column-def.interface';
import { TableComponent } from '../components/table/table.component';
import { PaginationComponent } from '../components/pagination/pagination.component';

interface Row { id: string; nome: string; }

/** idioma fora dos componentes (como o i18n de um app) */
const lang = signal<'en' | 'pt'>('en');

@Component({
  imports: [TableComponent, PaginationComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-table id="t1" [columns]="columns" [data]="[]" [selectable]="true" />
    <app-table id="t2" [columns]="columns" [data]="[]" emptyMessage="Só aqui" />
    <app-pagination [total]="30" [pageSize]="10" />
  `
})
class HostComponent {
  columns: ColumnDef<Row>[] = [{ key: 'nome', header: 'Nome' }];
}

describe('UI labels (provideUiLabels)', () => {
  let fixture: ComponentFixture<HostComponent>;
  let el: HTMLElement;
  const settle = async () => { fixture.detectChanges(); await fixture.whenStable(); };
  const empty = (id: string) => el.querySelector(`#${id} td.empty`)!.textContent!.trim();
  const selectAll = () => el.querySelector('#t1 thead input')!.getAttribute('aria-label');
  const prev = () => el.querySelectorAll('app-pagination button')[0].getAttribute('aria-label');

  async function create(providers: Provider[] = []) {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection(), ...providers]
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  afterEach(() => { fixture?.destroy(); lang.set('en'); });

  it('without a provider, the components speak English', async () => {
    await create();
    expect(empty('t1')).toBe('No records found');
    expect(selectAll()).toBe('Select all');
    expect(prev()).toBe('Previous');
    expect(TestBed.inject(FormErrorsService).messageFor({ required: true })).toBe(UI_LABELS_EN.formErrors['required']);
  });

  it('a full preset switches everything (Portuguese)', async () => {
    await create([provideUiLabels(UI_LABELS_PT)]);
    expect(empty('t1')).toBe('Nenhum registro encontrado');
    expect(selectAll()).toBe('Selecionar tudo');
    expect(prev()).toBe('Anterior');
    expect(TestBed.inject(FormErrorsService).messageFor({ minlength: { requiredLength: 3 } })).toBe('Mínimo de 3 caracteres');
  });

  it('a partial object changes only what it names (groups can be partial too)', async () => {
    await create([provideUiLabels({ table: { empty: 'Nothing here' } })]);
    expect(empty('t1')).toBe('Nothing here');
    expect(selectAll()).toBe('Select all');
    expect(prev()).toBe('Previous');
  });

  it('the input of an instance wins over the provider', async () => {
    await create([provideUiLabels(UI_LABELS_PT)]);
    expect(empty('t2')).toBe('Só aqui');
    expect(empty('t1')).toBe('Nenhum registro encontrado');
  });

  it('a factory returning a signal follows the app language live', async () => {
    await create([provideUiLabels(() => computed(() => (lang() === 'pt' ? UI_LABELS_PT : UI_LABELS_EN)))]);
    const errors = TestBed.inject(FormErrorsService);
    expect(empty('t1')).toBe('No records found');
    expect(errors.messageFor({ required: true })).toBe('This field is required');

    lang.set('pt');
    await settle();
    expect(empty('t1')).toBe('Nenhum registro encontrado');
    expect(prev()).toBe('Anterior');
    expect(errors.messageFor({ required: true })).toBe('Campo obrigatório');
  });
});
