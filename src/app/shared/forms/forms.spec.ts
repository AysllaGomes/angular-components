import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MaskDirective } from './mask.directive';
import { AppValidators } from './validators';
import { FieldErrorPipe } from './field-error.pipe';
import { FormErrorsService, provideFormErrorMessages } from './form-errors';
import { FormValidationDirective } from './form-validation.directive';
import { RadioGroupComponent } from '../components/radio/radio-group.component';
import { FormFieldComponent } from '../components/form-field/form-field.component';

describe('FormErrorsService', () => {
  const setup = (custom?: Record<string, any>) => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ...(custom ? [provideFormErrorMessages(custom)] : [])]
    });
    return TestBed.inject(FormErrorsService);
  };

  it('uses the i18n message of the error, with its data as params', () => {
    const svc = setup();
    expect(svc.messageFor({ cpf: true })).toBe('CPF inválido');
    expect(svc.messageFor({ minlength: { requiredLength: 3, actualLength: 1 } })).toBe('Mínimo de 3 caracteres');
    expect(svc.messageFor(null)).toBeNull();
  });

  it('"required" wins when there is more than one error; unknown errors fall back', () => {
    const svc = setup();
    expect(svc.messageFor({ cpf: true, required: true })).toBe('Campo obrigatório');
    expect(svc.messageFor({ algoNovo: true })).toBe('Valor inválido');
  });

  it('messages can be overridden or added in one place (text, i18n key or function)', () => {
    const svc = setup({
      required: 'Preencha este campo',
      cpf: 'form.error.cnpj',
      senhaFraca: 'Use {{min}}+ caracteres',
      minlength: (e: any) => `Faltam ${e.requiredLength - e.actualLength}`,
    });
    expect(svc.messageFor({ required: true })).toBe('Preencha este campo');
    expect(svc.messageFor({ cpf: true })).toBe('CNPJ inválido');
    expect(svc.messageFor({ senhaFraca: { min: 8 } })).toBe('Use 8+ caracteres');
    expect(svc.messageFor({ minlength: { requiredLength: 5, actualLength: 2 } })).toBe('Faltam 3');
  });
});

@Component({
  imports: [ReactiveFormsModule, FormsModule, MaskDirective, FieldErrorPipe, FormValidationDirective, FormFieldComponent, RadioGroupComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <form [formGroup]="form" appFormValidation (validSubmit)="sent = $event" (invalidSubmit)="invalid = invalid + 1">
      <app-form-field label="Nome" required hint="Como no documento" [error]="form.controls.nome | fieldError">
        <input formControlName="nome">
      </app-form-field>
      <app-form-field label="Documento" required [error]="form.controls.doc | fieldError">
        <input id="doc" appMask="cpfCnpj" formControlName="doc">
      </app-form-field>
      <app-radio-group label="Plano" [options]="plans" formControlName="plano" [error]="form.controls.plano | fieldError" />
      <button type="submit">Enviar</button>
    </form>
  `
})
class FormHostComponent {
  plans = [{ label: 'Básico', value: 'basic' }, { label: 'Pro', value: 'pro' }];
  form = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    doc: new FormControl('', { nonNullable: true, validators: [Validators.required, AppValidators.cpfOrCnpj()] }),
    plano: new FormControl<string | null>(null, Validators.required),
  });
  sent: unknown = null;
  invalid = 0;
}

describe('Forms: fieldError, appFormValidation, appMask and app-form-field together', () => {
  let fixture: ComponentFixture<FormHostComponent>;
  let host: FormHostComponent;
  let el: HTMLElement;

  const input = (sel: string) => el.querySelector<HTMLInputElement>(sel)!;
  const type = async (inp: HTMLInputElement, text: string) => {
    inp.value = text;
    inp.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };
  const submit = async () => {
    el.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormHostComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
    fixture = TestBed.createComponent(FormHostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    document.body.appendChild(el); // foco precisa do elemento no documento
    await fixture.whenStable();
  });

  afterEach(() => el.remove());

  it('the mask formats the input and the form receives the unmasked value', async () => {
    await type(input('#doc'), '52998224725');
    expect(input('#doc').value).toBe('529.982.247-25');
    expect(host.form.controls.doc.value).toBe('52998224725');
    expect(host.form.controls.doc.valid).toBe(true);
  });

  it('values written by the form are shown formatted', async () => {
    host.form.controls.doc.setValue('12ABC34501DE35');
    await fixture.whenStable();
    expect(input('#doc').value).toBe('12.ABC.345/01DE-35');
  });

  it('errors only show after the field is touched', async () => {
    expect(el.textContent).not.toContain('Campo obrigatório');
    await type(input('#doc'), '529982247');
    input('#doc').dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(el.textContent).toContain('CPF ou CNPJ inválido');
  });

  it('invalid submit: shows every error and focuses the first invalid field in screen order', async () => {
    await type(input('input[formcontrolname="nome"]'), 'Ana');
    await submit();

    expect(host.sent).toBeNull();
    expect(host.invalid).toBe(1);
    expect(el.textContent).toContain('Campo obrigatório'); // doc e plano
    expect(document.activeElement).toBe(input('#doc'));     // nome já é válido
  });

  it('typing and submitting right away (no render in between) still focuses the right field', async () => {
    const nome = input('input[formcontrolname="nome"]');
    nome.value = 'Ana';
    nome.dispatchEvent(new Event('input')); // sem esperar a renderização
    el.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    await fixture.whenStable();
    expect(document.activeElement).toBe(input('#doc'));
  });

  it('focus goes into custom components too (radio group)', async () => {
    await type(input('input[formcontrolname="nome"]'), 'Ana');
    await type(input('#doc'), '52998224725');
    await submit();
    expect(document.activeElement).toBe(el.querySelector('app-radio-group input[type="radio"]'));
  });

  it('valid submit emits the form value', async () => {
    await type(input('input[formcontrolname="nome"]'), 'Ana Lima');
    await type(input('#doc'), '12.ABC.345/01DE-35');
    el.querySelector<HTMLInputElement>('app-radio-group input[type="radio"]')!.click();
    await submit();
    expect(host.sent).toEqual({ nome: 'Ana Lima', doc: '12ABC34501DE35', plano: 'basic' });
  });

  it('app-form-field links label, hint/error, aria-invalid and aria-required to the projected input', async () => {
    const nome = input('input[formcontrolname="nome"]');
    const label = nome.closest('app-form-field')!.querySelector('label')!;
    expect(label.getAttribute('for')).toBe(nome.id);
    expect(nome.getAttribute('aria-required')).toBe('true');
    expect(el.querySelector(`#${nome.getAttribute('aria-describedby')}`)!.textContent).toContain('Como no documento');

    await submit();
    expect(nome.getAttribute('aria-invalid')).toBe('true');
    expect(el.querySelector(`#${nome.getAttribute('aria-describedby')}`)!.textContent).toContain('Campo obrigatório');
    // id já existente é respeitado
    expect(input('#doc').closest('app-form-field')!.querySelector('label')!.getAttribute('for')).toBe('doc');
  });
});
