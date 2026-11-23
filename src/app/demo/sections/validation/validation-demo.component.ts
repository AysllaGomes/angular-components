import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TPipe } from '../../../site/i18n/t.pipe';
import { I18nService } from '../../../site/services/i18n.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

import { AppValidators, FieldErrorPipe, FormValidationDirective, MaskDirective } from '../../../shared/forms';
import { RadioOption } from '../../../shared/components/radio/radio.types';
import { SelectOption } from '../../../shared/components/select/select.types';
import { ButtonDirective } from '../../../shared/components/button/button.directive';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { CheckboxComponent } from '../../../shared/components/checkbox/checkbox.component';
import { RadioGroupComponent } from '../../../shared/components/radio/radio-group.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';

@Component({
  selector: 'app-validation-demo',
  standalone: true,
  imports: [
    TPipe, ReactiveFormsModule, FieldErrorPipe, FormValidationDirective, MaskDirective,
    ButtonDirective, FormFieldComponent, SelectComponent, RadioGroupComponent, CheckboxComponent,
  ],
  templateUrl: './validation-demo.component.html',
  styleUrl: './validation-demo.component.sass',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ValidationDemoComponent {
  private i18n = inject(I18nService);
  private toast = inject(ToastService);

  form = new FormGroup({
    name:  new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    doc:   new FormControl('', { nonNullable: true, validators: [Validators.required, AppValidators.cpfOrCnpj()] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.minLength(10)] }),
    cep:   new FormControl('', { nonNullable: true, validators: [Validators.minLength(8)] }),
    state: new FormControl<string | null>(null, Validators.required),
    plan:  new FormControl<string | null>(null, Validators.required),
    terms: new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue }),
  });
  get c() { return this.form.controls; }

  states: SelectOption<string>[] = [
    { label: 'Bahia', value: 'BA' }, { label: 'Minas Gerais', value: 'MG' }, { label: 'Paraná', value: 'PR' },
    { label: 'Rio de Janeiro', value: 'RJ' }, { label: 'Rio Grande do Sul', value: 'RS' }, { label: 'São Paulo', value: 'SP' },
  ];
  plans = computed<RadioOption<string>[]>(() => [
    { label: this.i18n.t('radio.plan.basic'), value: 'basic' },
    { label: this.i18n.t('radio.plan.pro'), value: 'pro' },
  ]);

  sent = signal<string | null>(null);

  /** só chega aqui com o formulário válido; o toast faz o papel da resposta do back-end */
  onValidSubmit(value: unknown) {
    this.sent.set(JSON.stringify(value, null, 2));
    this.toast.success(this.i18n.t('validation.sent'));
  }

  reset() {
    this.form.reset();
    this.sent.set(null);
  }
}
