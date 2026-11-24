/** Tipos públicos do Checkbox group. */

/** Opção do `app-checkbox-group`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- padrão público: sem tipar, o uso continua funcionando; quem tipa ganha a checagem
export interface CheckboxOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  /** texto de apoio abaixo do rótulo da opção (ex.: detalhe, preço) */
  description?: string;
}
