import { Component, ChangeDetectionStrategy, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

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
      providers: [provideZonelessChangeDetection()]
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

  it('hrefs point to the demo route, not to a bare "#id" (which <base href> sends to another page)', () => {
    for (const id of ['stepper', 'table', 'pagination', 'toast', 'select', 'checkbox', 'treeselect', 'actionbar', 'dialog', 'button', 'main']) {
      expect(link(id).getAttribute('href')).toBe(`demo#${id}`);
    }
    expect(link('top').getAttribute('href')).toBe('demo');
  });

  it('a normal click scrolls in place, updates the hash and focuses the section (no navigation)', () => {
    const ev = click(link('toast'));

    expect(ev.defaultPrevented).toBe(true);
    expect(scrolled).toEqual(['toast']);
    expect(location.hash).toBe('#toast');
    expect(document.activeElement?.id).toBe('toast');
  });

  it('the skip link focuses <main>', () => {
    click(link('main'));
    expect(document.activeElement?.id).toBe('main');
  });

  it('the brand goes back to the top and clears the hash', () => {
    click(link('toast'));
    click(link('top'));
    expect(scrolled).toEqual(['toast', 'top']);
    expect(location.hash).toBe('');
  });

  it('ctrl/cmd-click is left to the browser (open in a new tab)', () => {
    const ev = click(link('toast'), { ctrlKey: true });
    expect(ev.defaultPrevented).toBe(false);
    expect(scrolled).toEqual([]);
  });

  it('a link whose target does not exist falls back to the normal link', () => {
    const ev = click(link('stepper')); // não há #stepper nesta página de teste
    expect(ev.defaultPrevented).toBe(false);
  });
});
