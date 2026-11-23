/** Tipos públicos do Checkbox group. */

/** Opção do `app-checkbox-group`. */
export interface CheckboxOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  /** texto de apoio abaixo do rótulo da opção (ex.: detalhe, preço) */
  description?: string;
}
