import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TPipe } from '../../site/i18n/t.pipe';
import { I18nService } from '../../site/services/i18n.service';
import { A11yReportService, a11yTotals } from '../../site/a11y-report';

/**
 * Resultado do axe de um componente, lido do relatório que os testes gravam no deploy:
 * resumo, uma barra por estado (regras ok / para revisar / violações) e a explicação
 * de cada item que ficou para revisão manual.
 */
@Component({
  selector: 'app-a11y-result',
  imports: [RouterLink, TPipe],
  templateUrl: './a11y-result.component.html',
  styleUrl: './a11y-result.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class A11yResultComponent {
  readonly componentId = input.required<string>();

  private readonly i18n = inject(I18nService);
  private readonly service = inject(A11yReportService);
  readonly state = this.service.state;

  constructor() {
    this.service.load();
  }

  readonly states = computed(() => {
    const s = this.state();
    return s.status === 'ready' ? s.report.components[this.componentId()]?.states ?? [] : [];
  });

  readonly totals = computed(() => a11yTotals(this.states()));

  /** barras proporcionais ao maior número de regras do componente */
  readonly rows = computed(() => {
    const lang = this.i18n.lang();
    const states = this.states();
    const max = Math.max(1, ...states.map(s => s.passes + s.incomplete + s.violations));
    return states.map(s => ({
      label: s.state[lang],
      passes: s.passes,
      review: s.incomplete,
      violations: s.violations,
      passesPct: (s.passes / max) * 100,
      reviewPct: (s.incomplete / max) * 100,
      violationsPct: (s.violations / max) * 100,
    }));
  });

  /** regras que ficaram para revisar, uma vez cada, com a explicação */
  readonly reviews = computed(() => {
    const ids = [...new Set(this.states().flatMap(s => s.needsReview))];
    return ids.map(id => {
      const key = 'a11y.review.' + id;
      const text = this.i18n.t(key);
      return { id, text: text === key ? this.i18n.t('a11y.review.default') : text };
    });
  });

  readonly meta = computed(() => {
    const s = this.state();
    if (s.status !== 'ready') return null;
    const lang = this.i18n.lang();
    const date = new Intl.DateTimeFormat(lang === 'en' ? 'en' : 'pt-BR', { dateStyle: 'medium' }).format(new Date(s.report.generatedAt));
    return { text: this.i18n.t('a11y.report.meta', { version: s.report.axeVersion, date }), runUrl: s.report.runUrl };
  });
}
