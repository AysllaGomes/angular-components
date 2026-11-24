/** Tipos públicos do Select. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- padrão público: sem tipar, o uso continua funcionando; quem tipa ganha a checagem
export interface SelectOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  /**
   * Nome do grupo (opcional). Opções com o mesmo `group` aparecem juntas sob um
   * título, na ordem em que o grupo aparece pela primeira vez na lista.
   */
  group?: string;
}

export type ResponsiveMode = 'auto' | 'menu' | 'sheet';
