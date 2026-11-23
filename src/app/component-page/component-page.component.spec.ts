import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { expectNoA11yViolations } from '../../testing/axe';
import { A11yReport } from '../site/a11y-report';
import { SAMPLE_REPORT } from '../../testing/a11y-report.sample';
import { ComponentPageComponent } from './component-page.component';


describe('ComponentPageComponent', () => {
  let fixture: ComponentFixture<ComponentPageComponent>;
  let el: HTMLElement;
  const settle = async () => { await new Promise(r => setTimeout(r)); fixture.detectChanges(); await fixture.whenStable(); };

  async function open(id: string, report: A11yReport | null = SAMPLE_REPORT) {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(report
      ? { ok: true, json: async () => report }
      : { ok: false, status: 404 }));
    await TestBed.configureTestingModule({
      imports: [ComponentPageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id })) } },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ComponentPageComponent);
    el = fixture.nativeElement;
    await fixture.whenStable();
    await settle();
  }

  afterEach(() => {
    fixture?.destroy();
    vi.unstubAllGlobals();
  });

  it('shows the component, with the sections from its docs', async () => {
    await open('tabs');
    expect(el.querySelector('h1')!.textContent!.trim()).toBe('Tabs');
    expect(el.querySelector('.lead')!.textContent).toContain('WAI-ARIA');
    for (const id of ['exemplo', 'por-que', 'quando-usar', 'api', 'acessibilidade', 'copiar', 'tema']) {
      expect(el.querySelector('#' + id), id).not.toBeNull();
    }
    expect(el.querySelector('#quando-usar a[href="/componentes/stepper"]')).not.toBeNull();
    expect(TestBed.inject(Title).getTitle()).toBe('Tabs · Angular Components');
  });

  it('live example and code: the same example, toggled', async () => {
    await open('tabs');
    expect(el.querySelector('#exemplo .preview app-tabs')).not.toBeNull();
    const [preview, code] = Array.from(el.querySelectorAll<HTMLButtonElement>('#exemplo .toggle button'));
    expect(preview.getAttribute('aria-pressed')).toBe('true');
    code.click();
    await settle();
    expect(code.getAttribute('aria-pressed')).toBe('true');
    expect(el.querySelector('#exemplo pre')!.textContent).toContain('<app-tabs ariaLabel="Conta"');
  });

  it('API tables live in the library Tabs, one per part', async () => {
    await open('tabs');
    const tabs = Array.from(el.querySelectorAll('#api [role="tab"]')).map(t => t.textContent!.trim());
    expect(tabs).toEqual(['app-tabs', 'app-tabs · Evento', 'app-tab']);
    expect(el.querySelector('#api [role="tabpanel"] table code')!.textContent).toBe('selected');
  });

  it('accessibility: what it guarantees plus the real axe result, with the to-review items explained', async () => {
    await open('select');
    expect(el.querySelectorAll('#acessibilidade .card li').length).toBeGreaterThan(3);
    const result = el.querySelector('app-a11y-result')!;
    expect(result.querySelector('.summary')!.textContent).toContain('0 violações em 2 estados verificados');
    expect(Array.from(result.querySelectorAll('tbody th .label')).map(l => l.textContent)).toEqual(['fechado', 'aberto']);
    const reviews = Array.from(result.querySelectorAll('.reviews li')).map(l => l.textContent!);
    expect(reviews.length).toBe(2); // uma vez cada regra
    expect(reviews[0]).toContain('WCAG 2.5.3');
    expect(result.querySelector('.meta a')!.getAttribute('href')).toContain('/actions/runs/1');
  });

  it('without the report, says so instead of inventing numbers', async () => {
    await open('tabs', null);
    expect(el.querySelector('app-a11y-result')!.textContent).toContain('O relatório ainda não foi gerado');
  });

  it('what to copy, theme tokens and previous/next', async () => {
    await open('tabs');
    expect(el.querySelector('#copiar')!.textContent).toContain('components/tabs/');
    expect(el.querySelectorAll('#tema li').length).toBeGreaterThan(3);
    const [prev, next] = Array.from(el.querySelectorAll<HTMLAnchorElement>('.pn a'));
    expect(prev.getAttribute('href')).toBe('/componentes/treeselect');
    expect(next.getAttribute('href')).toBe('/componentes/dialog');
  });

  it('a component without a live example shows the code and points to the demo', async () => {
    await open('dialog');
    expect(el.querySelector('#exemplo .toggle')).toBeNull();
    expect(el.querySelector('#exemplo .note a')!.getAttribute('href')).toBe('/demo#dialog');
  });

  it('an unknown component shows the 404 page', async () => {
    await open('xyz');
    expect(el.querySelector('app-not-found-page')).not.toBeNull();
  });

  it('has no accessibility violations (axe)', async () => {
    await open('select');
    await expectNoA11yViolations(el);
  });
});
