import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { TPipe } from '../shared/i18n/t.pipe';
import { I18nService } from '../shared/services/i18n.service';
import { HeaderComponent } from '../demo/layout/header/header.component';
import { FooterComponent } from '../demo/layout/footer/footer.component';
import { A11yReportService, a11yTotals } from '../site/a11y-report';
import { SITE_COMPONENTS } from '../site/site-components';

/**
 * /acessibilidade: o relatório do axe de todos os componentes, como os testes o
 * gravaram no deploy, mais o método e o que o axe não vê.
 */
@Component({
  selector: 'app-a11y-page',
  imports: [RouterLink, TPipe, HeaderComponent, FooterComponent],
  templateUrl: './a11y-page.component.html',
  styleUrl: './a11y-page.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class A11yPageComponent {
  private readonly i18n = inject(I18nService);
  private readonly service = inject(A11yReportService);
  readonly state = this.service.state;

  constructor() {
    this.service.load();
    const title = inject(Title);
    effect(() => title.setTitle(this.i18n.t('a11y.page.title')));
  }

  /** uma linha por componente, na ordem do site */
  readonly rows = computed(() => {
    const s = this.state();
    if (s.status !== 'ready') return [];
    this.i18n.lang();
    return SITE_COMPONENTS
      .filter(c => s.report.components[c.id])
      .map(c => ({ id: c.id, name: this.i18n.t('nav.' + c.id), ...a11yTotals(s.report.components[c.id].states) }));
  });

  readonly totals = computed(() => {
    const s = this.state();
    if (s.status !== 'ready') return null;
    const all = Object.values(s.report.components).flatMap(c => c.states);
    return { components: Object.keys(s.report.components).length, ...a11yTotals(all) };
  });

  readonly meta = computed(() => {
    const s = this.state();
    if (s.status !== 'ready') return null;
    const lang = this.i18n.lang();
    const date = new Intl.DateTimeFormat(lang === 'en' ? 'en' : 'pt-BR', { dateStyle: 'medium' }).format(new Date(s.report.generatedAt));
    return {
      text: this.i18n.t('a11y.report.meta', { version: s.report.axeVersion, date }),
      runUrl: s.report.runUrl,
      disabled: s.report.disabledRules,
    };
  });
}
