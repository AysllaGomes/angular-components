import { isPlatformBrowser } from '@angular/common';
import { Injectable, effect, signal, PLATFORM_ID, inject, DOCUMENT } from '@angular/core';

import { THEMES, Theme, ACCENTS, Accent } from './theme.types';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private doc: Document | null = this.isBrowser ? inject(DOCUMENT) : null;

  readonly theme  = signal<Theme>(this.loadTheme());
  readonly accent = signal<Accent>(this.loadAccent());

  constructor() {
    if (this.isBrowser) {
      effect(() => {
        const t = this.theme();
        try {
          this.doc!.documentElement.dataset["theme"] = t;
          localStorage.setItem('demo-theme', t);
        } catch { /* sem storage: o tema vale só nesta visita */ }
      });
      effect(() => {
        const a = this.accent();
        try {
          this.doc!.documentElement.dataset["accent"] = a;
          localStorage.setItem('demo-accent', a);
        } catch { /* sem storage: a cor vale só nesta visita */ }
      });
    }
  }

  toggle() {
    this.theme.update(v => (v === 'light' ? 'dark' : 'light'));
  }

  setAccent(a: Accent) {
    this.accent.set(a);
  }

  private loadTheme(): Theme {
    return this.loadValid('demo-theme', THEMES, 'light');
  }

  private loadAccent(): Accent {
    return this.loadValid('demo-accent', ACCENTS, 'teal');
  }

  /** lê do localStorage e só aceita valores conhecidos (ignora lixo/versões antigas) */
  private loadValid<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
    if (!this.isBrowser) return fallback;
    try {
      const v = localStorage.getItem(key);
      return allowed.includes(v as T) ? (v as T) : fallback;
    } catch {
      return fallback;
    }
  }
}
