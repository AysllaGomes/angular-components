import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  model,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CheckState, CheckboxMarkComponent } from './checkbox-mark.component';

let uid = 0;

/**
 * Checkbox acessível com estado parcial (indeterminado).
 *
 * Por baixo há um `<input type="checkbox">` nativo (invisível): teclado (Espaço),
 * clique no rótulo, `required` e o anúncio de "parcial" pelo leitor de tela vêm
 * de graça. Por cima, a caixa visual `app-checkbox-mark`.
 *
 * O rótulo é o conteúdo: `<app-checkbox [(checked)]="aceito">Aceito os termos</app-checkbox>`.
 */
@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CheckboxMarkComponent],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // integra com Reactive Forms (formControl/formControlName) e ngModel; o valor é boolean
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckboxComponent), multi: true }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  /** marcado (two-way `[(checked)]`); com formulários, use `formControl`/`ngModel` */
  readonly checked = model(false);
  /**
   * Estado parcial ("−"), típico de um "selecionar todos" com só alguns filhos
   * marcados. Tem prioridade visual sobre `checked`. Ao clicar, sai do parcial
   * (two-way `[(indeterminate)]`) e fica marcado.
   */
  readonly indeterminate = model(false);

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly name = input<string | null>(null);
  /** rótulo para leitor de tela quando não há texto visível */
  readonly ariaLabel = input<string | null>(null);
  readonly hint = input<string | null>(null);
  /** mensagem de erro (ex.: vinda do estado do formulário); marca `aria-invalid` */
  readonly error = input<string | null>(null);

  /** desabilitado pelo formulário (setDisabledState) */
  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  readonly state = computed<CheckState>(() =>
    this.indeterminate() ? 'mixed' : this.checked() ? 'checked' : 'unchecked');

  readonly inputId = `cb-${++uid}`;
  readonly hintId = `${this.inputId}-hint`;
  readonly errorId = `${this.inputId}-error`;
  readonly describedBy = computed(() => this.error() ? this.errorId : this.hint() ? this.hintId : null);

  // ---- ControlValueAccessor
  private onChange: (v: boolean) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(v: unknown): void { this.checked.set(!!v); }
  registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.formDisabled.set(isDisabled); }

  /** mudança feita pelo usuário (clique, Espaço, clique no rótulo) */
  onToggle(ev: Event) {
    const value = (ev.target as HTMLInputElement).checked;
    this.indeterminate.set(false);
    this.checked.set(value);
    this.onChange(value);
  }
}
