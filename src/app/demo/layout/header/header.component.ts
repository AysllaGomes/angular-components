import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { Component, HostListener, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';

import { TPipe } from '../../../shared/i18n/t.pipe';

import { Accent } from '../../../shared/model/type/accent.type';

import { I18nService } from '../../../shared/services/i18n.service';
import { ThemeService } from '../../../shared/services/theme.service';
import { SITE_COMPONENTS, SITE_GROUPS } from '../../../site/site-components';

@Component({
  selector: 'app-demo-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [TPipe, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.component.sass'
})
export class HeaderComponent {
  theme = inject(ThemeService);
  i18n  = inject(I18nService);
  private router = inject(Router);

  // estado do menu mobile
  openNav = signal(false);

  /** o painel "Componentes": os grupos do site, cada item levando à página do componente */
  readonly groups = computed(() => {
    this.i18n.lang();
    return SITE_GROUPS.map(g => ({
      id: g,
      label: this.i18n.t('nav.group.' + g),
      items: SITE_COMPONENTS.filter(c => c.group === g).map(c => ({ id: c.id, name: this.i18n.t('nav.' + c.id) })),
    }));
  });

  /** numa página de componente, "Componentes" aparece como a seção atual */
  readonly inComponents = toSignal(
    this.router.events.pipe(filter(e => e instanceof NavigationEnd), map(() => this.router.url.startsWith('/componentes/'))),
    { initialValue: this.router.url.startsWith('/componentes/') }
  );

  /** grupo aberto no desktop (só um por vez) */
  openGroup = signal<string | null>(null);

  toggleGroup(id: string) { this.openGroup.update(g => g === id ? null : id); }

  /** Tab/clique saindo do grupo fecha a lista dele */
  onGroupFocusOut(e: FocusEvent, id: string) {
    const group = e.currentTarget as HTMLElement;
    const next = e.relatedTarget as Node | null;
    if (this.openGroup() === id && next && !group.contains(next)) this.openGroup.set(null);
  }

  /** clique fora do cabeçalho fecha o grupo aberto */
  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    if (this.openGroup() && !(e.target as HTMLElement | null)?.closest('.nav')) this.openGroup.set(null);
  }

  toggleTheme() { this.theme.toggle(); }
  toggleLang()  { this.i18n.toggle(); }
  setAccent(a: 'teal'|'orange'|'violet'|'blue'|'rose') { this.theme.setAccent(a); }

  toggleMenu() { this.openNav.update(v => !v); }

  // fecha quando clicar em qualquer <a> dentro do nav
  onNavClick(e: Event) {
    const a = (e.target as HTMLElement).closest('a');
    if (a) { this.openNav.set(false); this.openGroup.set(null); }
  }

  /**
   * Links internos (`data-target`): rola até a seção na própria página.
   *
   * O `href` ("demo#toast") já é o endereço certo para nova aba/copiar link, mas
   * no clique normal não dependemos do navegador: com `<base href>` (GitHub Pages)
   * um "#toast" puro virava "/angular-components/#toast", outra página, e recarregava.
   * Aqui: rola (suave, salvo "reduzir movimento"), atualiza o # da URL sem criar
   * histórico e leva o foco para a seção (teclado e leitor de tela continuam dali).
   * Fora da demo (ex.: na home), a seção não existe na página: navega para /demo#id
   * pelo roteador, sem recarregar.
   */
  @HostListener('click', ['$event'])
  onInternalLink(e: MouseEvent) {
    const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[data-target]');
    // ctrl/cmd/shift/alt ou botão do meio: deixa o navegador abrir em nova aba/janela
    if (!a || e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

    const id = a.dataset['target']!;
    const target = document.getElementById(id);
    e.preventDefault();
    this.openNav.set(false);

    if (!target) {
      this.openGroup.set(null);
      this.router.navigate(['/demo'], { fragment: id });
      return;
    }

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth';
    history.replaceState(history.state, '', location.pathname + location.search + `#${id}`);

    target.scrollIntoView({ behavior, block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  // Esc: fecha o grupo aberto (devolvendo o foco ao botão dele) e o menu mobile
  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (e.key !== 'Escape') return;
    const open = this.openGroup();
    if (open) {
      this.openGroup.set(null);
      document.querySelector<HTMLElement>(`[aria-controls="nav-${open}"]`)?.focus();
    }
    this.openNav.set(false);
  }
}
