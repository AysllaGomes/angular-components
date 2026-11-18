import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { SelectOption } from '../../model/interface/select/select-option.interface';

import { SelectComponent } from './select.component';

@Component({
  imports: [SelectComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-select
      label="Fruta"
      responsive="menu"
      [filterable]="true"
      [required]="required()"
      [options]="options()"
      [(value)]="value" />
  `
})
class HostComponent {
  required = signal(false);
  options = signal<SelectOption<string>[]>([
    { label: 'Maçã', value: 'apple' },
    { label: 'Banana', value: 'banana' }
  ]);
  value: string | null = null;
}

function optionLabels(fixture: ComponentFixture<unknown>): string[] {
  const el = fixture.nativeElement as HTMLElement;
  return Array.from(el.querySelectorAll('.option')).map(o => o.textContent!.trim());
}

describe('SelectComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  async function openPanel() {
    el.querySelector<HTMLButtonElement>('button.control')!.click();
    await fixture.whenStable();
  }

  it('renders the options when opened', async () => {
    await openPanel();
    expect(optionLabels(fixture)).toEqual(['Maçã', 'Banana']);
  });

  it('updates the list when options change after first render', async () => {
    await openPanel();
    expect(optionLabels(fixture)).toEqual(['Maçã', 'Banana']);

    host.options.set([
      { label: 'Uva', value: 'grape' },
      { label: 'Kiwi', value: 'kiwi' },
      { label: 'Manga', value: 'mango' }
    ]);
    await fixture.whenStable();

    expect(optionLabels(fixture)).toEqual(['Uva', 'Kiwi', 'Manga']);
  });

  it('filters ignoring accents and case', async () => {
    await openPanel();
    const input = el.querySelector<HTMLInputElement>('.filter input')!;
    input.value = 'MACA';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(optionLabels(fixture)).toEqual(['Maçã']);
  });

  it('selects an option on click and emits the value', async () => {
    await openPanel();
    el.querySelectorAll<HTMLElement>('.option')[1].click();
    await fixture.whenStable();

    expect(host.value).toBe('banana');
    expect(el.querySelector('.control .value')!.textContent!.trim()).toBe('Banana');
    expect(el.querySelector('.panel')).toBeNull();
  });

  it('closing the panel with the button validates required fields', async () => {
    const select = fixture.debugElement.children[0].componentInstance as SelectComponent;
    host.required.set(true);
    await fixture.whenStable();

    await openPanel();
    await openPanel(); // segundo clique fecha

    expect(el.querySelector('.panel')).toBeNull();
    expect(select.displayError()).toBe('Campo obrigatório');
  });
});

// ===== Formulários (ControlValueAccessor) =====

const FRUITS: SelectOption<string>[] = [
  { label: 'Maçã', value: 'apple' },
  { label: 'Banana', value: 'banana' }
];

@Component({
  imports: [SelectComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <form [formGroup]="form">
      <app-select label="Fruta" responsive="menu" [options]="options" formControlName="fruit"
                  [error]="form.controls.fruit.touched && form.controls.fruit.invalid ? 'Escolha uma fruta' : null" />
    </form>
  `
})
class ReactiveHostComponent {
  options = FRUITS;
  form = new FormGroup({ fruit: new FormControl<string | null>('banana', Validators.required) });
}

@Component({
  imports: [SelectComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<app-select label="Fruta" responsive="menu" [options]="options" [(ngModel)]="fruit" />`
})
class NgModelHostComponent {
  options = FRUITS;
  fruit: string | null = 'apple';
}

describe('SelectComponent with forms', () => {
  const label = (el: HTMLElement) => el.querySelector('.control .value')!.textContent!.trim();
  const button = (el: HTMLElement) => el.querySelector<HTMLButtonElement>('button.control')!;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  describe('reactive forms', () => {
    let fixture: ComponentFixture<ReactiveHostComponent>;
    let host: ReactiveHostComponent;
    let el: HTMLElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(ReactiveHostComponent);
      host = fixture.componentInstance;
      el = fixture.nativeElement;
      await fixture.whenStable();
    });

    it('shows the initial control value', () => {
      expect(label(el)).toBe('Banana');
    });

    it('reflects setValue() from the form', async () => {
      host.form.controls.fruit.setValue('apple');
      await fixture.whenStable();
      expect(label(el)).toBe('Maçã');
    });

    it('updates the control when the user picks an option', async () => {
      button(el).click();
      await fixture.whenStable();
      el.querySelectorAll<HTMLElement>('.option')[0].click();
      await fixture.whenStable();

      expect(host.form.value.fruit).toBe('apple');
      expect(host.form.controls.fruit.dirty).toBe(true);
    });

    it('marks the control as touched on blur', async () => {
      button(el).dispatchEvent(new Event('blur'));
      await fixture.whenStable();
      expect(host.form.controls.fruit.touched).toBe(true);
    });

    it('follows disable()/enable() from the form', async () => {
      host.form.controls.fruit.disable();
      await fixture.whenStable();
      expect(button(el).disabled).toBe(true);

      host.form.controls.fruit.enable();
      await fixture.whenStable();
      expect(button(el).disabled).toBe(false);
    });

    it('shows the error passed from the form state', async () => {
      host.form.controls.fruit.setValue(null);
      host.form.controls.fruit.markAsTouched();
      await fixture.whenStable();

      expect(el.textContent).toContain('Escolha uma fruta');
    });
  });

  describe('ngModel', () => {
    let fixture: ComponentFixture<NgModelHostComponent>;
    let host: NgModelHostComponent;
    let el: HTMLElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(NgModelHostComponent);
      host = fixture.componentInstance;
      el = fixture.nativeElement;
      await fixture.whenStable();
    });

    it('shows the bound value and writes the selection back', async () => {
      expect(label(el)).toBe('Maçã');

      button(el).click();
      await fixture.whenStable();
      el.querySelectorAll<HTMLElement>('.option')[1].click();
      await fixture.whenStable();

      expect(host.fruit).toBe('banana');
    });
  });
});
