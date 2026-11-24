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
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { injectUiLabels } from '../../labels';
import { CheckState, CheckboxMarkComponent } from '../checkbox/checkbox-mark.component';
import { CheckboxOption } from './checkbox-group.types';

let uid = 0;

/**
 * Grupo de opções de escolha múltipla; o valor é a lista dos valores marcados.
 *
 * Por baixo: `<fieldset>` + `<legend>` (nome do grupo) e um `<input type="checkbox">`
 * nativo por opção: Tab passa por cada caixa e Espaço marca/desmarca. A caixa visual
 * é o `app-checkbox-mark`, a mesma do `app-checkbox`.
 *
 * O valor segue a ordem das opções (não a ordem dos cliques). Valores que chegam
 * de fora e não estão nas opções são mantidos no fim, para não sumir dado salvo.
 */
@Component({
  selector: 'app-checkbox-group',
  standalone: true,
  imports: [CheckboxMarkComponent],
  templateUrl: './checkbox-group.component.html',
  styleUrl: './checkbox-group.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckboxGroupComponent), multi: true }
  ]
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- padrão público: sem tipar, o uso continua funcionando; quem tipa ganha a checagem
export class CheckboxGroupComponent<T = any> implements ControlValueAccessor {
  /** textos padrão (UI_LABELS_EN, ou o que provideUiLabels trocou) */
  protected readonly labels = injectUiLabels();

  /** nome do grupo (vira o `<legend>`) */
  readonly label = input('');
  readonly options = input.required<CheckboxOption<T>[], CheckboxOption<T>[] | null | undefined>({ transform: v => v ?? [] });
  readonly orientation = input<'vertical' | 'horizontal'>('vertical');
  /** `name` dos inputs (padrão: gerado e único) */
  readonly name = input<string | null>(null);

  /** mostra a caixa "Selecionar todos" acima das opções (parcial quando só algumas estão marcadas) */
  readonly selectAll = input(false, { transform: booleanAttribute });
  readonly selectAllLabelInput = input<string | undefined>(undefined, { alias: 'selectAllLabel' });
  readonly selectAllLabel = computed(() => this.selectAllLabelInput() ?? this.labels().selectAll);

  readonly disabled = input(false, { transform: booleanAttribute });
  /**
   * Só mostra o marcador "requerido" no rótulo do grupo. A validação fica com o
   * formulário (`Validators.required` trata a lista vazia como inválida): o `required`
   * nativo em cada caixa exigiria marcar todas.
   */
  readonly required = input(false, { transform: booleanAttribute });
  readonly requiredLabelInput = input<string | undefined>(undefined, { alias: 'requiredLabel' });
  readonly requiredLabel = computed(() => this.requiredLabelInput() ?? this.labels().required);
  readonly hint = input<string | null>(null);
  /** mensagem de erro (ex.: do estado do formulário); marca `aria-invalid` */
  readonly error = input<string | null>(null);

  /** two-way `[(value)]`; com formulários, use `formControl`/`ngModel` */
  readonly value = input<T[] | null>(null);
  readonly valueChange = output<T[]>();

  readonly current = linkedSignal<T[]>(() => [...(this.value() ?? [])]);

  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  readonly id = `cbg-${++uid}`;
  readonly groupName = computed(() => this.name() || this.id);
  readonly hintId = `${this.id}-hint`;
  readonly errorId = `${this.id}-error`;
  readonly allId = `${this.id}-all`;
  readonly describedBy = computed(() => this.error() ? this.errorId : this.hint() ? this.hintId : null);
  optionId(i: number) { return `${this.id}-opt-${i}`; }
  descId(i: number) { return `${this.id}-desc-${i}`; }

  // ---- ControlValueAccessor
  private onChange: (v: T[]) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(v: T[] | null): void { this.current.set(Array.isArray(v) ? [...v] : []); }
  registerOnChange(fn: (v: T[]) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.formDisabled.set(isDisabled); }

  isChecked(opt: CheckboxOption<T>) { return this.current().includes(opt.value); }

  stateOf(opt: CheckboxOption<T>): CheckState { return this.isChecked(opt) ? 'checked' : 'unchecked'; }

  /** opções que o "Selecionar todos" alcança (as desabilitadas ficam como estão) */
  private readonly enabledOptions = computed(() => this.options().filter(o => !o.disabled));

  /** estado da caixa "Selecionar todos": todas, nenhuma ou parte das opções habilitadas */
  readonly allState = computed<CheckState>(() => {
    const enabled = this.enabledOptions();
    const on = enabled.filter(o => this.current().includes(o.value)).length;
    return on === 0 ? 'unchecked' : on === enabled.length ? 'checked' : 'mixed';
  });

  /** o usuário marcou/desmarcou uma opção (clique, Espaço, clique no rótulo) */
  toggle(opt: CheckboxOption<T>, checked: boolean) {
    if (opt.disabled || this.isDisabled()) return;
    const set = new Set(this.current());
    if (checked) set.add(opt.value); else set.delete(opt.value);
    this.commit(set);
  }

  /** "Selecionar todos": marca as habilitadas que faltam; se já estão todas, desmarca todas */
  toggleAll() {
    if (this.isDisabled()) return;
    const set = new Set(this.current());
    const enabled = this.enabledOptions().map(o => o.value);
    if (this.allState() === 'checked') enabled.forEach(v => set.delete(v));
    else enabled.forEach(v => set.add(v));
    this.commit(set);
  }

  /** valor na ordem das opções; o que não está nas opções fica no fim */
  private commit(set: Set<T>) {
    const inOptions = this.options().map(o => o.value);
    const next = [
      ...inOptions.filter(v => set.has(v)),
      ...[...set].filter(v => !inOptions.includes(v)),
    ];
    this.current.set(next);
    this.valueChange.emit(next);
    this.onChange(next);
  }

  /** descrição da opção + dica/erro do grupo */
  optionDescribedBy(i: number, opt: CheckboxOption<T>) {
    const ids = [opt.description ? this.descId(i) : null, this.describedBy()].filter(Boolean);
    return ids.length ? ids.join(' ') : null;
  }

  /** ids das opções que o "Selecionar todos" controla */
  readonly controlsIds = computed(() =>
    this.options().map((o, i) => o.disabled ? null : this.optionId(i)).filter(Boolean).join(' ') || null);
}
