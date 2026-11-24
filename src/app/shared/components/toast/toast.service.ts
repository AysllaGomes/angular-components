import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';

import { ToastKind, Toast } from './toast.types';

/** tempo de um toast: corre, ou fica parado (pausa) guardando quanto faltava */
interface ToastTimer {
  handle: ReturnType<typeof setTimeout> | null;
  remaining: number;
  startedAt: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private readonly _toasts = signal<Toast[]>([]);
  /** pilha atual, do mais novo para o mais antigo (só leitura: use os métodos) */
  readonly toasts = this._toasts.asReadonly();

  private id = 0;
  private timers = new Map<number, ToastTimer>();
  private paused = false;
  private MAX = 5;

  /**
   * Mostra um toast. `duration` padrão: 4000 ms; com `actionLabel`, 0 (fica até a pessoa
   * agir ou fechar), porque uma ação que some sozinha pode não dar tempo (WCAG 2.2.1).
   */
  show(message: string, kind: ToastKind = 'info', opt: Partial<Toast> = {}) {
    const id = ++this.id;
    const t: Toast = {
      id, kind, message,
      duration: opt.duration ?? (opt.actionLabel ? 0 : 4000),
      dismissible: opt.dismissible ?? true,
      actionLabel: opt.actionLabel,
      onAction: opt.onAction
    };

    const next = [t, ...this._toasts()];
    // o que passou do limite sai, sem deixar timer para trás
    for (const old of next.slice(this.MAX)) this.clearTimer(old.id);
    this._toasts.set(next.slice(0, this.MAX));

    if (t.duration! > 0 && this.isBrowser) this.startTimer(id, t.duration!);
    return id;
  }

  success(m: string, opt: Partial<Toast> = {}) { return this.show(m, 'success', opt); }
  error(m: string, opt: Partial<Toast> = {})   { return this.show(m, 'error', opt); }
  info(m: string, opt: Partial<Toast> = {})    { return this.show(m, 'info', opt); }
  warning(m: string, opt: Partial<Toast> = {}) { return this.show(m, 'warning', opt); }

  dismiss(id: number) {
    this.clearTimer(id);
    this._toasts.set(this._toasts().filter(t => t.id !== id));
  }

  clear() {
    this._toasts().forEach(t => this.dismiss(t.id));
  }

  /**
   * Para o tempo de todos os toasts (o container chama enquanto o mouse está sobre um
   * toast ou o foco está na pilha). Toasts novos durante a pausa também esperam.
   */
  pause() {
    if (this.paused) return;
    this.paused = true;
    const now = Date.now();
    for (const t of this.timers.values()) {
      if (t.handle === null) continue;
      clearTimeout(t.handle);
      t.handle = null;
      t.remaining = Math.max(0, t.remaining - (now - t.startedAt));
    }
  }

  /** Retoma o tempo de cada toast de onde parou. */
  resume() {
    if (!this.paused) return;
    this.paused = false;
    for (const [id, t] of this.timers) this.run(id, t);
  }

  private startTimer(id: number, ms: number) {
    const t: ToastTimer = { handle: null, remaining: ms, startedAt: 0 };
    this.timers.set(id, t);
    if (!this.paused) this.run(id, t);
  }

  private run(id: number, t: ToastTimer) {
    t.startedAt = Date.now();
    t.handle = setTimeout(() => this.dismiss(id), t.remaining);
  }

  private clearTimer(id: number) {
    const t = this.timers.get(id);
    if (t?.handle) clearTimeout(t.handle);
    this.timers.delete(id);
  }
}
