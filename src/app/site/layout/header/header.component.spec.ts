import { Component, ChangeDetectionStrategy, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { HeaderComponent } from './header.component';

/** Página mínima: o header + as seções-alvo dos links internos. */
@Component({
  imports: [HeaderComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-demo-header />
    <main id="main" tabindex="-1">
      <section id="toast" class="demo-section">Toast</section>
      <section id="button" class="demo-section">Button</section>
    </main>
  `
})
class PageComponent {}

describe('HeaderComponent internal links', () => {
  let fixture: ComponentFixture<PageComponent>;
  let el: HTMLElement;
  let scrolled: string[];
  let initialUrl: string;
  const originalScrollIntoView = Element.prototype.scrollIntoView;
  const originalScrollTo = window.scrollTo;

  const link = (target: string) => el.querySelector<HTMLAnchorElement>(`a[data-target="${target}"]`)!;
  const click = (a: HTMLElement, init: MouseEventInit = {}) => {
    const ev = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...init });
    a.dispatchEvent(ev);
    return ev;
  };

  beforeEach(async () => {
    initialUrl = location.href;
    scrolled = [];
    // jsdom não implementa rolagem: registra quem pediu
    Element.prototype.scrollIntoView = function (this: Element) { scrolled.push(this.id); };
    window.scrollTo = (() => scrolled.push('top')) as typeof window.scrollTo;

    await TestBed.configureTestingModule({
      imports: [PageComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])]
    }).compileComponents();
    fixture = TestBed.createComponent(PageComponent);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
    history.replaceState(null, '', initialUrl);
    Element.prototype.scrollIntoView = originalScrollIntoView;
    window.scrollTo = originalScrollTo;
  });

  it('the skip link points to the demo route, not to a bare "#main" (which <base href> sends to another page)', () => {
    expect(link('main').getAttribute('href')).toBe('demo#main');
  });

  it('the brand leads to the home page', () => {
    expect(el.querySelector('a.brand')!.getAttribute('href')).toBe('/');
  });

  it('the skip link focuses <main> in place, without navigating', () => {
    const ev = click(link('main'));
    expect(ev.defaultPrevented).toBe(true);
    expect(scrolled).toEqual(['main']);
    expect(document.activeElement?.id).toBe('main');
  });

  it('ctrl/cmd-click is left to the browser (open in a new tab)', () => {
    const ev = click(link('main'), { ctrlKey: true });
    expect(ev.defaultPrevented).toBe(false);
    expect(scrolled).toEqual([]);
  });

  it('a page without <main> sends the skip link to /demo#main through the router', () => {
    document.getElementById('main')!.id = 'other';
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const ev = click(link('main'));
    expect(ev.defaultPrevented).toBe(true);
    expect(navigate).toHaveBeenCalledWith(['/demo'], { fragment: 'main' });
  });

  it('direct links to the demo and to the accessibility page', () => {
    const links = Array.from(el.querySelectorAll<HTMLAnchorElement>('nav > a.nav-link')).map(a => a.getAttribute('href'));
    expect(links).toEqual(['/demo', '/acessibilidade']);
  });

  describe('"Components" menu (disclosure navigation)', () => {
    const btn = () => el.querySelector<HTMLButtonElement>('button[aria-controls="nav-components"]')!;
    const isOpen = () => btn().closest('.group')!.classList.contains('is-open');
    const pageLink = (id: string) => el.querySelector<HTMLAnchorElement>(`#nav-components a[href="/componentes/${id}"]`)!;

    it('lists every component page, in labelled groups', () => {
      expect(btn().getAttribute('aria-expanded')).toBe('false');
      const lists = Array.from(el.querySelectorAll('#nav-components ul'));
      expect(lists.length).toBe(4);
      for (const ul of lists) expect(el.querySelector('#' + ul.getAttribute('aria-labelledby'))!.textContent).toBeTruthy();
      expect(el.querySelectorAll('#nav-components a').length).toBe(15);
      expect(pageLink('treeselect')).not.toBeNull();
      expect(pageLink('table').textContent).toBe('Tabela');
    });

    it('the button opens and closes the panel', async () => {
      btn().click();
      await fixture.whenStable();
      expect(btn().getAttribute('aria-expanded')).toBe('true');
      expect(isOpen()).toBe(true);
      btn().click();
      await fixture.whenStable();
      expect(isOpen()).toBe(false);
    });

    it('Escape closes it and returns focus to the button', async () => {
      btn().click();
      await fixture.whenStable();
      pageLink('toast').focus();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await fixture.whenStable();
      expect(isOpen()).toBe(false);
      expect(document.activeElement).toBe(btn());
    });

    it('choosing a component closes the panel', async () => {
      btn().click();
      await fixture.whenStable();
      pageLink('toast').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true }));
      await fixture.whenStable();
      expect(isOpen()).toBe(false);
    });

    it('focus leaving the panel (Tab) closes it; clicking outside too', async () => {
      btn().click();
      await fixture.whenStable();
      btn().closest('.group')!.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: el.querySelector('a.nav-link') }));
      await fixture.whenStable();
      expect(isOpen()).toBe(false);

      btn().click();
      await fixture.whenStable();
      document.getElementById('toast')!.click();
      await fixture.whenStable();
      expect(isOpen()).toBe(false);
    });
  });
});
