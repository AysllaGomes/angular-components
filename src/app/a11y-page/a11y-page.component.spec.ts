import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { expectNoA11yViolations } from '../../testing/axe';
import { A11yReport } from '../site/a11y-report';
import { SAMPLE_REPORT } from '../../testing/a11y-report.sample';
import { A11yPageComponent } from './a11y-page.component';

describe('A11yPageComponent', () => {
  let fixture: ComponentFixture<A11yPageComponent>;
  let el: HTMLElement;

  async function open(report: A11yReport | null) {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(report ? { ok: true, json: async () => report } : { ok: false, status: 404 }));
    await TestBed.configureTestingModule({
      imports: [A11yPageComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])]
    }).compileComponents();
    fixture = TestBed.createComponent(A11yPageComponent);
    el = fixture.nativeElement;
    await fixture.whenStable();
    await new Promise(r => setTimeout(r));
    fixture.detectChanges();
    await fixture.whenStable();
  }

  afterEach(() => {
    fixture?.destroy();
    vi.unstubAllGlobals();
  });

  it('totals and one row per component, linking to its page', async () => {
    await open(SAMPLE_REPORT);
    const stats = Array.from(el.querySelectorAll('.stats strong')).map(s => s.textContent);
    expect(stats).toEqual(['2', '3', '0', '3']); // componentes, estados, violações, para revisar
    const rows = Array.from(el.querySelectorAll('tbody tr'));
    expect(rows.length).toBe(2);
    expect(rows[0].querySelector('a')!.getAttribute('href')).toBe('/componentes/select#acessibilidade');
    expect(el.textContent).toContain('color-contrast');
  });

  it('without the report, says so', async () => {
    await open(null);
    expect(el.textContent).toContain('O relatório ainda não foi gerado');
    expect(el.querySelector('table')).toBeNull();
  });

  it('has no accessibility violations (axe)', async () => {
    await open(SAMPLE_REPORT);
    await expectNoA11yViolations(el);
  });
});
