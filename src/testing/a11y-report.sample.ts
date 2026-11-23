import { A11yReport } from '../app/site/a11y-report';

/** relatório como os testes de acessibilidade gravam (public/a11y-report.json) */
export const SAMPLE_REPORT: A11yReport = {
  generatedAt: '2026-11-23T18:00:00.000Z',
  axeVersion: '4.14.0',
  commit: 'abc1234',
  runUrl: 'https://github.com/AysllaGomes/angular-components/actions/runs/1',
  disabledRules: ['color-contrast', 'region'],
  components: {
    tabs: { states: [{ state: { pt: 'contador e desabilitada', en: 'badge and disabled' }, passes: 16, violations: 0, incomplete: 0, needsReview: [], nodes: 13 }] },
    select: { states: [
      { state: { pt: 'fechado', en: 'closed' }, passes: 9, violations: 0, incomplete: 1, needsReview: ['label-content-name-mismatch'], nodes: 5 },
      { state: { pt: 'aberto', en: 'open' }, passes: 18, violations: 0, incomplete: 2, needsReview: ['label-content-name-mismatch', 'aria-valid-attr-value'], nodes: 13 },
    ] },
  },
};
