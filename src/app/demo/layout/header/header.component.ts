import { NgIf } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';

import { TPipe } from '../../../shared/i18n/t.pipe';

import { Accent } from '../../../shared/model/type/accent.type';

import { I18nService } from '../../../shared/services/i18n.service';
import { ThemeService } from '../../../shared/services/theme.service';

@Component({
  selector: 'app-demo-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    NgIf,
    TPipe,
  ],
  styleUrl: './header.component.sass'
})
export class HeaderComponent {
  theme = inject(ThemeService);
  i18n  = inject(I18nService);

  // estado do menu mobile
  openNav = signal(false);

  toggleTheme() { this.theme.toggle(); }
  toggleLang()  { this.i18n.toggle(); }
  setAccent(a: 'teal'|'orange'|'violet'|'blue'|'rose') { this.theme.setAccent(a); }

  toggleMenu() { this.openNav.update(v => !v); }

  // fecha quando clicar em qualquer <a> dentro do nav
  onNavClick(e: Event) {
    const a = (e.target as HTMLElement).closest('a');
    if (a) this.openNav.set(false);
  }

  // fecha com Esc
  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') this.openNav.set(false);
  }
}
