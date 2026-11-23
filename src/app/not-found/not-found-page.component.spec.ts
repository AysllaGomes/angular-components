import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { expectNoA11yViolations } from '../../testing/axe';
import { NotFoundPageComponent } from './not-found-page.component';

describe('NotFoundPageComponent', () => {
  let fixture: ComponentFixture<NotFoundPageComponent>;
  let el: HTMLElement;
  let initialUrl: string;
  const settle = async () => { fixture.detectChanges(); await fixture.whenStable(); };
  const btn = (text: string) => Array.from(el.querySelectorAll<HTMLAnchorElement>('a.btn')).find(a => a.textContent!.includes(text))!;
  const type = async (value: string) => {
    const input = el.querySelector<HTMLInputElement>('#nf-q')!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await settle();
  };

  /** a página lê o endereço da barra do navegador */
  async function open(path: string) {
    history.replaceState(null, '', path);
    await TestBed.configureTestingModule({
      imports: [NotFoundPageComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])]
    }).compileComponents();
    fixture = TestBed.createComponent(NotFoundPageComponent);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(() => { initialUrl = location.href; });
  afterEach(() => {
    fixture?.destroy();
    history.replaceState(null, '', initialUrl);
  });

  it('says what happened and shows the typed address', async () => {
    await open('/angular-components/precos?ref=x');
    expect(el.querySelector('h1')!.textContent).toContain('Esta página não existe');
    expect(el.querySelector('.address code')!.textContent).toBe('/angular-components/precos?ref=x');
    expect(TestBed.inject(Title).getTitle()).toBe('Página não encontrada · Angular Components');
  });

  it('asks search engines not to index it, and removes that when leaving', async () => {
    await open('/xyz');
    expect(document.querySelector('meta[name="robots"]')!.getAttribute('content')).toBe('noindex');
    fixture.destroy();
    expect(document.querySelector('meta[name="robots"]')).toBeNull();
  });

  it('suggests the component the address looks like, linking to its demo section', async () => {
    await open('/angular-components/tabla');
    const aside = el.querySelector('aside.suggestion')!;
    expect(aside.textContent).toContain('Você quis dizer Tabela?');
    expect(aside.querySelector('a')!.getAttribute('href')).toBe('/componentes/table');
    // um botão cheio por vez: com a sugestão, "início" vira secundário
    expect(btn('Ir para o início').classList).not.toContain('btn--primary');
  });

  it('without a suggestion, "home" is the main way out', async () => {
    await open('/xyz');
    expect(el.querySelector('aside.suggestion')).toBeNull();
    expect(btn('Ir para o início').classList).toContain('btn--primary');
    expect(btn('Ir para o início').getAttribute('href')).toBe('/');
  });

  it('search filters by name or alias, announcing how many are left', async () => {
    await open('/xyz');
    const count = () => el.querySelector('#nf-count')!;
    const names = () => Array.from(el.querySelectorAll('.results a span:first-child')).map(s => s.textContent!.trim());
    expect(count().getAttribute('aria-live')).toBe('polite');
    expect(count().textContent).toContain('15 componentes');

    await type('dica'); // apelido em português do Tooltip
    expect(names()).toEqual(['Tooltip']);
    expect(count().textContent).toContain('1 componente encontrado');

    await type('Paginação');
    expect(names()).toEqual(['Paginação']);

    await type('zzz');
    expect(el.querySelector('.results')).toBeNull();
    expect(el.querySelector('.empty')!.textContent).toContain('Nenhum componente com esse nome.');
  });

  it('has no accessibility violations (axe), with and without a suggestion', async () => {
    await open('/tabla');
    await expectNoA11yViolations(el);
    await type('zzz');
    await expectNoA11yViolations(el);
  });
});
