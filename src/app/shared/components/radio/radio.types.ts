/** Tipos públicos do Radio. */

export interface RadioOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  /** texto de apoio abaixo do rótulo da opção (ex.: preço, detalhe) */
  description?: string;
}
