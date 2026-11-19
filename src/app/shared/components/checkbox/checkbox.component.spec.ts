import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CheckboxComponent } from './checkbox.component';

@Component({
  imports: [CheckboxComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-checkbox [(checked)]="checked" [(indeterminate)]="mixed" [disabled]="disabled()"
                  [hint]="hint()" [error]="error()">Aceito os termos</app-checkbox>
  `
})
class HostComponent {
  checked = signal(false);
  mixed = signal(false);
  disabled = signal(false);
  hint = signal<string | null>(null);
  error = signal<string | null>(null);
}

describe('CheckboxComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;

  const input = () => el.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
  const mark = () => el.querySelector<HTMLElement>('app-checkbox-mark')!;

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

  it('is a real checkbox labelled by its content', () => {
    expect(input()).not.toBeNull();
    expect(input().closest('label')?.textContent).toContain('Aceito os termos');
    expect(mark().getAttribute('aria-hidden')).toBe('true');
  });

  it('toggles on click and updates [(checked)]', async () => {
    input().click();
    await fixture.whenStable();
    expect(host.checked()).toBe(true);
    expect(mark().classList).toContain('is-on');
    expect(mark().querySelector('svg')).not.toBeNull();

    input().click();
    await fixture.whenStable();
    expect(host.checked()).toBe(false);
  });

  it('clicking the label text toggles too', async () => {
    el.querySelector<HTMLElement>('.cb__label')!.click();
    await fixture.whenStable();
    expect(host.checked()).toBe(true);
  });

  it('indeterminate shows the bar and sets the native property (announced as "mixed")', async () => {
    host.mixed.set(true);
    await fixture.whenStable();
    expect(input().indeterminate).toBe(true);
    expect(mark().querySelector('.bar')).not.toBeNull();
    expect(mark().querySelector('svg')).toBeNull();
  });

  it('clicking a mixed checkbox leaves the mixed state and checks it', async () => {
    host.mixed.set(true);
    await fixture.whenStable();

    input().click();
    await fixture.whenStable();
    expect(host.mixed()).toBe(false);
    expect(host.checked()).toBe(true);
    expect(input().indeterminate).toBe(false);
  });

  it('disabled does not toggle', async () => {
    host.disabled.set(true);
    await fixture.whenStable();
    expect(input().disabled).toBe(true);

    input().click();
    await fixture.whenStable();
    expect(host.checked()).toBe(false);
    expect(mark().classList).toContain('is-disabled');
  });

  it('links hint/error with aria-describedby; error wins and sets aria-invalid', async () => {
    host.hint.set('Leia antes');
    await fixture.whenStable();
    let desc = input().getAttribute('aria-describedby')!;
    expect(el.querySelector(`#${desc}`)?.textContent).toContain('Leia antes');
    expect(input().hasAttribute('aria-invalid')).toBe(false);

    host.error.set('Obrigatório');
    await fixture.whenStable();
    desc = input().getAttribute('aria-describedby')!;
    expect(el.querySelector(`#${desc}`)?.textContent).toContain('Obrigatório');
    expect(input().getAttribute('aria-invalid')).toBe('true');
  });
});

// ===== Formulários =====

@Component({
  imports: [CheckboxComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<app-checkbox [formControl]="ctrl">Aceito</app-checkbox>`
})
class ReactiveHostComponent {
  ctrl = new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue });
}

@Component({
  imports: [CheckboxComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<app-checkbox [(ngModel)]="value">Aceito</app-checkbox>`
})
class NgModelHostComponent {
  value = true;
}

describe('CheckboxComponent with forms', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('reactive forms: value, requiredTrue validity, touched and disable()', async () => {
    const fixture = TestBed.createComponent(ReactiveHostComponent);
    const host = fixture.componentInstance;
    const input = () => (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;
    await fixture.whenStable();

    expect(host.ctrl.valid).toBe(false);
    input().click();
    await fixture.whenStable();
    expect(host.ctrl.value).toBe(true);
    expect(host.ctrl.valid).toBe(true);

    input().dispatchEvent(new Event('blur'));
    expect(host.ctrl.touched).toBe(true);

    host.ctrl.setValue(false);
    await fixture.whenStable();
    expect(input().checked).toBe(false);

    host.ctrl.disable();
    await fixture.whenStable();
    expect(input().disabled).toBe(true);
  });

  it('ngModel: shows the bound value and writes changes back', async () => {
    const fixture = TestBed.createComponent(NgModelHostComponent);
    await fixture.whenStable();
    await fixture.whenStable();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;
    expect(input.checked).toBe(true);

    input.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value).toBe(false);
  });
});
