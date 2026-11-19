import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TABS_IMPORTS, TabsActivation } from './index';

let created = 0;

@Component({ selector: 'app-heavy', standalone: true, template: `pesado` })
class HeavyComponent { constructor() { created++; } }

@Component({
  imports: [...TABS_IMPORTS, HeavyComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-tabs ariaLabel="Conta" [(selected)]="sel" [activation]="activation()" [keepAlive]="keep()">
      <app-tab key="perfil" label="Perfil"><input id="nome"></app-tab>
      <app-tab key="pedidos" label="Pedidos" [badge]="3">Lista de pedidos</app-tab>
      <app-tab key="arquivo" label="Arquivo" disabled>Arquivados</app-tab>
      <app-tab key="relatorios">
        <ng-template appTabLabel let-active><b>Relatórios</b>@if (active) { <i>aberta</i> }</ng-template>
        <ng-template appTabContent><app-heavy /></ng-template>
      </app-tab>
    </app-tabs>
  `
})
class HostComponent {
  sel: string | null = null;
  activation = signal<TabsActivation>('auto');
  keep = signal(false);
}

describe('TabsComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;

  const tabs = () => Array.from(el.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const tab = (name: string) => tabs().find(t => t.textContent!.includes(name))!;
  const panels = () => Array.from(el.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
  const visible = () => panels().filter(p => !p.hidden);
  const key = async (target: HTMLElement, k: string) => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    created = 0;
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    document.body.appendChild(el); // foco precisa do elemento no documento
    await fixture.whenStable();
  });

  afterEach(() => el.remove());

  it('wires tablist, tabs and panels (WAI-ARIA)', () => {
    expect(el.querySelector('[role="tablist"]')!.getAttribute('aria-label')).toBe('Conta');
    expect(tabs().length).toBe(4);
    tabs().forEach((t, i) => {
      const panel = panels()[i];
      expect(t.getAttribute('aria-controls')).toBe(panel.id);
      expect(panel.getAttribute('aria-labelledby')).toBe(t.id);
    });
  });

  it('opens the first enabled tab by default; only its panel is visible and only it is in the Tab order', () => {
    expect(tab('Perfil').getAttribute('aria-selected')).toBe('true');
    expect(tab('Pedidos').getAttribute('aria-selected')).toBe('false');
    expect(visible()).toEqual([panels()[0]]);
    expect(tabs().map(t => t.tabIndex)).toEqual([0, -1, -1, -1]);
  });

  it('click selects and updates [(selected)]; disabled tabs cannot be selected', async () => {
    tab('Pedidos').click();
    await fixture.whenStable();
    expect(host.sel).toBe('pedidos');
    expect(visible()[0].textContent).toContain('Lista de pedidos');

    expect(tab('Arquivo').disabled).toBe(true);
  });

  it('[(selected)] from outside opens that tab; an unknown or disabled key falls back to the first enabled', async () => {
    host.sel = 'relatorios';
    fixture.changeDetectorRef.markForCheck();
    await fixture.whenStable();
    expect(tab('Relatórios').getAttribute('aria-selected')).toBe('true');

    host.sel = 'arquivo';
    fixture.changeDetectorRef.markForCheck();
    await fixture.whenStable();
    expect(tab('Perfil').getAttribute('aria-selected')).toBe('true');
  });

  it('arrows move and select (auto), skipping disabled tabs and wrapping; Home/End', async () => {
    tab('Perfil').focus();
    await key(tab('Perfil'), 'ArrowRight');
    expect(document.activeElement).toBe(tab('Pedidos'));
    expect(host.sel).toBe('pedidos');

    await key(tab('Pedidos'), 'ArrowRight'); // pula "Arquivo"
    expect(document.activeElement).toBe(tab('Relatórios'));

    await key(tab('Relatórios'), 'ArrowRight'); // volta ao início
    expect(document.activeElement).toBe(tab('Perfil'));

    await key(tab('Perfil'), 'ArrowLeft');
    expect(document.activeElement).toBe(tab('Relatórios'));

    await key(tab('Relatórios'), 'Home');
    expect(host.sel).toBe('perfil');
    await key(tab('Perfil'), 'End');
    expect(host.sel).toBe('relatorios');
    expect(tabs().map(t => t.tabIndex)).toEqual([-1, -1, -1, 0]);
  });

  it('manual activation: arrows only move focus; click (Enter/Space) opens; leaving the list resets the Tab stop', async () => {
    host.activation.set('manual');
    await fixture.whenStable();

    tab('Perfil').focus();
    await key(tab('Perfil'), 'ArrowRight');
    expect(document.activeElement).toBe(tab('Pedidos'));
    expect(tab('Perfil').getAttribute('aria-selected')).toBe('true');
    expect(tab('Pedidos').tabIndex).toBe(0); // foco "mora" na aba focada enquanto está na lista

    // sai da lista sem abrir: o Tab volta a cair na aba aberta
    (el.querySelector('#nome') as HTMLElement).focus();
    await fixture.whenStable();
    expect(tab('Perfil').tabIndex).toBe(0);
    expect(tab('Pedidos').tabIndex).toBe(-1);

    tab('Pedidos').click();
    await fixture.whenStable();
    expect(host.sel).toBe('pedidos');
  });

  it('appTabContent is created only when the tab opens and destroyed when it closes', async () => {
    expect(el.querySelector('app-heavy')).toBeNull();
    tab('Relatórios').click();
    await fixture.whenStable();
    expect(el.querySelector('app-heavy')).not.toBeNull();
    tab('Perfil').click();
    await fixture.whenStable();
    expect(el.querySelector('app-heavy')).toBeNull();
    expect(created).toBe(1);
  });

  it('keepAlive keeps appTabContent after the first visit (created once)', async () => {
    host.keep.set(true);
    await fixture.whenStable();
    expect(el.querySelector('app-heavy')).toBeNull(); // ainda não visitada

    tab('Relatórios').click();
    await fixture.whenStable();
    tab('Perfil').click();
    await fixture.whenStable();
    tab('Relatórios').click();
    await fixture.whenStable();
    expect(el.querySelector('app-heavy')).not.toBeNull();
    expect(created).toBe(1);
  });

  it('direct content is kept (hidden) when switching tabs, so its state survives', async () => {
    const nome = el.querySelector<HTMLInputElement>('#nome')!;
    nome.value = 'Ana';
    tab('Pedidos').click();
    await fixture.whenStable();
    expect(el.querySelector<HTMLInputElement>('#nome')).toBe(nome);
    expect(nome.closest<HTMLElement>('[role="tabpanel"]')!.hidden).toBe(true);
    expect(nome.value).toBe('Ana');
  });

  it('custom label template gets the active state; badge is read as "(3)" next to the name', async () => {
    expect(tab('Relatórios').querySelector('i')).toBeNull();
    tab('Relatórios').click();
    await fixture.whenStable();
    expect(tab('Relatórios').querySelector('i')!.textContent).toBe('aberta');

    const badge = tab('Pedidos').querySelector('.tabs__badge')!;
    expect(badge.getAttribute('aria-hidden')).toBe('true');
    expect(tab('Pedidos').querySelector('.tabs__sr')!.textContent).toBe(' (3)');
  });
});
