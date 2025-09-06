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

  // menu mobile
  openNav = signal(false);
  private BREAKPOINT = 840;

  toggleMenu() { this.openNav.update(v => !v); }
  closeMenu()  { this.openNav.set(false); }
  onNavClick(e: Event) {
    const t = e.target as HTMLElement;
    if (t.tagName.toLowerCase() === 'a') this.closeMenu();
  }

  @HostListener('window:resize')
  onResize() { if (window.innerWidth > this.BREAKPOINT && this.openNav()) this.closeMenu(); }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) { if (e.key === 'Escape' && this.openNav()) this.closeMenu(); }

  toggleTheme() { this.theme.toggle(); }
  toggleLang()  { this.i18n.toggle(); }
  setAccent(a: Accent) { this.theme.setAccent(a); }
}
