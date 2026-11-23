import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { expectNoA11yViolations } from '../../../../testing/axe';
import { CheckboxOption } from './checkbox-group.types';
import { CheckboxGroupComponent } from './checkbox-group.component';

const TOPICS: CheckboxOption<string>[] = [
  { label: 'Novidades', value: 'news', description: 'Uma vez por mês' },
  { label: 'Promoções', value: 'deals' },
  { label: 'Segurança', value: 'security', disabled: true },
  { label: 'Pesquisas', value: 'surveys' },
];

@Component({
  imports: [CheckboxGroupComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-checkbox-group label="Avisos por e-mail" [options]="topics" [(value)]="value"
                        [selectAll]="selectAll()" [disabled]="disabled()"
                        [hint]="hint()" [error]="error()" />
    <app-checkbox-group label="Outro" [options]="topics" />
  `
})
class HostComponent {
  topics = TOPICS;
  value = signal<string[] | null>(['deals']);
  selectAll = signal(false);
  disabled = signal(false);
  hint = signal<string | null>(null);
  error = signal<string | null>(null);
}

describe('CheckboxGroupComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;

  const group = (i = 0) => el.querySelectorAll('app-checkbox-group')[i] as HTMLElement;
  const boxes = (g: Element = group()) =>
    Array.from(g.querySelectorAll<HTMLInputElement>('.cbg__options input[type="checkbox"]'));
  const all = () => group().querySelector<HTMLInputElement>('.cbg__all input')!;
  const settle = async () => { fixture.detectChanges(); await fixture.whenStable(); };

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

  it('is a fieldset named by its legend, with one native checkbox per option and a unique name per group', () => {
    const fs = group().querySelector('fieldset')!;
    expect(fs.querySelector('legend')!.textContent).toContain('Avisos por e-mail');
    expect(boxes()).toHaveLength(4);
    expect(new Set(boxes().map(b => b.name)).size).toBe(1);
    expect(boxes(group(1))[0].name).not.toBe(boxes()[0].name);
  });

  it('reflects the value and updates [(value)] in the order of the options, not of the clicks', async () => {
    expect(boxes().map(b => b.checked)).toEqual([false, true, false, false]);
    boxes()[3].click();
    await settle();
    boxes()[0].click();
    await settle();
    expect(host.value()).toEqual(['news', 'deals', 'surveys']);
    boxes()[1].click();
    await settle();
    expect(host.value()).toEqual(['news', 'surveys']);
  });

  it('keeps values that are not among the options (data saved elsewhere)', async () => {
    host.value.set(['legacy', 'deals']);
    await settle();
    boxes()[0].click();
    await settle();
    expect(host.value()).toEqual(['news', 'deals', 'legacy']);
  });

  it('disabled options and a disabled group cannot be changed', async () => {
    expect(boxes()[2].disabled).toBe(true);
    host.disabled.set(true);
    await settle();
    expect(group().querySelector('fieldset')!.disabled).toBe(true);
    expect(boxes().every(b => b.disabled)).toBe(true);
  });

  it('option description, hint and error are linked by aria-describedby; error sets aria-invalid', async () => {
    const first = () => boxes()[0];
    const ids = () => first().getAttribute('aria-describedby')!.split(' ');
    expect(ids()).toHaveLength(1);
    expect(group().querySelector('#' + ids()[0])!.textContent).toContain('Uma vez por mês');

    host.hint.set('Escolha quantos quiser.');
    await settle();
    expect(group().querySelector('#' + ids()[1])!.textContent).toContain('Escolha quantos quiser.');

    host.error.set('Escolha pelo menos um.');
    await settle();
    expect(group().querySelector('#' + ids()[1])!.textContent).toContain('Escolha pelo menos um.');
    expect(first().getAttribute('aria-invalid')).toBe('true');
    expect(group().textContent).not.toContain('Escolha quantos quiser.');
  });

  describe('select all', () => {
    beforeEach(async () => { host.selectAll.set(true); await settle(); });

    it('shows a "Select all" box above the options, partial while only some are checked', async () => {
      expect(all().closest('label')!.textContent).toContain('Select all');
      expect(all().checked).toBe(false);
      expect(all().indeterminate).toBe(true);
      expect(all().getAttribute('aria-controls')!.split(' ')).toHaveLength(3); // sem a desabilitada
    });

    it('checks the enabled options that are missing, then unchecks them all; disabled options stay as they are', async () => {
      host.value.set(['deals', 'security']);
      await settle();
      all().click();
      await settle();
      expect(host.value()).toEqual(['news', 'deals', 'security', 'surveys']);
      expect(all().checked).toBe(true);
      expect(all().indeterminate).toBe(false);

      all().click();
      await settle();
      expect(host.value()).toEqual(['security']);
      expect(all().checked).toBe(false);
      expect(all().indeterminate).toBe(false);
    });

    it('has no accessibility violations (axe)', async () => {
      host.error.set('Escolha pelo menos um.');
      await settle();
      await expectNoA11yViolations(group());
    });
  });
});

@Component({
  imports: [CheckboxGroupComponent, ReactiveFormsModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-checkbox-group label="Reativo" required [options]="topics" [formControl]="ctrl" />
    <app-checkbox-group label="ngModel" [options]="topics" [(ngModel)]="model" />
  `
})
class FormsHostComponent {
  topics = TOPICS;
  ctrl = new FormControl<string[]>([], { nonNullable: true, validators: Validators.required });
  model: string[] = ['news'];
}

describe('CheckboxGroupComponent with forms', () => {
  let fixture: ComponentFixture<FormsHostComponent>;
  let host: FormsHostComponent;
  let el: HTMLElement;
  const boxes = (i: number) =>
    Array.from(el.querySelectorAll('app-checkbox-group')[i].querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
  const settle = async () => { fixture.detectChanges(); await fixture.whenStable(); };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsHostComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
    fixture = TestBed.createComponent(FormsHostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
    await settle();
  });

  it('reactive forms: value, required (empty list is invalid), touched and disable()', async () => {
    expect(host.ctrl.invalid).toBe(true);
    // "requerido" só no rótulo: o required nativo em cada caixa exigiria marcar todas
    expect(el.querySelector('legend')!.textContent).toContain('required');
    expect(boxes(0).some(b => b.required)).toBe(false);

    boxes(0)[1].click();
    await settle();
    expect(host.ctrl.value).toEqual(['deals']);
    expect(host.ctrl.valid).toBe(true);

    boxes(0)[1].dispatchEvent(new FocusEvent('blur'));
    expect(host.ctrl.touched).toBe(true);

    host.ctrl.setValue(['news', 'surveys']);
    await settle();
    expect(boxes(0).map(b => b.checked)).toEqual([true, false, false, true]);

    host.ctrl.disable();
    await settle();
    expect(boxes(0).every(b => b.disabled)).toBe(true);
  });

  it('ngModel: shows the bound value and writes changes back', async () => {
    await settle();
    expect(boxes(1)[0].checked).toBe(true);
    boxes(1)[3].click();
    await settle();
    expect(host.model).toEqual(['news', 'surveys']);
  });
});
