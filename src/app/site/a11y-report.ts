import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

/** um estado verificado pelo axe nos testes (ver src/testing/axe.ts) */
export interface A11yState {
  state: { pt: string; en: string };
  passes: number;
  violations: number;
  incomplete: number;
  needsReview: string[];
  nodes: number;
}

/** relatório gravado pelos testes de acessibilidade (public/a11y-report.json) */
export interface A11yReport {
  generatedAt: string;
  axeVersion: string;
  commit: string | null;
  runUrl: string | null;
  disabledRules: string[];
  components: Record<string, { states: A11yState[] }>;
}

export type A11yReportState =
  | { status: 'loading' }
  | { status: 'ready'; report: A11yReport }
  | { status: 'unavailable' };

/** totais de um componente (ou do relatório inteiro) */
export function a11yTotals(states: A11yState[]) {
  return {
    states: states.length,
    passes: states.reduce((n, s) => n + s.passes, 0),
    review: states.reduce((n, s) => n + s.incomplete, 0),
    violations: states.reduce((n, s) => n + s.violations, 0),
  };
}

/**
 * Lê o relatório publicado com o site. Só no navegador (no servidor a página sai
 * com "carregando" e o navegador completa); uma vez por visita.
 */
@Injectable({ providedIn: 'root' })
export class A11yReportService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private started = false;

  readonly state = signal<A11yReportState>({ status: 'loading' });

  load(): void {
    if (!this.isBrowser || this.started) return;
    this.started = true;
    fetch(new URL('a11y-report.json', this.doc.baseURI))
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((report: A11yReport) => this.state.set({ status: 'ready', report }))
      .catch(() => this.state.set({ status: 'unavailable' }));
  }
}
