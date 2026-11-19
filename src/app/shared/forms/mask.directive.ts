import { Directive, ElementRef, booleanAttribute, computed, forwardRef, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MaskSpec, applyMask, caretAfter, isNumericPattern, resolvePattern } from './mask';

/**
 * Máscara de digitação para `<input>`:
 *
 * ```html
 * <input appMask="cpfCnpj" formControlName="documento">
 * <input appMask="phone" [(ngModel)]="telefone">
 * <input appMask="000-AAA" formControlName="codigo">   <!-- padrão próprio -->
 * ```
 *
 * Prontas: `cpf`, `cnpj` (inclui o alfanumérico), `cpfCnpj`, `phone`, `cep`, `date`.
 * Tokens de um padrão próprio: `0` dígito, `A` letra, `*` letra ou dígito.
 *
 * O **formulário recebe o valor sem máscara** ("12345678909"); a tela mostra
 * formatado. Use `[unmask]="false"` para guardar o texto formatado.
 * É o value accessor do input: funciona com `formControl`, `formControlName` e `ngModel`.
 */
@Directive({
  selector: 'input[appMask]',
  standalone: true,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MaskDirective), multi: true }],
  host: {
    '(input)': 'onInput()',
    '(blur)': 'onTouched()',
    '[attr.inputmode]': 'inputMode()',
    '[attr.autocomplete]': '"off"',
  },
})
export class MaskDirective implements ControlValueAccessor {
  readonly appMask = input.required<MaskSpec>();
  /** `true` (padrão): o formulário recebe só o conteúdo; `false`: o texto formatado */
  readonly unmask = input(true, { transform: booleanAttribute });

  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;
  private readonly text = signal('');

  /** teclado numérico no celular quando a máscara (atual) só aceita dígitos */
  readonly inputMode = computed(() => isNumericPattern(resolvePattern(this.appMask(), this.text())) ? 'numeric' : null);

  private onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(v: unknown): void { this.render(String(v ?? '')); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.el.disabled = disabled; }

  onInput() {
    const typed = this.el.value;
    // quantos caracteres de conteúdo havia antes do cursor (para devolvê-lo ao lugar)
    const before = typed.slice(0, this.el.selectionStart ?? typed.length).replace(/[^A-Za-z0-9]/g, '').length;
    const { masked, raw } = this.render(typed);
    if (document.activeElement === this.el) {
      const pos = caretAfter(masked, before);
      this.el.setSelectionRange(pos, pos);
    }
    this.onChange(this.unmask() ? raw : masked);
  }

  private render(value: string) {
    const result = applyMask(value, resolvePattern(this.appMask(), value));
    this.el.value = result.masked;
    this.text.set(result.masked);
    return result;
  }
}
