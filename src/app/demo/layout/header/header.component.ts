import { Component, HostListener, inject, signal, ChangeDetectionStrategy } from '@angular/core';

import { TPipe } from '../../../shared/i18n/t.pipe';

import { Accent } from '../../../shared/model/type/accent.type';

import { I18nService } from '../../../shared/services/i18n.service';
import { ThemeService } from '../../../shared/services/theme.service';

@Component({
  selector: 'app-demo-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    TPipe
],
  changeDetection: ChangeDetectionStrategy.Eager,
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

  /**
   * Links internos (`data-target`): rola até a seção na própria página.
   *
   * O `href` ("demo#toast") já é o endereço certo para nova aba/copiar link, mas
   * no clique normal não dependemos do navegador: com `<base href>` (GitHub Pages)
   * um "#toast" puro virava "/angular-components/#toast", outra página, e recarregava.
   * Aqui: rola (suave, salvo "reduzir movimento"), atualiza o # da URL sem criar
   * histórico e leva o foco para a seção (teclado e leitor de tela continuam dali).
   */
  @HostListener('click', ['$event'])
  onInternalLink(e: MouseEvent) {
    const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[data-target]');
    // ctrl/cmd/shift/alt ou botão do meio: deixa o navegador abrir em nova aba/janela
    if (!a || e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

    const id = a.dataset['target']!;
    const target = id === 'top' ? null : document.getElementById(id);
    if (id !== 'top' && !target) return; // alvo inexistente: segue o link normalmente

    e.preventDefault();
    this.openNav.set(false);

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth';
    history.replaceState(history.state, '', location.pathname + location.search + (target ? `#${id}` : ''));

    if (!target) { window.scrollTo({ top: 0, behavior }); return; }
    target.scrollIntoView({ behavior, block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  // fecha com Esc
  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') this.openNav.set(false);
  }
}
