/** Tipos públicos do Radio. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- padrão público: sem tipar, o uso continua funcionando; quem tipa ganha a checagem
export interface RadioOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  /** texto de apoio abaixo do rótulo da opção (ex.: preço, detalhe) */
  description?: string;
}
