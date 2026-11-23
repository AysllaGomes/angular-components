import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { RadioOption } from './radio.types';

import { RadioGroupComponent } from './radio-group.component';

const PLANS: RadioOption<string>[] = [
  { label: 'Básico', value: 'basic', description: 'R$ 0/mês' },
  { label: 'Pro', value: 'pro' },
  { label: 'Empresa', value: 'enterprise', disabled: true },
];

@Component({
  imports: [RadioGroupComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-radio-group label="Plano" [options]="plans" [(value)]="plan" [disabled]="disabled()"
                     [hint]="hint()" [error]="error()" />
    <app-radio-group label="Outro" [options]="plans" />
  `
})
class HostComponent {
  plans = PLANS;
  plan = signal<string | null>('basic');
  disabled = signal(false);
  hint = signal<string | null>(null);
  error = signal<string | null>(null);
}

describe('RadioGroupComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;

  const group = () => el.querySelectorAll('app-radio-group')[0] as HTMLElement;
  const radios = (g: Element = group()) => Array.from(g.querySelectorAll<HTMLInputElement>('input[type="radio"]'));

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

  it('is a fieldset named by its legend, with native radios sharing a unique name per group', () => {
    const fs = group().querySelector('fieldset')!;
    expect(fs.querySelector('legend')!.textContent).toContain('Plano');
    const names = new Set(radios().map(r => r.name));
    expect(names.size).toBe(1);
    const other = radios(el.querySelectorAll('app-radio-group')[1]);
    expect(other[0].name).not.toBe(radios()[0].name);
  });

  it('reflects the value and updates [(value)] when another option is chosen', async () => {
    expect(radios().map(r => r.checked)).toEqual([true, false, false]);
    radios()[1].click();
    await fixture.whenStable();
    expect(host.plan()).toBe('pro');
    expect(radios().map(r => r.checked)).toEqual([false, true, false]);
  });

  it('disabled options and a disabled group cannot be chosen', async () => {
    expect(radios()[2].disabled).toBe(true);
    radios()[2].click();
    await fixture.whenStable();
    expect(host.plan()).toBe('basic');

    host.disabled.set(true);
    await fixture.whenStable();
    expect(group().querySelector('fieldset')!.disabled).toBe(true);
  });

  it('option description, hint and error are linked by aria-describedby; error sets aria-invalid', async () => {
    const first = radios()[0];
    const descIds = () => first.getAttribute('aria-describedby')!.split(' ');
    expect(el.querySelector(`#${descIds()[0]}`)!.textContent).toContain('R$ 0/mês');

    host.error.set('Escolha um plano');
    await fixture.whenStable();
    expect(descIds().map(id => el.querySelector(`#${id}`)!.textContent!.trim())).toEqual(['R$ 0/mês', 'Escolha um plano']);
    expect(first.getAttribute('aria-invalid')).toBe('true');
  });
});

// ===== Formulários =====

@Component({
  imports: [RadioGroupComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<app-radio-group label="Plano" required [options]="plans" [formControl]="ctrl" />`
})
class ReactiveHostComponent {
  plans = PLANS;
  ctrl = new FormControl<string | null>(null, Validators.required);
}

@Component({
  imports: [RadioGroupComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<app-radio-group label="Plano" [options]="plans" [(ngModel)]="plan" />`
})
class NgModelHostComponent {
  plans = PLANS;
  plan = 'pro';
}

describe('RadioGroupComponent with forms', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('reactive forms: value, required validity, touched and disable()', async () => {
    const fixture = TestBed.createComponent(ReactiveHostComponent);
    const host = fixture.componentInstance;
    const radios = () => Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>('input'));
    await fixture.whenStable();

    expect(host.ctrl.valid).toBe(false);
    radios()[0].click();
    await fixture.whenStable();
    expect(host.ctrl.value).toBe('basic');
    expect(host.ctrl.valid).toBe(true);

    radios()[0].dispatchEvent(new Event('blur'));
    expect(host.ctrl.touched).toBe(true);

    host.ctrl.setValue('pro');
    await fixture.whenStable();
    expect(radios()[1].checked).toBe(true);

    host.ctrl.disable();
    await fixture.whenStable();
    expect(radios().every(r => r.disabled)).toBe(true);
  });

  it('ngModel: shows the bound value and writes changes back', async () => {
    const fixture = TestBed.createComponent(NgModelHostComponent);
    await fixture.whenStable();
    await fixture.whenStable();
    const radios = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>('input'));
    expect(radios[1].checked).toBe(true);

    radios[0].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.plan).toBe('basic');
  });
});
