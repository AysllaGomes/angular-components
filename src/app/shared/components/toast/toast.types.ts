/** Tipos públicos do Toast. */

export type ToastKind = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
  duration?: number;         // ms (0 = não auto-fecha)
  dismissible?: boolean;     // default: true
  actionLabel?: string;
  onAction?: () => void;
}
