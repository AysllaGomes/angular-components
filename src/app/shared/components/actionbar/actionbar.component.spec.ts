import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { stubLayout } from '../../../../testing/layout-stub';

import { AbSize } from '../../model/type/ab-size.type';

import { ActionBarComponent } from './actionbar.component';

@Component({
  imports: [ActionBarComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button id="ab-opener" type="button">Abrir</button>
    <p id="ab-outside">Fundo</p>
    <p id="ab-already-inert" inert>Já inerte</p>
    <p id="ab-keep" data-dialog-keep-active>Avisos</p>
    <app-actionbar title="Teste" [size]="size()" [(opened)]="opened">
      <div [style.width.px]="contentWidth()" style="height: 10px"></div>
    </app-actionbar>
  `
})
class HostComponent {
  size = signal<AbSize>('auto');
  opened = signal(false);
  contentWidth = signal(800);
}

/** Espera o ResizeObserver disparar e o Angular renderizar. */
async function settle(fixture: ComponentFixture<unknown>) {
  await new Promise(r => requestAnimationFrame(() => setTimeout(r)));
  await fixture.whenStable();
}

function sheetEl(fixture: ComponentFixture<unknown>): HTMLElement | null {
  return (fixture.nativeElement as HTMLElement).querySelector('.ab__sheet');
}

describe('ActionBarComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  let restoreLayout: () => void;

  beforeEach(async () => {
    restoreLayout = stubLayout();

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
    restoreLayout();
  });

  it('size="auto" measures content after opening (content only exists while open)', async () => {
    host.opened.set(true);
    await settle(fixture);

    // 800px de conteúdo → lg (>= 720)
    expect(sheetEl(fixture)?.classList).toContain('ab--lg');
  });

  it('applies a fixed size and reacts to size changes', async () => {
    host.size.set('sm');
    host.opened.set(true);
    await settle(fixture);
    expect(sheetEl(fixture)?.classList).toContain('ab--sm');

    host.size.set('md');
    await settle(fixture);
    expect(sheetEl(fixture)?.classList).toContain('ab--md');
  });

  describe('modal behavior (focus restore, scroll lock, inert background)', () => {
    const byId = (id: string) => document.getElementById(id) as HTMLElement;

    it('focuses the close button on open and returns focus to the opener on close', async () => {
      byId('ab-opener').focus();
      host.opened.set(true);
      await settle(fixture);
      expect(document.activeElement?.classList).toContain('ab__close');

      host.opened.set(false);
      await settle(fixture);
      expect(document.activeElement).toBe(byId('ab-opener'));
    });

    it('returns focus when closed with Esc', async () => {
      byId('ab-opener').focus();
      host.opened.set(true);
      await settle(fixture);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await settle(fixture);
      expect(host.opened()).toBe(false);
      expect(document.activeElement).toBe(byId('ab-opener'));
    });

    it('locks body scroll while open and restores the previous value', async () => {
      document.body.style.overflow = 'scroll';
      host.opened.set(true);
      await settle(fixture);
      expect(document.body.style.overflow).toBe('hidden');

      host.opened.set(false);
      await settle(fixture);
      expect(document.body.style.overflow).toBe('scroll');
      document.body.style.overflow = '';
    });

    it('makes the background inert (except data-dialog-keep-active) and releases only what it marked', async () => {
      host.opened.set(true);
      await settle(fixture);
      expect(byId('ab-outside').hasAttribute('inert')).toBe(true);
      expect(byId('ab-keep').hasAttribute('inert')).toBe(false);
      expect(sheetEl(fixture)!.closest('[inert]')).toBeNull();

      host.opened.set(false);
      await settle(fixture);
      expect(byId('ab-outside').hasAttribute('inert')).toBe(false);
      expect(byId('ab-already-inert').hasAttribute('inert')).toBe(true);
    });

    it('cleans up if destroyed while open', async () => {
      host.opened.set(true);
      await settle(fixture);
      const outside = byId('ab-outside');

      fixture.destroy();
      expect(outside.hasAttribute('inert')).toBe(false);
      expect(document.body.style.overflow).toBe('');
    });
  });
});
