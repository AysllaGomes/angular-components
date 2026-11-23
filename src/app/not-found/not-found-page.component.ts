import { ChangeDetectionStrategy, Component, DOCUMENT, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';

import { TPipe } from '../site/i18n/t.pipe';
import { I18nService } from '../site/services/i18n.service';
import { HeaderComponent } from '../site/layout/header/header.component';
import { FooterComponent } from '../site/layout/footer/footer.component';
import { SITE_COMPONENTS, normalizeText, suggestComponent } from '../site/site-components';

/**
 * Página 404 (rota "**"): diz o que aconteceu, mostra o endereço digitado, sugere o
 * componente que ele parece pedir ("/tabla" → Tabela) e oferece busca e caminhos.
 * O status 404 vem do GitHub Pages (404.html); aqui é só a página.
 */
@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, TPipe, HeaderComponent, FooterComponent],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPageComponent {
  private readonly i18n = inject(I18nService);
  private readonly doc = inject(DOCUMENT);

  /** o endereço como está na barra do navegador (no servidor, o do roteador) */
  readonly path = this.doc.location?.pathname
    ? this.doc.location.pathname + this.doc.location.search
    : inject(Router).url;

  readonly suggestion = suggestComponent(this.path);
  readonly suggestionName = computed(() => (this.suggestion ? this.i18n.t('nav.' + this.suggestion.id) : ''));

  readonly query = signal('');

  /** filtra pelo nome no idioma atual ou pelos apelidos (PT/EN), sem acento */
  readonly results = computed(() => {
    const q = normalizeText(this.query());
    this.i18n.lang();
    return SITE_COMPONENTS
      .map(c => ({ id: c.id, name: this.i18n.t('nav.' + c.id), aliases: c.aliases }))
      .filter(c => !q || normalizeText(c.name).includes(q) || c.aliases.some(a => a.includes(q)));
  });

  readonly countText = computed(() => {
    const n = this.results().length;
    if (!normalizeText(this.query())) return this.i18n.t('notfound.search.all', { n });
    return n === 1 ? this.i18n.t('notfound.search.one') : this.i18n.t('notfound.search.many', { n });
  });

  constructor() {
    // título da aba no idioma atual (as outras rotas têm título fixo no roteador)
    const title = inject(Title);
    effect(() => title.setTitle(this.i18n.t('notfound.title')));

    // buscadores não devem guardar a página de erro
    const meta = inject(Meta);
    meta.updateTag({ name: 'robots', content: 'noindex' });
    inject(DestroyRef).onDestroy(() => meta.removeTag('name="robots"'));
  }

  onQuery(e: Event) {
    this.query.set((e.target as HTMLInputElement).value);
  }
}
