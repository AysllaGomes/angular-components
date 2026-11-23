/** Tipos públicos do Stepper. */

export type StepState = 'pending' | 'active' | 'done' | 'disabled';

export interface StepItem {
  /** Texto principal da etapa */
  label: string;
  /** Texto auxiliar */
  caption?: string;
  /** Estado inicial; será recalculado se você não passar */
  state?: StepState;
  /** Id opcional para rastreio/testes */
  id?: string | number;
}
