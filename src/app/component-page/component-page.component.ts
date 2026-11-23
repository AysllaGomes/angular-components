import { NgComponentOutlet, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, DOCUMENT, PLATFORM_ID, afterNextRender, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { TPipe } from '../site/i18n/t.pipe';
import { I18nService } from '../site/services/i18n.service';
import { TABS_IMPORTS } from '../shared/components/tabs';
import { HeaderComponent } from '../site/layout/header/header.component';
import { FooterComponent } from '../site/layout/footer/footer.component';
import { NotFoundPageComponent } from '../not-found/not-found-page.component';
import { COMPONENT_DOCS } from '../site/component-docs.generated';
import { SITE_COMPONENTS, SITE_GROUPS } from '../site/site-components';
import { LIVE_EXAMPLES } from './examples/examples';
import { A11yResultComponent } from './a11y-result/a11y-result.component';

/**
 * Página de um componente (/componentes/:id): por que existe, quando usar, exemplo,
 * API, acessibilidade (com o relatório do axe), o que copiar e tema. O texto vem
 * dos .md (component-docs.generated.ts); id desconhecido mostra a página 404.
 */
@Component({
  selector: 'app-component-page',
  imports: [
    RouterLink, NgComponentOutlet, TPipe, ...TABS_IMPORTS,
    HeaderComponent, FooterComponent, NotFoundPageComponent, A11yResultComponent
  ],
  templateUrl: './component-page.component.html',
  styleUrl: './component-page.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentPageComponent {
  private readonly i18n = inject(I18nService);
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly id = toSignal(inject(ActivatedRoute).paramMap.pipe(map(p => p.get('id') ?? '')), { initialValue: '' });
  readonly docs = computed(() => COMPONENT_DOCS[this.id()] ?? null);
  /** os textos no idioma da página */
  readonly page = computed(() => {
    const d = this.docs();
    return d ? d[this.i18n.lang()] : null;
  });
  readonly name = computed(() => this.i18n.t('nav.' + this.id()));
  readonly example = computed(() => LIVE_EXAMPLES[this.id()] ?? null);

  /** menu lateral: os grupos do cabeçalho, com o componente atual marcado */
  readonly groups = computed(() => {
    this.i18n.lang();
    return SITE_GROUPS.map(g => ({
      id: g,
      label: this.i18n.t('nav.group.' + g),
      items: SITE_COMPONENTS.filter(c => c.group === g).map(c => ({ id: c.id, name: this.i18n.t('nav.' + c.id) })),
    }));
  });

  readonly prevNext = computed(() => {
    this.i18n.lang();
    const i = SITE_COMPONENTS.findIndex(c => c.id === this.id());
    const at = (j: number) => {
      const c = SITE_COMPONENTS[(j + SITE_COMPONENTS.length) % SITE_COMPONENTS.length];
      return { id: c.id, name: this.i18n.t('nav.' + c.id) };
    };
    return { prev: at(i - 1), next: at(i + 1) };
  });

  /** atalhos da coluna "Nesta página" (só as seções que existem) */
  readonly toc = computed(() => {
    const p = this.page();
    if (!p) return [];
    return [
      { id: 'exemplo', key: 'cp.example', show: true },
      { id: 'por-que', key: 'cp.why', show: p.why.length > 0 },
      { id: 'quando-usar', key: 'cp.when', show: p.useWhen.length + p.preferOther.length > 0 },
      { id: 'api', key: 'cp.api', show: p.api.length > 0 },
      { id: 'acessibilidade', key: 'cp.a11y', show: true },
      { id: 'copiar', key: 'cp.copy', show: !!p.copy },
      { id: 'tema', key: 'cp.theme', show: p.tokens.length > 0 },
    ].filter(x => x.show);
  });

  readonly view = signal<'preview' | 'code'>('preview');
  readonly apiTab = signal<string | null>(null);
  readonly copied = signal(false);
  /** menu lateral aberto (fechado no celular, para o conteúdo vir logo) */
  readonly navOpen = signal(true);

  /** o caminho da pasta do componente, para copiar ("components/tabs/") */
  readonly copyPath = computed(() => {
    const first = this.page()?.copy?.rows[0]?.items[0] ?? '';
    return first.replace(/<[^>]+>/g, '');
  });

  /** linhas @use para o styles.sass, uma por linha */
  readonly globalsText = computed(() => (this.page()?.copy?.globals ?? []).join('\n'));

  constructor() {
    const title = inject(Title);
    effect(() => {
      if (this.docs()) title.setTitle(this.i18n.t('cp.title', { name: this.name() }));
    });
    // trocou de componente: volta ao exemplo e à primeira parte da API
    effect(() => {
      this.id();
      this.view.set('preview');
      this.apiTab.set(null);
      this.copied.set(false);
    });
    afterNextRender(() => {
      if (this.doc.defaultView?.matchMedia?.('(max-width: 900px)').matches) this.navOpen.set(false);
    });
  }

  onNavToggle(e: Event) {
    this.navOpen.set((e.target as HTMLDetailsElement).open);
  }

  async copyFolder() {
    const path = `src/app/shared/${this.copyPath()}`;
    if (this.isBrowser) {
      try { await navigator.clipboard?.writeText(path); } catch { /* sem permissão: o texto continua visível */ }
    }
    this.copied.set(true);
  }
}
