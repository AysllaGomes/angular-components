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

let uid = 0;

/**
 * Liga/desliga para configurações que valem na hora (ex.: "Notificações").
 * Para aceitar termos ou marcar itens de uma lista, prefira o `app-checkbox`.
 *
 * Por baixo: `<input type="checkbox" role="switch">` nativo (invisível): teclado
 * (Espaço), clique no rótulo e anúncio "ligado/desligado" vêm do navegador.
 * O rótulo é o conteúdo: `<app-switch [(checked)]="ativo">Notificações</app-switch>`.
 */
@Component({
  selector: 'app-switch',
  standalone: true,
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SwitchComponent), multi: true }
  ]
})
export class SwitchComponent implements ControlValueAccessor {
  /** ligado (two-way `[(checked)]`); com formulários, use `formControl`/`ngModel` */
  readonly checked = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly name = input<string | null>(null);
  /** rótulo para leitor de tela quando não há texto visível */
  readonly ariaLabel = input<string | null>(null);
  readonly hint = input<string | null>(null);
  /** rótulo à esquerda e o switch à direita (comum em listas de configurações) */
  readonly labelFirst = input(false, { transform: booleanAttribute });

  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  readonly inputId = `sw-${++uid}`;
  readonly hintId = `${this.inputId}-hint`;

  // ---- ControlValueAccessor
  private onChange: (v: boolean) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(v: unknown): void { this.checked.set(!!v); }
  registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.formDisabled.set(isDisabled); }

  onToggle(ev: Event) {
    const value = (ev.target as HTMLInputElement).checked;
    this.checked.set(value);
    this.onChange(value);
  }
}
