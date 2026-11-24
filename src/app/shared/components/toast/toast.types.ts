/** Tipos públicos do Toast. */

export type ToastKind = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
  duration?: number;         // ms; 0 = não fecha sozinho (padrão: 4000, ou 0 com actionLabel)
  dismissible?: boolean;     // default: true
  actionLabel?: string;
  onAction?: () => void;
}
