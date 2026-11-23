import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { expectNoA11yViolations } from '../../testing/axe';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let fixture: ComponentFixture<HomePageComponent>;
  let el: HTMLElement;
  const settle = async () => { fixture.detectChanges(); await fixture.whenStable(); };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])]
    }).compileComponents();
    fixture = TestBed.createComponent(HomePageComponent);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('one h1, with the main message, and calls to action', () => {
    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('h1')!.textContent).toContain('sem nenhuma dependência além do Angular');
    expect(el.querySelector('a.btn--link')!.getAttribute('href')).toBe('/demo');
  });

  it('the showcase is the real Table (with selection and pagination)', () => {
    const table = el.querySelector('app-home-showcase app-table')!;
    expect(table.querySelectorAll('tbody tr').length).toBe(3); // 3 por página
    expect(table.querySelector('app-table-footer')).not.toBeNull();
    expect(table.querySelector('app-table-bulk-bar')!.textContent).toContain('2');
  });

  it('the catalog lists the 15 components, each linking to its demo section by name', () => {
    const links = Array.from(el.querySelectorAll<HTMLAnchorElement>('#componentes .item a'));
    expect(links.length).toBe(15);
    expect(links[0].getAttribute('href')).toBe('/componentes/table');
    expect(links[0].textContent).toContain('Tabela');
    expect(new Set(links.map(a => a.textContent!.trim())).size).toBe(15); // nomes distintos para o leitor de tela
  });

  it('the two views are real tabs', async () => {
    const tabs = Array.from(el.querySelectorAll<HTMLElement>('#como-usar [role="tab"]'));
    expect(tabs.map(t => t.textContent!.trim())).toEqual(['Para quem vai usar', 'Como foi feito']);
    expect(el.querySelector('#como-usar [role="tabpanel"]')!.textContent).toContain('provideUiLabels(UI_LABELS_PT)');

    tabs[1].click();
    await settle();
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(el.querySelector('#como-usar [role="tabpanel"]:not([hidden])')!.textContent).toContain('WCAG 1.4.13');
  });

  it('has no accessibility violations (axe)', async () => {
    await expectNoA11yViolations(el);
  });
});
