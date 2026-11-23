import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { I18nService } from './i18n.service';
import { ThemeService } from './theme.service';

const KEYS = ['demo-theme', 'demo-accent', 'demo-lang'];

describe('Stored preferences', () => {
  beforeEach(() => {
    KEYS.forEach(k => localStorage.removeItem(k));
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  afterEach(() => KEYS.forEach(k => localStorage.removeItem(k)));

  it('loads valid stored values', () => {
    localStorage.setItem('demo-theme', 'dark');
    localStorage.setItem('demo-accent', 'rose');
    localStorage.setItem('demo-lang', 'en');

    const theme = TestBed.inject(ThemeService);
    const i18n = TestBed.inject(I18nService);

    expect(theme.theme()).toBe('dark');
    expect(theme.accent()).toBe('rose');
    expect(i18n.lang()).toBe('en');
  });

  it('falls back to defaults for unknown stored values', () => {
    localStorage.setItem('demo-theme', 'neon');
    localStorage.setItem('demo-accent', 'purple');
    localStorage.setItem('demo-lang', 'fr');

    const theme = TestBed.inject(ThemeService);
    const i18n = TestBed.inject(I18nService);

    expect(theme.theme()).toBe('light');
    expect(theme.accent()).toBe('teal');
    expect(i18n.lang()).toBe('pt');
  });

  it('keeps <html lang> in sync with the current language', () => {
    const i18n = TestBed.inject(I18nService);
    TestBed.tick();
    expect(document.documentElement.lang).toBe('pt-BR');

    i18n.set('en');
    TestBed.tick();
    expect(document.documentElement.lang).toBe('en');

    i18n.set('pt');
    TestBed.tick();
    expect(document.documentElement.lang).toBe('pt-BR');
  });
});
