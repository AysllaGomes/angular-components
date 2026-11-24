import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UI_LABELS_PT, provideUiLabels } from '../../labels';

import { FormFieldComponent } from './form-field.component';

@Component({
  imports: [FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-form-field id="a" label="E-mail" [required]="required()" [hint]="hint()" [error]="error()">
      <input id="email" type="email">
    </app-form-field>
    <app-form-field id="b" label="Observações" requiredLabel="(precisa)" required>
      <textarea></textarea>
    </app-form-field>
  `
})
class HostComponent {
  required = signal(true);
  hint = signal<string | null>('Usamos só para o recibo');
  error = signal<string | null>(null);
}

describe('FormFieldComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;

  const field = (id: string) => el.querySelector<HTMLElement>(`#${id} .ff__control > *`)!;
  const label = (id: string) => el.querySelector<HTMLLabelElement>(`#${id} .ff__label`)!;
  const describedText = (control: HTMLElement) => {
    const id = control.getAttribute('aria-describedby');
    return id ? el.querySelector(`#${id}`)?.textContent?.trim() : null;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection(), provideUiLabels(UI_LABELS_PT)]
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('keeps the id the field already has and points the label to it', () => {
    expect(field('a').id).toBe('email');
    expect(label('a').htmlFor).toBe('email');
  });

  it('gives an id to a field without one (textarea too)', () => {
    const textarea = field('b');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea.id).toMatch(/^ff-\d+$/);
    expect(label('b').htmlFor).toBe(textarea.id);
    expect(textarea.getAttribute('aria-required')).toBe('true');
  });

  it('the field follows the messages: hint, then error instead, then nothing', async () => {
    const input = field('a');
    expect(describedText(input)).toBe('Usamos só para o recibo');
    expect(input.hasAttribute('aria-invalid')).toBe(false);

    host.error.set('Informe um e-mail válido');
    await fixture.whenStable();
    expect(describedText(input)).toBe('Informe um e-mail válido');
    expect(input.getAttribute('aria-invalid')).toBe('true');

    host.error.set(null);
    host.hint.set(null);
    host.required.set(false);
    await fixture.whenStable();
    expect(input.hasAttribute('aria-describedby')).toBe(false);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(input.hasAttribute('aria-required')).toBe(false);
  });

  it('"required" marker: default text, or the one given per instance', () => {
    expect(el.querySelector('#a .ff__req')!.textContent!.trim()).toBe(UI_LABELS_PT.required);
    expect(el.querySelector('#b .ff__req')!.textContent!.trim()).toBe('(precisa)');
  });
});
