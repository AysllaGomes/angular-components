import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** só os dígitos */
export const onlyDigits = (v: unknown): string => String(v ?? '').replace(/\D/g, '');

/** só letras e dígitos, em maiúsculas (CNPJ alfanumérico) */
export const onlyAlnum = (v: unknown): string => String(v ?? '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();

/** CPF válido (dígitos verificadores), com ou sem máscara. */
export function isValidCpf(value: unknown): boolean {
  const d = onlyDigits(value);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const check = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(d[i]) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return check(9) === Number(d[9]) && check(10) === Number(d[10]);
}

/**
 * CNPJ válido (dígitos verificadores), com ou sem máscara.
 *
 * Aceita o **CNPJ alfanumérico** (IN RFB 2.229/2024, emitido desde jul/2026): as
 * 12 primeiras posições podem ter letras; os 2 dígitos verificadores são sempre
 * números. No cálculo, cada caractere vale o código ASCII − 48 (dígitos ficam iguais).
 */
export function isValidCnpj(value: unknown): boolean {
  const c = onlyAlnum(value);
  if (!/^[A-Z0-9]{12}\d{2}$/.test(c) || /^(\d)\1{13}$/.test(c)) return false;
  const val = (ch: string) => ch.charCodeAt(0) - 48;
  const check = (len: number) => {
    let sum = 0;
    let w = len - 7; // pesos 5..2,9..2 (12) e 6..2,9..2 (13)
    for (let i = 0; i < len; i++) {
      sum += val(c[i]) * w;
      w = w === 2 ? 9 : w - 1;
    }
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return check(12) === Number(c[12]) && check(13) === Number(c[13]);
}

/** Valor vazio não é validado aqui (deixe o `Validators.required` cuidar disso). */
const isEmpty = (v: unknown) => v === null || v === undefined || String(v).trim() === '';

/**
 * Validadores de documentos brasileiros. Todos aceitam o valor com ou sem máscara
 * e ignoram vazio (combine com `Validators.required` se for obrigatório).
 *
 * ```ts
 * documento: ['', [Validators.required, AppValidators.cpfOrCnpj()]]
 * ```
 */
export const AppValidators = {
  /** erro `{ cpf: true }` */
  cpf(): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null =>
      isEmpty(c.value) || isValidCpf(c.value) ? null : { cpf: true };
  },

  /** erro `{ cnpj: true }` (numérico ou alfanumérico) */
  cnpj(): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null =>
      isEmpty(c.value) || isValidCnpj(c.value) ? null : { cnpj: true };
  },

  /** CPF (11 dígitos) ou CNPJ (14 caracteres); erro `{ cpfCnpj: true }` */
  cpfOrCnpj(): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      if (isEmpty(c.value)) return null;
      const len = onlyAlnum(c.value).length;
      const ok = len === 11 ? isValidCpf(c.value) : len === 14 ? isValidCnpj(c.value) : false;
      return ok ? null : { cpfCnpj: true };
    };
  },
};
