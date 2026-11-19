/**
 * Motor de máscara de digitação (funções puras, usadas pela diretiva `appMask`).
 *
 * Tokens do padrão: `0` dígito · `A` letra · `*` letra ou dígito (em maiúsculas).
 * Qualquer outro caractere é literal ("." "/" "-" "(" ")" espaço...).
 */
const TOKENS: Record<string, RegExp> = { '0': /\d/, 'A': /[A-Za-z]/, '*': /[A-Za-z0-9]/ };

const CPF = '000.000.000-00';
/** CNPJ alfanumérico: 12 posições alfanuméricas + 2 dígitos verificadores */
const CNPJ = '**.***.***/****-00';

/** máscaras prontas; algumas mudam conforme o que já foi digitado */
export const MASKS = {
  cpf: CPF,
  cnpj: CNPJ,
  /** CPF até 11 dígitos; vira CNPJ ao passar disso ou ao digitar uma letra */
  cpfCnpj: (v: string) => (/[A-Za-z]/.test(v) || v.replace(/[^A-Za-z0-9]/g, '').length > 11 ? CNPJ : CPF),
  /** fixo (10 dígitos) ou celular (11 dígitos) */
  phone: (v: string) => (v.replace(/\D/g, '').length > 10 ? '(00) 00000-0000' : '(00) 0000-0000'),
  cep: '00000-000',
  date: '00/00/0000',
} as const;

export type MaskName = keyof typeof MASKS;
/** nome de uma máscara pronta ou um padrão próprio (ex.: `'000-AAA'`) */
export type MaskSpec = MaskName | (string & {});

/** padrão efetivo para o valor atual */
export function resolvePattern(spec: MaskSpec, value: string): string {
  const m = (MASKS as Record<string, string | ((v: string) => string)>)[spec];
  if (m === undefined) return spec;
  return typeof m === 'function' ? m(value) : m;
}

/** o padrão só aceita dígitos? (para `inputmode="numeric"`) */
export function isNumericPattern(pattern: string): boolean {
  return [...pattern].every(ch => !(ch in TOKENS) || ch === '0');
}

/**
 * Aplica o padrão ao texto: descarta o que não cabe no token da vez e insere os
 * literais. Devolve o texto formatado e o "cru" (só o que preencheu tokens).
 */
export function applyMask(value: string, pattern: string): { masked: string; raw: string } {
  const chars = [...value].filter(ch => /[A-Za-z0-9]/.test(ch));
  let masked = '';
  let raw = '';
  let j = 0;
  for (const p of pattern) {
    if (j >= chars.length) break;
    const token = TOKENS[p];
    if (!token) { masked += p; continue; }
    while (j < chars.length && !token.test(chars[j])) j++; // pula o que não serve aqui
    if (j >= chars.length) break;
    const ch = p === '*' ? chars[j].toUpperCase() : chars[j];
    masked += ch;
    raw += ch;
    j++;
  }
  // não termina com separador solto ("123." quando o resto não cabia no token)
  return { masked: masked.replace(/[^A-Za-z0-9]+$/, ''), raw };
}

/** posição no texto formatado logo após o n-ésimo caractere "de conteúdo" */
export function caretAfter(masked: string, contentCount: number): number {
  if (contentCount <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < masked.length; i++) {
    if (/[A-Za-z0-9]/.test(masked[i]) && ++seen === contentCount) return i + 1;
  }
  return masked.length;
}
