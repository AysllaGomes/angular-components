import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { injectIsEn } from './lang';
import { SelectComponent } from '../../shared/components/select/select.component';
import { SelectOption } from '../../shared/components/select/select.types';
import { TreeSelectComponent } from '../../shared/components/tree-select/tree-select.component';
import { TreeNode } from '../../shared/components/tree-select/tree-select.types';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { CheckboxGroupComponent } from '../../shared/components/checkbox-group/checkbox-group.component';
import { CheckboxOption } from '../../shared/components/checkbox-group/checkbox-group.types';
import { RadioGroupComponent } from '../../shared/components/radio/radio-group.component';
import { RadioOption } from '../../shared/components/radio/radio.types';
import { SwitchComponent } from '../../shared/components/switch/switch.component';
import { FormFieldComponent } from '../../shared/components/form-field/form-field.component';
import { AutosizeDirective } from '../../shared/components/form-field/autosize.directive';
import { ButtonDirective } from '../../shared/components/button/button.directive';
import { AppValidators, FieldErrorPipe, FormValidationDirective, MaskDirective } from '../../shared/forms';

/*
 * Exemplos ao vivo do grupo Formulário. Cada um reproduz o exemplo de "Uso" do .md
 * (o que a aba "Código" mostra), no idioma da página.
 */

const FIELD = `
:host
  display: block
  max-width: 22rem
`;

