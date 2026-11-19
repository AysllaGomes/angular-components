import { Injectable, InjectionToken, Provider, inject } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { I18nService } from '../services/i18n.service';

/**
 * Mensagem de um tipo de erro: chave do i18n, texto literal (com `{{param}}`) ou
 * função que recebe o valor do erro (ex.: `{ requiredLength: 3, actualLength: 1 }`).
 */
export type ErrorMessage = string | ((error: any) => string);

export const FORM_ERROR_MESSAGES = new InjectionToken<Record<string, ErrorMessage>>('FORM_ERROR_MESSAGES');

/**
 * Sobrescreve ou acrescenta mensagens de erro num só lugar (ex.: em `app.config.ts`):
 *
 * ```ts
 * provideFormErrorMessages({
 *   required: 'Preencha este campo',
 *   senhaFraca: 'Use 8+ caracteres com número e símbolo',
 *   minlength: e => `Faltam ${e.requiredLength - e.actualLength} caracteres`,
 * })
 * ```
 */
export function provideFormErrorMessages(messages: Record<string, ErrorMessage>): Provider {
  return { provide: FORM_ERROR_MESSAGES, useValue: messages };
}

/** erro mostrado primeiro quando há mais de um (o resto segue a ordem do controle).
 *  Obs.: `Validators.requiredTrue` do Angular também informa `required`. */
const PRIORITY = ['required'];

/**
 * Transforma os erros de um controle numa mensagem (a do erro mais importante).
 * Padrão: chave `form.error.<tipo>` do i18n, com os dados do erro como parâmetros.
 * Erro sem mensagem cadastrada → `form.error.invalid` ("Valor inválido").
 */
@Injectable({ providedIn: 'root' })
export class FormErrorsService {
  private readonly i18n = inject(I18nService);
  private readonly custom = inject(FORM_ERROR_MESSAGES, { optional: true }) ?? {};

  messageFor(errors: ValidationErrors | null | undefined): string | null {
    if (!errors) return null;
    const keys = Object.keys(errors);
    if (!keys.length) return null;
    const key = PRIORITY.find(k => k in errors) ?? keys[0];
    return this.resolve(key, errors[key]);
  }

  private resolve(key: string, error: unknown): string {
    const params = error && typeof error === 'object' ? (error as Record<string, string | number>) : undefined;
    const custom = this.custom[key];
    if (typeof custom === 'function') return custom(error);
    if (typeof custom === 'string') return this.i18n.has(custom) ? this.i18n.t(custom, params) : this.interpolate(custom, params);
    const own = `form.error.${key}`;
    return this.i18n.t(this.i18n.has(own) ? own : 'form.error.invalid', params);
  }

  private interpolate(text: string, params?: Record<string, string | number>) {
    if (!params) return text;
    return text.replace(/{{\s*(\w+)\s*}}/g, (_, k) => String(params[k] ?? ''));
  }
}
