import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';

import { DICT } from '../i18n/dict';

import { LANGS, Lang } from '../i18n/i18n.types';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private _lang = signal<Lang>(this.load());
  lang = this._lang.asReadonly();

  constructor() {
    // mantém <html lang> em sincronia (leitores de tela, hifenização, tradutores)
    if (this.isBrowser) {
      const doc = inject(DOCUMENT);
      effect(() => {
        doc.documentElement.lang = this._lang() === 'en' ? 'en' : 'pt-BR';
      });
    }
  }

  /** a chave existe no dicionário? */
  has(key: string): boolean { return key in DICT; }

  t(key: string, params?: Record<string, string | number>): string {
    const entry = DICT[key];
    let text = entry ? entry[this._lang()] : key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v));
      }
    }
    return text;
  }

  set(l: Lang) {
    this._lang.set(l);
    if (this.isBrowser) {
      try { localStorage.setItem('demo-lang', l); } catch { /* sem storage (modo privado): só não lembra */ }
    }
  }

  toggle() { this.set(this._lang() === 'pt' ? 'en' : 'pt'); }

  private load(): Lang {
    if (this.isBrowser) {
      try {
        const v = localStorage.getItem('demo-lang');
        if (LANGS.includes(v as Lang)) return v as Lang;
      } catch { /* sem storage: usa o padrão */ }
    }
    return 'pt';
  }
}