/** select.md → ## Uso básico */
@Component({
  selector: 'app-select-example',
  imports: [SelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let en = isEn();
    <app-select
      [label]="en ? 'Category' : 'Categoria'"
      [placeholder]="en ? 'Select' : 'Selecione'"
      [required]="true"
      [options]="options()"
      [value]="category()"
      (valueChange)="category.set($event)"
      [hint]="en ? 'Used to organize the reports.' : 'Usada para organizar os relatórios.'" />
  `,
  styles: FIELD
})
export class SelectExampleComponent {
  readonly isEn = injectIsEn();
  readonly category = signal<string | null>(null);
  readonly options = computed<SelectOption<string>[]>(() => this.isEn()
    ? [{ label: 'Sales', value: 'sales' }, { label: 'Marketing', value: 'marketing' }, { label: 'Support', value: 'support' }]
    : [{ label: 'Vendas', value: 'vendas' }, { label: 'Marketing', value: 'marketing' }, { label: 'Suporte', value: 'suporte' }]);
}

/** tree-select.md → ## Uso · Um nó */
@Component({
  selector: 'app-treeselect-example',
  imports: [TreeSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-tree-select [label]="isEn() ? 'City' : 'Cidade'" [nodes]="places()" [(value)]="city" />`,
  styles: FIELD
})
export class TreeSelectExampleComponent {
  readonly isEn = injectIsEn();
  readonly city = signal<string | null>(null);
  readonly places = computed<TreeNode[]>(() => [
    {
      key: 'br', label: this.isEn() ? 'Brazil' : 'Brasil', children: [
        { key: 'sp', label: 'São Paulo', children: [
          { key: 'sp-capital', label: 'São Paulo' },
          { key: 'campinas', label: 'Campinas' },
          { key: 'santos', label: 'Santos' },
        ] },
        { key: 'ba', label: 'Bahia', children: [
          { key: 'salvador', label: 'Salvador' },
          { key: 'ilheus', label: 'Ilhéus' },
        ] },
      ],
    },
  ]);
}

/** checkbox.md → ## Uso */
@Component({
  selector: 'app-checkbox-example',
  imports: [CheckboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-checkbox [(checked)]="accepted">{{ isEn() ? 'I accept the terms' : 'Aceito os termos' }}</app-checkbox>`
})
export class CheckboxExampleComponent {
  readonly isEn = injectIsEn();
  readonly accepted = signal(false);
}

/** checkbox-group.md → ## Uso */
@Component({
  selector: 'app-checkboxgroup-example',
  imports: [CheckboxGroupComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let en = isEn();
    <app-checkbox-group [label]="en ? 'Email alerts' : 'Avisos por e-mail'" selectAll required
      [options]="topics()" [formControl]="alerts"
      [error]="alerts.touched && alerts.invalid ? (en ? 'Choose at least one alert.' : 'Escolha pelo menos um aviso.') : null" />

    <!-- sem formulário -->
    <app-checkbox-group [label]="en ? 'Interests' : 'Interesses'" orientation="horizontal" [options]="interests()" [(value)]="chosen" />
  `,
  styles: `
:host
  display: grid
  gap: 1.5rem
`
})
export class CheckboxGroupExampleComponent {
  readonly isEn = injectIsEn();
  readonly alerts = new FormControl<string[]>(['security'], { nonNullable: true, validators: Validators.required });
  readonly chosen = signal<string[]>(['design']);
  readonly topics = computed<CheckboxOption<string>[]>(() => this.isEn()
    ? [
      { label: 'News', value: 'news', description: 'Once a month' },
      { label: 'Deals', value: 'deals' },
      { label: 'Account security', value: 'security', disabled: true },
    ]
    : [
      { label: 'Novidades', value: 'news', description: 'Uma vez por mês' },
      { label: 'Promoções', value: 'deals' },
      { label: 'Segurança da conta', value: 'security', disabled: true },
    ]);
  readonly interests = computed<CheckboxOption<string>[]>(() => this.isEn()
    ? [{ label: 'Design', value: 'design' }, { label: 'Code', value: 'code' }, { label: 'Product', value: 'product' }]
    : [{ label: 'Design', value: 'design' }, { label: 'Código', value: 'code' }, { label: 'Produto', value: 'product' }]);
}

/** radio-group.md → ## Uso */
@Component({
  selector: 'app-radio-example',
  imports: [RadioGroupComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let en = isEn();
    <app-radio-group [label]="en ? 'Plan' : 'Plano'" [options]="plans()" [(value)]="plan" />

    <app-radio-group [label]="en ? 'Shipping' : 'Entrega'" orientation="horizontal" required
      [options]="methods()" [formControl]="shipping"
      [error]="shipping.touched && shipping.invalid ? (en ? 'Choose a shipping method.' : 'Escolha uma forma de entrega.') : null" />
  `,
  styles: `
:host
  display: grid
  gap: 1.5rem
`
})
export class RadioExampleComponent {
  readonly isEn = injectIsEn();
  readonly plan = signal<string | null>('basic');
  readonly shipping = new FormControl<string | null>(null, Validators.required);
  readonly plans = computed<RadioOption<string>[]>(() => this.isEn()
    ? [
      { label: 'Basic', value: 'basic', description: 'Up to 3 projects, free' },
      { label: 'Pro', value: 'pro' },
      { label: 'Enterprise', value: 'enterprise', disabled: true },
    ]
    : [
      { label: 'Básico', value: 'basic', description: 'Até 3 projetos, sem custo' },
      { label: 'Pro', value: 'pro' },
      { label: 'Empresa', value: 'enterprise', disabled: true },
    ]);
  readonly methods = computed<RadioOption<string>[]>(() => this.isEn()
    ? [{ label: 'Standard', value: 'standard' }, { label: 'Express', value: 'express' }, { label: 'Pickup', value: 'pickup' }]
    : [{ label: 'Normal', value: 'standard' }, { label: 'Expressa', value: 'express' }, { label: 'Retirada', value: 'pickup' }]);
}

/** switch.md → ## Uso */
@Component({
  selector: 'app-switch-example',
  imports: [SwitchComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let en = isEn();
    <app-switch [(checked)]="notifications">{{ en ? 'Email notifications' : 'Notificações por e-mail' }}</app-switch>

    <!-- lista de configurações: rótulo à esquerda, switch à direita -->
    <app-switch labelFirst [formControl]="compactMode">{{ en ? 'Compact mode' : 'Modo compacto' }}</app-switch>
  `,
  styles: `
:host
  display: grid
  gap: 1rem
  max-width: 22rem
`
})
export class SwitchExampleComponent {
  readonly isEn = injectIsEn();
  readonly notifications = signal(true);
  readonly compactMode = new FormControl(false, { nonNullable: true });
}

/** forms.md → ## Uso */
@Component({
  selector: 'app-validation-example',
  imports: [
    ReactiveFormsModule, FormFieldComponent, RadioGroupComponent, CheckboxComponent, ButtonDirective,
    FieldErrorPipe, FormValidationDirective, MaskDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let en = isEn();
    <form [formGroup]="form" appFormValidation (validSubmit)="save()">
      <app-form-field [label]="en ? 'Full name' : 'Nome completo'" required [error]="form.controls.name | fieldError">
        <input formControlName="name" autocomplete="name">
      </app-form-field>

      <app-form-field [label]="en ? 'CPF or CNPJ' : 'CPF ou CNPJ'" required [error]="form.controls.doc | fieldError">
        <input appMask="cpfCnpj" formControlName="doc">
      </app-form-field>

      <app-form-field [label]="en ? 'Phone' : 'Telefone'">
        <input appMask="phone" formControlName="phone" type="tel">
      </app-form-field>

      <app-radio-group [label]="en ? 'Plan' : 'Plano'" required [options]="plans()" formControlName="plan"
                       [error]="form.controls.plan | fieldError" />

      <app-checkbox formControlName="terms" required [error]="form.controls.terms | fieldError">
        {{ en ? 'I accept the terms' : 'Li e aceito os termos' }}
      </app-checkbox>

      <button appButton type="submit">{{ en ? 'Submit' : 'Enviar' }}</button>
    </form>
    <p class="status" role="status">{{ sent() ? (en ? 'Sent.' : 'Enviado.') : '' }}</p>
  `,
  styles: `
form
  display: grid
  gap: 1.25rem
  max-width: 26rem
  justify-items: start
  > app-form-field, > app-radio-group
    justify-self: stretch
.status
  margin: .75rem 0 0
  min-height: 1.5em
  color: var(--muted, #5f6a75)
`
})
export class ValidationExampleComponent {
  readonly isEn = injectIsEn();
  readonly sent = signal(false);
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    doc: new FormControl('', { nonNullable: true, validators: [Validators.required, AppValidators.cpfOrCnpj()] }),
    phone: new FormControl('', { nonNullable: true }),
    plan: new FormControl<string | null>(null, Validators.required),
    terms: new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue }),
  });
  readonly plans = computed<RadioOption<string>[]>(() => this.isEn()
    ? [{ label: 'Basic', value: 'basic' }, { label: 'Pro', value: 'pro' }]
    : [{ label: 'Básico', value: 'basic' }, { label: 'Pro', value: 'pro' }]);

  save() { this.sent.set(true); }
}

/** form-field.md → ## Uso */
@Component({
  selector: 'app-textfield-example',
  imports: [ReactiveFormsModule, FormFieldComponent, AutosizeDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let en = isEn();
    <form class="fields" [formGroup]="form" (submit)="$event.preventDefault()">
      <app-form-field [label]="en ? 'Email' : 'E-mail'" required
        [hint]="en ? 'We use it to recover your password' : 'Usaremos para recuperar a senha'">
        <input type="email" autocomplete="email" formControlName="email">
      </app-form-field>

      <app-form-field [label]="en ? 'Password' : 'Senha'" required passwordToggle>
        <input type="password" autocomplete="current-password" formControlName="password">
      </app-form-field>

      <app-form-field [label]="en ? 'Order amount' : 'Valor do pedido'">
        <span ffPrefix>{{ en ? '$' : 'R$' }}</span>
        <input inputmode="decimal" formControlName="amount">
      </app-form-field>

      <app-form-field [label]="en ? 'Notes' : 'Observações'" counter
        [hint]="en ? 'Only the team sees this' : 'Visível só para a equipe'">
        <textarea maxlength="280" appAutosize="6" formControlName="notes"></textarea>
      </app-form-field>
    </form>
  `,
  styles: `
:host
  display: block
  max-width: 24rem
.fields
  display: grid
  gap: 1rem
`
})
export class TextFieldExampleComponent {
  readonly isEn = injectIsEn();
  readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
    amount: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true }),
  });
}
