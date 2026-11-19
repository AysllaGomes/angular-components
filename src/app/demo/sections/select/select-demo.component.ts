import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { TPipe } from '../../../shared/i18n/t.pipe';

import { I18nService } from '../../../shared/services/i18n.service';

import { ButtonDirective } from '../../../shared/components/button/button.directive';
import { SelectComponent } from '../../../shared/components/select/select.component';

import { SelectOption } from '../../../shared/model/interface/select/select-option.interface';

@Component({
  selector: 'app-select-demo',
  standalone: true,
  imports: [SelectComponent, ReactiveFormsModule, ButtonDirective, TPipe],
  templateUrl: './select-demo.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './select-demo.component.sass'
})
export class SelectDemoComponent {
  private i18n = inject(I18nService);

  categoriaBasic   = signal<string | null>(null);
  categoriaFilter  = signal<string | null>(null);
  categoriaDisabled= signal<string | null>('o1');
  categoriaNoReq   = signal<string | null>(null);
  alimento         = signal<string | null>(null);

  options = computed<SelectOption<string>[]>(() => [
    { label: this.i18n.t('select.option.hover'), value: 'hover' },
    { label: this.i18n.t('select.option.o1'),    value: 'o1' },
    { label: this.i18n.t('select.option.o2'),    value: 'o2' },
  ]);

  /** opções agrupadas (o campo `group` junta as opções sob um título) */
  groupedOptions = computed<SelectOption<string>[]>(() => {
    const fruits = this.i18n.t('select.group.fruits');
    const veggies = this.i18n.t('select.group.veggies');
    return [
      { label: this.i18n.t('select.food.banana'),   value: 'banana',   group: fruits },
      { label: this.i18n.t('select.food.pineapple'), value: 'pineapple', group: fruits },
      { label: this.i18n.t('select.food.mango'),    value: 'mango',    group: fruits },
      { label: this.i18n.t('select.food.carrot'),   value: 'carrot',   group: veggies },
      { label: this.i18n.t('select.food.broccoli'), value: 'broccoli', group: veggies },
      { label: this.i18n.t('select.food.potato'),   value: 'potato',   group: veggies, disabled: true },
    ];
  });

  // ===== Reactive Forms (ControlValueAccessor) =====
  categoriaCtrl = new FormControl<string | null>(null, Validators.required);

  /** estado do controle em signals, para exibir na demo sem zone.js */
  ctrlValue  = toSignal(this.categoriaCtrl.valueChanges,  { initialValue: this.categoriaCtrl.value });
  ctrlStatus = toSignal(this.categoriaCtrl.statusChanges, { initialValue: this.categoriaCtrl.status });

  /** erro só depois que o usuário interagiu com o campo */
  ctrlError(): string | null {
    const c = this.categoriaCtrl;
    return c.touched && c.hasError('required') ? this.i18n.t('form.required.error') : null;
  }

  toggleCtrlDisabled() {
    const c = this.categoriaCtrl;
    if (c.disabled) c.enable(); else c.disable();
  }

  resetCtrl() {
    this.categoriaCtrl.reset(null);
  }
}
