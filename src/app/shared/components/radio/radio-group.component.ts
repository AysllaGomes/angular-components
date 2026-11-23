import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  linkedSignal,
  output,
  signal
} from '@angular/core';

import { injectUiLabels } from '../../labels';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { RadioOption } from './radio.types';

let uid = 0;

/**
 * Grupo de opções de escolha única.
 *
 * Por baixo: `<fieldset>` + `<legend>` (nome do grupo) e `<input type="radio">`
 * nativos com o mesmo `name`. O navegador cuida do teclado do padrão WAI-ARIA:
 * Tab entra/sai do grupo (na opção marcada), setas trocam a opção.
 */
@Component({
  selector: 'app-radio-group',
  standalone: true,
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RadioGroupComponent), multi: true }
  ]
})
export class RadioGroupComponent<T = any> implements ControlValueAccessor {
  /** textos padrão (UI_LABELS_EN, ou o que provideUiLabels trocou) */
  protected readonly labels = injectUiLabels();

  /** nome do grupo (vira o `<legend>`) */
  readonly label = input('');
  readonly options = input.required<RadioOption<T>[], RadioOption<T>[] | null | undefined>({ transform: v => v ?? [] });
  readonly orientation = input<'vertical' | 'horizontal'>('vertical');
  /** `name` dos inputs (padrão: gerado e único) */
  readonly name = input<string | null>(null);

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly requiredLabelInput = input<string | undefined>(undefined, { alias: 'requiredLabel' });
  readonly requiredLabel = computed(() => this.requiredLabelInput() ?? this.labels().required);
  readonly hint = input<string | null>(null);
  /** mensagem de erro (ex.: do estado do formulário); marca `aria-invalid` */
  readonly error = input<string | null>(null);

  /** two-way `[(value)]`; com formulários, use `formControl`/`ngModel` */
  readonly value = input<T | null>(null);
  readonly valueChange = output<T | null>();

  readonly current = linkedSignal<T | null>(() => this.value() ?? null);

  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  readonly id = `rg-${++uid}`;
  readonly groupName = computed(() => this.name() || this.id);
  readonly hintId = `${this.id}-hint`;
  readonly errorId = `${this.id}-error`;
  readonly describedBy = computed(() => this.error() ? this.errorId : this.hint() ? this.hintId : null);
  optionId(i: number) { return `${this.id}-opt-${i}`; }
  descId(i: number) { return `${this.id}-desc-${i}`; }

  // ---- ControlValueAccessor
  private onChange: (v: T | null) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(v: T | null): void { this.current.set(v ?? null); }
  registerOnChange(fn: (v: T | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.formDisabled.set(isDisabled); }

  isChecked(opt: RadioOption<T>) { return opt.value === this.current(); }

  /** o usuário marcou uma opção (clique, setas, Espaço) */
  select(opt: RadioOption<T>) {
    if (opt.disabled || this.isDisabled() || this.isChecked(opt)) return;
    this.current.set(opt.value);
    this.valueChange.emit(opt.value);
    this.onChange(opt.value);
  }

  /** descrição da opção + dica/erro do grupo */
  optionDescribedBy(i: number, opt: RadioOption<T>) {
    const ids = [opt.description ? this.descId(i) : null, this.describedBy()].filter(Boolean);
    return ids.length ? ids.join(' ') : null;
  }
}
