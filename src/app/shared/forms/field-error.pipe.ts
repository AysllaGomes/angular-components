import { Pipe, PipeTransform, inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { FormErrorsService } from './form-errors';

/**
 * Mensagem de erro de um controle, pronta para o input `error` dos componentes:
 *
 * ```html
 * <app-select formControlName="plano" [error]="form.controls.plano | fieldError" />
 * ```
 *
 * Só mostra depois que o campo foi **tocado** (saiu dele) — ou quando o formulário
 * foi enviado com `appFormValidation`, que marca tudo como tocado.
 * É impuro: acompanha mudanças de valor, validade, toque e idioma.
 */
@Pipe({ name: 'fieldError', standalone: true, pure: false })
export class FieldErrorPipe implements PipeTransform {
  private readonly errors = inject(FormErrorsService);

  transform(control: AbstractControl | null | undefined): string | null {
    if (!control || !control.invalid || !control.touched) return null;
    return this.errors.messageFor(control.errors);
  }
}
