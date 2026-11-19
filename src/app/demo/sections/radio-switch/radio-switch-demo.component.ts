import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { TPipe } from '../../../shared/i18n/t.pipe';
import { I18nService } from '../../../shared/services/i18n.service';

import { RadioOption } from '../../../shared/model/interface/radio/radio-option.interface';
import { ButtonDirective } from '../../../shared/components/button/button.directive';
import { SwitchComponent } from '../../../shared/components/switch/switch.component';
import { RadioGroupComponent } from '../../../shared/components/radio/radio-group.component';

/** demo das duas seções do grupo Formulário: Radio group e Switch */
@Component({
  selector: 'app-radio-switch-demo',
  standalone: true,
  imports: [TPipe, ReactiveFormsModule, ButtonDirective, RadioGroupComponent, SwitchComponent],
  templateUrl: './radio-switch-demo.component.html',
  styleUrl: './radio-switch-demo.component.sass',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RadioSwitchDemoComponent {
  private i18n = inject(I18nService);
  private t = (k: string) => this.i18n.t(k);

  // radio: planos com descrição
  plans = computed<RadioOption<string>[]>(() => [
    { label: this.t('radio.plan.basic'), value: 'basic', description: this.t('radio.plan.basic.desc') },
    { label: this.t('radio.plan.pro'), value: 'pro', description: this.t('radio.plan.pro.desc') },
    { label: this.t('radio.plan.enterprise'), value: 'enterprise', disabled: true },
  ]);
  plan = signal<string | null>('basic');

  // radio: entrega (formulário obrigatório)
  shipping = computed<RadioOption<string>[]>(() => [
    { label: this.t('radio.ship.standard'), value: 'standard' },
    { label: this.t('radio.ship.express'), value: 'express' },
    { label: this.t('radio.ship.pickup'), value: 'pickup' },
  ]);
  ship = new FormControl<string | null>(null, Validators.required);
  shipStatus = toSignal(this.ship.statusChanges, { initialValue: this.ship.status });
  submitted = signal(false);
  shipError = computed(() => this.submitted() && this.shipStatus() === 'INVALID');
  submit() { this.submitted.set(true); this.ship.markAsTouched(); }

  // switch
  notifications = signal(true);
  compact = signal(false);
}
