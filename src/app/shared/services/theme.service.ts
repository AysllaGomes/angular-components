import { isPlatformBrowser } from '@angular/common';
import { Injectable, effect, signal, PLATFORM_ID, inject, DOCUMENT } from '@angular/core';

import { Theme } from '../model/type/theme.type';
import {Accent} from '../model/type/accent.type';

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
        } catch {}
      });
      effect(() => {
        const a = this.accent();
        try {
          this.doc!.documentElement.dataset["accent"] = a;
          localStorage.setItem('demo-accent', a);
        } catch {}
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
    if (this.isBrowser) {
      try { return (localStorage.getItem('demo-theme') as Theme) ?? 'light'; } catch {}
    }
    return 'light';
  }

  private loadAccent(): Accent {
    if (this.isBrowser) {
      try { return (localStorage.getItem('demo-accent') as Accent) ?? 'teal'; } catch {}
    }
    return 'teal';
  }
}
